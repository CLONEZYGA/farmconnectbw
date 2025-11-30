import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../_types/auth';
import { UserRole as AdminUserRole } from '../_types/admin';

const USERS_STORAGE_KEY = 'users';

export interface LocalUser {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export const authUtils = {
  async saveUser(user: LocalUser): Promise<void> {
    try {
      const existingUsers = await this.getUsers();
      existingUsers.push(user);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
      console.log('User saved successfully:', user.username);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async getUsers(): Promise<LocalUser[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  async findUser(username: string): Promise<LocalUser | null> {
    try {
      const users = await this.getUsers();
      return users.find(user => user.username === username) || null;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  },

  async authenticate(username: string, password: string): Promise<LocalUser | null> {
    try {
      const user = await this.findUser(username);
      if (user && user.password === password) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  },

  async clearUsers(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USERS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing users:', error);
    }
  }
};

export const getRoleBasedRoute = (role: AdminUserRole): string => {
  switch (role) {
    case 'admin':
      return '/(admin)';
    case 'farmer':
      return '/(farmer)';
    case 'buyer':
      return '/(buyer)';
    case 'expert':
      return '/(expert)';
    default:
      return '/';
  }
};

export const isAuthorizedForRoute = (role: AdminUserRole, route: string): boolean => {
  const baseRoute = route.split('/')[1];
  switch (role) {
    case 'admin':
      return baseRoute === '(admin)';
    case 'farmer':
      return baseRoute === '(farmer)';
    case 'buyer':
      return baseRoute === '(buyer)';
    case 'expert':
      return baseRoute === '(expert)';
    default:
      return false;
  }
};
