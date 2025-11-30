import { initializeUserFirebase } from '../../shared/config/firebase';
import { getUserDatabaseService } from '../../shared/services/database/userDB';
import { UserProfile, LoginRequest, RegisterRequest, LoginResponse, FarmerProfile, BuyerProfile, ExpertProfile } from '../../shared/types/api';
import { USER_ROLES, ERROR_MESSAGES } from '../../shared/config/constants';
import { environmentUtils } from '../../shared/config/environment';

// Custom user authentication error
export class UserAuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'UserAuthError';
  }
}

// User Authentication Service
export class UserAuthService {
  private config: ReturnType<typeof environmentUtils.getFirebaseConfig>;
  private databaseService = getUserDatabaseService();

  constructor() {
    this.config = environmentUtils.getFirebaseConfig('user');
  }

  // Initialize Firebase and get auth instance
  private getAuth() {
    const { auth } = initializeUserFirebase();
    return auth;
  }

  // Login with email and password
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Validate inputs
      if (!credentials.email || !credentials.password) {
        throw new UserAuthError(
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

      // Verify user role
      if (!claims.role || !Object.values(USER_ROLES).includes(claims.role as any)) {
        await auth.signOut();
        throw new UserAuthError(
          'Invalid user account type',
          'ACCESS_DENIED',
          403
        );
      }

      // Get or create user profile
      let userProfile = await this.databaseService.getUserProfile(user.uid);

      if (!userProfile) {
        // Create new user profile based on role
        const profileData = this.getDefaultProfileData(claims.role as any, claims);
        userProfile = await this.databaseService.createUserProfile({
          id: user.uid,
          email: user.email || credentials.email,
          role: claims.role as any,
          profileData,
          isVerified: user.emailVerified || false,
        });
      } else {
        // Update existing user profile
        await this.databaseService.updateUserProfile(user.uid, {
          lastLogin: new Date(),
          isVerified: user.emailVerified || userProfile.isVerified,
        });
        userProfile.lastLogin = new Date();
        userProfile.isVerified = user.emailVerified || userProfile.isVerified;
      }

      // Verify user profile if email is verified but profile isn't
      if (user.emailVerified && !userProfile.isVerified) {
        await this.databaseService.verifyUserProfile(user.uid);
        userProfile.isVerified = true;
      }

      // Generate tokens
      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;

      // Log login activity
      await this.logUserActivity(user.uid, 'LOGIN', {
        timestamp: new Date().toISOString(),
        userAgent: this.getUserAgent(),
        platform: 'user',
        role: claims.role,
      });

      return {
        user: userProfile,
        token,
        refreshToken,
        expiresIn: idTokenResult.expirationTime
          ? new Date(idTokenResult.expirationTime).getTime() - Date.now()
          : 3600000, // 1 hour default
      };

    } catch (error: any) {
      console.error('User login error:', error);

      if (error instanceof UserAuthError) {
        throw error;
      }

      if (error.code === 'auth/user-not-found') {
        throw new UserAuthError(
          ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
          'USER_NOT_FOUND',
          401
        );
      }

      if (error.code === 'auth/wrong-password') {
        throw new UserAuthError(
          ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
          'INVALID_PASSWORD',
          401
        );
      }

      if (error.code === 'auth/user-disabled') {
        throw new UserAuthError(
          'Account has been disabled. Please contact support.',
          'ACCOUNT_DISABLED',
          403
        );
      }

      if (error.code === 'auth/email-not-verified') {
        throw new UserAuthError(
          'Please verify your email address before logging in.',
          'EMAIL_NOT_VERIFIED',
          403
        );
      }

      if (error.code === 'auth/too-many-requests') {
        throw new UserAuthError(
          'Too many failed login attempts. Please try again later.',
          'TOO_MANY_REQUESTS',
          429
        );
      }

      if (error.code === 'auth/network-request-failed') {
        throw new UserAuthError(
          ERROR_MESSAGES.NETWORK.OFFLINE,
          'NETWORK_ERROR',
          503
        );
      }

      throw new UserAuthError(
        ERROR_MESSAGES.NETWORK.SERVER_ERROR,
        'UNKNOWN_ERROR',
        500
      );
    }
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    try {
      // Validate inputs
      if (!userData.email || !userData.password || !userData.role) {
        throw new UserAuthError(
          'Email, password, and role are required',
          'MISSING_REQUIRED_FIELDS',
          400
        );
      }

      if (!Object.values(USER_ROLES).includes(userData.role)) {
        throw new UserAuthError(
          'Invalid user role specified',
          'INVALID_ROLE',
          400
        );
      }

      // Create user in Firebase Auth
      const auth = this.getAuth();
      const userCredential = await auth.createUserWithEmailAndPassword(
        userData.email,
        userData.password
      );

      const user = userCredential.user;

      // Send email verification
      await user.sendEmailVerification();

      // Create custom claims with role
      const customClaims = {
        role: userData.role,
        platform: 'user',
      };

      await this.setCustomClaims(user.uid, customClaims);

      // Create user profile with default data
      const profileData = this.getDefaultProfileData(userData.role, userData.profileData || {});
      const userProfile = await this.databaseService.createUserProfile({
        id: user.uid,
        email: user.email || userData.email,
        role: userData.role,
        profileData,
        isVerified: false,
      });

      // Generate tokens
      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;

      // Log registration activity
      await this.logUserActivity(user.uid, 'REGISTER', {
        timestamp: new Date().toISOString(),
        userAgent: this.getUserAgent(),
        platform: 'user',
        role: userData.role,
        email: userData.email,
      });

      return {
        user: userProfile,
        token,
        refreshToken,
        expiresIn: 3600000, // 1 hour
      };

    } catch (error: any) {
      console.error('User registration error:', error);

      if (error instanceof UserAuthError) {
        throw error;
      }

      if (error.code === 'auth/email-already-in-use') {
        throw new UserAuthError(
          'An account with this email already exists.',
          'EMAIL_ALREADY_IN_USE',
          409
        );
      }

      if (error.code === 'auth/invalid-email') {
        throw new UserAuthError(
          ERROR_MESSAGES.VALIDATION.INVALID_EMAIL,
          'INVALID_EMAIL',
          400
        );
      }

      if (error.code === 'auth/weak-password') {
        throw new UserAuthError(
          'Password is too weak. Please choose a stronger password.',
          'WEAK_PASSWORD',
          400
        );
      }

      if (error.code === 'auth/network-request-failed') {
        throw new UserAuthError(
          ERROR_MESSAGES.NETWORK.OFFLINE,
          'NETWORK_ERROR',
          503
        );
      }

      throw new UserAuthError(
        ERROR_MESSAGES.NETWORK.SERVER_ERROR,
        'REGISTRATION_FAILED',
        500
      );
    }
  }

