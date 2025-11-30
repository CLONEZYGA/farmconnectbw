// Environment configuration management
export interface EnvironmentConfig {
  development: {
    FIREBASE_ADMIN_API_KEY: string;
    FIREBASE_ADMIN_AUTH_DOMAIN: string;
    FIREBASE_ADMIN_PROJECT_ID: string;
    FIREBASE_ADMIN_STORAGE_BUCKET: string;
    FIREBASE_ADMIN_MESSAGING_SENDER_ID: string;
    FIREBASE_ADMIN_APP_ID: string;
    FIREBASE_USER_API_KEY: string;
    FIREBASE_USER_AUTH_DOMAIN: string;
    FIREBASE_USER_PROJECT_ID: string;
    FIREBASE_USER_STORAGE_BUCKET: string;
    FIREBASE_USER_MESSAGING_SENDER_ID: string;
    FIREBASE_USER_APP_ID: string;
    ADMIN_API_BASE_URL: string;
    ADMIN_API_KEY: string;
    USER_API_BASE_URL: string;
    USER_API_KEY: string;
    API_TIMEOUT: number;
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  };
  staging: {
    FIREBASE_ADMIN_API_KEY: string;
    FIREBASE_ADMIN_AUTH_DOMAIN: string;
    FIREBASE_ADMIN_PROJECT_ID: string;
    FIREBASE_ADMIN_STORAGE_BUCKET: string;
    FIREBASE_ADMIN_MESSAGING_SENDER_ID: string;
    FIREBASE_ADMIN_APP_ID: string;
    FIREBASE_USER_API_KEY: string;
    FIREBASE_USER_AUTH_DOMAIN: string;
    FIREBASE_USER_PROJECT_ID: string;
    FIREBASE_USER_STORAGE_BUCKET: string;
    FIREBASE_USER_MESSAGING_SENDER_ID: string;
    FIREBASE_USER_APP_ID: string;
    ADMIN_API_BASE_URL: string;
    ADMIN_API_KEY: string;
    USER_API_BASE_URL: string;
    USER_API_KEY: string;
    API_TIMEOUT: number;
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  };
  production: {
    FIREBASE_ADMIN_API_KEY: string;
    FIREBASE_ADMIN_AUTH_DOMAIN: string;
    FIREBASE_ADMIN_PROJECT_ID: string;
    FIREBASE_ADMIN_STORAGE_BUCKET: string;
    FIREBASE_ADMIN_MESSAGING_SENDER_ID: string;
    FIREBASE_ADMIN_APP_ID: string;
    FIREBASE_USER_API_KEY: string;
    FIREBASE_USER_AUTH_DOMAIN: string;
    FIREBASE_USER_PROJECT_ID: string;
    FIREBASE_USER_STORAGE_BUCKET: string;
    FIREBASE_USER_MESSAGING_SENDER_ID: string;
    FIREBASE_USER_APP_ID: string;
    ADMIN_API_BASE_URL: string;
    ADMIN_API_KEY: string;
    USER_API_BASE_URL: string;
    USER_API_KEY: string;
    API_TIMEOUT: number;
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  };
}

// Get current environment
export function getCurrentEnvironment(): 'development' | 'staging' | 'production' {
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Check for explicit environment override
  if (process.env.EXPO_PUBLIC_ENVIRONMENT) {
    const env = process.env.EXPO_PUBLIC_ENVIRONMENT.toLowerCase();
    if (['development', 'staging', 'production'].includes(env)) {
      return env as 'development' | 'staging' | 'production';
    }
  }

  // Check if we're in web and use development defaults
  if (typeof window !== 'undefined' && nodeEnv === 'development') {
    return 'development';
  }

  // Default to production for builds
  if (nodeEnv === 'production' || !nodeEnv) {
    return 'production';
  }

  return nodeEnv as 'development' | 'staging' | 'production';
}

