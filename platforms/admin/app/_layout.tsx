import React from 'react';
import { Redirect, Slot, Stack, Tabs } from 'expo-router';
import { Platform, SafeAreaView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ADMIN_ROLES, PLATFORMS } from '../../shared/config/constants';
import { ThemedText } from '../../shared/components/UI/ThemedText';
import { ThemedView } from '../../shared/components/UI/ThemedView';

export default function AdminLayout() {
  const { admin, isLoading, isInitialized, hasPermission } = useAdminAuth();

  // Show loading screen while initializing
  if (!isInitialized || isLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading admin dashboard...</ThemedText>
      </ThemedView>
    );
  }

  // Redirect to login if not authenticated
  if (!admin) {
    return <Redirect href="/login" />;
  }

  // Main admin layout
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Platform.select({
              ios: '#f5f5f5',
              android: '#ffffff',
              web: '#ffffff',
            }),
          },
          headerTintColor: '#333333',
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            title: 'FarmConnectBW Admin',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Admin Login',
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="users/[id]"
          options={{
            title: 'User Details',
          }}
        />
        <Stack.Screen
          name="products/[id]"
          options={{
            title: 'Product Details',
          }}
        />
        <Stack.Screen
          name="orders/[id]"
          options={{
            title: 'Order Details',
          }}
        />
        <Stack.Screen
          name="consultations/[id]"
          options={{
            title: 'Consultation Details',
          }}
        />
        <Stack.Screen
          name="reports/[id]"
          options={{
            title: 'Report Details',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings',
          }}
        />
        <Stack.Screen
          name="logs"
          options={{
            title: 'Activity Logs',
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}

// Tab layout for main admin sections
function AdminTabsLayout() {
  const { admin, hasPermission } = useAdminAuth();

  if (!admin) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: Platform.select({
            ios: '#f5f5f5',
            android: '#ffffff',
            web: '#ffffff',
          }),
        },
        headerShown: false,
      }}
    >
      {/* Dashboard Tab - Always visible */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Users Tab - Only if has manage_users permission */}
      {hasPermission('manage_users') && (
        <Tabs.Screen
          name="users"
          options={{
            title: 'Users',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Products Tab - Only if has manage_products permission */}
      {hasPermission('manage_products') && (
        <Tabs.Screen
          name="products"
          options={{
            title: 'Products',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="basket-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Orders Tab - Only if has manage_orders permission */}
      {hasPermission('manage_orders') && (
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Consultations Tab - Only if has manage_consultations permission */}
      {hasPermission('manage_consultations') && (
        <Tabs.Screen
          name="consultations"
          options={{
            title: 'Consultations',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Reports Tab - Only if has view_reports permission */}
      {hasPermission('view_reports') && (
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* More Options Tab - Always visible */}
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}