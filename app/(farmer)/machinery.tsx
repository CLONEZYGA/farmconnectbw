import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

// Sample machinery data for demonstration
const MACHINERY_DATA = {
  equipment: [
    {
      id: '1',
      name: 'John Deere Tractor',
      model: '5075E',
      type: 'Tractor',
      status: 'operational',
      lastMaintenance: '2023-10-15',
      nextMaintenance: '2024-01-15',
      fuelLevel: 85,
      hoursUsed: 1200,
      location: 'Main Field',
      purchaseDate: '2020-05-10',
      purchasePrice: 35000,
      image: 'https://example.com/tractor.jpg'
    },
    {
      id: '2',
      name: 'Kubota Harvester',
      model: 'DC-70',
      type: 'Harvester',
      status: 'maintenance',
      lastMaintenance: '2023-11-05',
      nextMaintenance: '2023-11-12',
      fuelLevel: 45,
      hoursUsed: 890,
      location: 'Equipment Shed',
      purchaseDate: '2021-03-15',
      purchasePrice: 48000,
      image: 'https://example.com/harvester.jpg'
    },
    {
      id: '3',
      name: 'Irrigation Pump',
      model: 'WaterMax 3000',
      type: 'Irrigation',
      status: 'operational',
      lastMaintenance: '2023-09-20',
      nextMaintenance: '2024-03-20',
      hoursUsed: 2450,
      location: 'Northern Field',
      purchaseDate: '2019-08-22',
      purchasePrice: 12000,
      image: 'https://example.com/pump.jpg'
    },
    {
      id: '4',
      name: 'Drone',
      model: 'AgriDrone X2',
      type: 'Monitoring',
      status: 'charging',
      lastMaintenance: '2023-10-30',
      nextMaintenance: '2024-01-30',
      batteryLevel: 25,
      hoursUsed: 120,
      location: 'Main Office',
      purchaseDate: '2022-09-05',
      purchasePrice: 5000,
      image: 'https://example.com/drone.jpg'
    },
  ],
  statistics: {
    totalEquipment: 4,
    operationalCount: 2,
    maintenanceNeeded: 1,
    totalInvestment: 100000,
    upcomingMaintenance: 1
  },
  maintenanceHistory: [
    { id: '1', equipmentId: '2', date: '2023-11-05', type: 'Routine', cost: 350, notes: 'Oil change and filter replacement' },
    { id: '2', equipmentId: '1', date: '2023-10-15', type: 'Major', cost: 1200, notes: 'Engine overhaul and diagnostics' },
    { id: '3', equipmentId: '3', date: '2023-09-20', type: 'Routine', cost: 150, notes: 'Cleaning and inspection' }
  ]
};

