import { APIResponse, AdminUser, UserListRequest, AdminReport, ReportRequest, AdminSettings, AdminLogEntry } from '../../types/api';
import { API_ENDPOINTS } from '../../config/constants';

// Admin API service
export class AdminAPIService {
  private baseURL: string;
  private apiKey: string;
  private token: string | null = null;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  // Authentication
  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
          message: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        message: 'Failed to connect to server',
      };
    }
  }

  // User Management
  async getUsers(params?: UserListRequest): Promise<APIResponse<AdminUser[]>> {
    const queryString = new URLSearchParams();

    if (params?.page) queryString.append('page', params.page.toString());
    if (params?.limit) queryString.append('limit', params.limit.toString());
    if (params?.role) queryString.append('role', params.role);
    if (params?.search) queryString.append('search', params.search);
    if (params?.isActive !== undefined) queryString.append('isActive', params.isActive.toString());

    const endpoint = `${API_ENDPOINTS.ADMIN.USERS}${queryString.toString() ? `?${queryString.toString()}` : ''}`;

    return this.makeRequest<AdminUser[]>(endpoint, {
      method: 'GET',
    });
  }

  async getUser(userId: string): Promise<APIResponse<AdminUser>> {
    return this.makeRequest<AdminUser>(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`, {
      method: 'GET',
    });
  }

  async createUser(userData: Partial<AdminUser>): Promise<APIResponse<AdminUser>> {
    return this.makeRequest<AdminUser>(API_ENDPOINTS.ADMIN.USERS, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, userData: Partial<AdminUser>): Promise<APIResponse<AdminUser>> {
    return this.makeRequest<AdminUser>(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string): Promise<APIResponse<void>> {
    return this.makeRequest<void>(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`, {
      method: 'DELETE',
    });
  }

  async activateUser(userId: string): Promise<APIResponse<AdminUser>> {
    return this.makeRequest<AdminUser>(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/activate`, {
      method: 'POST',
    });
  }

  async deactivateUser(userId: string): Promise<APIResponse<AdminUser>> {
    return this.makeRequest<AdminUser>(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/deactivate`, {
      method: 'POST',
    });
  }

  // Reports
  async generateReports(request: ReportRequest): Promise<APIResponse<AdminReport[]>> {
    return this.makeRequest<AdminReport[]>(API_ENDPOINTS.ADMIN.REPORTS, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getReports(): Promise<APIResponse<AdminReport[]>> {
    return this.makeRequest<AdminReport[]>(API_ENDPOINTS.ADMIN.REPORTS, {
      method: 'GET',
    });
  }

  async getReport(reportId: string): Promise<APIResponse<AdminReport>> {
    return this.makeRequest<AdminReport>(`${API_ENDPOINTS.ADMIN.REPORTS}/${reportId}`, {
      method: 'GET',
    });
  }

  async deleteReport(reportId: string): Promise<APIResponse<void>> {
    return this.makeRequest<void>(`${API_ENDPOINTS.ADMIN.REPORTS}/${reportId}`, {
      method: 'DELETE',
    });
  }

  // Settings Management
  async getSettings(): Promise<APIResponse<AdminSettings>> {
    return this.makeRequest<AdminSettings>(API_ENDPOINTS.ADMIN.SETTINGS, {
      method: 'GET',
    });
  }

  async updateSettings(settings: Partial<AdminSettings>): Promise<APIResponse<AdminSettings>> {
    return this.makeRequest<AdminSettings>(API_ENDPOINTS.ADMIN.SETTINGS, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Activity Logging
  async logActivity(action: string, details: Record<string, any>): Promise<APIResponse<AdminLogEntry>> {
    return this.makeRequest<AdminLogEntry>(API_ENDPOINTS.ADMIN.LOGS, {
      method: 'POST',
      body: JSON.stringify({
        action,
        timestamp: new Date().toISOString(),
        details,
      }),
    });
  }

  async getLogs(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<APIResponse<AdminLogEntry[]>> {
    const queryString = new URLSearchParams();

    if (params?.page) queryString.append('page', params.page.toString());
    if (params?.limit) queryString.append('limit', params.limit.toString());
    if (params?.userId) queryString.append('userId', params.userId);
    if (params?.action) queryString.append('action', params.action);
    if (params?.startDate) queryString.append('startDate', params.startDate);
    if (params?.endDate) queryString.append('endDate', params.endDate);

    const endpoint = `${API_ENDPOINTS.ADMIN.LOGS}${queryString.toString() ? `?${queryString.toString()}` : ''}`;

    return this.makeRequest<AdminLogEntry[]>(endpoint, {
      method: 'GET',
    });
  }

  // Statistics
  async getDashboardStats(): Promise<APIResponse<Record<string, any>>> {
    return this.makeRequest<Record<string, any>>(`${API_ENDPOINTS.ADMIN.REPORTS}/dashboard`, {
      method: 'GET',
    });
  }

  // Permissions Management
  async updateUserPermissions(userId: string, permissions: string[]): Promise<APIResponse<AdminUser>> {
    return this.makeRequest<AdminUser>(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissions }),
    });
  }

  async getUserPermissions(userId: string): Promise<APIResponse<string[]>> {
    return this.makeRequest<string[]>(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/permissions`, {
      method: 'GET',
    });
  }

  // Platform Settings
  async getPlatformSettings(): Promise<APIResponse<Record<string, any>>> {
    return this.makeRequest<Record<string, any>>(`${API_ENDPOINTS.ADMIN.SETTINGS}/platform`, {
      method: 'GET',
    });
  }

  async updatePlatformSettings(settings: Record<string, any>): Promise<APIResponse<Record<string, any>>> {
    return this.makeRequest<Record<string, any>>(`${API_ENDPOINTS.ADMIN.SETTINGS}/platform`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

// Create singleton instance
let adminAPIService: AdminAPIService | null = null;

export function getAdminAPIService(): AdminAPIService {
  if (!adminAPIService) {
    const baseURL = process.env.ADMIN_API_BASE_URL || 'https://admin-api.farmconnectbw.com';
    const apiKey = process.env.ADMIN_API_KEY || '';

    if (!apiKey) {
      throw new Error('Admin API key is required');
    }

    adminAPIService = new AdminAPIService(baseURL, apiKey);
  }

  return adminAPIService;
}