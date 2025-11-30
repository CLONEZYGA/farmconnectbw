import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ExpertProvider } from './context/ExpertContext';
import { BuyerProvider } from './context/BuyerContext';
import { OrderProvider } from './context/OrderContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ExpertProvider>
          <BuyerProvider>
            <CartProvider>
              <OrderProvider>
                {/* Expo Router will handle navigation */}
              </OrderProvider>
            </CartProvider>
          </BuyerProvider>
        </ExpertProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
} 