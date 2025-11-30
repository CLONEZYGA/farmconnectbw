import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

// Sample detailed soil data
const SOIL_DATA = {
  currentReadings: {
    moisture: 68,
    ph: 6.5,
    temperature: 22,
    salinity: 'Low',
    nitrogen: 'Medium',
    phosphorus: 'High',
    potassium: 'Medium',
    calcium: 'Medium',
    magnesium: 'Low',
    sulfur: 'Medium',
    organicMatter: '3.2%',
  },
  soilType: 'Sandy Loam',
  fieldZones: [
    { name: 'North Field', moisture: 72, ph: 6.7, status: 'Optimal' },
    { name: 'South Field', moisture: 61, ph: 6.2, status: 'Needs Attention' },
    { name: 'East Field', moisture: 70, ph: 6.4, status: 'Good' },
    { name: 'West Field', moisture: 65, ph: 6.8, status: 'Good' },
  ],
  soilHistory: [
    { date: '2023-06-10', moisture: 65, ph: 6.5, nitrogen: 'Medium', actions: 'Added compost' },
    { date: '2023-05-15', moisture: 60, ph: 6.3, nitrogen: 'Low', actions: 'Applied fertilizer' },
    { date: '2023-04-20', moisture: 72, ph: 6.6, nitrogen: 'Medium', actions: 'None' },
    { date: '2023-03-25', moisture: 68, ph: 6.4, nitrogen: 'Medium', actions: 'Soil aeration' },
  ],
  recommendations: [
    'Consider adding nitrogen fertilizer to improve nutrient levels in South Field',
    'Monitor soil moisture levels in dry periods',
    'Maintain current organic matter through regular compost application',
    'Apply soil amendments to increase calcium and magnesium levels'
  ],
  lastTested: '3 days ago'
};

