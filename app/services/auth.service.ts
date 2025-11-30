import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async clearAuthData(): Promise<void> {
    try {
      console.log('AuthService: Clearing all auth data...');
      
      // Clear all auth-related items
      const keysToRemove = [
        'loggedInUser',
        'authToken',
        'userPreferences',
        'userSession'
      ];

      await Promise.all(
        keysToRemove.map(key => AsyncStorage.removeItem(key))
      );

      console.log('AuthService: Successfully cleared auth data');
      return Promise.resolve();
    } catch (error) {
      console.error('AuthService: Error clearing auth data:', error);
      throw new Error('Failed to clear authentication data');
    }
  }

  public async performSignOut(): Promise<void> {
    try {
      console.log('AuthService: Starting sign out process');

      // 1. Clear all auth data
      await this.clearAuthData();

      // 2. Post cleanup tasks (if any)
      await this.postSignOutCleanup();

      // 3. Force navigation to login
      this.navigateToLogin();

      console.log('AuthService: Sign out completed successfully');
    } catch (error) {
      console.error('AuthService: Sign out failed:', error);
      // Even if there's an error, try to navigate to login
      this.navigateToLogin();
      throw error;
    }
  }

  private async postSignOutCleanup(): Promise<void> {
    try {
      // Add any additional cleanup tasks here
      // For example: Clear cache, reset app state, etc.
      console.log('AuthService: Performing post-signout cleanup');
    } catch (error) {
      console.error('AuthService: Cleanup failed:', error);
    }
  }

  private navigateToLogin(): void {
    try {
      console.log('AuthService: Navigating to login screen');
      router.replace('/');
    } catch (error) {
      console.error('AuthService: Navigation failed:', error);
      // Fallback navigation
      window.location.href = '/';
    }
  }
}

export const authService = AuthService.getInstance(); 