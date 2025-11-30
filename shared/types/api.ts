import { UserRole } from '../config/constants';

// Common API response wrapper
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Admin API types
export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface AdminLogEntry {
  id: string;
  action: string;
  userId: string;
  timestamp: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AdminReport {
  id: string;
  type: string;
  title: string;
  data: Record<string, any>;
  generatedAt: Date;
  generatedBy: string;
  filters?: Record<string, any>;
}

export interface AdminSettings {
  platform: Record<string, any>;
  features: Record<string, boolean>;
  notifications: Record<string, any>;
  security: Record<string, any>;
}

// User API types
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  profileData: FarmerProfile | BuyerProfile | ExpertProfile;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

export interface FarmerProfile {
  firstName: string;
  lastName: string;
  farmName: string;
  farmLocation: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  farmSize: number; // in acres/hectares
  specialization: string[];
  certifications: string[];
  bio?: string;
  contactInfo: {
    phone: string;
    email?: string;
  };
}

export interface BuyerProfile {
  firstName: string;
  lastName: string;
  companyName?: string;
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  businessType: 'individual' | 'restaurant' | 'retailer' | 'distributor';
  preferences: {
    productTypes: string[];
    organic: boolean;
    local: boolean;
  };
  bio?: string;
  contactInfo: {
    phone: string;
    email?: string;
  };
}

export interface ExpertProfile {
  firstName: string;
  lastName: string;
  title: string;
  specialization: string[];
  experience: number; // years
  qualifications: {
    degree?: string;
    certifications: string[];
    licenses: string[];
  };
  bio?: string;
  availability: {
    days: string[];
    timeSlots: string[];
  };
  consultationRate?: number;
  contactInfo: {
    phone: string;
    email?: string;
    website?: string;
  };
}

// Product types
export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  available: boolean;
  quantity: number;
  images: string[];
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  certifications?: string[];
  organic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order types
export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  products: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

// Consultation types
export interface Consultation {
  id: string;
  farmerId: string;
  farmerName: string;
  expertId: string;
  expertName: string;
  status: 'requested' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: string;
  description?: string;
  scheduledAt?: Date;
  duration?: number; // in minutes
  meetingLink?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AdminUser | UserProfile;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  profileData: Partial<FarmerProfile | BuyerProfile | ExpertProfile>;
}

// Request/Response types for different operations
export interface UserListRequest {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
  isActive?: boolean;
}

export interface ReportRequest {
  type: string;
  filters?: Record<string, any>;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ProfileUpdateRequest {
  profileData: Partial<FarmerProfile | BuyerProfile | ExpertProfile>;
}

// Error types
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}