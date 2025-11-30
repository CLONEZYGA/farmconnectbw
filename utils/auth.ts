import { StorageService } from '../services/storage';
import { User } from '../types/auth';

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await StorageService.getUser();
  return !!user;
};

export const getUserRole = async (): Promise<string | null> => {
  const user = await StorageService.getUser();
  return user ? user.role : null;
};

export const getUser = async (): Promise<User | null> => {
  return await StorageService.getUser();
};

export default {
  isAuthenticated,
  getUserRole,
  getUser
}; 