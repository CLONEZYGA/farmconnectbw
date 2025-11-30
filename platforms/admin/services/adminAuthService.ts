import { initializeAdminFirebase } from '../../shared/config/firebase';
import { getAdminDatabaseService } from '../../shared/services/database/adminDB';
import { AdminUser, LoginRequest, LoginResponse, APIError } from '../../shared/types/api';
import { USER_ROLES, ERROR_MESSAGES } from '../../shared/config/constants';
import { environmentUtils } from '../../shared/config/environment';

// Custom admin authentication error
export class AdminAuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AdminAuthError';
  }
}

// Admin Authentication Service
export class AdminAuthService {
  private config: ReturnType<typeof environmentUtils.getFirebaseConfig>;
  private databaseService = getAdminDatabaseService();

  constructor() {
    this.config = environmentUtils.getFirebaseConfig('admin');
  }

  // Initialize Firebase and get auth instance
  private getAuth() {
    const { auth } = initializeAdminFirebase();
    return auth;
  }

  // Login with email and password
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Validate inputs
      if (!credentials.email || !credentials.password) {
        throw new AdminAuthError(
          ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
          'INVALID_CREDENTIALS',
          400
        );
      }

      // Authenticate with Firebase Auth
      const auth = this.getAuth();
      const userCredential = await auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      const user = userCredential.user;

      // Get ID token and check custom claims
      const idTokenResult = await user.getIdTokenResult(true);
      const claims = idTokenResult.claims;

      // Verify admin role
      if (!claims.role || claims.role !== USER_ROLES.ADMIN) {
        await auth.signOut();
        throw new AdminAuthError(
          'Access denied: User is not an administrator',
          'ACCESS_DENIED',
          403
        );
      }

      // Create or update admin user record
      let adminUser = await this.databaseService.getAdminUser(user.uid);

      if (!adminUser) {
        // Create new admin user record
        adminUser = await this.databaseService.createAdminUser({
          id: user.uid,
          email: user.email || credentials.email,
          role: claims.role as any,
          permissions: claims.permissions || [],
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      } else {
        // Update existing admin user
        await this.databaseService.updateAdminUser(user.uid, {
          lastLogin: new Date(),
          isActive: true,
        });
        adminUser.lastLogin = new Date();
        adminUser.isActive = true;
      }

      // Generate tokens
      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;

      // Log login activity
      await this.databaseService.logActivity({
        action: 'LOGIN',
        userId: user.uid,
        timestamp: new Date(),
        details: {
          timestamp: new Date().toISOString(),
          userAgent: this.getUserAgent(),
          ipAddress: await this.getClientIP(),
          platform: 'admin',
        },
      });

      return {
        user: adminUser,
        token,
        refreshToken,
        expiresIn: idTokenResult.expirationTime
          ? new Date(idTokenResult.expirationTime).getTime() - Date.now()
          : 3600000, // 1 hour default
      };

    } catch (error: any) {
      console.error('Admin login error:', error);

      if (error instanceof AdminAuthError) {
        throw error;
      }

      if (error.code === 'auth/user-not-found') {
        throw new AdminAuthError(
          ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
          'USER_NOT_FOUND',
          401
        );
      }

      if (error.code === 'auth/wrong-password') {
        throw new AdminAuthError(
          ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
          'INVALID_PASSWORD',
          401
        );
      }

      if (error.code === 'auth/user-disabled') {
        throw new AdminAuthError(
          'Account has been disabled. Please contact system administrator.',
          'ACCOUNT_DISABLED',
          403
        );
      }

      if (error.code === 'auth/too-many-requests') {
        throw new AdminAuthError(
          'Too many failed login attempts. Please try again later.',
          'TOO_MANY_REQUESTS',
          429
        );
      }

      if (error.code === 'auth/network-request-failed') {
        throw new AdminAuthError(
          ERROR_MESSAGES.NETWORK.OFFLINE,
          'NETWORK_ERROR',
          503
        );
      }

      throw new AdminAuthError(
        ERROR_MESSAGES.NETWORK.SERVER_ERROR,
        'UNKNOWN_ERROR',
        500
      );
    }
  }

