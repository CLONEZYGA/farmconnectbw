import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalRevenue: number;
  usersByRole: {
    farmer: number;
    expert: number;
    buyer: number;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    usersByRole: {
      farmer: 0,
      expert: 0,
      buyer: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load users
      const usersData = await SecureStore.getItemAsync('users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Load orders
      const ordersData = await SecureStore.getItemAsync('orders');
      const orders = ordersData ? JSON.parse(ordersData) : [];

      // Calculate stats
      const usersByRole = users.reduce((acc: any, user: any) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

      setStats({
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.lastActive > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
        totalOrders: orders.length,
        totalRevenue,
        usersByRole: {
          farmer: usersByRole.farmer || 0,
          expert: usersByRole.expert || 0,
          buyer: usersByRole.buyer || 0,
        },
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.welcomeText}>Welcome back, {user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={loadDashboardData}>
          <Ionicons name="refresh" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <Ionicons name="people" size={24} color="#4CAF50" />
          <Text style={styles.statsNumber}>{stats.totalUsers}</Text>
          <Text style={styles.statsLabel}>Total Users</Text>
        </View>

        <View style={styles.statsCard}>
          <Ionicons name="person" size={24} color="#2196F3" />
          <Text style={styles.statsNumber}>{stats.activeUsers}</Text>
          <Text style={styles.statsLabel}>Active Users</Text>
        </View>

        <View style={styles.statsCard}>
          <Ionicons name="cart" size={24} color="#FF9800" />
          <Text style={styles.statsNumber}>{stats.totalOrders}</Text>
          <Text style={styles.statsLabel}>Total Orders</Text>
        </View>

        <View style={styles.statsCard}>
          <Ionicons name="cash" size={24} color="#4CAF50" />
          <Text style={styles.statsNumber}>BWP {stats.totalRevenue.toFixed(2)}</Text>
          <Text style={styles.statsLabel}>Total Revenue</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Users by Role</Text>
        <View style={styles.roleStats}>
          <View style={styles.roleStat}>
            <Ionicons name="leaf" size={24} color="#4CAF50" />
            <Text style={styles.roleNumber}>{stats.usersByRole.farmer}</Text>
            <Text style={styles.roleLabel}>Farmers</Text>
          </View>

          <View style={styles.roleStat}>
            <Ionicons name="briefcase" size={24} color="#2196F3" />
            <Text style={styles.roleNumber}>{stats.usersByRole.expert}</Text>
            <Text style={styles.roleLabel}>Experts</Text>
          </View>

          <View style={styles.roleStat}>
            <Ionicons name="cart" size={24} color="#FF9800" />
            <Text style={styles.roleNumber}>{stats.usersByRole.buyer}</Text>
            <Text style={styles.roleLabel}>Buyers</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="people" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bar-chart" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  roleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  roleStat: {
    alignItems: 'center',
    gap: 8,
  },
  roleNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  roleLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 