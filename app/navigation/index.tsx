import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@/app/login';
import type { RootStackParamList } from '../_types/navigation';

// Import dashboard screens (to be created)
import ExpertDashboard from '@/app/(expert)/index';
import FarmerDashboard from '@/app/(farmer)/index';
import BuyerDashboard from '@/app/(buyer)/index';
import AdminDashboard from '@/app/(admin)/index';
import RegisterScreen from '@/app/(auth)/register';
import ForgotPasswordScreen from '@/app/(auth)/forgot-password';
import ProfileScreen from '@/app/(farmer)/profile';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen 
          name="ExpertDashboard" 
          component={ExpertDashboard}
          options={{ headerShown: true, headerLeft: () => null }}
        />
        <Stack.Screen 
          name="FarmerDashboard" 
          component={FarmerDashboard}
          options={{ headerShown: true, headerLeft: () => null }}
        />
        <Stack.Screen 
          name="BuyerDashboard" 
          component={BuyerDashboard}
          options={{ headerShown: true, headerLeft: () => null }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboard}
          options={{ headerShown: true, headerLeft: () => null }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ headerShown: true, headerLeft: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 