export default function MachineryScreen() {
  const [machineryData, setMachineryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  const router = useRouter();
  const pathname = usePathname();

  // Simulate data loading
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMachineryData(MACHINERY_DATA);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setMachineryData(MACHINERY_DATA);
    setLoading(false);
  };

  const handleNavigation = (route) => {
    router.push(route);
  };

  const navItems = [
    { name: 'Dashboard', icon: 'home-outline', route: '/(farmer)/' },
    { name: 'Market', icon: 'cart-outline', route: '/(farmer)/market' },
    { name: 'Analytics', icon: 'analytics-outline', route: '/(farmer)/charts' },
    { name: 'Settings', icon: 'settings-outline', route: '/(farmer)/settings' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return '#4CAF50';
      case 'maintenance': return '#FFC107';
      case 'repair': return '#F44336';
      case 'charging': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return 'checkmark-circle';
      case 'maintenance': return 'construct';
      case 'repair': return 'warning';
      case 'charging': return 'battery-charging';
      default: return 'help-circle';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const filteredEquipment = machineryData?.equipment.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         equipment.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || equipment.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = ['All', 'Tractor', 'Harvester', 'Irrigation', 'Monitoring'];

  const handleEquipmentPress = (equipment) => {
    setSelectedEquipment(equipment);
  };

  // Calculate days until next maintenance
  const getDaysUntilMaintenance = (nextMaintenanceDate) => {
    const today = new Date();
    const maintenance = new Date(nextMaintenanceDate);
    const diffTime = maintenance - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading machinery data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Machinery Management</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Equipment Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{machineryData.statistics.totalEquipment}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{machineryData.statistics.operationalCount}</Text>
              <Text style={styles.statLabel}>Operational</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#FFC107' }]}>
                {machineryData.statistics.maintenanceNeeded}
              </Text>
              <Text style={styles.statLabel}>Needs Attention</Text>
            </View>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search machinery..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color="#0066CC" />
          </TouchableOpacity>
        </View>

        {/* Filter options */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterButton,
                filterType === option && styles.activeFilterButton,
              ]}
              onPress={() => setFilterType(option)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === option && styles.activeFilterButtonText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Machinery list */}
        {filteredEquipment && filteredEquipment.length > 0 ? (
          filteredEquipment.map((equipment) => (
            <TouchableOpacity
              key={equipment.id}
              style={styles.equipmentCard}
              onPress={() => handleEquipmentPress(equipment)}
            >
              <View style={styles.equipmentCardHeader}>
                <View style={styles.equipmentTitleRow}>
                  <Text style={styles.equipmentName}>{equipment.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(equipment.status) }]}>
                    <Ionicons name={getStatusIcon(equipment.status)} size={12} color="white" style={styles.statusIcon} />
                    <Text style={styles.statusText}>
                      {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.equipmentModel}>{equipment.model} | {equipment.type}</Text>
              </View>
              
              <View style={styles.equipmentCardContent}>
                <View style={styles.equipmentSpecsRow}>
                  <View style={styles.equipmentSpecItem}>
                    <Ionicons name="calendar" size={16} color="#0066CC" />
                    <Text style={styles.specLabel}>Last Maintenance</Text>
                    <Text style={styles.specValue}>{formatDate(equipment.lastMaintenance)}</Text>
                  </View>
                  
                  <View style={styles.equipmentSpecItem}>
                    <Ionicons name="time" size={16} color="#0066CC" />
                    <Text style={styles.specLabel}>Hours Used</Text>
                    <Text style={styles.specValue}>{equipment.hoursUsed}</Text>
                  </View>
                </View>
                
                <View style={styles.equipmentSpecsRow}>
                  <View style={styles.equipmentSpecItem}>
                    <Ionicons name="calendar-outline" size={16} color="#0066CC" />
                    <Text style={styles.specLabel}>Next Maintenance</Text>
                    <Text style={styles.specValue}>{formatDate(equipment.nextMaintenance)}</Text>
                  </View>
                  
                  <View style={styles.equipmentSpecItem}>
                    <Ionicons name="location" size={16} color="#0066CC" />
                    <Text style={styles.specLabel}>Location</Text>
                    <Text style={styles.specValue}>{equipment.location}</Text>
                  </View>
                </View>
                
                {/* Show fuel level or battery level based on equipment type */}
                {equipment.fuelLevel !== undefined && (
                  <View style={styles.levelContainer}>
                    <Text style={styles.levelLabel}>Fuel Level</Text>
                    <View style={styles.levelBarContainer}>
                      <View style={styles.levelBar}>
                        <View 
                          style={[
                            styles.levelFill, 
                            { 
                              width: `${equipment.fuelLevel}%`,
                              backgroundColor: equipment.fuelLevel > 25 ? '#4CAF50' : '#F44336'
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.levelText}>{equipment.fuelLevel}%</Text>
                    </View>
                  </View>
                )}
                
                {equipment.batteryLevel !== undefined && (
                  <View style={styles.levelContainer}>
                    <Text style={styles.levelLabel}>Battery Level</Text>
                    <View style={styles.levelBarContainer}>
                      <View style={styles.levelBar}>
                        <View 
                          style={[
                            styles.levelFill, 
                            { 
                              width: `${equipment.batteryLevel}%`,
                              backgroundColor: equipment.batteryLevel > 20 ? '#4CAF50' : '#F44336'
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.levelText}>{equipment.batteryLevel}%</Text>
                    </View>
                  </View>
                )}
                
                {/* Maintenance countdown */}
                {equipment.nextMaintenance && (
                  <View style={styles.maintenanceAlert}>
                    <Ionicons 
                      name="construct" 
                      size={16} 
                      color={getDaysUntilMaintenance(equipment.nextMaintenance) <= 7 ? '#F44336' : '#0066CC'} 
                    />
                    <Text 
                      style={[
                        styles.maintenanceAlertText,
                        { color: getDaysUntilMaintenance(equipment.nextMaintenance) <= 7 ? '#F44336' : '#0066CC' }
                      ]}
                    >
                      {getDaysUntilMaintenance(equipment.nextMaintenance)} days until next maintenance
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.equipmentCardActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="construct-outline" size={18} color="#0066CC" />
                  <Text style={styles.actionButtonText}>Maintenance</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="analytics-outline" size={18} color="#0066CC" />
                  <Text style={styles.actionButtonText}>Usage Log</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="document-text-outline" size={18} color="#0066CC" />
                  <Text style={styles.actionButtonText}>Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="construct-outline" size={60} color="#ccc" />
            <Text style={styles.emptyStateText}>No machinery found</Text>
            <Text style={styles.emptyStateSubtext}>Add new equipment or change your search criteria</Text>
          </View>
        )}
        
        {/* Maintenance History Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Maintenance History</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {machineryData.maintenanceHistory && machineryData.maintenanceHistory.length > 0 ? (
          machineryData.maintenanceHistory.map((record) => {
            const equipment = machineryData.equipment.find(e => e.id === record.equipmentId);
            return (
              <View key={record.id} style={styles.maintenanceRecord}>
                <View style={styles.maintenanceHeader}>
                  <Text style={styles.maintenanceEquipment}>{equipment ? equipment.name : 'Unknown Equipment'}</Text>
                  <Text style={styles.maintenanceDate}>{formatDate(record.date)}</Text>
                </View>
                <View style={styles.maintenanceDetails}>
                  <Text style={styles.maintenanceType}>{record.type} Maintenance</Text>
                  <Text style={styles.maintenanceCost}>BWP {record.cost}</Text>
                </View>
                <Text style={styles.maintenanceNotes}>{record.notes}</Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.noMaintenanceText}>No maintenance records found</Text>
        )}
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
              color={pathname === item.route ? '#0066CC' : '#666'}
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
  scrollContainer: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#0066CC',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    marginTop: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    fontSize: 16,
  },
  refreshButton: {
    padding: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterButton: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  equipmentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    marginTop: 0,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  equipmentCardHeader: {
    marginBottom: 12,
  },
  equipmentTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  equipmentModel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  equipmentCardContent: {
    marginBottom: 12,
  },
  equipmentSpecsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  equipmentSpecItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  specLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  levelContainer: {
    marginBottom: 12,
  },
  levelLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  levelBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  levelFill: {
    height: '100%',
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    width: 40,
    textAlign: 'right',
  },
  maintenanceAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  maintenanceAlertText: {
    marginLeft: 8,
    fontSize: 14,
  },
  equipmentCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#0066CC',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllButton: {
    padding: 4,
  },
  seeAllText: {
    color: '#0066CC',
    fontSize: 14,
  },
  maintenanceRecord: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  maintenanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  maintenanceEquipment: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  maintenanceDate: {
    fontSize: 14,
    color: '#666',
  },
  maintenanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  maintenanceType: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '500',
  },
  maintenanceCost: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  maintenanceNotes: {
    fontSize: 14,
    color: '#666',
  },
  noMaintenanceText: {
    padding: 16,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#0066CC',
  },
}); 