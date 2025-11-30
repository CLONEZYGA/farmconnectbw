import { Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function BuyerLayout() {
  const { user } = useAuth();

  if (!user || user.role !== 'buyer') {
    return null; // Will be redirected by AuthContext
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="market" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="profile" />
    </Stack>
  );
} 