// Get environment configuration
export function getEnvironmentConfig(): EnvironmentConfig[typeof getCurrentEnvironment()] {
  const env = getCurrentEnvironment();

  switch (env) {
    case 'development':
      return {
        FIREBASE_ADMIN_API_KEY: process.env.FIREBASE_ADMIN_API_KEY || '',
        FIREBASE_ADMIN_AUTH_DOMAIN: process.env.FIREBASE_ADMIN_AUTH_DOMAIN || 'farmconnectbw-admin-dev.firebaseapp.com',
        FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID || 'farmconnectbw-admin-dev',
        FIREBASE_ADMIN_STORAGE_BUCKET: process.env.FIREBASE_ADMIN_STORAGE_BUCKET || 'farmconnectbw-admin-dev.appspot.com',
        FIREBASE_ADMIN_MESSAGING_SENDER_ID: process.env.FIREBASE_ADMIN_MESSAGING_SENDER_ID || '',
        FIREBASE_ADMIN_APP_ID: process.env.FIREBASE_ADMIN_APP_ID || '',
        FIREBASE_USER_API_KEY: process.env.FIREBASE_USER_API_KEY || '',
        FIREBASE_USER_AUTH_DOMAIN: process.env.FIREBASE_USER_AUTH_DOMAIN || 'farmconnectbw-user-dev.firebaseapp.com',
        FIREBASE_USER_PROJECT_ID: process.env.FIREBASE_USER_PROJECT_ID || 'farmconnectbw-user-dev',
        FIREBASE_USER_STORAGE_BUCKET: process.env.FIREBASE_USER_STORAGE_BUCKET || 'farmconnectbw-user-dev.appspot.com',
        FIREBASE_USER_MESSAGING_SENDER_ID: process.env.FIREBASE_USER_MESSAGING_SENDER_ID || '',
        FIREBASE_USER_APP_ID: process.env.FIREBASE_USER_APP_ID || '',
        ADMIN_API_BASE_URL: process.env.ADMIN_API_BASE_URL || 'http://localhost:3001/admin',
        ADMIN_API_KEY: process.env.ADMIN_API_KEY || 'dev-admin-key',
        USER_API_BASE_URL: process.env.USER_API_BASE_URL || 'http://localhost:3002/api',
        USER_API_KEY: process.env.USER_API_KEY || 'dev-user-key',
        API_TIMEOUT: 30000, // 30 seconds
        LOG_LEVEL: 'debug',
      };

    case 'staging':
      return {
        FIREBASE_ADMIN_API_KEY: process.env.FIREBASE_ADMIN_API_KEY || '',
        FIREBASE_ADMIN_AUTH_DOMAIN: process.env.FIREBASE_ADMIN_AUTH_DOMAIN || 'farmconnectbw-admin-staging.firebaseapp.com',
        FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID || 'farmconnectbw-admin-staging',
        FIREBASE_ADMIN_STORAGE_BUCKET: process.env.FIREBASE_ADMIN_STORAGE_BUCKET || 'farmconnectbw-admin-staging.appspot.com',
        FIREBASE_ADMIN_MESSAGING_SENDER_ID: process.env.FIREBASE_ADMIN_MESSAGING_SENDER_ID || '',
        FIREBASE_ADMIN_APP_ID: process.env.FIREBASE_ADMIN_APP_ID || '',
        FIREBASE_USER_API_KEY: process.env.FIREBASE_USER_API_KEY || '',
        FIREBASE_USER_AUTH_DOMAIN: process.env.FIREBASE_USER_AUTH_DOMAIN || 'farmconnectbw-user-staging.firebaseapp.com',
        FIREBASE_USER_PROJECT_ID: process.env.FIREBASE_USER_PROJECT_ID || 'farmconnectbw-user-staging',
        FIREBASE_USER_STORAGE_BUCKET: process.env.FIREBASE_USER_STORAGE_BUCKET || 'farmconnectbw-user-staging.appspot.com',
        FIREBASE_USER_MESSAGING_SENDER_ID: process.env.FIREBASE_USER_MESSAGING_SENDER_ID || '',
        FIREBASE_USER_APP_ID: process.env.FIREBASE_USER_APP_ID || '',
        ADMIN_API_BASE_URL: process.env.ADMIN_API_BASE_URL || 'https://staging-admin-api.farmconnectbw.com',
        ADMIN_API_KEY: process.env.ADMIN_API_KEY || '',
        USER_API_BASE_URL: process.env.USER_API_BASE_URL || 'https://staging-api.farmconnectbw.com',
        USER_API_KEY: process.env.USER_API_KEY || '',
        API_TIMEOUT: 25000, // 25 seconds
        LOG_LEVEL: 'info',
      };

    case 'production':
      return {
        FIREBASE_ADMIN_API_KEY: process.env.FIREBASE_ADMIN_API_KEY || '',
        FIREBASE_ADMIN_AUTH_DOMAIN: process.env.FIREBASE_ADMIN_AUTH_DOMAIN || 'farmconnectbw-admin.firebaseapp.com',
        FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID || 'farmconnectbw-admin',
        FIREBASE_ADMIN_STORAGE_BUCKET: process.env.FIREBASE_ADMIN_STORAGE_BUCKET || 'farmconnectbw-admin.appspot.com',
        FIREBASE_ADMIN_MESSAGING_SENDER_ID: process.env.FIREBASE_ADMIN_MESSAGING_SENDER_ID || '',
        FIREBASE_ADMIN_APP_ID: process.env.FIREBASE_ADMIN_APP_ID || '',
        FIREBASE_USER_API_KEY: process.env.FIREBASE_USER_API_KEY || '',
        FIREBASE_USER_AUTH_DOMAIN: process.env.FIREBASE_USER_AUTH_DOMAIN || 'farmconnectbw-user.firebaseapp.com',
        FIREBASE_USER_PROJECT_ID: process.env.FIREBASE_USER_PROJECT_ID || 'farmconnectbw-user',
        FIREBASE_USER_STORAGE_BUCKET: process.env.FIREBASE_USER_STORAGE_BUCKET || 'farmconnectbw-user.appspot.com',
        FIREBASE_USER_MESSAGING_SENDER_ID: process.env.FIREBASE_USER_MESSAGING_SENDER_ID || '',
        FIREBASE_USER_APP_ID: process.env.FIREBASE_USER_APP_ID || '',
        ADMIN_API_BASE_URL: process.env.ADMIN_API_BASE_URL || 'https://admin-api.farmconnectbw.com',
        ADMIN_API_KEY: process.env.ADMIN_API_KEY || '',
        USER_API_BASE_URL: process.env.USER_API_BASE_URL || 'https://api.farmconnectbw.com',
        USER_API_KEY: process.env.USER_API_KEY || '',
        API_TIMEOUT: 20000, // 20 seconds
        LOG_LEVEL: 'info',
      };

    default:
      throw new Error(`Unknown environment: ${env}`);
  }
}

