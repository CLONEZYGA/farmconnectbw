import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

class LogoutService {
  private static instance: LogoutService;
  private isLoggingOut: boolean = false;

  private constructor() {}

  public static getInstance(): LogoutService {
    if (!LogoutService.instance) {
      LogoutService.instance = new LogoutService();
    }
    return LogoutService.instance;
  }

  /**
   * Perform a complete logout process
   * @returns {Promise<void>}
   */
  public async logout(): Promise<void> {
    if (this.isLoggingOut) {
      console.log('LogoutService: Logout already in progress');
      return;
    }

    this.isLoggingOut = true;
    console.log('LogoutService: Starting logout process');

    try {
      // Step 1: Clear all user data
      await this.clearUserData();
      console.log('LogoutService: Cleared user data');

      // Step 2: Clear all app data
      await this.clearAppData();
      console.log('LogoutService: Cleared app data');

      // Step 3: Navigate to login
      await this.navigateToLogin();
      console.log('LogoutService: Navigated to login');

      console.log('LogoutService: Logout completed successfully');
    } catch (error) {
      console.error('LogoutService: Error during logout:', error);
      // Even on error, try to navigate to login
      await this.navigateToLogin();
      throw new Error('Failed to logout properly');
    } finally {
      this.isLoggingOut = false;
    }
  }

  /**
   * Clear all user-related data
   * @returns {Promise<void>}
   */
  private async clearUserData(): Promise<void> {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.clear();
      console.log('LogoutService: Cleared AsyncStorage');

      // Clear any other user-specific data here
      // For example, clear any global state, caches, etc.
    } catch (error) {
      console.error('LogoutService: Error clearing user data:', error);
      throw error;
    }
  }

  /**
   * Clear all app-related data
   * @returns {Promise<void>}
   */
  private async clearAppData(): Promise<void> {
    try {
      // Clear any app-specific data here
      // For example, clear any app caches, temporary files, etc.
    } catch (error) {
      console.error('LogoutService: Error clearing app data:', error);
      throw error;
    }
  }

  /**
   * Navigate to the login page
   * @returns {Promise<void>}
   */
  private async navigateToLogin(): Promise<void> {
    try {
      // Use replace to prevent going back to the previous screen
      router.replace('/login');
    } catch (error) {
      console.error('LogoutService: Error navigating to login:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const logoutService = LogoutService.getInstance(); 