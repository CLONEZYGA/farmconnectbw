import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions, Alert, Platform, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import FarmerNavigation from '../../components/FarmerNavigation';

interface DashboardCard {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
}

interface NavItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

export default function FarmerDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);

  // Sample soil data
  const soilData = {
    moisture: 68,
    ph: 6.5,
    nitrogen: 'Medium',
    phosphorus: 'High',
    potassium: 'Medium',
    organicMatter: '3.2%',
    lastTested: '3 days ago'
  };

  // Quick stats data
  const quickStatsData = {
    activeCrops: {
      total: 12,
      details: [
        { name: 'Maize', status: 'Growing', area: '5 acres' },
        { name: 'Tomatoes', status: 'Fruiting', area: '2 acres' },
        { name: 'Wheat', status: 'Growing', area: '3 acres' },
        { name: 'Soybeans', status: 'Planned', area: '2 acres' }
      ]
    },
    marketListings: {
      total: 5,
      details: [
        { product: 'Fresh Tomatoes', quantity: '500 kg', price: 'BWP 25/kg' },
        { product: 'Maize', quantity: '2 tons', price: 'BWP 3,500/ton' },
        { product: 'Wheat', quantity: '1.5 tons', price: 'BWP 4,200/ton' }
      ]
    },
    irrigationActive: {
      total: 3,
      details: [
        { zone: 'North Field', status: 'Active', moisture: '75%' },
        { zone: 'South Field', status: 'Active', moisture: '68%' },
        { zone: 'East Field', status: 'Active', moisture: '72%' }
      ]
    }
  };

  // Dummy fallback data
  const dummyStats = {
    activeCrops: [
      { name: 'Maize', status: 'Growing', area: '5 acres' },
      { name: 'Tomatoes', status: 'Fruiting', area: '2 acres' },
      { name: 'Wheat', status: 'Growing', area: '3 acres' },
      { name: 'Soybeans', status: 'Planned', area: '2 acres' }
    ],
    marketListings: [
      { product: 'Fresh Tomatoes', quantity: '500 kg', price: 'BWP 25/kg' },
      { product: 'Maize', quantity: '2 tons', price: 'BWP 3,500/ton' },
      { product: 'Wheat', quantity: '1.5 tons', price: 'BWP 4,200/ton' }
    ],
    irrigationActive: [
      { zone: 'North Field', status: 'Active', moisture: '75%' },
      { zone: 'South Field', status: 'Active', moisture: '68%' },
      { zone: 'East Field', status: 'Active', moisture: '72%' }
    ]
  };

  const dashboardCards: DashboardCard[] = [
    {
      title: 'My Crops',
      description: 'Manage and monitor your crops',
      icon: 'leaf-outline',
      route: '/(farmer)/crops',
      color: '#4CAF50'
    },
    {
      title: 'Market',
      description: 'Buy and sell farm products',
      icon: 'cart-outline',
      route: '/(farmer)/market',
      color: '#FF9800'
    },
    {
      title: 'Weather',
      description: 'Check weather forecasts',
      icon: 'cloud-outline',
      route: '/(farmer)/weather',
      color: '#2196F3'
    },
    {
      title: 'Irrigation',
      description: 'Monitor water usage and systems',
      icon: 'water-outline',
      route: '/(farmer)/irrigation',
      color: '#03A9F4'
    },
    {
      title: 'Machinery',
      description: 'Track farm equipment status',
      icon: 'construct-outline',
      route: '/(farmer)/machinery',
      color: '#F44336'
    },
    {
      title: 'Analytics',
      description: 'View farm performance metrics',
      icon: 'analytics-outline',
      route: '/(farmer)/charts',
      color: '#9C27B0'
    },
    {
      title: 'Pests',
      description: 'Monitor and manage pest control',
      icon: 'bug-outline',
      route: '/(farmer)/pests',
      color: '#8D6E63'
    },
  ];

  const handleNavigation = (route: string) => {
    console.log('Navigation attempted to:', route);
    router.push(route as any);
  };

  const handleSignOut = () => {
    if (isSigningOut) return; // Prevent multiple sign-out attempts

    Alert.alert(
      'Confirm Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Sign out cancelled')
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              setIsSigningOut(true);
              console.log('FarmerDashboard: Starting sign out process');
              await signOut();
              console.log('FarmerDashboard: Sign out completed successfully');
            } catch (error) {
              console.error('FarmerDashboard: Sign out failed:', error);
              Alert.alert(
                'Sign Out Error',
                'Failed to sign out. Please try again.'
              );
            } finally {
              setIsSigningOut(false);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: 'home-outline', route: '/(farmer)/' },
    { name: 'Market', icon: 'cart-outline', route: '/(farmer)/market' },
    { name: 'Chat', icon: 'chatbubbles-outline', route: '/(farmer)/chat' },
    { name: 'Settings', icon: 'settings-outline', route: '/(farmer)/settings' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmFybXxlbnwwfHwwfHw%3D&w=1000&q=80' }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.97)']}
            style={styles.overlay}
          >
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.welcomeText}>
                  {user && user.name ? `Welcome back ${user.name}` : 'Welcome back'}
                </Text>
                <Text style={styles.headerTitle}>Farmer Dashboard</Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity 
                  style={styles.profileButton} 
                  onPress={() => {
                    console.log('Profile button pressed');
                    router.push('/(farmer)/settings' as any);
                  }}
                  activeOpacity={0.7}
                  disabled={isSigningOut}
                >
                  <View style={styles.profileIcon}>
                    <Ionicons name="person" size={28} color="#fff" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.logoutButton, isSigningOut && styles.disabledButton]} 
                  onPress={handleSignOut}
                  activeOpacity={0.7}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.quickStats}>
              <Text style={styles.sectionTitle}>Quick Stats</Text>
              <View style={styles.statsContainer}>
                <TouchableOpacity 
                  style={[styles.statItem, styles.statItemGreen]}
                  onPress={() => {
                    setSelectedStat(null);
                    setTimeout(() => setSelectedStat('activeCrops'), 10);
                  }}
                >
                  <Ionicons name="leaf" size={24} color="#fff" />
                  <Text style={styles.statValue}>{quickStatsData.activeCrops.total}</Text>
                  <Text style={styles.statLabel}>Active Crops</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.statItem, styles.statItemOrange]}
                  onPress={() => {
                    setSelectedStat(null);
                    setTimeout(() => setSelectedStat('marketListings'), 10);
                  }}
                >
                  <Ionicons name="cart" size={24} color="#fff" />
                  <Text style={styles.statValue}>{quickStatsData.marketListings.total}</Text>
                  <Text style={styles.statLabel}>Market Listings</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.statItem, styles.statItemBlue]}
                  onPress={() => {
                    setSelectedStat(null);
                    setTimeout(() => setSelectedStat('irrigationActive'), 10);
                  }}
                >
                  <Ionicons name="water" size={24} color="#fff" />
                  <Text style={styles.statValue}>{quickStatsData.irrigationActive.total}</Text>
                  <Text style={styles.statLabel}>Irrigation Active</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.weatherPreview}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.weatherGradient}
              >
                <View style={styles.weatherContent}>
                  <View>
                    <Text style={styles.weatherLocation}>Gaborone, Botswana</Text>
                    <Text style={styles.weatherTemp}>28°C</Text>
                    <Text style={styles.weatherDesc}>Sunny</Text>
                  </View>
                  <View style={styles.weatherIcon}>
                    <Ionicons name="sunny" size={60} color="#fff" />
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.weatherButton} 
                  onPress={() => router.push('/(farmer)/weather' as any)}
                >
                  <Text style={styles.weatherButtonText}>View Forecast</Text>
                  <Ionicons name="chevron-forward" size={16} color="#2196F3" />
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Soil Information Section */}
            <View style={styles.soilSection}>
              <View style={styles.soilHeader}>
                <Text style={styles.sectionTitle}>Soil Analysis</Text>
                <TouchableOpacity onPress={() => router.push('/(farmer)/soil' as any)}>
                  <Text style={styles.viewMoreText}>More Details</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.soilCardContent}>
                <View style={styles.soilMainMetrics}>
                  <View style={styles.soilMetricItem}>
                    <View style={styles.soilMetricIconContainer}>
                      <Ionicons name="water-outline" size={24} color="#2196F3" />
                    </View>
                    <Text style={styles.soilMetricValue}>{soilData.moisture}%</Text>
                    <Text style={styles.soilMetricLabel}>Moisture</Text>
                  </View>
                  
                  <View style={styles.soilMetricItem}>
                    <View style={[styles.soilMetricIconContainer, { backgroundColor: '#FF9800' }]}>
                      <Ionicons name="flask-outline" size={24} color="#fff" />
                    </View>
                    <Text style={styles.soilMetricValue}>{soilData.ph}</Text>
                    <Text style={styles.soilMetricLabel}>pH Level</Text>
                  </View>
                  
                  <View style={styles.soilMetricItem}>
                    <View style={[styles.soilMetricIconContainer, { backgroundColor: '#4CAF50' }]}>
                      <Ionicons name="leaf-outline" size={24} color="#fff" />
                    </View>
                    <Text style={styles.soilMetricValue}>{soilData.organicMatter}</Text>
                    <Text style={styles.soilMetricLabel}>Organic</Text>
                  </View>
                </View>
                
                <View style={styles.soilNutrients}>
                  <Text style={styles.nutrientsTitle}>Nutrient Levels</Text>
                  <View style={styles.nutrientsRow}>
                    <View style={styles.nutrientItem}>
                      <Text style={styles.nutrientName}>Nitrogen (N)</Text>
                      <View style={styles.nutrientIndicator}>
                        <View style={[styles.nutrientLevel, { width: '60%', backgroundColor: '#FFC107' }]} />
                      </View>
                      <Text style={styles.nutrientValue}>{soilData.nitrogen}</Text>
                    </View>
                    
                    <View style={styles.nutrientItem}>
                      <Text style={styles.nutrientName}>Phosphorus (P)</Text>
                      <View style={styles.nutrientIndicator}>
                        <View style={[styles.nutrientLevel, { width: '85%', backgroundColor: '#4CAF50' }]} />
                      </View>
                      <Text style={styles.nutrientValue}>{soilData.phosphorus}</Text>
                    </View>
                    
                    <View style={styles.nutrientItem}>
                      <Text style={styles.nutrientName}>Potassium (K)</Text>
                      <View style={styles.nutrientIndicator}>
                        <View style={[styles.nutrientLevel, { width: '70%', backgroundColor: '#2196F3' }]} />
                      </View>
                      <Text style={styles.nutrientValue}>{soilData.potassium}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.lastTestedText}>Last tested: {soilData.lastTested}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Farm Management</Text>
            <View style={styles.cardsContainer}>
              {dashboardCards.map((card, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.card}
                  onPress={() => router.push(card.route as any)}
                >
                  <View style={[styles.cardIconContainer, { backgroundColor: card.color }]}>
                    <Ionicons name={card.icon} size={28} color="#fff" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardDescription}>{card.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#aaa" />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.activitySection}>
              <View style={styles.activityHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: '#4CAF50' }]}>
                    <Ionicons name="water" size={20} color="#fff" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Irrigation Completed</Text>
                    <Text style={styles.activityTime}>Today, 06:30 AM</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: '#FF9800' }]}>
                    <Ionicons name="cart" size={20} color="#fff" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>New Market Order</Text>
                    <Text style={styles.activityTime}>Yesterday, 02:15 PM</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: '#F44336' }]}>
                    <Ionicons name="alert-circle" size={20} color="#fff" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Machinery Maintenance Due</Text>
                    <Text style={styles.activityTime}>Yesterday, 10:45 AM</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Quick Stats Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedStat !== null}
          onRequestClose={() => setSelectedStat(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedStat === 'activeCrops' && 'Active Crops Details'}
                  {selectedStat === 'marketListings' && 'Market Listings Details'}
                  {selectedStat === 'irrigationActive' && 'Active Irrigation Zones'}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedStat(null)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <ScrollView 
                style={styles.modalBody}
                contentContainerStyle={styles.modalBodyContent}
                showsVerticalScrollIndicator={true}
              >
                {selectedStat === 'activeCrops' && (
                  <View>
                    {(quickStatsData.activeCrops.details.length === 0 ? dummyStats.activeCrops : quickStatsData.activeCrops.details).map((crop, index) => (
                      <View key={index} style={styles.detailItem}>
                        <View style={styles.detailHeader}>
                          <Text style={styles.detailTitle}>{crop.name}</Text>
                          <View style={[
                            styles.statusBadge,
                            crop.status === 'Growing' ? styles.growingStatus :
                            crop.status === 'Fruiting' ? styles.fruitingStatus :
                            styles.plannedStatus
                          ]}>
                            <Text style={styles.statusText}>{crop.status}</Text>
                          </View>
                        </View>
                        <Text style={styles.detailText}>Area: {crop.area}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {selectedStat === 'marketListings' && (
                  <View>
                    {(quickStatsData.marketListings.details.length === 0 ? dummyStats.marketListings : quickStatsData.marketListings.details).map((listing, index) => (
                      <View key={index} style={styles.detailItem}>
                        <Text style={styles.detailTitle}>{listing.product}</Text>
                        <Text style={styles.detailText}>Quantity: {listing.quantity}</Text>
                        <Text style={styles.detailText}>Price: {listing.price}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {selectedStat === 'irrigationActive' && (
                  <View>
                    {(quickStatsData.irrigationActive.details.length === 0 ? dummyStats.irrigationActive : quickStatsData.irrigationActive.details).map((zone, index) => (
                      <View key={index} style={styles.detailItem}>
                        <Text style={styles.detailTitle}>{zone.zone}</Text>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailText}>Status: {zone.status}</Text>
                          <Text style={styles.detailText}>Moisture: {zone.moisture}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <FarmerNavigation />
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
  },
  scrollContent: {
    paddingBottom: 80, // Add padding to account for navigation bar
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    opacity: 0.9,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: 8,
    marginRight: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  logoutButton: {
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  disabledButton: {
    opacity: 0.5,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  quickStats: {
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItemGreen: {
    backgroundColor: '#4CAF50',
  },
  statItemOrange: {
    backgroundColor: '#FF9800',
  },
  statItemBlue: {
    backgroundColor: '#2196F3',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  weatherPreview: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  weatherGradient: {
    borderRadius: 12,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  weatherLocation: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherDesc: {
    fontSize: 16,
    color: '#fff',
  },
  weatherIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherButton: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    marginRight: 4,
  },
  cardsContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  activitySection: {
    marginTop: 16,
    marginBottom: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  activityList: {
    paddingHorizontal: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
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
  disabledNavItem: {
    opacity: 0.5,
  },
  soilSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  soilHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  soilCardContent: {
    marginBottom: 8,
  },
  soilMainMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  soilMetricItem: {
    alignItems: 'center',
    width: '30%',
  },
  soilMetricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  soilMetricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  soilMetricLabel: {
    fontSize: 12,
    color: '#666',
  },
  soilNutrients: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  nutrientsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  nutrientsRow: {
    marginBottom: 12,
  },
  nutrientItem: {
    marginBottom: 8,
  },
  nutrientName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  nutrientIndicator: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  nutrientLevel: {
    height: '100%',
    borderRadius: 4,
  },
  nutrientValue: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  lastTestedText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '90%',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 16,
    paddingBottom: 32, // Add extra padding at bottom for better scrolling
  },
  detailItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  growingStatus: {
    backgroundColor: '#E8F5E9',
  },
  fruitingStatus: {
    backgroundColor: '#FFF8E1',
  },
  plannedStatus: {
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 