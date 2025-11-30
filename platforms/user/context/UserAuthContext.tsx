import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { initializeUserFirebase } from '../../shared/config/firebase';
import { getUserAPIService } from '../../shared/services/api/userAPI';
import { getUserDatabaseService } from '../../shared/services/database/userDB';
import { UserProfile, LoginRequest, RegisterRequest, LoginResponse } from '../../shared/types/api';
import { USER_ROLES, PLATFORMS, ERROR_MESSAGES } from '../../shared/config/constants';
import { environmentUtils } from '../../shared/config/environment';

// User authentication context interface
export interface UserAuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  role: 'farmer' | 'buyer' | 'expert' | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  canAccess: (feature: string) => boolean;
  clearError: () => void;
}

// Create context
const UserAuthContext = createContext<UserAuthContextType | null>(null);

// User Auth Provider component
interface UserAuthProviderProps {
  children: ReactNode;
}

export function UserAuthProvider({ children }: UserAuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  const apiService = getUserAPIService();
  const databaseService = getUserDatabaseService();

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize Firebase
      const { auth } = initializeUserFirebase();

      // Check if user is already logged in
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        setFirebaseUser(user);

        if (user) {
          // User is logged in, fetch user profile
          try {
            const idTokenResult = await user.getIdTokenResult(true);
            const claims = idTokenResult.claims;

            // Verify user has a valid role
            if (!claims.role || !Object.values(USER_ROLES).includes(claims.role as any)) {
              console.error('User has invalid role:', claims.role);
              await auth.signOut();
              setUser(null);
              setFirebaseUser(null);
              setError('Invalid user account. Please contact support.');
              return;
            }

            // Fetch user profile from database
            const userProfile = await databaseService.getUserProfile(user.uid);

            if (userProfile) {
              setUser({
                ...userProfile,
                email: user.email || userProfile.email,
                role: claims.role as any,
                isVerified: user.emailVerified || userProfile.isVerified,
              });

              // Set API service token
              const token = await user.getIdToken();
              apiService.setToken(token);
            } else {
              console.error('User profile not found for user:', user.uid);
              await auth.signOut();
              setError('User profile not found. Please contact support.');
            }
          } catch (fetchError) {
            console.error('Error fetching user profile:', fetchError);
            setError('Failed to load user profile');
          }
        } else {
          // User is logged out
          setUser(null);
          apiService.clearToken();
        }

        setIsInitialized(true);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error initializing user authentication:', error);
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
        setUser(response.data.user);
        apiService.setToken(response.data.token);

        // Update last login in database
        await databaseService.updateProfile(response.data.user.id, {
          updatedAt: new Date(),
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

  // Register function
  const register = async (data: RegisterRequest): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      if (!data.email || !data.password || !data.role) {
        const errorMessage = 'Email, password, and role are required';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      // Call register API
      const response = await apiService.register(data);

      if (!response.success) {
        const errorMessage = response.error || ERROR_MESSAGES.NETWORK.SERVER_ERROR;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (response.data) {
        // Registration successful, update state
        setUser(response.data.user);
        apiService.setToken(response.data.token);

        return { success: true };
      }

      return { success: false, error: 'Unknown registration error' };
    } catch (error) {
      console.error('Registration error:', error);
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
      const { auth } = initializeUserFirebase();

      // Call logout API
      await apiService.logout();

      // Sign out from Firebase
      await auth.signOut();

      // Clear local state
      setUser(null);
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

      // Check if user role has changed or been revoked
      const claims = idTokenResult.claims;
      if (!claims.role || !Object.values(USER_ROLES).includes(claims.role as any)) {
        await logout();
        return { success: false, error: 'Account access has been modified. Please login again.' };
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

  // Profile update function
  const updateProfile = async (data: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call update profile API
      const response = await apiService.updateProfile({ profileData: data });

      if (!response.success) {
        const errorMessage = response.error || ERROR_MESSAGES.NETWORK.SERVER_ERROR;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (response.data) {
        // Update local state
        setUser(response.data);
      }

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

  // Forgot password function
  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email) {
        const errorMessage = 'Email is required';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      const response = await apiService.forgotPassword(email);

      if (!response.success) {
        const errorMessage = response.error || ERROR_MESSAGES.NETWORK.SERVER_ERROR;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK.SERVER_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!token || !newPassword) {
        const errorMessage = 'Token and new password are required';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      const response = await apiService.resetPassword(token, newPassword);

      if (!response.success) {
        const errorMessage = response.error || ERROR_MESSAGES.NETWORK.SERVER_ERROR;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK.SERVER_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Feature access checking function
  const canAccess = (feature: string): boolean => {
    if (!user || !user.role) return false;

    // Define role-based feature access
    const roleFeatures: Record<string, Record<string, boolean>> = {
      [USER_ROLES.FARMER]: {
        'dashboard': true,
        'products': true,
        'orders': true,
        'consultations': true,
        'profile': true,
        'analytics': true,
        'reports': false,
        'user_management': false,
      },
      [USER_ROLES.BUYER]: {
        'dashboard': true,
        'products': true,
        'orders': true,
        'consultations': false,
        'profile': true,
        'analytics': false,
        'reports': false,
        'user_management': false,
      },
      [USER_ROLES.EXPERT]: {
        'dashboard': true,
        'products': false,
        'orders': false,
        'consultations': true,
        'profile': true,
        'analytics': false,
        'reports': false,
        'user_management': false,
      },
    };

    const features = roleFeatures[user.role];
    return features ? features[feature] || false : false;
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value: UserAuthContextType = {
    user,
    isLoading,
    isInitialized,
    error,
    role: user?.role || null,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    forgotPassword,
    resetPassword,
    canAccess,
    clearError,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

// Custom hook to use user authentication
export function useUserAuth(): UserAuthContextType {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}

// Higher-order component for user authentication protection
interface WithUserAuthProps {
  children: ReactNode;
  requiredRole?: 'farmer' | 'buyer' | 'expert';
  fallback?: ReactNode;
}

export function withUserAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredRole?: 'farmer' | 'buyer' | 'expert';
    fallback?: ReactNode;
  }
) {
  return function UserAuthWrapper(props: P) {
    const { user, isLoading, isInitialized, role } = useUserAuth();

    if (!isInitialized || isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user) {
      return options?.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Access denied: Login required
          </div>
          <div className="text-gray-600 text-center">
            Please log in to access this page.
          </div>
        </div>
      );
    }

    if (options?.requiredRole && role !== options.requiredRole) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            Access denied: Wrong user role
          </div>
          <div className="text-gray-600 text-center">
            This page is only accessible to {options.requiredRole}s.
            Your current role is: {role}.
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export default UserAuthContext;