// Environment-specific utilities
export const environmentUtils = {
  isDevelopment: () => getCurrentEnvironment() === 'development',
  isStaging: () => getCurrentEnvironment() === 'staging',
  isProduction: () => getCurrentEnvironment() === 'production',
  isTest: () => process.env.NODE_ENV === 'test',
  isWeb: () => typeof window !== 'undefined',
  isNative: () => typeof window === 'undefined',
  getAPIBaseURL: (platform: 'admin' | 'user') => {
    const config = getEnvironmentConfig();
    return platform === 'admin' ? config.ADMIN_API_BASE_URL : config.USER_API_BASE_URL;
  },
  getAPIKey: (platform: 'admin' | 'user') => {
    const config = getEnvironmentConfig();
    return platform === 'admin' ? config.ADMIN_API_KEY : config.USER_API_KEY;
  },
  getAPIConfig: (platform: 'admin' | 'user') => {
    const config = getEnvironmentConfig();
    return {
      baseURL: platform === 'admin' ? config.ADMIN_API_BASE_URL : config.USER_API_BASE_URL,
      apiKey: platform === 'admin' ? config.ADMIN_API_KEY : config.USER_API_KEY,
      timeout: config.API_TIMEOUT,
      logLevel: config.LOG_LEVEL,
    };
  },
  getFirebaseConfig: (platform: 'admin' | 'user') => {
    const config = getEnvironmentConfig();
    if (platform === 'admin') {
      return {
        apiKey: config.FIREBASE_ADMIN_API_KEY,
        authDomain: config.FIREBASE_ADMIN_AUTH_DOMAIN,
        projectId: config.FIREBASE_ADMIN_PROJECT_ID,
        storageBucket: config.FIREBASE_ADMIN_STORAGE_BUCKET,
        messagingSenderId: config.FIREBASE_ADMIN_MESSAGING_SENDER_ID,
        appId: config.FIREBASE_ADMIN_APP_ID,
      };
    } else {
      return {
        apiKey: config.FIREBASE_USER_API_KEY,
        authDomain: config.FIREBASE_USER_AUTH_DOMAIN,
        projectId: config.FIREBASE_USER_PROJECT_ID,
        storageBucket: config.FIREBASE_USER_STORAGE_BUCKET,
        messagingSenderId: config.FIREBASE_USER_MESSAGING_SENDER_ID,
        appId: config.FIREBASE_USER_APP_ID,
      };
    }
  },
  // Helper for building environment-specific URLs
  buildURL: (path: string, platform?: 'admin' | 'user') => {
    const baseURL = platform ? environmentUtils.getAPIBaseURL(platform) : getEnvironmentConfig().USER_API_BASE_URL;
    return `${baseURL}${path.startsWith('/') ? path : `/${path}`}`;
  },
  // Helper for checking if critical environment variables are set
  validateEnvironment: () => {
    const config = getEnvironmentConfig();
    const missing: string[] = [];

    // Check Firebase configs
    if (!config.FIREBASE_ADMIN_API_KEY) missing.push('FIREBASE_ADMIN_API_KEY');
    if (!config.FIREBASE_USER_API_KEY) missing.push('FIREBASE_USER_API_KEY');

    // Check API keys
    if (!config.ADMIN_API_KEY) missing.push('ADMIN_API_KEY');
    if (!config.USER_API_KEY) missing.push('USER_API_KEY');

    // Check API URLs
    if (!config.ADMIN_API_BASE_URL) missing.push('ADMIN_API_BASE_URL');
    if (!config.USER_API_BASE_URL) missing.push('USER_API_BASE_URL');

    return {
      isValid: missing.length === 0,
      missing,
      environment: getCurrentEnvironment(),
    };
  },
};

// Default export
export default {
  getCurrentEnvironment,
  getEnvironmentConfig,
  environmentUtils,
};