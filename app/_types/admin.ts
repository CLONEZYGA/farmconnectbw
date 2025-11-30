export type UserRole = 'admin' | 'farmer' | 'buyer' | 'expert';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
}

export interface SystemLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'announcement' | 'help';
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  registrationOpen: boolean;
  maintenanceMode: boolean;
  featureFlags: {
    [key: string]: boolean;
  };
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  userGrowth: {
    date: string;
    count: number;
  }[];
  roleDistribution: {
    role: UserRole;
    count: number;
  }[];
}
