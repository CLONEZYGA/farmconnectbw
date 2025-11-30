import { User } from '../context/AuthContext';

// Permission levels - hierarchical structure
export enum PermissionLevel {
  BASIC = 0,       // Basic user permissions
  STANDARD = 1,    // Standard operations
  ADVANCED = 2,    // Advanced operations
  ADMIN = 3,       // Administrative operations
  SUPER_ADMIN = 4  // Super admin (can do everything)
}

// Map user roles to permission levels
const rolePermissions = {
  'FARMER': PermissionLevel.STANDARD,
  'BUYER': PermissionLevel.STANDARD,
  'EXPERT': PermissionLevel.ADVANCED,
  'ADMIN': PermissionLevel.SUPER_ADMIN
};

// Feature access mapping
export const FeatureAccess = {
  // Dashboard features
  VIEW_DASHBOARD: PermissionLevel.BASIC,
  EDIT_DASHBOARD: PermissionLevel.STANDARD,
  
  // User management
  VIEW_USERS: PermissionLevel.ADVANCED,
  CREATE_USER: PermissionLevel.ADMIN,
  EDIT_USER: PermissionLevel.ADMIN,
  DELETE_USER: PermissionLevel.ADMIN,
  CHANGE_USER_ROLE: PermissionLevel.SUPER_ADMIN,
  
  // System settings
  VIEW_SETTINGS: PermissionLevel.ADVANCED,
  EDIT_SETTINGS: PermissionLevel.ADMIN,
  SYSTEM_CONFIGURATION: PermissionLevel.SUPER_ADMIN,
  
  // Data management
  VIEW_DATA: PermissionLevel.BASIC,
  EDIT_DATA: PermissionLevel.STANDARD,
  DELETE_DATA: PermissionLevel.ADVANCED,
  IMPORT_EXPORT_DATA: PermissionLevel.ADMIN,
  
  // Audit and logs
  VIEW_LOGS: PermissionLevel.ADMIN,
  CLEAR_LOGS: PermissionLevel.SUPER_ADMIN,
  
  // Financial operations
  VIEW_FINANCES: PermissionLevel.STANDARD,
  APPROVE_TRANSACTIONS: PermissionLevel.ADVANCED,
  FINANCIAL_SETUP: PermissionLevel.SUPER_ADMIN,
};

/**
 * Check if the current user has permission for a specific feature
 * @param user The current user
 * @param requiredPermission The permission level required for the feature
 * @returns boolean indicating if the user has permission
 */
export const hasPermission = (
  user: User | null, 
  requiredPermission: PermissionLevel
): boolean => {
  if (!user) return false;
  
  // Admin bypass - ADMIN role can do everything
  if (user.role === 'ADMIN') return true;
  
  // For other roles, check permission level
  const userPermissionLevel = rolePermissions[user.role] || PermissionLevel.BASIC;
  return userPermissionLevel >= requiredPermission;
};

/**
 * Check if user can access a specific feature
 * @param user The current user
 * @param feature The feature to check access for
 * @returns boolean indicating if the user can access the feature
 */
export const canAccessFeature = (
  user: User | null,
  feature: keyof typeof FeatureAccess
): boolean => {
  if (!user) return false;
  
  // Admin bypass - ADMIN role can access all features
  if (user.role === 'ADMIN') return true;
  
  // For other roles, check permission level for the feature
  const requiredPermission = FeatureAccess[feature];
  const userPermissionLevel = rolePermissions[user.role] || PermissionLevel.BASIC;
  return userPermissionLevel >= requiredPermission;
};

/**
 * Get all features a user can access
 * @param user The current user
 * @returns Array of features the user can access
 */
export const getUserAccessibleFeatures = (user: User | null): (keyof typeof FeatureAccess)[] => {
  if (!user) return [];
  
  // Admin can access all features
  if (user.role === 'ADMIN') {
    return Object.keys(FeatureAccess) as (keyof typeof FeatureAccess)[];
  }
  
  // For other roles, filter features by permission level
  const userPermissionLevel = rolePermissions[user.role] || PermissionLevel.BASIC;
  return Object.entries(FeatureAccess)
    .filter(([_, permissionLevel]) => userPermissionLevel >= permissionLevel)
    .map(([feature, _]) => feature as keyof typeof FeatureAccess);
};

// Export a special function to check if user is a super admin (full system control)
export const isSystemAdmin = (user: User | null): boolean => {
  return user?.role === 'ADMIN';
}; 