import { User } from '../types/auth';

export const hasAccess = (user: User | null, requiredRoles: string[]): boolean => {
  if (!user) return false;
  return requiredRoles.includes(user.role);
};

export const isFarmer = (user: User | null): boolean => {
  return user?.role === 'farmer';
};

export const isBuyer = (user: User | null): boolean => {
  return user?.role === 'buyer';
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const isExpert = (user: User | null): boolean => {
  return user?.role === 'expert';
};

export default {
  hasAccess,
  isFarmer,
  isBuyer,
  isAdmin,
  isExpert
}; 