  // Logout current admin
  async logout(userId?: string): Promise<void> {
    try {
      const auth = this.getAuth();

      // Log logout activity if userId provided
      if (userId) {
        await this.databaseService.logActivity({
          action: 'LOGOUT',
          userId,
          timestamp: new Date(),
          details: {
            timestamp: new Date().toISOString(),
            userAgent: this.getUserAgent(),
            platform: 'admin',
          },
        });
      }

      // Sign out from Firebase
      await auth.signOut();
    } catch (error) {
      console.error('Admin logout error:', error);
      // Don't throw error for logout failures - just log it
    }
  }

  // Refresh admin token
  async refreshToken(user: any): Promise<{ token: string; expiresIn: number }> {
    try {
      if (!user) {
        throw new AdminAuthError(
          ERROR_MESSAGES.AUTH.UNAUTHORIZED,
          'NO_USER',
          401
        );
      }

      // Get fresh ID token
      const idTokenResult = await user.getIdTokenResult(true);
      const token = await user.getIdToken(true);

      // Verify admin role is still valid
      if (!idTokenResult.claims.role || idTokenResult.claims.role !== USER_ROLES.ADMIN) {
        throw new AdminAuthError(
          'Access revoked: User is no longer an administrator',
          'ACCESS_REVOKED',
          403
        );
      }

      // Update last activity
      if (idTokenResult.claims.uid) {
        await this.databaseService.logActivity({
          action: 'TOKEN_REFRESH',
          userId: idTokenResult.claims.uid,
          timestamp: new Date(),
          details: {
            timestamp: new Date().toISOString(),
            userAgent: this.getUserAgent(),
            platform: 'admin',
          },
        });
      }

      return {
        token,
        expiresIn: idTokenResult.expirationTime
          ? new Date(idTokenResult.expirationTime).getTime() - Date.now()
          : 3600000, // 1 hour default
      };

    } catch (error: any) {
      console.error('Token refresh error:', error);

      if (error instanceof AdminAuthError) {
        throw error;
      }

      if (error.code === 'auth/user-disabled') {
        throw new AdminAuthError(
          'Account has been disabled. Please contact system administrator.',
          'ACCOUNT_DISABLED',
          403
        );
      }

      if (error.code === 'auth/id-token-expired') {
        throw new AdminAuthError(
          ERROR_MESSAGES.AUTH.TOKEN_EXPIRED,
          'TOKEN_EXPIRED',
          401
        );
      }

      if (error.code === 'auth/id-token-revoked') {
        throw new AdminAuthError(
          'Access revoked: Please login again.',
          'TOKEN_REVOKED',
          401
        );
      }

      throw new AdminAuthError(
        ERROR_MESSAGES.AUTH.TOKEN_EXPIRED,
        'TOKEN_REFRESH_FAILED',
        401
      );
    }
  }

  // Update admin profile
  async updateProfile(userId: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    try {
      if (!userId) {
        throw new AdminAuthError(
          'User ID is required',
          'INVALID_USER_ID',
          400
        );
      }

      // Validate updates (restrict certain fields)
      const allowedUpdates: Partial<AdminUser> = {};

      if (updates.email !== undefined) {
        // Email updates require separate verification process
        allowedUpdates.email = updates.email;
      }

      if (updates.permissions !== undefined && Array.isArray(updates.permissions)) {
        allowedUpdates.permissions = updates.permissions;
      }

      // Update in database
      await this.databaseService.updateAdminUser(userId, allowedUpdates);

      // Get updated user
      const updatedUser = await this.databaseService.getAdminUser(userId);
      if (!updatedUser) {
        throw new AdminAuthError(
          'Failed to retrieve updated user',
          'UPDATE_FAILED',
          500
        );
      }

      // Log profile update
      await this.databaseService.logActivity({
        action: 'PROFILE_UPDATE',
        userId,
        timestamp: new Date(),
        details: {
          updatedFields: Object.keys(allowedUpdates),
          timestamp: new Date().toISOString(),
          userAgent: this.getUserAgent(),
          platform: 'admin',
        },
      });

      return updatedUser;

    } catch (error: any) {
      console.error('Profile update error:', error);

      if (error instanceof AdminAuthError) {
        throw error;
      }

      throw new AdminAuthError(
        ERROR_MESSAGES.NETWORK.SERVER_ERROR,
        'PROFILE_UPDATE_FAILED',
        500
      );
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      if (!email) {
        throw new AdminAuthError(
          ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
          'INVALID_EMAIL',
          400
        );
      }

      const auth = this.getAuth();
      await auth.sendPasswordResetEmail(email);

      // Log password reset request
      await this.databaseService.logActivity({
        action: 'PASSWORD_RESET_REQUEST',
        userId: 'system', // We don't have user ID at this point
        timestamp: new Date(),
        details: {
          email,
          timestamp: new Date().toISOString(),
          userAgent: this.getUserAgent(),
          platform: 'admin',
        },
      });

    } catch (error: any) {
      console.error('Password reset error:', error);

      if (error.code === 'auth/user-not-found') {
        // Don't reveal if user exists or not for security
        return;
      }

      if (error.code === 'auth/invalid-email') {
        throw new AdminAuthError(
          ERROR_MESSAGES.VALIDATION.INVALID_EMAIL,
          'INVALID_EMAIL',
          400
        );
      }

      if (error.code === 'auth/network-request-failed') {
        throw new AdminAuthError(
          ERROR_MESSAGES.NETWORK.OFFLINE,
          'NETWORK_ERROR',
          503
        );
      }

      throw new AdminAuthError(
        ERROR_MESSAGES.NETWORK.SERVER_ERROR,
        'PASSWORD_RESET_FAILED',
        500
      );
    }
  }

