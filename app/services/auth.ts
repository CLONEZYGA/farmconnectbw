import { AuthResponse, LoginCredentials, RegisterData } from '../_types/auth';
import { authUtils } from '../_utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_STORAGE_KEY = 'authToken';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const user = await authUtils.authenticate(credentials.username, credentials.password);
      
      if (!user) {
        throw new Error('Invalid username or password');
      }

      const token = `local-token-${Date.now()}`;
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);

      const { password, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<void> {
    try {
      // Check if username exists
      const existingUser = await authUtils.findUser(data.username);
      if (existingUser) {
        throw new Error('Username already exists');
      }

      const newUser = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await authUtils.saveUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async validateToken(token: string): Promise<AuthResponse> {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token !== storedToken) {
        throw new Error('Invalid token');
      }

      // Get the first user for demo purposes
      const users = await authUtils.getUsers();
      if (users.length === 0) {
        throw new Error('No users found');
      }

      const { password, ...userWithoutPassword } = users[0];
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  },

  async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  },

  async clearToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing token:', error);
      throw error;
    }
  }
}; 