export default function SoilScreen() {
  const [soilData, setSoilData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setSoilData(SOIL_DATA);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSoilData(SOIL_DATA);
      setIsLoading(false);
    }, 1000);
  };

  const handleNavigation = (route) => {
    router.push(route);
  };

  const navItems = [
    { name: 'Dashboard', icon: 'home-outline', route: '/(farmer)/' },
    { name: 'Market', icon: 'cart-outline', route: '/(farmer)/market' },
    { name: 'Chat', icon: 'chatbubbles-outline', route: '/(farmer)/chat' },
    { name: 'Settings', icon: 'settings-outline', route: '/(farmer)/settings' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimal': return '#4CAF50';
      case 'Good': return '#8BC34A';
      case 'Needs Attention': return '#FFC107';
      case 'Critical': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading soil data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Soil Analysis</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <View style={styles.soilTypeCard}>
          <View style={styles.soilTypeContent}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1566813916511-32543ce1517f?q=80&w=800&auto=format&fit=crop' }}
              style={styles.soilImage}
            />
            <View style={styles.soilTypeInfo}>
              <Text style={styles.soilTypeLabel}>Soil Type</Text>
              <Text style={styles.soilTypeName}>{soilData.soilType}</Text>
              <Text style={styles.soilTypeDescription}>
                Sandy loam soil is a mixture of sand, silt, and clay. It has good drainage while retaining enough moisture and nutrients for crops.
              </Text>
            </View>
          </View>
          <Text style={styles.lastTestedText}>Last tested: {soilData.lastTested}</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'overview' && styles.activeTab]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'zones' && styles.activeTab]}
            onPress={() => setSelectedTab('zones')}
          >
            <Text style={[styles.tabText, selectedTab === 'zones' && styles.activeTabText]}>Field Zones</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'history' && styles.activeTab]}
            onPress={() => setSelectedTab('history')}
          >
            <Text style={[styles.tabText, selectedTab === 'history' && styles.activeTabText]}>History</Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'overview' && (
          <>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Primary Soil Properties</Text>
              <View style={styles.propertiesGrid}>
                <View style={styles.propertyItem}>
                  <View style={[styles.propertyIcon, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="water-outline" size={24} color="#2196F3" />
                  </View>
                  <Text style={styles.propertyValue}>{soilData.currentReadings.moisture}%</Text>
                  <Text style={styles.propertyLabel}>Moisture</Text>
                </View>
                
                <View style={styles.propertyItem}>
                  <View style={[styles.propertyIcon, { backgroundColor: '#FFF3E0' }]}>
                    <Ionicons name="flask-outline" size={24} color="#FF9800" />
                  </View>
                  <Text style={styles.propertyValue}>{soilData.currentReadings.ph}</Text>
                  <Text style={styles.propertyLabel}>pH Level</Text>
                </View>
                
                <View style={styles.propertyItem}>
                  <View style={[styles.propertyIcon, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="leaf-outline" size={24} color="#4CAF50" />
                  </View>
                  <Text style={styles.propertyValue}>{soilData.currentReadings.organicMatter}</Text>
                  <Text style={styles.propertyLabel}>Organic Matter</Text>
                </View>
                
                <View style={styles.propertyItem}>
                  <View style={[styles.propertyIcon, { backgroundColor: '#FCE4EC' }]}>
                    <Ionicons name="thermometer-outline" size={24} color="#E91E63" />
                  </View>
                  <Text style={styles.propertyValue}>{soilData.currentReadings.temperature}°C</Text>
                  <Text style={styles.propertyLabel}>Temperature</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Nutrient Levels</Text>
              <View style={styles.nutrientList}>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientName}>Nitrogen (N)</Text>
                  <View style={styles.nutrientLevelContainer}>
                    <View style={styles.nutrientIndicator}>
                      <View 
                        style={[
                          styles.nutrientLevel, 
                          { 
                            width: soilData.currentReadings.nitrogen === 'Low' ? '30%' : 
                                  soilData.currentReadings.nitrogen === 'Medium' ? '60%' : '90%',
                            backgroundColor: soilData.currentReadings.nitrogen === 'Low' ? '#F44336' : 
                                           soilData.currentReadings.nitrogen === 'Medium' ? '#FFC107' : '#4CAF50' 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.nutrientValue}>{soilData.currentReadings.nitrogen}</Text>
                  </View>
                </View>

                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientName}>Phosphorus (P)</Text>
                  <View style={styles.nutrientLevelContainer}>
                    <View style={styles.nutrientIndicator}>
                      <View 
                        style={[
                          styles.nutrientLevel, 
                          { 
                            width: soilData.currentReadings.phosphorus === 'Low' ? '30%' : 
                                  soilData.currentReadings.phosphorus === 'Medium' ? '60%' : '90%',
                            backgroundColor: soilData.currentReadings.phosphorus === 'Low' ? '#F44336' : 
                                           soilData.currentReadings.phosphorus === 'Medium' ? '#FFC107' : '#4CAF50' 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.nutrientValue}>{soilData.currentReadings.phosphorus}</Text>
                  </View>
                </View>

                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientName}>Potassium (K)</Text>
                  <View style={styles.nutrientLevelContainer}>
                    <View style={styles.nutrientIndicator}>
                      <View 
                        style={[
                          styles.nutrientLevel, 
                          { 
                            width: soilData.currentReadings.potassium === 'Low' ? '30%' : 
                                  soilData.currentReadings.potassium === 'Medium' ? '60%' : '90%',
                            backgroundColor: soilData.currentReadings.potassium === 'Low' ? '#F44336' : 
                                           soilData.currentReadings.potassium === 'Medium' ? '#FFC107' : '#4CAF50' 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.nutrientValue}>{soilData.currentReadings.potassium}</Text>
                  </View>
                </View>

                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientName}>Calcium (Ca)</Text>
                  <View style={styles.nutrientLevelContainer}>
                    <View style={styles.nutrientIndicator}>
                      <View 
                        style={[
                          styles.nutrientLevel, 
                          { 
                            width: soilData.currentReadings.calcium === 'Low' ? '30%' : 
                                  soilData.currentReadings.calcium === 'Medium' ? '60%' : '90%',
                            backgroundColor: soilData.currentReadings.calcium === 'Low' ? '#F44336' : 
                                           soilData.currentReadings.calcium === 'Medium' ? '#FFC107' : '#4CAF50' 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.nutrientValue}>{soilData.currentReadings.calcium}</Text>
                  </View>
                </View>

                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientName}>Magnesium (Mg)</Text>
                  <View style={styles.nutrientLevelContainer}>
                    <View style={styles.nutrientIndicator}>
                      <View 
                        style={[
                          styles.nutrientLevel, 
                          { 
                            width: soilData.currentReadings.magnesium === 'Low' ? '30%' : 
                                  soilData.currentReadings.magnesium === 'Medium' ? '60%' : '90%',
                            backgroundColor: soilData.currentReadings.magnesium === 'Low' ? '#F44336' : 
                                           soilData.currentReadings.magnesium === 'Medium' ? '#FFC107' : '#4CAF50' 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.nutrientValue}>{soilData.currentReadings.magnesium}</Text>
                  </View>
                </View>

                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientName}>Sulfur (S)</Text>
                  <View style={styles.nutrientLevelContainer}>
                    <View style={styles.nutrientIndicator}>
                      <View 
                        style={[
                          styles.nutrientLevel, 
                          { 
                            width: soilData.currentReadings.sulfur === 'Low' ? '30%' : 
                                  soilData.currentReadings.sulfur === 'Medium' ? '60%' : '90%',
                            backgroundColor: soilData.currentReadings.sulfur === 'Low' ? '#F44336' : 
                                           soilData.currentReadings.sulfur === 'Medium' ? '#FFC107' : '#4CAF50' 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.nutrientValue}>{soilData.currentReadings.sulfur}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {soilData.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" style={styles.recommendationIcon} />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {selectedTab === 'zones' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Field Zones</Text>
            {soilData.fieldZones.map((zone, index) => (
              <View key={index} style={styles.zoneItem}>
                <View style={styles.zoneHeader}>
                  <Text style={styles.zoneName}>{zone.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(zone.status) }]}>
                    <Text style={styles.statusText}>{zone.status}</Text>
                  </View>
                </View>
                
                <View style={styles.zoneDetails}>
                  <View style={styles.zoneDetail}>
                    <Ionicons name="water-outline" size={20} color="#2196F3" />
                    <Text style={styles.zoneDetailText}>Moisture: {zone.moisture}%</Text>
                  </View>
                  <View style={styles.zoneDetail}>
                    <Ionicons name="flask-outline" size={20} color="#FF9800" />
                    <Text style={styles.zoneDetailText}>pH: {zone.ph}</Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.viewZoneButton}>
                  <Text style={styles.viewZoneButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'history' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Soil History</Text>
            <TouchableOpacity style={styles.viewChartButton}>
              <Ionicons name="bar-chart-outline" size={20} color="#fff" />
              <Text style={styles.viewChartButtonText}>View Trends</Text>
            </TouchableOpacity>
            
            {soilData.soilHistory.map((record, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>{new Date(record.date).toLocaleDateString()}</Text>
                </View>
                
                <View style={styles.historyDetails}>
                  <View style={styles.historyDetail}>
                    <Text style={styles.historyLabel}>Moisture:</Text>
                    <Text style={styles.historyValue}>{record.moisture}%</Text>
                  </View>
                  <View style={styles.historyDetail}>
                    <Text style={styles.historyLabel}>pH:</Text>
                    <Text style={styles.historyValue}>{record.ph}</Text>
                  </View>
                  <View style={styles.historyDetail}>
                    <Text style={styles.historyLabel}>Nitrogen:</Text>
                    <Text style={styles.historyValue}>{record.nitrogen}</Text>
                  </View>
                  <View style={styles.historyDetail}>
                    <Text style={styles.historyLabel}>Actions:</Text>
                    <Text style={styles.historyValue}>{record.actions}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.testSoilButton}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.testSoilButtonText}>Record New Soil Test</Text>
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
  soilTypeCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  soilTypeContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  soilImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  soilTypeInfo: {
    flex: 1,
  },
  soilTypeLabel: {
    fontSize: 14,
    color: '#666',
  },
  soilTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  soilTypeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  lastTestedText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
    backgroundColor: '#f0fff0',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  propertyItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 20,
  },
  propertyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  propertyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  propertyLabel: {
    fontSize: 14,
    color: '#666',
  },
  nutrientList: {
    marginTop: 8,
  },
  nutrientItem: {
    marginBottom: 16,
  },
  nutrientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  nutrientLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutrientIndicator: {
    flex: 1,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  nutrientLevel: {
    height: '100%',
    borderRadius: 6,
  },
  nutrientValue: {
    width: 70,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  recommendationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  zoneItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  zoneDetails: {
    marginBottom: 12,
  },
  zoneDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  zoneDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  viewZoneButton: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  viewZoneButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  viewChartButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  viewChartButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  historyItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  historyHeader: {
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  historyDetail: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  historyLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  historyValue: {
    fontSize: 14,
    color: '#333',
  },
  testSoilButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  testSoilButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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