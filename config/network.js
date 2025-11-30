import AsyncStorage from '@react-native-async-storage/async-storage';

// Network configuration for offline/online handling
export const NETWORK_CONFIG = {
  // Timeout settings
  REQUEST_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second

  // Offline mode settings
  OFFLINE_MODE: {
    ENABLED: true,
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  },

  // API endpoints (for when network is available)
  API_ENDPOINTS: {
    BASE_URL: 'https://api.farmconnectbw.com', // Replace with your actual API
    AUTH: '/auth',
    USERS: '/users',
    PRODUCTS: '/products',
    ORDERS: '/orders',
    MESSAGES: '/messages',
  },

  // Local storage keys for offline data
  STORAGE_KEYS: {
    OFFLINE_DATA: 'offline_data',
    PENDING_REQUESTS: 'pending_requests',
    LAST_SYNC: 'last_sync',
    NETWORK_STATUS: 'network_status',
  },
};

// Network status checker
// Helper: fetch with timeout (fetch on React Native doesn't accept timeout option)
const fetchWithTimeout = (url, options = {}, timeout = NETWORK_CONFIG.REQUEST_TIMEOUT) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout)
    ),
  ]);
};

export const checkNetworkStatus = async () => {
  // Strategy:
  // 1) Try a quick 204 probe (clients3.google.com/generate_204) which returns 204 when online
  // 2) Fallback to checking the project's Realtime Database root (will return 200/401 if reachable)
  // 3) Any error/timeouts => consider offline
  try {
    // 204 probe (fast and conservative)
    const probe = await fetchWithTimeout('https://clients3.google.com/generate_204', { method: 'GET' }, 4000);
    if (probe && probe.status === 204) return true;

    // Fallback: try Firebase Realtime Database URL (exists in NETWORK_CONFIG? use configured database if present)
    const dbUrl = NETWORK_CONFIG.API_ENDPOINTS && NETWORK_CONFIG.API_ENDPOINTS.BASE_URL
      ? NETWORK_CONFIG.API_ENDPOINTS.BASE_URL
      : 'https://farmconnect-bw-default-rtdb.firebaseio.com';

    // Prefer a lightweight HEAD on the db host if possible
    try {
      const dbProbe = await fetchWithTimeout(dbUrl + '/.json', { method: 'GET' }, NETWORK_CONFIG.REQUEST_TIMEOUT);
      if (dbProbe && (dbProbe.status === 200 || dbProbe.status === 401 || dbProbe.status === 204)) return true;
    } catch (e) {
      // ignore and fall through
    }

    return false;
  } catch (error) {
    // Network check failed or timed out
    // console.debug('Network check failed:', error.message || error);
    return false;
  }
};

// Offline data manager
export class OfflineDataManager {
  static async saveOfflineData(key, data) {
    try {
      const offlineData = await this.getOfflineData();
      offlineData[key] = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(
        NETWORK_CONFIG.STORAGE_KEYS.OFFLINE_DATA,
        JSON.stringify(offlineData)
      );
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  static async getOfflineData() {
    try {
      const data = await AsyncStorage.getItem(NETWORK_CONFIG.STORAGE_KEYS.OFFLINE_DATA);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting offline data:', error);
      return {};
    }
  }

  static async clearOfflineData() {
    try {
      await AsyncStorage.removeItem(NETWORK_CONFIG.STORAGE_KEYS.OFFLINE_DATA);
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }
}

export default NETWORK_CONFIG; 