import { User } from 'firebase/auth';

// Firebase custom claims
export interface FirebaseCustomClaims {
  role: string;
  permissions: string[];
  platform: string;
}

// Firebase user metadata
export interface FirebaseUserMetadata {
  creationTime?: string;
  lastSignInTime?: string;
}

// Extended Firebase user
export interface ExtendedFirebaseUser extends User {
  role?: string;
  permissions?: string[];
  platform?: string;
  metadata: FirebaseUserMetadata;
}

// Firestore document references
export interface FirestoreDocument {
  id: string;
  exists: boolean;
  data(): any;
}

// Firestore query types
export interface FirestoreQueryOptions {
  where?: Array<{
    field: string;
    operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'array-contains' | 'in' | 'array-contains-any';
    value: any;
  }>;
  orderBy?: Array<{
    field: string;
    direction: 'asc' | 'desc';
  }>;
  limit?: number;
  offset?: number;
}

// Realtime Database paths
export const DATABASE_PATHS = {
  ADMIN: {
    USERS: 'admin/users',
    LOGS: 'admin/logs',
    REPORTS: 'admin/reports',
    SETTINGS: 'admin/settings'
  },
  USER: {
    FARMERS: 'users/farmers',
    BUYERS: 'users/buyers',
    EXPERTS: 'users/experts',
    PRODUCTS: 'users/products',
    ORDERS: 'users/orders',
    CONSULTATIONS: 'users/consultations'
  }
} as const;

// Firebase security rule context
export interface FirebaseSecurityRuleContext {
  auth?: {
    uid: string;
    token: {
      role: string;
      permissions: string[];
      platform: string;
    };
  };
  request: {
    time: number;
    headers: Record<string, string>;
  };
  resource: {
    data: Record<string, any>;
  };
}