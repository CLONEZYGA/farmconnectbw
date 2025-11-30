export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'buyer' | 'admin' | 'expert';
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  userId: string;
  status: 'open' | 'closed' | 'in-progress';
}

export default { User, Report }; 