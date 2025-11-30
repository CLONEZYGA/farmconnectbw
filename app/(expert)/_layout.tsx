import { Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import ExpertNavigation from '../components/ExpertNavigation';
import { View, StyleSheet, Platform } from 'react-native';

export default function ExpertLayout() {
  const { user } = useAuth();

  if (!user || user.role !== 'expert') {
    return null; // Will be redirected by AuthContext
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="advice" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="settings" />
        </Stack>
      </View>
      <ExpertNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 90 : 70, // Height of navigation bar
  },
}); 