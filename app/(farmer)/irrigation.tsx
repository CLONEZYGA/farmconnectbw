import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image, ActivityIndicator, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

// Sample irrigation data
const IRRIGATION_DATA = {
  systems: [
    { id: '1', name: 'North Field Sprinklers', status: 'active', moisture: 68, lastWatered: '2 hours ago', schedule: 'Daily at 6:00 AM', efficiency: 84 },
    { id: '2', name: 'Greenhouse Drip System', status: 'inactive', moisture: 72, lastWatered: '1 day ago', schedule: 'Every 2 days at 7:00 AM', efficiency: 91 },
    { id: '3', name: 'South Field Pivot', status: 'scheduled', moisture: 52, lastWatered: '3 days ago', schedule: 'Tomorrow at 5:30 AM', efficiency: 78 },
    { id: '4', name: 'Orchard Micro-Sprinklers', status: 'active', moisture: 65, lastWatered: '6 hours ago', schedule: 'Daily at 5:00 AM', efficiency: 88 },
  ],
  stats: {
    totalWaterUsed: '12,450 gallons',
    averageMoisture: '64%',
    activeZones: 2,
    waterSaved: '3,200 gallons',
  },
  alerts: [
    { id: '1', message: 'Low moisture detected in South Field - Schedule adjusted', severity: 'warning' },
    { id: '2', message: 'Greenhouse drip system maintenance required', severity: 'info' },
  ]
};

export default function IrrigationScreen() {
  const [irrigationData, setIrrigationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIrrigationData(IRRIGATION_DATA);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIrrigationData(IRRIGATION_DATA);
      setIsLoading(false);
    }, 1000);
  };

  const handleNavigation = (route) => {
    router.push(route);
  };

  const filteredSystems = irrigationData?.systems.filter(system => {
    const matchesSearch = system.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || system.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'inactive': return '#9E9E9E';
      case 'scheduled': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: 'home-outline', route: '/(farmer)/' },
    { name: 'Market', icon: 'cart-outline', route: '/(farmer)/market' },
    { name: 'Chat', icon: 'chatbubbles-outline', route: '/(farmer)/chat' },
    { name: 'Settings', icon: 'settings-outline', route: '/(farmer)/settings' },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading irrigation data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Irrigation Management</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search irrigation systems..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, filterStatus === 'all' && styles.activeFilter]}
            onPress={() => setFilterStatus('all')}
          >
            <Text style={[styles.filterText, filterStatus === 'all' && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterStatus === 'active' && styles.activeFilter]}
            onPress={() => setFilterStatus('active')}
          >
            <Text style={[styles.filterText, filterStatus === 'active' && styles.activeFilterText]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterStatus === 'scheduled' && styles.activeFilter]}
            onPress={() => setFilterStatus('scheduled')}
          >
            <Text style={[styles.filterText, filterStatus === 'scheduled' && styles.activeFilterText]}>Scheduled</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterStatus === 'inactive' && styles.activeFilter]}
            onPress={() => setFilterStatus('inactive')}
          >
            <Text style={[styles.filterText, filterStatus === 'inactive' && styles.activeFilterText]}>Inactive</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{irrigationData.stats.totalWaterUsed}</Text>
            <Text style={styles.statLabel}>Total Water</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{irrigationData.stats.averageMoisture}</Text>
            <Text style={styles.statLabel}>Avg Moisture</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{irrigationData.stats.activeZones}</Text>
            <Text style={styles.statLabel}>Active Zones</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{irrigationData.stats.waterSaved}</Text>
            <Text style={styles.statLabel}>Water Saved</Text>
          </View>
        </View>

        {irrigationData.alerts.length > 0 && (
          <View style={styles.alertsContainer}>
            <Text style={styles.sectionTitle}>Alerts</Text>
            {irrigationData.alerts.map(alert => (
              <View 
                key={alert.id} 
                style={[
                  styles.alertItem, 
                  alert.severity === 'warning' ? styles.warningAlert : styles.infoAlert
                ]}
              >
                <Ionicons 
                  name={alert.severity === 'warning' ? 'warning-outline' : 'information-circle-outline'} 
                  size={20} 
                  color={alert.severity === 'warning' ? '#FFA000' : '#2196F3'}
                />
                <Text style={styles.alertText}>{alert.message}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Irrigation Systems</Text>
        {filteredSystems?.length > 0 ? (
          filteredSystems.map(system => (
            <View key={system.id} style={styles.systemCard}>
              <View style={styles.systemHeader}>
                <Text style={styles.systemName}>{system.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(system.status) }]}>
                  <Text style={styles.statusText}>{system.status.charAt(0).toUpperCase() + system.status.slice(1)}</Text>
                </View>
              </View>
              
              <View style={styles.systemDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="water-outline" size={20} color="#2196F3" />
                  <Text style={styles.detailText}>{system.moisture}% moisture</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={20} color="#9E9E9E" />
                  <Text style={styles.detailText}>Last: {system.lastWatered}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
                  <Text style={styles.detailText}>{system.schedule}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="trending-up-outline" size={20} color="#FF9800" />
                  <Text style={styles.detailText}>{system.efficiency}% efficiency</Text>
                </View>
              </View>
              
              <View style={styles.systemControls}>
                <TouchableOpacity style={styles.controlButton}>
                  <Text style={styles.controlButtonText}>Details</Text>
                </TouchableOpacity>
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>Auto</Text>
                  <Switch
                    value={system.status !== 'inactive'}
                    onValueChange={() => {}}
                    trackColor={{ false: '#d3d3d3', true: '#bae6c2' }}
                    thumbColor={system.status !== 'inactive' ? '#4CAF50' : '#f4f3f4'}
                  />
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="water-outline" size={40} color="#d0d0d0" />
            <Text style={styles.emptyStateText}>No irrigation systems match your filters</Text>
          </View>
        )}

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add New System</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => handleNavigation(item.route)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={pathname === item.route ? '#4CAF50' : '#666'}
            />
            <Text
              style={[
                styles.navText,
                pathname === item.route && styles.activeNavText,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 70,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    padding: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#e0e0e0',
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  alertsContainer: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  warningAlert: {
    backgroundColor: '#FFF8E1',
  },
  infoAlert: {
    backgroundColor: '#E3F2FD',
  },
  alertText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    marginHorizontal: 16,
    color: '#333',
  },
  systemCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  systemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  systemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  systemDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  systemControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  controlButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  controlButtonText: {
    color: '#333',
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    marginRight: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#4CAF50',
  },
}); 