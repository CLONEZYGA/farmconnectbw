import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

// Product categories
export type ProductCategory = 
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Dairy'
  | 'Livestock'
  | 'Poultry';

// Product interface
export interface Product {
  id: string;
  farmerId: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  images: string[];
  location: string;
  harvestDate?: Date;
  expiryDate?: Date;
  organic: boolean;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order status
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// Order interface
export interface Order {
  id: string;
  buyerId: string;
  farmerId: string;
  status: OrderStatus;
  items: {
    productId: string;
    quantity: number;
    pricePerUnit: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Buyer profile interface
export interface BuyerProfile {
  buyerId: string;
  userId: string;
  businessName?: string;
  businessType: 'individual' | 'company' | 'cooperative';
  tradingLicense?: string;
  taxId?: string;
  preferredCategories: ProductCategory[];
  shippingAddresses: {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
  }[];
  paymentMethods: {
    id: string;
    type: string;
    details: string;
    isDefault: boolean;
  }[];
  purchaseHistory: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  };
  rating: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

interface BuyerContextType {
  buyerProfile: BuyerProfile | null;
  orders: Order[];
  loading: boolean;
  updateProfile: (profile: Partial<BuyerProfile>) => Promise<void>;
  placeOrder: (order: Omit<Order, 'id' | 'buyerId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  getActiveOrders: () => Promise<Order[]>;
  getPastOrders: () => Promise<Order[]>;
  addShippingAddress: (address: Omit<BuyerProfile['shippingAddresses'][0], 'id'>) => Promise<void>;
  addPaymentMethod: (method: Omit<BuyerProfile['paymentMethods'][0], 'id'>) => Promise<void>;
  searchProducts: (query: string, category?: ProductCategory) => Promise<Product[]>;
}

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export function BuyerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Load buyer profile
  useEffect(() => {
    const loadBuyerProfile = async () => {
      if (user?.role !== 'buyer') return;
      
      try {
        const storedProfile = await AsyncStorage.getItem(`buyerProfile:${user.id}`);
        if (storedProfile) {
          setBuyerProfile(JSON.parse(storedProfile));
        }

        const storedOrders = await AsyncStorage.getItem(`buyerOrders:${user.id}`);
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (error) {
        console.error('Error loading buyer profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBuyerProfile();
  }, [user]);

  const updateProfile = async (profileUpdate: Partial<BuyerProfile>) => {
    if (!user || !buyerProfile) return;

    try {
      const updatedProfile = { ...buyerProfile, ...profileUpdate };
      await AsyncStorage.setItem(`buyerProfile:${user.id}`, JSON.stringify(updatedProfile));
      setBuyerProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating buyer profile:', error);
      throw error;
    }
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'buyerId' | 'createdAt' | 'updatedAt'>) => {
    if (!user || !buyerProfile) return;

    try {
      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        buyerId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedOrders = [...orders, newOrder];
      await AsyncStorage.setItem(`buyerOrders:${user.id}`, JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!user || !buyerProfile) return;

    try {
      const updatedOrders = orders.map(order => 
        order.id === orderId
          ? { ...order, status: 'cancelled' as const, updatedAt: new Date() }
          : order
      );

      await AsyncStorage.setItem(`buyerOrders:${user.id}`, JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  };

  const getActiveOrders = async () => {
    return orders.filter(o => 
      ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)
    );
  };

  const getPastOrders = async () => {
    return orders.filter(o => 
      ['delivered', 'cancelled'].includes(o.status)
    );
  };

  const addShippingAddress = async (address: Omit<BuyerProfile['shippingAddresses'][0], 'id'>) => {
    if (!user || !buyerProfile) return;

    try {
      const newAddress = {
        ...address,
        id: Date.now().toString(),
      };

      const updatedAddresses = [...buyerProfile.shippingAddresses];
      if (address.isDefault) {
        updatedAddresses.forEach(addr => addr.isDefault = false);
      }
      updatedAddresses.push(newAddress);

      const updatedProfile = {
        ...buyerProfile,
        shippingAddresses: updatedAddresses,
      };

      await AsyncStorage.setItem(`buyerProfile:${user.id}`, JSON.stringify(updatedProfile));
      setBuyerProfile(updatedProfile);
    } catch (error) {
      console.error('Error adding shipping address:', error);
      throw error;
    }
  };

  const addPaymentMethod = async (method: Omit<BuyerProfile['paymentMethods'][0], 'id'>) => {
    if (!user || !buyerProfile) return;

    try {
      const newMethod = {
        ...method,
        id: Date.now().toString(),
      };

      const updatedMethods = [...buyerProfile.paymentMethods];
      if (method.isDefault) {
        updatedMethods.forEach(m => m.isDefault = false);
      }
      updatedMethods.push(newMethod);

      const updatedProfile = {
        ...buyerProfile,
        paymentMethods: updatedMethods,
      };

      await AsyncStorage.setItem(`buyerProfile:${user.id}`, JSON.stringify(updatedProfile));
      setBuyerProfile(updatedProfile);
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  };

  const searchProducts = async (query: string, category?: ProductCategory) => {
    // This would typically be an API call to search products
    // For now, we'll return an empty array
    return [];
  };

  const value = {
    buyerProfile,
    orders,
    loading,
    updateProfile,
    placeOrder,
    cancelOrder,
    getActiveOrders,
    getPastOrders,
    addShippingAddress,
    addPaymentMethod,
    searchProducts,
  };

  return <BuyerContext.Provider value={value}>{children}</BuyerContext.Provider>;
}

export function useBuyer() {
  const context = useContext(BuyerContext);
  if (context === undefined) {
    throw new Error('useBuyer must be used within a BuyerProvider');
  }
  return context;
} 