import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { initializeAdminFirebase } from '../../shared/config/firebase';
import { getAdminAPIService } from '../../shared/services/api/adminAPI';
import { getAdminDatabaseService } from '../../shared/services/database/adminDB';
import { AdminUser, LoginRequest } from '../../shared/types/api';
import { USER_ROLES, PLATFORMS, ERROR_MESSAGES } from '../../shared/config/constants';
import { environmentUtils } from '../../shared/config/environment';

// Admin authentication context interface
export interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<{ success: boolean; error?: string }>;
  logActivity: (action: string, details?: any) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  canAccess: (feature: string) => boolean;
  updateProfile: (updates: Partial<AdminUser>) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

// Create context
const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

// Admin Auth Provider component
interface AdminAuthProviderProps {
  children: ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  const apiService = getAdminAPIService();
  const databaseService = getAdminDatabaseService();

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize Firebase
      const { auth } = initializeAdminFirebase();

      // Check if user is already logged in
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        setFirebaseUser(user);

        if (user) {
          // User is logged in, fetch admin profile
          try {
            const idTokenResult = await user.getIdTokenResult(true);
            const claims = idTokenResult.claims;

            // Verify user has admin role
            if (claims.role !== USER_ROLES.ADMIN) {
              console.error('User is not an admin:', claims.role);
              await auth.signOut();
              setAdmin(null);
              setFirebaseUser(null);
              setError('Access denied: User is not an administrator');
              return;
            }

            // Fetch admin profile from database
            const adminProfile = await databaseService.getAdminUser(user.uid);

            if (adminProfile) {
              setAdmin({
                ...adminProfile,
                email: user.email || adminProfile.email,
                lastLogin: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime) : adminProfile.lastLogin,
              });

              // Set API service token
              const token = await user.getIdToken();
              apiService.setToken(token);

              // Log admin login activity
              await databaseService.logActivity({
                action: 'LOGIN',
                userId: user.uid,
                timestamp: new Date(),
                details: {
                  timestamp: new Date().toISOString(),
                  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
                  platform: PLATFORMS.ADMIN,
                },
              });
            } else {
              console.error('Admin profile not found for user:', user.uid);
              await auth.signOut();
              setError('Admin profile not found. Please contact system administrator.');
            }
          } catch (fetchError) {
            console.error('Error fetching admin profile:', fetchError);
            setError('Failed to load admin profile');
          }
        } else {
          // User is logged out
          setAdmin(null);
          apiService.clearToken();
        }

        setIsInitialized(true);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error initializing admin authentication:', error);
      setError('Failed to initialize authentication');
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      if (!email || !password) {
        const errorMessage = 'Email and password are required';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      // Call login API
      const loginData: LoginRequest = { email, password };
      const response = await apiService.login(loginData);

      if (!response.success) {
        const errorMessage = response.error || ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (response.data) {
        // Login successful, update state
        setAdmin(response.data.user);
        apiService.setToken(response.data.token);

        // Update last login in database
        await databaseService.updateAdminUser(response.data.user.id, {
          lastLogin: new Date(),
        });

        return { success: true };
      }

      return { success: false, error: 'Unknown login error' };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK.SERVER_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const { auth } = initializeAdminFirebase();

      // Log logout activity before signing out
      if (admin) {
        await databaseService.logActivity({
          action: 'LOGOUT',
          userId: admin.id,
          timestamp: new Date(),
          details: {
            timestamp: new Date().toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
            platform: PLATFORMS.ADMIN,
          },
        });
      }

      // Sign out from Firebase
      await auth.signOut();

      // Clear local state
      setAdmin(null);
      setFirebaseUser(null);
      apiService.clearToken();
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout properly');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<{ success: boolean; error?: string }> => {
    if (!firebaseUser) {
      return { success: false, error: 'No user session to refresh' };
    }

    try {
      const idTokenResult = await firebaseUser.getIdTokenResult(true);
      const token = await firebaseUser.getIdToken(true);

      // Update API service token
      apiService.setToken(token);

      // Check if user role has changed
      const claims = idTokenResult.claims;
      if (claims.role !== USER_ROLES.ADMIN) {
        await logout();
        return { success: false, error: 'Access revoked: User is no longer an administrator' };
      }

      return { success: true };
    } catch (error) {
      console.error('Token refresh error:', error);
      const errorMessage = ERROR_MESSAGES.AUTH.TOKEN_EXPIRED;
      setError(errorMessage);
      await logout();
      return { success: false, error: errorMessage };
    }
  };

  // Activity logging function
  const logActivity = async (action: string, details?: any): Promise<void> => {
    if (!admin) return;

    try {
      await databaseService.logActivity({
        action,
        userId: admin.id,
        timestamp: new Date(),
        details: {
          ...details,
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
          platform: PLATFORMS.ADMIN,
        },
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
      // Don't set error state for logging failures
    }
  };

  // Permission checking function
  const hasPermission = (permission: string): boolean => {
    return admin ? admin.permissions.includes(permission) : false;
  };

  // Feature access checking function
  const canAccess = (feature: string): boolean => {
    if (!admin || !admin.isActive) return false;

    // Define permission mapping for features
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
    return requiredPermission ? hasPermission(requiredPermission) : true;
  };

  // Profile update function
  const updateProfile = async (updates: Partial<AdminUser>): Promise<{ success: boolean; error?: string }> => {
    if (!admin) {
      return { success: false, error: 'No admin user logged in' };
    }

    setIsLoading(true);
    setError(null);

    try {
      await databaseService.updateAdminUser(admin.id, updates);

      // Update local state
      setAdmin({ ...admin, ...updates });

      // Log profile update
      await logActivity('PROFILE_UPDATE', { fields: Object.keys(updates) });

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK.SERVER_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value: AdminAuthContextType = {
    admin,
    isLoading,
    isInitialized,
    error,
    login,
    logout,
    refreshToken,
    logActivity,
    hasPermission,
    canAccess,
    updateProfile,
    clearError,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// Custom hook to use admin authentication
export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Higher-order component for admin authentication protection
interface WithAdminAuthProps {
  children: ReactNode;
  requiredPermission?: string;
  fallback?: ReactNode;
}

export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredPermission?: string;
    fallback?: ReactNode;
  }
) {
  return function AdminAuthWrapper(props: P) {
    const { admin, isLoading, isInitialized, hasPermission } = useAdminAuth();

    if (!isInitialized || isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!admin) {
      return options?.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Access denied: Administrator login required
          </div>
          <div className="text-gray-600 text-center">
            Please log in with an administrator account to access this page.
          </div>
        </div>
      );
    }

    if (options?.requiredPermission && !hasPermission(options.requiredPermission)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            Access denied: Insufficient permissions
          </div>
          <div className="text-gray-600 text-center">
            You do not have the required permissions to access this page.
            Please contact your system administrator.
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export default AdminAuthContext;