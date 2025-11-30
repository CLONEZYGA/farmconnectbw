import { UserProfile } from './profile';

export type UserRole = 'EXPERT' | 'FARMER' | 'BUYER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
