import { APIResponse, UserProfile, Product, Order, Consultation, ProfileUpdateRequest, LoginRequest, LoginResponse, RegisterRequest } from '../../types/api';
import { API_ENDPOINTS, USER_ROLES } from '../../config/constants';

// User API service
export class UserAPIService {
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

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<APIResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<APIResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<APIResponse<void>> {
    return this.makeRequest<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(refreshToken: string): Promise<APIResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async forgotPassword(email: string): Promise<APIResponse<void>> {
    return this.makeRequest<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<APIResponse<void>> {
    return this.makeRequest<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Profile Management
  async getProfile(): Promise<APIResponse<UserProfile>> {
    return this.makeRequest<UserProfile>(API_ENDPOINTS.USER.PROFILE, {
      method: 'GET',
    });
  }

  async updateProfile(data: ProfileUpdateRequest): Promise<APIResponse<UserProfile>> {
    return this.makeRequest<UserProfile>(API_ENDPOINTS.USER.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadProfilePhoto(imageFile: File): Promise<APIResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('photo', imageFile);

    return this.makeRequest<{ url: string }>(`${API_ENDPOINTS.USER.PROFILE}/photo`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-API-Key': this.apiKey,
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
    });
  }

  // Product Management (for farmers)
  async getProducts(params?: {
    category?: string;
    location?: string;
    organic?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<APIResponse<Product[]>> {
    const queryString = new URLSearchParams();

    if (params?.category) queryString.append('category', params.category);
    if (params?.location) queryString.append('location', params.location);
    if (params?.organic !== undefined) queryString.append('organic', params.organic.toString());
    if (params?.search) queryString.append('search', params.search);
    if (params?.page) queryString.append('page', params.page.toString());
    if (params?.limit) queryString.append('limit', params.limit.toString());

    const endpoint = `${API_ENDPOINTS.USER.PRODUCTS}${queryString.toString() ? `?${queryString.toString()}` : ''}`;

    return this.makeRequest<Product[]>(endpoint, {
      method: 'GET',
    });
  }

  async getProduct(productId: string): Promise<APIResponse<Product>> {
    return this.makeRequest<Product>(`${API_ENDPOINTS.USER.PRODUCTS}/${productId}`, {
      method: 'GET',
    });
  }

  async createProduct(productData: Partial<Product>): Promise<APIResponse<Product>> {
    return this.makeRequest<Product>(API_ENDPOINTS.USER.PRODUCTS, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId: string, productData: Partial<Product>): Promise<APIResponse<Product>> {
    return this.makeRequest<Product>(`${API_ENDPOINTS.USER.PRODUCTS}/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId: string): Promise<APIResponse<void>> {
    return this.makeRequest<void>(`${API_ENDPOINTS.USER.PRODUCTS}/${productId}`, {
      method: 'DELETE',
    });
  }

  async uploadProductPhotos(productId: string, imageFiles: File[]): Promise<APIResponse<{ urls: string[] }>> {
    const formData = new FormData();
    imageFiles.forEach((file, index) => {
      formData.append(`photos[${index}]`, file);
    });

    return this.makeRequest<{ urls: string[] }>(`${API_ENDPOINTS.USER.PRODUCTS}/${productId}/photos`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-API-Key': this.apiKey,
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
    });
  }

  // Order Management
  async getOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<APIResponse<Order[]>> {
    const queryString = new URLSearchParams();

    if (params?.status) queryString.append('status', params.status);
    if (params?.page) queryString.append('page', params.page.toString());
    if (params?.limit) queryString.append('limit', params.limit.toString());

    const endpoint = `${API_ENDPOINTS.USER.ORDERS}${queryString.toString() ? `?${queryString.toString()}` : ''}`;

    return this.makeRequest<Order[]>(endpoint, {
      method: 'GET',
    });
  }

  async getOrder(orderId: string): Promise<APIResponse<Order>> {
    return this.makeRequest<Order>(`${API_ENDPOINTS.USER.ORDERS}/${orderId}`, {
      method: 'GET',
    });
  }

  async createOrder(orderData: Partial<Order>): Promise<APIResponse<Order>> {
    return this.makeRequest<Order>(API_ENDPOINTS.USER.ORDERS, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(orderId: string, status: string): Promise<APIResponse<Order>> {
    return this.makeRequest<Order>(`${API_ENDPOINTS.USER.ORDERS}/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async cancelOrder(orderId: string, reason?: string): Promise<APIResponse<Order>> {
    return this.makeRequest<Order>(`${API_ENDPOINTS.USER.ORDERS}/${orderId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  // Consultation Management
  async getConsultations(params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<APIResponse<Consultation[]>> {
    const queryString = new URLSearchParams();

    if (params?.status) queryString.append('status', params.status);
    if (params?.type) queryString.append('type', params.type);
    if (params?.page) queryString.append('page', params.page.toString());
    if (params?.limit) queryString.append('limit', params.limit.toString());

    const endpoint = `${API_ENDPOINTS.USER.CONSULTATIONS}${queryString.toString() ? `?${queryString.toString()}` : ''}`;

    return this.makeRequest<Consultation[]>(endpoint, {
      method: 'GET',
    });
  }

  async getConsultation(consultationId: string): Promise<APIResponse<Consultation>> {
    return this.makeRequest<Consultation>(`${API_ENDPOINTS.USER.CONSULTATIONS}/${consultationId}`, {
      method: 'GET',
    });
  }

  async createConsultation(consultationData: Partial<Consultation>): Promise<APIResponse<Consultation>> {
    return this.makeRequest<Consultation>(API_ENDPOINTS.USER.CONSULTATIONS, {
      method: 'POST',
      body: JSON.stringify(consultationData),
    });
  }

  async updateConsultationStatus(consultationId: string, status: string): Promise<APIResponse<Consultation>> {
    return this.makeRequest<Consultation>(`${API_ENDPOINTS.USER.CONSULTATIONS}/${consultationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async scheduleConsultation(consultationId: string, scheduledAt: Date, meetingLink?: string): Promise<APIResponse<Consultation>> {
    return this.makeRequest<Consultation>(`${API_ENDPOINTS.USER.CONSULTATIONS}/${consultationId}/schedule`, {
      method: 'PUT',
      body: JSON.stringify({ scheduledAt, meetingLink }),
    });
  }

  async getExpertAvailability(expertId: string): Promise<APIResponse<{
    days: string[];
    timeSlots: string[];
    upcomingConsultations: Date[];
  }>> {
    return this.makeRequest<{
      days: string[];
      timeSlots: string[];
      upcomingConsultations: Date[];
    }>(`/experts/${expertId}/availability`, {
      method: 'GET',
    });
  }

  async searchExperts(params?: {
    specialization?: string;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<APIResponse<UserProfile[]>> {
    const queryString = new URLSearchParams();

    if (params?.specialization) queryString.append('specialization', params.specialization);
    if (params?.location) queryString.append('location', params.location);
    if (params?.page) queryString.append('page', params.page.toString());
    if (params?.limit) queryString.append('limit', params.limit.toString());

    const endpoint = `/experts/search${queryString.toString() ? `?${queryString.toString()}` : ''}`;

    return this.makeRequest<UserProfile[]>(endpoint, {
      method: 'GET',
    });
  }

  // Notifications
  async getNotifications(params?: {
    read?: boolean;
    page?: number;
    limit?: number;
  }): Promise<APIResponse<any[]>> {
    const queryString = new URLSearchParams();

    if (params?.read !== undefined) queryString.append('read', params.read.toString());
    if (params?.page) queryString.append('page', params.page.toString());
    if (params?.limit) queryString.append('limit', params.limit.toString());

    const endpoint = `/notifications${queryString.toString() ? `?${queryString.toString()}` : ''}`;

    return this.makeRequest<any[]>(endpoint, {
      method: 'GET',
    });
  }

  async markNotificationAsRead(notificationId: string): Promise<APIResponse<void>> {
    return this.makeRequest<void>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead(): Promise<APIResponse<void>> {
    return this.makeRequest<void>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // File Upload
  async uploadFile(file: File, type: 'profile' | 'product' | 'document'): Promise<APIResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.makeRequest<{ url: string }>('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-API-Key': this.apiKey,
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
    });
  }
}

// Create singleton instance
let userAPIService: UserAPIService | null = null;

export function getUserAPIService(): UserAPIService {
  if (!userAPIService) {
    const baseURL = process.env.USER_API_BASE_URL || 'https://api.farmconnectbw.com';
    const apiKey = process.env.USER_API_KEY || '';

    if (!apiKey) {
      throw new Error('User API key is required');
    }

    userAPIService = new UserAPIService(baseURL, apiKey);
  }

  return userAPIService;
}