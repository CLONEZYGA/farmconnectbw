import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User types supported by the app
export type UserRole = 'farmer' | 'expert' | 'buyer' | 'admin';

// Complete user object structure
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string; // In a real app, this should be hashed
  role: UserRole;
  profileImage?: string;
  farmName?: string;
  region?: string;
  currency?: string;
  createdAt: number;
}

// Input for login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Input for registration
export interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  farmName?: string;
}

// Definition of the AuthContext type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

// Create a default implementation of the auth context
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  register: async () => {},
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Generate a unique user ID
const generateUserId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Try to load the logged in user
        const loggedInUserJson = await AsyncStorage.getItem('loggedInUser');
        if (loggedInUserJson) {
          const loggedInUser = JSON.parse(loggedInUserJson);
          setUser(loggedInUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (loading) return;
    
    const isRootRoute = segments.length === 0 || segments[0] === '';
    const isAuthRoute = segments[0] === '(auth)';
    const userRole = user?.role?.toLowerCase() || '';
    
    console.log('Current segments:', segments);
    console.log('User role:', userRole);
    
    if (!user && !isRootRoute && !isAuthRoute) {
      // Redirect to the login page if not logged in
      console.log('Redirecting to login');
      router.replace('/login');
    } else if (user && (isRootRoute || isAuthRoute)) {
      // Redirect to the appropriate dashboard based on user role
      console.log('Redirecting to user role dashboard:', `/(${userRole})`);
      router.replace(`/(${userRole})`);
    }
  }, [user, segments, loading]);

  const register = async (data: RegisterData): Promise<void> => {
    try {
      // Validate required fields
      if (!data.name || !data.email || !data.username || !data.password || !data.role) {
        throw new Error('All fields are required');
      }

      // Get existing users or initialize empty array
      const storedUsers = await AsyncStorage.getItem('users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if email already exists
      if (users.some(user => user.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('Email already registered');
      }

      // Check if username already exists
      if (users.some(user => user.username.toLowerCase() === data.username.toLowerCase())) {
        throw new Error('Username already taken');
      }

      // Create a new user object
      const newUser: User = {
        id: generateUserId(),
        name: data.name,
        email: data.email.toLowerCase(),
        username: data.username,
        password: data.password, // In a real app, this should be hashed
        role: data.role,
        farmName: data.farmName || '',
        region: 'Botswana', // Default values
        currency: 'BWP',
        createdAt: Date.now()
      };

      // Add to the users array
      users.push(newUser);
      
      // Save updated users array
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // Auto-login the user
      setUser(newUser);
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(newUser));

      // Redirect based on role
      redirectBasedOnRole(newUser.role);
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const signIn = async (credentials: LoginCredentials): Promise<void> => {
    try {
      console.log('SignIn function called with:', credentials.email);
      
      // Validate required fields
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Get stored users
      const storedUsers = await AsyncStorage.getItem('users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Find user with matching email and password
      const foundUser = users.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase() && 
             u.password === credentials.password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Set the logged in user
      setUser(foundUser);
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(foundUser));

      // Redirect based on role
      redirectBasedOnRole(foundUser.role);
      
    } catch (error: any) {
      console.error('Authentication failed:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('AuthContext: Starting sign out process');
      
      // 1. Clear user data from AsyncStorage
      console.log('AuthContext: Clearing user data from AsyncStorage');
      await AsyncStorage.removeItem('loggedInUser');
      console.log('AuthContext: User data cleared from AsyncStorage');
      
      // 2. Set user to null
      console.log('AuthContext: Setting user state to null');
      setUser(null);
      console.log('AuthContext: User state set to null');
      
      // 3. Navigate to login
      console.log('AuthContext: Navigating to login page');
      router.replace('/login');
      console.log('AuthContext: Navigation to login page completed');
      
      // 4. Additional cleanup
      setLoading(false);
      console.log('AuthContext: Sign out process completed successfully');
      
    } catch (error) {
      console.error('AuthContext: Error during sign-out:', error);
      // Even on error, ensure user is logged out
      setUser(null);
      router.replace('/login');
      throw new Error('Failed to sign out properly');
    }
  };

  // Helper function to redirect based on user role
  const redirectBasedOnRole = (role: UserRole) => {
    switch (role) {
      case 'farmer':
        router.replace('/(farmer)');
        break;
      case 'expert':
        router.replace('/(expert)');
        break;
      case 'buyer':
        router.replace('/(buyer)');
        break;
      case 'admin':
        router.replace('/(admin)');
        break;
      default:
        router.replace('/login');
    }
  };

  // Create initial users if none exist
  useEffect(() => {
    const createInitialUsers = async () => {
      try {
        // Check if users already exist
        const storedUsers = await AsyncStorage.getItem('users');
        if (!storedUsers || JSON.parse(storedUsers).length === 0) {
          // Create sample users for testing
          const initialUsers: User[] = [
            {
              id: generateUserId(),
              name: 'Demo Farmer',
              email: 'farmer@example.com',
              username: 'farmer',
              password: 'password',
              role: 'farmer',
              farmName: 'Green Valley Farm',
              region: 'Botswana',
              currency: 'BWP',
              createdAt: Date.now()
            },
            {
              id: generateUserId(),
              name: 'Agricultural Expert',
              email: 'expert@example.com',
              username: 'expert',
              password: 'password',
              role: 'expert',
              createdAt: Date.now()
            },
            {
              id: generateUserId(),
              name: 'Market Buyer',
              email: 'buyer@example.com',
              username: 'buyer',
              password: 'password',
              role: 'buyer',
              createdAt: Date.now()
            },
            {
              id: generateUserId(),
              name: 'System Administrator',
              email: 'admin@example.com',
              username: 'admin',
              password: 'password',
              role: 'admin',
              createdAt: Date.now()
            }
          ];

          // Save the initial users
          await AsyncStorage.setItem('users', JSON.stringify(initialUsers));
          console.log('Created initial users');
        }
      } catch (error) {
        console.error('Failed to create initial users:', error);
      }
    };

    if (!loading && !user) {
      createInitialUsers();
    }
  }, [loading, user]);

  // Log provided functions for debugging
  console.log('AuthContext provided functions:', { 
    signIn: typeof signIn, 
    signOut: typeof signOut, 
    register: typeof register 
  });

  // Create the context value object
  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    register
  };

  // Print the context value for debugging
  console.log('Context value contains signIn?', 'signIn' in value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Add default export
export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
} 