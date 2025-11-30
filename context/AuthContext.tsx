import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { PREDEFINED_USERS } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { auth } from '../config/firebase';
import databaseService from '../services/database';
import { database } from '../config/firebase';
import { ref as dbRef, set as dbSet } from 'firebase/database';

// User types supported by the app
export type UserRole = 'farmer' | 'expert' | 'buyer' | 'admin';

// Complete user object structure
export interface User {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  profileImage?: string;
  farmName?: string;
  region?: string;
  currency?: string;
  createdAt: number;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  properties?: {
    id: string;
    name: string;
    type: string;
    location: string;
    description?: string;
  }[];
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
  region?: string;
  currency?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  properties?: {
    id: string;
    name: string;
    type: string;
    location: string;
    description?: string;
  }[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateUser: (updatedUser: User) => Promise<User>;
  predefinedUsers: typeof PREDEFINED_USERS;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  LOGGED_IN_USER: 'loggedInUser',
  AUTH_TOKEN: 'authToken',
};

// Platform-specific storage operations
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      if (key === STORAGE_KEYS.AUTH_TOKEN) {
        await SecureStore.setItemAsync(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    }
  },
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      if (key === STORAGE_KEYS.AUTH_TOKEN) {
        return await SecureStore.getItemAsync(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      if (key === STORAGE_KEYS.AUTH_TOKEN) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    }
  },
  clear: async () => {
    if (Platform.OS === 'web') {
      localStorage.clear();
    } else {
      await AsyncStorage.clear();
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    }
  }
};

// Helper function to redirect based on role
const redirectBasedOnRole = (role: UserRole, router: any) => {
  switch (role) {
    case 'farmer':
      router.replace('/(farmer)/market');
      break;
    case 'expert':
      router.replace('/(expert)/messages');
      break;
    case 'buyer':
      router.replace('/(buyer)/cart');
      break;
    case 'admin':
      router.replace('/(admin)/dashboard');
      break;
    default:
      router.replace('/login');
  }
};

// Helper function to convert Firebase user to app user
const convertFirebaseUserToAppUser = async (firebaseUser: any): Promise<User | null> => {
  try {
    // Try to get user profile from PostgreSQL database
    const userProfile = await databaseService.getUserByFirebaseUid(firebaseUser.uid);
    
    if (userProfile) {
      return {
        id: userProfile.id,
        firebaseUid: userProfile.firebase_uid,
        name: userProfile.name,
        email: userProfile.email,
        username: userProfile.email.split('@')[0], // Generate username from email
        role: userProfile.role,
        phoneNumber: userProfile.phone_number,
        region: userProfile.region,
        farmName: userProfile.farm_name,
        createdAt: new Date(userProfile.created_at).getTime(),
      };
    }
    
    // If no profile in database, create a basic user object
    return {
      id: firebaseUser.uid,
      firebaseUid: firebaseUser.uid,
      name: firebaseUser.displayName || 'User',
      email: firebaseUser.email || '',
      username: firebaseUser.email?.split('@')[0] || 'user',
      role: 'farmer', // Default role
      createdAt: Date.now(),
    };
  } catch (error) {
    console.error('Error converting Firebase user:', error);
    return null;
  }
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Firebase auth state listener
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any | null) => {
      try {
        if (firebaseUser) {
          // User is signed in
          const appUser = await convertFirebaseUserToAppUser(firebaseUser);
          if (appUser) {
            setUser(appUser);
            await storage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(appUser));
            
            // Get Firebase ID token for API calls
            const token = await getIdToken(firebaseUser);
            await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            
            // Redirect based on role
            redirectBasedOnRole(appUser.role, router);
          }
        } else {
          // User is signed out
          setUser(null);
          await storage.clear();
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        setUser(null);
        await storage.clear();
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Route protection effect
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = ['(farmer)', '(expert)', '(buyer)', '(admin)'].includes(segments[0] || '');
    
    if (!user && inProtectedGroup) {
      // Redirect to login if trying to access protected route without user
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Redirect to appropriate screen if user is logged in and trying to access auth screens
      redirectBasedOnRole(user.role, router);
    }
  }, [user, loading, segments]);

  const signIn = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setLoading(true);
      
      // Check if it's a predefined user
      const predefinedUser = Object.values(PREDEFINED_USERS).find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (predefinedUser) {
        // Use predefined credentials
        const userCredential = await signInWithEmailAndPassword(
          auth,
          predefinedUser.email,
          predefinedUser.password
        );
        
        // Create user profile in database if it doesn't exist
        try {
          const existingProfile = await databaseService.getUserByFirebaseUid(userCredential.user.uid);
            if (!existingProfile) {
            await databaseService.createUser({
              firebase_uid: userCredential.user.uid,
              email: predefinedUser.email,
              name: predefinedUser.name,
              role: predefinedUser.role,
              phone_number: predefinedUser.phoneNumber,
              region: predefinedUser.region,
              farm_name: (predefinedUser as any).farmName,
              company: (predefinedUser as any).company,
              specialization: (predefinedUser as any).specialization,
              department: (predefinedUser as any).department,
            });
          }
        } catch (dbError) {
          console.warn('Database operation failed, continuing with Firebase auth:', dbError);
        }
      } else {
        // Regular Firebase authentication
        await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Create user profile in PostgreSQL database
      try {
        await databaseService.createUser({
          firebase_uid: userCredential.user.uid,
          email: data.email,
          name: data.name,
          role: data.role,
          phone_number: data.phoneNumber,
          region: data.region,
          farm_name: data.farmName,
          bio: data.bio,
        });
        // Also write a minimal profile to Realtime Database for quick app sync
        try {
          const userNodeRef = dbRef(database, `users/${userCredential.user.uid}`);
          const profileImage = (data as any).profileImage ?? null;
          await dbSet(userNodeRef, {
            uid: userCredential.user.uid,
            email: data.email,
            name: data.name,
            username: data.username || data.email.split('@')[0],
            role: data.role,
            profileImage,
            phoneNumber: data.phoneNumber || null,
            farmName: data.farmName || null,
            address: data.address || null,
            dateOfBirth: data.dateOfBirth || null,
            gender: data.gender || null,
            bio: data.bio || null,
            region: data.region || null,
            currency: data.currency || null,
            properties: data.properties || null,
            createdAt: Date.now()
          });
        } catch (rtError) {
          console.warn('Realtime DB write failed (non-fatal):', rtError);
        }
      } catch (dbError) {
        console.error('Error creating user profile in database:', dbError);
        // If database creation fails, delete the Firebase user
        await userCredential.user.delete();
        throw new Error('Failed to create user profile. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
      await storage.clear();
      router.replace('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedUser: User): Promise<User> => {
    try {
      // Update user in PostgreSQL database
      if (updatedUser.id) {
        await databaseService.updateUser(updatedUser.id, {
          name: updatedUser.name,
          phone_number: updatedUser.phoneNumber,
          region: updatedUser.region,
          farm_name: updatedUser.farmName,
          bio: updatedUser.bio,
        });
      }
      
      // Update local state
      setUser(updatedUser);
      await storage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error('Failed to update user. Please try again.');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    register,
    updateUser,
    predefinedUsers: PREDEFINED_USERS,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
