import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UserAuthProvider } from './context/UserAuthContext';
import { useFonts } from 'expo-font';
import { SafeAreaView, View } from 'react-native';
import { ThemedView } from '../../shared/components/UI/ThemedView';
import { ThemedText } from '../../shared/components/UI/ThemedText';

// Load fonts
export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    Space Mono: require('../../assets/fonts/Space Mono-Regular.ttf'),
  });

  // Show loading screen while fonts load
  if (!fontsLoaded && !fontsError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading fonts...</ThemedText>
      </View>
    );
  }

  // Show error screen if fonts fail to load
  if (fontsError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <ThemedText style={{ textAlign: 'center', color: 'red' }}>
          Error loading fonts. Please restart the app.
        </ThemedText>
      </View>
    );
  }

  return (
    <UserAuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "FarmConnectBW",
            }}
          />
        </Stack>
      </SafeAreaView>
    </UserAuthProvider>
  );
}