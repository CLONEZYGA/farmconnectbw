import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { getAdminDatabaseService } from '../../../shared/services/database/adminDB';
import { ADMIN_ROLES, PLATFORMS } from '../../../shared/config/constants';
import { ThemedText } from '../../../shared/components/UI/ThemedText';
import { ThemedView } from '../../../shared/components/UI/ThemedView';

const { width: screenWidth } = Dimensions.get('window');

export default function AdminDashboardScreen() {
  const { admin, logActivity, canAccess } = useAdminAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const databaseService = getAdminDatabaseService();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const dashboardStats = await databaseService.getDashboardStats();
      setStats(dashboardStats);

      if (admin) {
        await logActivity('DASHBOARD_VIEW', {
          timestamp: new Date().toISOString(),
          platform: PLATFORMS.ADMIN,
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardStats();
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </ThemedView>
    );
  }

  const StatCard = ({ title, value, icon, color, onPress }: any) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value || '0'}</Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.adminName}>
            {admin?.firstName || admin?.email?.split('@')[0] || 'Admin'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <Ionicons
            name={refreshing ? "refresh" : "refresh-outline"}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Users"
              value={stats?.users?.total}
              icon="people-outline"
              color="#007AFF"
              onPress={canAccess('users') ? () => {} : undefined}
            />
            <StatCard
              title="Active Users"
              value={stats?.users?.active}
              icon="person-check-outline"
              color="#34C759"
            />
            <StatCard
              title="Total Products"
              value={stats?.products?.total}
              icon="basket-outline"
              color="#FF9500"
              onPress={canAccess('products') ? () => {} : undefined}
            />
            <StatCard
              title="Total Orders"
              value={stats?.orders?.total}
              icon="document-text-outline"
              color="#FF3B30"
              onPress={canAccess('orders') ? () => {} : undefined}
            />
          </View>
        </View>

        {/* User Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Distribution</Text>
          <View style={styles.distributionContainer}>
            <View style={styles.roleStats}>
              <Text style={styles.roleLabel}>Farmers</Text>
              <Text style={styles.roleValue}>
                {stats?.users?.farmers || 0}
              </Text>
            </View>
            <View style={styles.roleStats}>
              <Text style={styles.roleLabel}>Buyers</Text>
              <Text style={styles.roleValue}>
                {stats?.users?.buyers || 0}
              </Text>
            </View>
            <View style={styles.roleStats}>
              <Text style={styles.roleLabel}>Experts</Text>
              <Text style={styles.roleValue}>
                {stats?.users?.experts || 0}
              </Text>
            </View>
            <View style={styles.roleStats}>
              <Text style={styles.roleLabel}>Admins</Text>
              <Text style={styles.roleValue}>
                {stats?.users?.admins || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            <View style={styles.activityItem}>
              <Ionicons
                name="add-circle-outline"
                size={16}
                color="#34C759"
              />
              <Text style={styles.activityText}>
                {stats?.activity?.newUsers || 0} new users this week
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons
                name="basket-outline"
                size={16}
                color="#FF9500"
              />
              <Text style={styles.activityText}>
                {stats?.activity?.newProducts || 0} new products added
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#007AFF"
              />
              <Text style={styles.activityText}>
                {stats?.activity?.ordersCompleted || 0} orders completed
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color="#5856D6"
              />
              <Text style={styles.activityText}>
                {stats?.activity?.consultationsCompleted || 0} consultations completed
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        {canAccess('manage_users') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: '#007AFF' }]}
                onPress={() => {}}
              >
                <Ionicons name="person-add-outline" size={24} color="#FFFFFF" />
                <Text style={styles.actionText}>Add User</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: '#34C759' }]}
                onPress={() => {}}
              >
                <Ionicons name="document-add-outline" size={24} color="#FFFFFF" />
                <Text style={styles.actionText}>Generate Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: '#FF9500' }]}
                onPress={() => {}}
              >
                <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Platform Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Health</Text>
          <View style={styles.healthContainer}>
            <View style={styles.healthItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#34C759"
              />
              <Text style={styles.healthText}>Database: Online</Text>
            </View>
            <View style={styles.healthItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#34C759"
              />
              <Text style={styles.healthText}>API: Operational</Text>
            </View>
            <View style={styles.healthItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#34C759"
              />
              <Text style={styles.healthText}>Storage: Available</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  adminName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  distributionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleStats: {
    alignItems: 'center',
    flex: 1,
  },
  roleLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    textAlign: 'center',
  },
  roleValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  activityContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    flex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (screenWidth - 60) / 3,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  healthContainer: {
    gap: 8,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  healthText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
});