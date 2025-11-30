import { Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { View, Text } from 'react-native';

export default function FarmerLayout() {
  const { user } = useAuth();

  if (!user || user.role !== 'farmer') {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Unauthorized. Please login as a farmer.</Text>
    </View>;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="advice" options={{ headerShown: false }} />
      <Stack.Screen name="crops" options={{ headerShown: false }} />
      <Stack.Screen name="pests" options={{ headerShown: false }} />
      <Stack.Screen name="livestock" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
} 