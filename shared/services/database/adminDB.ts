import { initializeAdminFirebase } from '../../config/firebase';
import { AdminUser, AdminLogEntry, AdminReport, AdminSettings } from '../../types/api';
import { DATABASE_PATHS, DATABASE_COLLECTIONS } from '../../types/firebase';
import { doc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, Firestore } from 'firebase/firestore';
import { ref, push, set, update, remove, get, DatabaseReference, Database } from 'firebase/database';

export class AdminDatabaseService {
  private firestore: Firestore;
  private database: Database;

  constructor() {
    const { firestore, database } = initializeAdminFirebase();
    this.firestore = firestore;
    this.database = database;
  }

  // User Management (Firestore)
  async createAdminUser(userData: Omit<AdminUser, 'id' | 'createdAt'>): Promise<AdminUser> {
    const docRef = await addDoc(collection(this.firestore, DATABASE_COLLECTIONS.ADMIN.SETTINGS), {
      ...userData,
      createdAt: new Date(),
    });

    const newDoc = await getDoc(docRef);
    return {
      id: newDoc.id,
      ...newDoc.data(),
    } as AdminUser;
  }

  async getAdminUser(userId: string): Promise<AdminUser | null> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.ADMIN.SETTINGS, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as AdminUser;
    }

    return null;
  }

  async getAdminUsers(params?: {
    role?: string;
    isActive?: boolean;
    limit?: number;
  }): Promise<AdminUser[]> {
    const usersRef = collection(this.firestore, DATABASE_COLLECTIONS.ADMIN.SETTINGS);
    let q = query(usersRef);

    if (params?.role) {
      q = query(q, where('role', '==', params.role));
    }

    if (params?.isActive !== undefined) {
      q = query(q, where('isActive', '==', params.isActive));
    }

    if (params?.limit) {
      q = query(q, limit(params.limit));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as AdminUser[];
  }

  async updateAdminUser(userId: string, updates: Partial<AdminUser>): Promise<void> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.ADMIN.SETTINGS, userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteAdminUser(userId: string): Promise<void> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.ADMIN.SETTINGS, userId);
    await deleteDoc(docRef);
  }

  // Logging (Realtime Database)
  async logActivity(entry: Omit<AdminLogEntry, 'id'>): Promise<string> {
    const logsRef = ref(this.database, DATABASE_PATHS.ADMIN.LOGS);
    const newLogRef = await push(logsRef);

    await set(newLogRef, {
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
    });

    return newLogRef.key || '';
  }

  async getLogs(params?: {
    userId?: string;
    action?: string;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AdminLogEntry[]> {
    const logsRef = ref(this.database, DATABASE_PATHS.ADMIN.LOGS);

    let queryRef: DatabaseReference = logsRef;

    // Apply filters
    if (params?.userId || params?.action) {
      // For more complex queries, we'd need to implement them in the security rules
      // For now, we'll fetch all logs and filter on the client
    }

    const snapshot = await get(queryRef);
    let logs: AdminLogEntry[] = [];

    if (snapshot.exists()) {
      const data = snapshot.val();
      logs = Object.entries(data).map(([id, logData]) => ({
        id,
        ...(logData as any),
      }));
    }

    // Apply client-side filters
    if (params?.userId) {
      logs = logs.filter(log => log.userId === params.userId);
    }

    if (params?.action) {
      logs = logs.filter(log => log.action === params.action);
    }

    if (params?.startDate) {
      logs = logs.filter(log => new Date(log.timestamp) >= params.startDate!);
    }

    if (params?.endDate) {
      logs = logs.filter(log => new Date(log.timestamp) <= params.endDate!);
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply limit
    if (params?.limit) {
      logs = logs.slice(0, params.limit);
    }

    return logs;
  }

  async deleteLog(logId: string): Promise<void> {
    const logRef = ref(this.database, `${DATABASE_PATHS.ADMIN.LOGS}/${logId}`);
    await remove(logRef);
  }

  // Reports (Firestore)
  async generateReport(reportData: Omit<AdminReport, 'id' | 'generatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, DATABASE_COLLECTIONS.ADMIN.REPORTS), {
      ...reportData,
      generatedAt: new Date(),
    });

    return docRef.id;
  }

  async getReports(params?: {
    type?: string;
    limit?: number;
  }): Promise<AdminReport[]> {
    const reportsRef = collection(this.firestore, DATABASE_COLLECTIONS.ADMIN.REPORTS);
    let q = query(reportsRef);

    if (params?.type) {
      q = query(q, where('type', '==', params.type));
    }

    if (params?.limit) {
      q = query(q, limit(params.limit));
    }

    q = query(q, orderBy('generatedAt', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as AdminReport[];
  }

  async getReport(reportId: string): Promise<AdminReport | null> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.ADMIN.REPORTS, reportId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as AdminReport;
    }

    return null;
  }

  async deleteReport(reportId: string): Promise<void> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.ADMIN.REPORTS, reportId);
    await deleteDoc(docRef);
  }

  // Settings Management (Realtime Database)
  async getSettings(): Promise<AdminSettings | null> {
    const settingsRef = ref(this.database, DATABASE_PATHS.ADMIN.SETTINGS);
    const snapshot = await get(settingsRef);

    if (snapshot.exists()) {
      return snapshot.val() as AdminSettings;
    }

    return null;
  }

  async updateSettings(settings: Partial<AdminSettings>): Promise<void> {
    const settingsRef = ref(this.database, DATABASE_PATHS.ADMIN.SETTINGS);
    await update(settingsRef, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
  }

  async getPlatformSettings(): Promise<Record<string, any> | null> {
    const platformRef = ref(this.database, `${DATABASE_PATHS.ADMIN.SETTINGS}/platform`);
    const snapshot = await get(platformRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    return null;
  }

  async updatePlatformSettings(settings: Record<string, any>): Promise<void> {
    const platformRef = ref(this.database, `${DATABASE_PATHS.ADMIN.SETTINGS}/platform`);
    await update(platformRef, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
  }

  // Statistics
  async getDashboardStats(): Promise<Record<string, any>> {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    // Get user counts
    const totalUsers = await this.getAdminUsers();
    const activeUsers = await this.getAdminUsers({ isActive: true });

    // Get recent logs
    const recentLogs = await this.getLogs({
      startDate: lastMonth,
      limit: 1000,
    });

    // Get recent reports
    const recentReports = await this.getReports({
      limit: 100,
    });

    return {
      users: {
        total: totalUsers.length,
        active: activeUsers.length,
        inactive: totalUsers.length - activeUsers.length,
      },
      activity: {
        recentLogs: recentLogs.length,
        reportsGenerated: recentReports.length,
      },
      timestamp: now.toISOString(),
    };
  }

  // Cleanup old data
  async cleanupOldData(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 1); // Delete logs older than 1 year

    // Clean up old logs
    const oldLogs = await this.getLogs({
      endDate: cutoffDate,
    });

    const logsRef = ref(this.database, DATABASE_PATHS.ADMIN.LOGS);
    for (const log of oldLogs) {
      const logRef = ref(this.database, `${DATABASE_PATHS.ADMIN.LOGS}/${log.id}`);
      await remove(logRef);
    }

    // Clean up old reports
    const oldReports = await this.getReports();
    const oldReportsToDelete = oldReports.filter(report =>
      new Date(report.generatedAt) < cutoffDate
    );

    for (const report of oldReportsToDelete) {
      await this.deleteReport(report.id);
    }
  }
}

// Create singleton instance
let adminDatabaseService: AdminDatabaseService | null = null;

export function getAdminDatabaseService(): AdminDatabaseService {
  if (!adminDatabaseService) {
    adminDatabaseService = new AdminDatabaseService();
  }

  return adminDatabaseService;
}