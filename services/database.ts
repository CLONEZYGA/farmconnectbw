import axios from 'axios';
import { User, UserRole } from '../types/auth';

// PostgreSQL Database Service
export interface DatabaseConfig {
  baseURL: string;
  apiKey: string;
}

// Database table interfaces
export interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone_number?: string;
  region?: string;
  farm_name?: string;
  company?: string;
  specialization?: string;
  department?: string;
  profile_image?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  quantity: number;
  unit: string;
  images: string[];
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  read: boolean;
  created_at: string;
}

export interface Consultation {
  id: string;
  farmer_id: string;
  expert_id: string;
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date?: string;
  created_at: string;
  updated_at: string;
}

class DatabaseService {
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  // User Management
  async createUser(userData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await axios.post(`${this.config.baseURL}/users`, userData, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<UserProfile | null> {
    try {
      const response = await axios.get(`${this.config.baseURL}/users/firebase/${firebaseUid}`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await axios.put(`${this.config.baseURL}/users/${userId}`, updates, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Product Management
  async getProducts(filters?: {
    category?: string;
    seller_id?: string;
    location?: string;
    min_price?: number;
    max_price?: number;
  }): Promise<Product[]> {
    try {
      const response = await axios.get(`${this.config.baseURL}/products`, {
        params: filters,
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await axios.post(`${this.config.baseURL}/products`, productData, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product> {
    try {
      const response = await axios.put(`${this.config.baseURL}/products/${productId}`, updates, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Order Management
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const response = await axios.post(`${this.config.baseURL}/orders`, orderData, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getUserOrders(userId: string, role: 'buyer' | 'seller'): Promise<Order[]> {
    try {
      const endpoint = role === 'buyer' ? 'buyer' : 'seller';
      const response = await axios.get(`${this.config.baseURL}/orders/${endpoint}/${userId}`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    try {
      const response = await axios.put(`${this.config.baseURL}/orders/${orderId}/status`, { status }, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Messaging
  async sendMessage(messageData: Partial<Message>): Promise<Message> {
    try {
      const response = await axios.post(`${this.config.baseURL}/messages`, messageData, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    try {
      const response = await axios.get(`${this.config.baseURL}/messages/conversation/${userId1}/${userId2}`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await axios.put(`${this.config.baseURL}/messages/${messageId}/read`, {}, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  // Consultations
  async createConsultation(consultationData: Partial<Consultation>): Promise<Consultation> {
    try {
      const response = await axios.post(`${this.config.baseURL}/consultations`, consultationData, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating consultation:', error);
      throw error;
    }
  }

  async getUserConsultations(userId: string, role: 'farmer' | 'expert'): Promise<Consultation[]> {
    try {
      const endpoint = role === 'farmer' ? 'farmer' : 'expert';
      const response = await axios.get(`${this.config.baseURL}/consultations/${endpoint}/${userId}`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
  }

  async updateConsultationStatus(consultationId: string, status: Consultation['status']): Promise<Consultation> {
    try {
      const response = await axios.put(`${this.config.baseURL}/consultations/${consultationId}/status`, { status }, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating consultation status:', error);
      throw error;
    }
  }
}

// Create and export database service instance
const databaseService = new DatabaseService({
  baseURL: process.env.EXPO_PUBLIC_DATABASE_URL || 'https://api.farmconnectbw.com',
  apiKey: process.env.EXPO_PUBLIC_DATABASE_API_KEY || 'your-api-key'
});

export default databaseService; 