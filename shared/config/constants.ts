// App-wide constants
export const APP_NAME = 'FarmConnectBW';
export const APP_VERSION = '1.0.0';

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  FARMER: 'farmer',
  BUYER: 'buyer',
  EXPERT: 'expert'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Platform identifiers
export const PLATFORMS = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export type Platform = typeof PLATFORMS[keyof typeof PLATFORMS];

// API endpoints
export const API_ENDPOINTS = {
  ADMIN: {
    USERS: '/admin/users',
    REPORTS: '/admin/reports',
    LOGS: '/admin/logs',
    SETTINGS: '/admin/settings'
  },
  USER: {
    PROFILE: '/user/profile',
    PRODUCTS: '/user/products',
    ORDERS: '/user/orders',
    CONSULTATIONS: '/user/consultations'
  }
} as const;

// Database collections
export const DATABASE_COLLECTIONS = {
  ADMIN: {
    LOGS: 'admin_logs',
    SETTINGS: 'admin_settings',
    REPORTS: 'admin_reports'
  },
  USER: {
    USERS: 'users',
    PRODUCTS: 'products',
    ORDERS: 'orders',
    CONSULTATIONS: 'consultations'
  }
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[\d\s\-\(\)]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
} as const;

// Error messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_EXPIRED: 'Session expired, please login again'
  },
  NETWORK: {
    OFFLINE: 'Network connection unavailable',
    TIMEOUT: 'Request timed out',
    SERVER_ERROR: 'Server error, please try again later'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long'
  }
} as const;