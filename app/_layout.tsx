// app/_layout.tsx
import { Stack } from 'expo-router';
import AuthProvider from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ExpertProvider } from '../context/ExpertContext';
import { BuyerProvider } from '../context/BuyerContext';
import { OrderProvider } from '../context/OrderContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetworkStatus from '../components/NetworkStatus';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ExpertProvider>
          <BuyerProvider>
            <CartProvider>
              <OrderProvider>
                <NetworkStatus />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#fff' },
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(farmer)" />
                  <Stack.Screen name="(expert)" />
                  <Stack.Screen name="(buyer)" />
                  <Stack.Screen name="(admin)" />
                </Stack>
              </OrderProvider>
            </CartProvider>
          </BuyerProvider>
        </ExpertProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
