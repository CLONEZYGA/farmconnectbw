import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function FarmerRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to the proper route with a slight delay
    const timer = setTimeout(() => {
      if (user && user.role === 'farmer') {
        router.replace('/(farmer)');
      } else {
        router.replace('/');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Redirecting...</Text>
    </View>
  );
} 