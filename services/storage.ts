import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';

export const StorageService = {
  // User-related storage methods
  setUser: async (user: User): Promise<void> => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },

  getUser: async (): Promise<User | null> => {
    const data = await AsyncStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  },

  removeUser: async (): Promise<void> => {
    await AsyncStorage.removeItem('user');
  },

  // Mock users for testing
  getUsers: async (): Promise<User[]> => {
    return [
      { id: '1', name: 'Farmer Test', email: 'farmer@test.com', role: 'farmer' },
      { id: '2', name: 'Buyer Test', email: 'buyer@test.com', role: 'buyer' },
      { id: '3', name: 'Admin Test', email: 'admin@test.com', role: 'admin' },
      { id: '4', name: 'Expert Test', email: 'expert@test.com', role: 'expert' },
    ];
  },
};

export default StorageService; 