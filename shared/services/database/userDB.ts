import { initializeUserFirebase } from '../../config/firebase';
import { UserProfile, Product, Order, Consultation, FarmerProfile, BuyerProfile, ExpertProfile } from '../../types/api';
import { DATABASE_PATHS, DATABASE_COLLECTIONS } from '../../types/firebase';
import { doc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, Firestore } from 'firebase/firestore';
import { ref, push, set, update, remove, get, DatabaseReference, Database } from 'firebase/database';
import { USER_ROLES } from '../../config/constants';

export class UserDatabaseService {
  private firestore: Firestore;
  private database: Database;

  constructor() {
    const { firestore, database } = initializeUserFirebase();
    this.firestore = firestore;
    this.database = database;
  }

  // User Profile Management (Firestore)
  async createUserProfile(userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const docRef = await addDoc(collection(this.firestore, DATABASE_COLLECTIONS.USER.USERS), {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
    });

    const newDoc = await getDoc(docRef);
    return {
      id: newDoc.id,
      ...newDoc.data(),
    } as UserProfile;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.USERS, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as UserProfile;
    }

    return null;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.USERS, userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async verifyUserProfile(userId: string): Promise<void> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.USERS, userId);
    await updateDoc(docRef, {
      isVerified: true,
      updatedAt: new Date(),
    });
  }

  // Product Management (Firestore - for farmers)
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, DATABASE_COLLECTIONS.USER.PRODUCTS), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
      available: true,
    });

    return docRef.id;
  }

  async getProduct(productId: string): Promise<Product | null> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.PRODUCTS, productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product;
    }

    return null;
  }

  async getFarmerProducts(farmerId: string): Promise<Product[]> {
    const productsRef = collection(this.firestore, DATABASE_COLLECTIONS.USER.PRODUCTS);
    const q = query(
      productsRef,
      where('farmerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  }

  async getProducts(params?: {
    category?: string;
    location?: string;
    organic?: boolean;
    farmerId?: string;
    available?: boolean;
    limit?: number;
  }): Promise<Product[]> {
    const productsRef = collection(this.firestore, DATABASE_COLLECTIONS.USER.PRODUCTS);
    let q = query(productsRef, orderBy('createdAt', 'desc'));

    if (params?.category) {
      q = query(q, where('category', '==', params.category));
    }

    if (params?.farmerId) {
      q = query(q, where('farmerId', '==', params.farmerId));
    }

    if (params?.organic !== undefined) {
      q = query(q, where('organic', '==', params.organic));
    }

    if (params?.available !== undefined) {
      q = query(q, where('available', '==', params.available));
    }

    if (params?.limit) {
      q = query(q, limit(params.limit));
    }

    // Location-based filtering would need to be done client-side with coordinate calculations
    const querySnapshot = await getDocs(q);
    let products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    // Client-side location filtering
    if (params?.location) {
      products = products.filter(product =>
        product.location.address.toLowerCase().includes(params.location.toLowerCase())
      );
    }

    return products;
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.PRODUCTS, productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.PRODUCTS, productId);
    await deleteDoc(docRef);
  }

  // Order Management (Firestore - for buyers and farmers)
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, DATABASE_COLLECTIONS.USER.ORDERS), {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending',
    });

    return docRef.id;
  }

  async getOrder(orderId: string): Promise<Order | null> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.ORDERS, orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Order;
    }

    return null;
  }

  async getBuyerOrders(buyerId: string, params?: {
    status?: string;
    limit?: number;
  }): Promise<Order[]> {
    const ordersRef = collection(this.firestore, DATABASE_COLLECTIONS.USER.ORDERS);
    let q = query(
      ordersRef,
      where('buyerId', '==', buyerId),
      orderBy('createdAt', 'desc')
    );

    if (params?.status) {
      q = query(q, where('status', '==', params.status));
    }

    if (params?.limit) {
      q = query(q, limit(params.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  }

  async getFarmerOrders(farmerId: string, params?: {
    status?: string;
    limit?: number;
  }): Promise<Order[]> {
    const ordersRef = collection(this.firestore, DATABASE_COLLECTIONS.USER.ORDERS);
    let q = query(
      ordersRef,
      where('farmerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );

    if (params?.status) {
      q = query(q, where('status', '==', params.status));
    }

    if (params?.limit) {
      q = query(q, limit(params.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  }

  async updateOrderStatus(orderId: string, status: Order['status'], notes?: string): Promise<void> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.ORDERS, orderId);
    const updates: Partial<Order> = {
      status,
      updatedAt: new Date(),
    };

    if (notes) {
      updates.notes = notes;
    }

    await updateDoc(docRef, updates);
  }

  async cancelOrder(orderId: string, reason: string): Promise<void> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.ORDERS, orderId);
    await updateDoc(docRef, {
      status: 'cancelled',
      notes: reason,
      updatedAt: new Date(),
    });
  }

  // Consultation Management (Firestore - for experts and farmers)
  async createConsultation(consultationData: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, DATABASE_COLLECTIONS.USER.CONSULTATIONS), {
      ...consultationData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'requested',
    });

    return docRef.id;
  }

  async getConsultation(consultationId: string): Promise<Consultation | null> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.CONSULTATIONS, consultationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Consultation;
    }

    return null;
  }

  async getFarmerConsultations(farmerId: string, params?: {
    status?: string;
    limit?: number;
  }): Promise<Consultation[]> {
    const consultationsRef = collection(this.firestore, DATABASE_COLLECTIONS.USER.CONSULTATIONS);
    let q = query(
      consultationsRef,
      where('farmerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );

    if (params?.status) {
      q = query(q, where('status', '==', params.status));
    }

    if (params?.limit) {
      q = query(q, limit(params.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Consultation[];
  }

  async getExpertConsultations(expertId: string, params?: {
    status?: string;
    limit?: number;
  }): Promise<Consultation[]> {
    const consultationsRef = collection(this.firestore, DATABASE_COLLECTIONS.USER.CONSULTATIONS);
    let q = query(
      consultationsRef,
      where('expertId', '==', expertId),
      orderBy('createdAt', 'desc')
    );

    if (params?.status) {
      q = query(q, where('status', '==', params.status));
    }

    if (params?.limit) {
      q = query(q, limit(params.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Consultation[];
  }

  async updateConsultationStatus(consultationId: string, status: Consultation['status'], notes?: string): Promise<void> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.CONSULTATIONS, consultationId);
    const updates: Partial<Consultation> = {
      status,
      updatedAt: new Date(),
    };

    if (notes) {
      updates.notes = notes;
    }

    await updateDoc(docRef, updates);
  }

  async scheduleConsultation(consultationId: string, scheduledAt: Date, meetingLink?: string): Promise<void> {
    const docRef = doc(this.firestore, DATABASE_COLLECTIONS.USER.CONSULTATIONS, consultationId);
    await updateDoc(docRef, {
      status: 'scheduled',
      scheduledAt,
      meetingLink,
      updatedAt: new Date(),
    });
  }

  // Real-time Database operations for live data
  async createRealtimeOrder(order: Order): Promise<string> {
    const ordersRef = ref(this.database, DATABASE_PATHS.USER.ORDERS);
    const newOrderRef = await push(ordersRef);

    await set(newOrderRef, {
      ...order,
      createdAt: new Date().toISOString(),
    });

    return newOrderRef.key || '';
  }

  async updateRealtimeOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    const orderRef = ref(this.database, `${DATABASE_PATHS.USER.ORDERS}/${orderId}`);
    await update(orderRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async createRealtimeConsultation(consultation: Consultation): Promise<string> {
    const consultationsRef = ref(this.database, DATABASE_PATHS.USER.CONSULTATIONS);
    const newConsultationRef = await push(consultationsRef);

    await set(newConsultationRef, {
      ...consultation,
      createdAt: new Date().toISOString(),
    });

    return newConsultationRef.key || '';
  }

  async updateRealtimeConsultation(consultationId: string, updates: Partial<Consultation>): Promise<void> {
    const consultationRef = ref(this.database, `${DATABASE_PATHS.USER.CONSULTATIONS}/${consultationId}`);
    await update(consultationRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  // User Statistics
  async getUserStats(userId: string, role: string): Promise<Record<string, any>> {
    switch (role) {
      case USER_ROLES.FARMER:
        return this.getFarmerStats(userId);
      case USER_ROLES.BUYER:
        return this.getBuyerStats(userId);
      case USER_ROLES.EXPERT:
        return this.getExpertStats(userId);
      default:
        return {};
    }
  }

  private async getFarmerStats(farmerId: string): Promise<Record<string, any>> {
    const products = await this.getFarmerProducts(farmerId);
    const orders = await this.getFarmerOrders(farmerId);
    const consultations = await this.getFarmerConsultations(farmerId);

    return {
      products: {
        total: products.length,
        available: products.filter(p => p.available).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
      },
      orders: {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        completed: orders.filter(o => o.status === 'delivered').length,
        totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      },
      consultations: {
        total: consultations.length,
        requested: consultations.filter(c => c.status === 'requested').length,
        scheduled: consultations.filter(c => c.status === 'scheduled').length,
        completed: consultations.filter(c => c.status === 'completed').length,
      },
    };
  }

  private async getBuyerStats(buyerId: string): Promise<Record<string, any>> {
    const orders = await this.getBuyerOrders(buyerId);
    const consultations = await this.getFarmerConsultations(buyerId);

    return {
      orders: {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
      },
      consultations: {
        total: consultations.length,
        requested: consultations.filter(c => c.status === 'requested').length,
        scheduled: consultations.filter(c => c.status === 'scheduled').length,
        completed: consultations.filter(c => c.status === 'completed').length,
      },
    };
  }

  private async getExpertStats(expertId: string): Promise<Record<string, any>> {
    const consultations = await this.getExpertConsultations(expertId);

    return {
      consultations: {
        total: consultations.length,
        requested: consultations.filter(c => c.status === 'requested').length,
        scheduled: consultations.filter(c => c.status === 'scheduled').length,
        completed: consultations.filter(c => c.status === 'completed').length,
        inProgress: consultations.filter(c => c.status === 'in_progress').length,
      },
      rating: {
        average: 0, // Would need to implement rating system
        totalRatings: 0,
      },
    };
  }

  // Search functionality
  async searchProducts(searchTerm: string, filters?: {
    category?: string;
    location?: string;
    organic?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    let products = await this.getProducts(filters);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.farmerName.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }

    if (filters?.minPrice) {
      products = products.filter(p => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice) {
      products = products.filter(p => p.price <= filters.maxPrice!);
    }

    return products;
  }

  async searchExperts(searchTerm: string, specializations?: string[], location?: string): Promise<UserProfile[]> {
    // This would need to be implemented based on how expert profiles are structured
    // For now, returning empty array
    return [];
  }
}

// Create singleton instance
let userDatabaseService: UserDatabaseService | null = null;

export function getUserDatabaseService(): UserDatabaseService {
  if (!userDatabaseService) {
    userDatabaseService = new UserDatabaseService();
  }

  return userDatabaseService;
}