  // Get admin user by ID
  async getAdminUser(userId: string): Promise<AdminUser | null> {
    try {
      if (!userId) {
        return null;
      }

      return await this.databaseService.getAdminUser(userId);
    } catch (error) {
      console.error('Get admin user error:', error);
      return null;
    }
  }

  // Create new admin user
  async createAdminUser(userData: Omit<AdminUser, 'id' | 'createdAt'>): Promise<AdminUser> {
    try {
      // Validate required fields
      if (!userData.email || !userData.role || !userData.permissions) {
        throw new AdminAuthError(
          'Required fields are missing',
          'MISSING_REQUIRED_FIELDS',
          400
        );
      }

      // Set default values
      const adminData = {
        ...userData,
        role: USER_ROLES.ADMIN,
        isActive: userData.isActive !== false, // Default to true
        createdAt: new Date(),
      };

      // Create in database
      const newAdmin = await this.databaseService.createAdminUser(adminData);

      // Log user creation
      await this.databaseService.logActivity({
        action: 'USER_CREATED',
        userId: newAdmin.id,
        timestamp: new Date(),
        details: {
          newAdminId: newAdmin.id,
          role: newAdmin.role,
          permissions: newAdmin.permissions,
          timestamp: new Date().toISOString(),
          userAgent: this.getUserAgent(),
          platform: 'admin',
        },
      });

      return newAdmin;

    } catch (error: any) {
      console.error('Create admin user error:', error);

      if (error instanceof AdminAuthError) {
        throw error;
      }

      throw new AdminAuthError(
        ERROR_MESSAGES.NETWORK.SERVER_ERROR,
        'USER_CREATION_FAILED',
        500
      );
    }
  }

  // Check if user has specific permission
  hasPermission(user: AdminUser | null, permission: string): boolean {
    if (!user || !user.permissions) {
      return false;
    }

    // Super admin check (if user has 'all' permission)
    if (user.permissions.includes('all')) {
      return true;
    }

    // Direct permission check
    return user.permissions.includes(permission);
  }

  // Check if user can access specific feature
  canAccessFeature(user: AdminUser | null, feature: string): boolean {
    if (!user || !user.isActive) {
      return false;
    }

    // Feature to permission mapping
    const featurePermissions: Record<string, string> = {
      'dashboard': 'view_dashboard',
      'users': 'manage_users',
      'reports': 'view_reports',
      'settings': 'manage_settings',
      'products': 'manage_products',
      'orders': 'manage_orders',
      'consultations': 'manage_consultations',
      'logs': 'view_logs',
    };

    const requiredPermission = featurePermissions[feature];
    return requiredPermission ? this.hasPermission(user, requiredPermission) : true;
  }

  // Utility functions
  private getUserAgent(): string {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent;
    }
    return 'Unknown';
  }

  private async getClientIP(): Promise<string> {
    try {
      // This would typically be handled by backend
      // For now, return a placeholder
      return 'client-ip';
    } catch {
      return 'unknown-ip';
    }
  }
}

// Create singleton instance
let adminAuthService: AdminAuthService | null = null;

export function getAdminAuthService(): AdminAuthService {
  if (!adminAuthService) {
    adminAuthService = new AdminAuthService();
  }
  return adminAuthService;
}

export default AdminAuthService;