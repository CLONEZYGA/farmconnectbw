import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import FarmerDashboard from '@/app/(farmer)/index';
import BuyerDashboard from '@/app/(buyer)/index';
import ExpertDashboard from '@/app/(expert)/index';
import AdminDashboard from '@/app/(admin)/index';


const Stack = createNativeStackNavigator();

export default function MainStack() {
  const { user } = useAuth();

  // Determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'FARMER':
        return FarmerDashboard;
      case 'BUYER':
        return BuyerDashboard;
      case 'EXPERT':
        return ExpertDashboard;
      case 'ADMIN':
        return AdminDashboard;
      default:
        return null;
    }
  };

  const DashboardComponent = getDashboardComponent();

  if (!DashboardComponent) {
    return null; // Or a fallback screen
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackVisible: false,
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardComponent}
        options={{ 
          title: `${user?.role} Dashboard`,
        }} 
      />
    </Stack.Navigator>
  );
} 