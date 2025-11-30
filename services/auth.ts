import { User } from '../types/auth';

// Mock auth service
export const login = async (email: string, password: string): Promise<User | null> => {
  // In a real app, this would call an API
  const mockUsers = {
    'farmer@test.com': { id: '1', name: 'Farmer', email: 'farmer@test.com', role: 'farmer' },
    'buyer@test.com': { id: '2', name: 'Buyer', email: 'buyer@test.com', role: 'buyer' },
    'admin@test.com': { id: '3', name: 'Admin', email: 'admin@test.com', role: 'admin' },
  };

  return mockUsers[email] || null;
};

export const logout = async (): Promise<void> => {
  // In a real app, this would invalidate tokens
  return Promise.resolve();
};

// Create a default export
export default { login, logout }; 