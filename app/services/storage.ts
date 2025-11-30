import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SystemLog, ContentItem, SystemSettings, AnalyticsData } from '../_types/admin';

const STORAGE_KEYS = {
  USERS: 'admin_users',
  LOGS: 'admin_logs',
  CONTENT: 'admin_content',
  SETTINGS: 'admin_settings',
  ANALYTICS: 'admin_analytics',
};

export const StorageService = {
  // Users
  async getUsers(): Promise<User[]> {
    const users = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  async saveUsers(users: User[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Logs
  async getLogs(): Promise<SystemLog[]> {
    const logs = await AsyncStorage.getItem(STORAGE_KEYS.LOGS);
    return logs ? JSON.parse(logs) : [];
  },

  async addLog(log: Omit<SystemLog, 'id'>): Promise<void> {
    const logs = await this.getLogs();
    const newLog = { ...log, id: Date.now().toString() };
    await AsyncStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([newLog, ...logs]));
  },

  // Content
  async getContent(): Promise<ContentItem[]> {
    const content = await AsyncStorage.getItem(STORAGE_KEYS.CONTENT);
    return content ? JSON.parse(content) : [];
  },

  async saveContent(content: ContentItem[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(content));
  },

  // Settings
  async getSettings(): Promise<SystemSettings> {
    const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
      registrationOpen: true,
      maintenanceMode: false,
      featureFlags: {},
    };
  },

  async saveSettings(settings: SystemSettings): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    const analytics = await AsyncStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return analytics ? JSON.parse(analytics) : {
      totalUsers: 0,
      activeUsers: 0,
      userGrowth: [],
      roleDistribution: [],
    };
  },

  async saveAnalytics(analytics: AnalyticsData): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  },

  // Backup
  async exportData(): Promise<string> {
    const data = {
      users: await this.getUsers(),
      logs: await this.getLogs(),
      content: await this.getContent(),
      settings: await this.getSettings(),
      analytics: await this.getAnalytics(),
    };
    return JSON.stringify(data);
  },

  async importData(data: string): Promise<void> {
    const parsedData = JSON.parse(data);
    await Promise.all([
      this.saveUsers(parsedData.users),
      AsyncStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(parsedData.logs)),
      this.saveContent(parsedData.content),
      this.saveSettings(parsedData.settings),
      this.saveAnalytics(parsedData.analytics),
    ]);
  },
}; 