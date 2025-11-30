import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  seller: {
    id: string;
    name: string;
  };
  unit: string;
  stock?: number;
}

interface CartContextType {
  cart: CartItem[];
  total: number;
  itemCount: number;
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
  getCartItemsByVendor: () => { [key: string]: CartItem[] };
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'asguard_cart';
const DEFAULT_SELLER = {
  id: 'default',
  name: 'General Store',
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Calculate totals whenever cart changes
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotal(newTotal);
    setItemCount(newItemCount);
  }, [cart]);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            // Validate and normalize cart items
            const validCartItems = parsedCart
              .filter((item: any) => {
                const isValid = (
                  item &&
                  typeof item.id === 'string' &&
                  typeof item.name === 'string' &&
                  typeof item.price === 'number' &&
                  typeof item.quantity === 'number' &&
                  item.quantity > 0 &&
                  item.price >= 0
                );
                if (!isValid) {
                  console.warn('Invalid cart item removed:', item);
                }
                return isValid;
              })
              .map((item: any) => ({
                ...item,
                seller: item.seller || DEFAULT_SELLER,
                unit: item.unit || 'unit',
                image: item.image || require('../assets/images/placeholder.png'),
                quantity: Math.max(1, Math.floor(item.quantity)),
                price: Math.max(0, item.price),
              }));
            setCart(validCartItems);
          } else {
            console.warn('Invalid cart data structure, resetting cart');
            setCart([]);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setError('Failed to load cart data');
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        setError(null);
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart:', error);
        setError('Failed to save cart data');
      }
    };
    if (!isLoading) {
      saveCart();
    }
  }, [cart, isLoading]);

  const validateProduct = (product: any): boolean => {
    try {
      if (!product?.id || typeof product.id !== 'string') {
        throw new Error('Invalid product ID');
      }
      if (!product?.name || typeof product.name !== 'string') {
        throw new Error('Invalid product name');
      }
      if (typeof product?.price !== 'number' || product.price < 0) {
        throw new Error('Invalid product price');
      }
      if (product.stock !== undefined && (typeof product.stock !== 'number' || product.stock < 0)) {
        throw new Error('Invalid product stock');
      }
      return true;
    } catch (error) {
      console.error('Product validation error:', error);
      setError(error instanceof Error ? error.message : 'Invalid product data');
      return false;
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Botswana phone number format: 8 digits
    // Can start with 71, 72, 73, 74, 75, 76, 77 (mobile) or 24 (landline)
    const botswanaPhoneRegex = /^(7[1-7]|24)\d{6}$/;
    return botswanaPhoneRegex.test(phone);
  };

  const addToCart = useCallback((product: any, quantity: number) => {
    try {
      setError(null);
      if (!validateProduct(product)) {
        return;
      }

      const validQuantity = Math.max(1, Math.floor(quantity));

      setCart(currentItems => {
        const existingItem = currentItems.find(item => item.id === product.id);
        
        if (existingItem) {
          // Check stock limit if available
          const newQuantity = existingItem.quantity + validQuantity;
          if (product.stock !== undefined && newQuantity > product.stock) {
            setError(`Only ${product.stock} items available`);
            return currentItems;
          }

          return currentItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        // Create new cart item with validated data
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: Math.max(0, product.price),
          quantity: validQuantity,
          image: product.image || require('../assets/images/placeholder.png'),
          seller: product.seller || DEFAULT_SELLER,
          unit: product.unit || 'unit',
          stock: product.stock,
        };

        return [...currentItems, newItem];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart');
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    try {
      setError(null);
      setCart(currentItems => currentItems.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Failed to remove item from cart');
    }
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    try {
      setError(null);
      const validQuantity = Math.floor(quantity);

      if (validQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCart(currentItems => {
        const item = currentItems.find(item => item.id === productId);
        
        if (item?.stock !== undefined && validQuantity > item.stock) {
          setError(`Only ${item.stock} items available`);
          return currentItems;
        }

        return currentItems.map(item =>
          item.id === productId
            ? { ...item, quantity: validQuantity }
            : item
        );
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity');
    }
  }, [removeFromCart]);

  const clearCart = useCallback(async () => {
    try {
      setError(null);
      setCart([]);
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart');
    }
  }, []);

  const getTotalItems = useCallback(() => {
    return itemCount;
  }, [itemCount]);

  const getTotalPrice = useCallback(() => {
    return total;
  }, [total]);

  const getItemQuantity = useCallback((productId: string) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [cart]);

  const getCartItemsByVendor = useCallback(() => {
    return cart.reduce((grouped, item) => {
      const vendorId = item.seller?.id || DEFAULT_SELLER.id;
      if (!grouped[vendorId]) {
        grouped[vendorId] = [];
      }
      grouped[vendorId].push(item);
      return grouped;
    }, {} as { [key: string]: CartItem[] });
  }, [cart]);

  const value = {
    cart,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
    getCartItemsByVendor,
    isLoading,
    error,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 