  // Logout current user
  async logout(userId?: string): Promise<void> {
    try {
      const auth = this.getAuth();

      // Log logout activity if userId provided
      if (userId) {
        await this.logUserActivity(userId, 'LOGOUT', {
          timestamp: new Date().toISOString(),
          userAgent: this.getUserAgent(),
          platform: 'user',
        });
      }

      // Sign out from Firebase
      await auth.signOut();
    } catch (error) {
      console.error('User logout error:', error);
      // Don't throw error for logout failures - just log it
    }
  }

  // Refresh user token
  async refreshToken(user: any): Promise<{ token: string; expiresIn: number }> {
    try {
      if (!user) {
        throw new UserAuthError(
          ERROR_MESSAGES.AUTH.UNAUTHORIZED,
          'NO_USER',
          401
        );
      }

      // Get fresh ID token
      const idTokenResult = await user.getIdTokenResult(true);
      const token = await user.getIdToken(true);

      // Verify user role is still valid
      const claims = idTokenResult.claims;
      if (!claims.role || !Object.values(USER_ROLES).includes(claims.role as any)) {
        await this.logout();
        throw new UserAuthError(
          'Account access has been modified. Please login again.',
          'ACCESS_REVOKED',
          401
        );
      }

      // Log token refresh activity
      if (claims.uid) {
        await this.logUserActivity(claims.uid, 'TOKEN_REFRESH', {
          timestamp: new Date().toISOString(),
          userAgent: this.getUserAgent(),
          platform: 'user',
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

      if (error instanceof UserAuthError) {
        throw error;
      }

      if (error.code === 'auth/user-disabled') {
        throw new UserAuthError(
          'Account has been disabled. Please contact support.',
          'ACCOUNT_DISABLED',
          403
        );
      }

      if (error.code === 'auth/id-token-expired') {
        throw new UserAuthError(
          ERROR_MESSAGES.AUTH.TOKEN_EXPIRED,
          'TOKEN_EXPIRED',
          401
        );
      }

      if (error.code === 'auth/id-token-revoked') {
        throw new UserAuthError(
          'Access revoked. Please login again.',
          'TOKEN_REVOKED',
          401
        );
      }

      throw new UserAuthError(
        ERROR_MESSAGES.AUTH.TOKEN_EXPIRED,
        'TOKEN_REFRESH_FAILED',
        401
      );
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      if (!userId) {
        throw new UserAuthError(
          'User ID is required',
          'INVALID_USER_ID',
          400
        );
      }

      // Validate updates (restrict certain fields)
      const allowedUpdates: Partial<UserProfile> = {};

      if (updates.email !== undefined) {
        // Email updates require separate verification process
        allowedUpdates.email = updates.email;
      }

      if (updates.profileData !== undefined) {
        allowedUpdates.profileData = updates.profileData;
      }

      // Update in database
      await this.databaseService.updateUserProfile(userId, allowedUpdates);

      // Get updated user
      const updatedUser = await this.databaseService.getUserProfile(userId);
      if (!updatedUser) {
        throw new UserAuthError(
          'Failed to retrieve updated user profile',
          'UPDATE_FAILED',
          500
        );
      }

      // Log profile update
      await this.logUserActivity(userId, 'PROFILE_UPDATE', {
        timestamp: new Date().toISOString(),
        userAgent: this.getUserAgent(),
        platform: 'user',
        updatedFields: Object.keys(allowedUpdates),
      });

      return updatedUser;

    } catch (error: any) {
      console.error('Profile update error:', error);

      if (error instanceof UserAuthError) {
        throw error;
      }

      throw new UserAuthError(
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
        throw new UserAuthError(
          ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
          'INVALID_EMAIL',
          400
        );
      }

      const auth = this.getAuth();
      await auth.sendPasswordResetEmail(email);

      // Log password reset request
      await this.logUserActivity('system', 'PASSWORD_RESET_REQUEST', {
        timestamp: new Date().toISOString(),
        userAgent: this.getUserAgent(),
        platform: 'user',
        email,
      });

    } catch (error: any) {
      console.error('Password reset error:', error);

      if (error.code === 'auth/user-not-found') {
        // Don't reveal if user exists or not for security
        return;
      }

      if (error.code === 'auth/invalid-email') {
        throw new UserAuthError(
          ERROR_MESSAGES.VALIDATION.INVALID_EMAIL,
          'INVALID_EMAIL',
          400
        );
      }

      if (error.code === 'auth/network-request-failed') {
        throw new UserAuthError(
          ERROR_MESSAGES.NETWORK.OFFLINE,
          'NETWORK_ERROR',
          503
        );
      }

      throw new UserAuthError(
        ERROR_MESSAGES.NETWORK.SERVER_ERROR,
        'PASSWORD_RESET_FAILED',
        500
      );
    }
  }

  // Verify email
  async verifyEmail(userId: string): Promise<void> {
    try {
      await this.databaseService.verifyUserProfile(userId);

      // Log email verification
      await this.logUserActivity(userId, 'EMAIL_VERIFIED', {
        timestamp: new Date().toISOString(),
        userAgent: this.getUserAgent(),
        platform: 'user',
      });

    } catch (error) {
      console.error('Email verification error:', error);
      throw new UserAuthError(
        ERROR_MESSAGES.NETWORK.SERVER_ERROR,
        'EMAIL_VERIFICATION_FAILED',
        500
      );
    }
  }

  // Helper methods
  private getDefaultProfileData(role: string, customData: any = {}): Partial<FarmerProfile | BuyerProfile | ExpertProfile> {
    switch (role) {
      case USER_ROLES.FARMER:
        return {
          firstName: customData.firstName || '',
          lastName: customData.lastName || '',
          farmName: customData.farmName || '',
          farmLocation: customData.farmLocation || { address: '' },
          farmSize: customData.farmSize || 0,
          specialization: customData.specialization || [],
          certifications: customData.certifications || [],
          bio: customData.bio || '',
          contactInfo: customData.contactInfo || { phone: '' },
        } as FarmerProfile;

      case USER_ROLES.BUYER:
        return {
          firstName: customData.firstName || '',
          lastName: customData.lastName || '',
          companyName: customData.companyName || '',
          location: customData.location || { address: '' },
          businessType: customData.businessType || 'individual',
          preferences: customData.preferences || {
            productTypes: [],
            organic: false,
            local: false,
          },
          bio: customData.bio || '',
          contactInfo: customData.contactInfo || { phone: '' },
        } as BuyerProfile;

      case USER_ROLES.EXPERT:
        return {
          firstName: customData.firstName || '',
          lastName: customData.lastName || '',
          title: customData.title || '',
          specialization: customData.specialization || [],
          experience: customData.experience || 0,
          qualifications: customData.qualifications || {
            certifications: [],
            licenses: [],
          },
          bio: customData.bio || '',
          availability: customData.availability || {
            days: [],
            timeSlots: [],
          },
          consultationRate: customData.consultationRate || 0,
          contactInfo: customData.contactInfo || { phone: '' },
        } as ExpertProfile;

      default:
        return {};
    }
  }

  private async setCustomClaims(uid: string, claims: Record<string, any>): Promise<void> {
    // This would typically be handled by a backend service using Firebase Admin SDK
    // For now, we'll simulate the process
    console.log('Setting custom claims for user:', uid, claims);
  }

  private async logUserActivity(
    userId: string,
    action: string,
    details: any
  ): Promise<void> {
    try {
      // This would typically log to the database
      console.log('User activity:', { userId, action, details });
    } catch (error) {
      console.error('Failed to log user activity:', error);
      // Don't throw error for logging failures
    }
  }

  private getUserAgent(): string {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent;
    }
    return 'Unknown';
  }
}

// Create singleton instance
let userAuthService: UserAuthService | null = null;

export function getUserAuthService(): UserAuthService {
  if (!userAuthService) {
    userAuthService = new UserAuthService();
  }
  return userAuthService;
}

export default UserAuthService;