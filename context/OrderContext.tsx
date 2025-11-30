import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from './CartContext';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  total: number;
  deliveryFee: number;
  deliveryAddress: {
    street: string;
    city: string;
    region: string;
    details?: string;
  };
  paymentMethod: {
    type: string;
    last4?: string;
  };
  buyer: {
    id: string;
    name: string;
  };
  trackingInfo?: {
    status: string;
    location?: string;
    estimatedDelivery?: string;
    updates: {
      status: string;
      timestamp: string;
      description: string;
    }[];
  };
}

interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  cancelOrder: (orderId: string) => Promise<void>;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from AsyncStorage on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const savedOrders = await AsyncStorage.getItem('orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Save orders to AsyncStorage whenever they change
  useEffect(() => {
    const saveOrders = async () => {
      try {
        await AsyncStorage.setItem('orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Error saving orders:', error);
      }
    };
    if (!isLoading) {
      saveOrders();
    }
  }, [orders, isLoading]);

  const addOrder = useCallback(async (orderData: Partial<Order>): Promise<Order> => {
    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      items: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      total: 0,
      deliveryFee: 0,
      deliveryAddress: {
        street: '',
        city: '',
        region: '',
      },
      paymentMethod: {
        type: 'cash',
      },
      buyer: {
        id: '',
        name: '',
      },
      trackingInfo: {
        status: 'pending',
        updates: [{
          status: 'pending',
          timestamp: new Date().toISOString(),
          description: 'Order placed',
        }],
      },
      ...orderData,
    };

    setOrders(currentOrders => [...currentOrders, newOrder]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    setOrders(currentOrders => 
      currentOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            updatedAt: new Date().toISOString(),
            trackingInfo: {
              ...order.trackingInfo,
              status,
              updates: [
                ...order.trackingInfo?.updates || [],
                {
                  status,
                  timestamp: new Date().toISOString(),
                  description: `Order ${status}`,
                },
              ],
            },
          };
        }
        return order;
      })
    );
  }, []);

  const getOrderById = useCallback((orderId: string) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const cancelOrder = useCallback(async (orderId: string) => {
    await updateOrderStatus(orderId, 'cancelled');
  }, [updateOrderStatus]);

  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    cancelOrder,
    isLoading,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
} 