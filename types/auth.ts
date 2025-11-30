export type Role = 'farmer' | 'buyer' | 'admin' | 'expert';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Create a default export
export default { Role, User, AuthState }; 