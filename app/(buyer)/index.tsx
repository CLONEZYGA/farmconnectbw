import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';

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

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  seller: string;
  location: string;
  imageUrl: string;
}

export default function BuyerDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Sample market data
  const marketData = {
    activeOrders: 5,
    savedItems: 12,
    recentTransactions: 8,
    totalSpent: 2500,
  };

  // Format currency function
  const formatBWP = (amount: number) => {
    return `BWP ${amount.toLocaleString('en-BW')}`;
  };

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Browse Market',
      description: 'Explore available products',
      icon: 'cart-outline',
      route: '/(buyer)/market',
      color: '#4CAF50'
    },
    {
      title: 'My Orders',
      description: 'Track your purchases',
      icon: 'list-outline',
      route: '/(buyer)/orders',
      color: '#FF9800'
    },
    {
      title: 'Saved Items',
      description: 'View your wishlist',
      icon: 'heart-outline',
      route: '/(buyer)/saved',
      color: '#2196F3'
    },
    {
      title: 'Messages',
      description: 'Chat with sellers',
      icon: 'chatbubbles-outline',
      route: '/(buyer)/messages',
      color: '#9C27B0'
    },
    {
      title: 'Analytics',
      description: 'View spending insights',
      icon: 'analytics-outline',
      route: '/(buyer)/analytics',
      color: '#F44336'
    },
    {
      title: 'Settings',
      description: 'Manage your account',
      icon: 'settings-outline',
      route: '/(buyer)/settings',
      color: '#607D8B'
    },
  ];

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: 'home-outline', route: '/(buyer)/' },
    { name: 'Market', icon: 'cart-outline', route: '/(buyer)/market' },
    { name: 'Messages', icon: 'chatbubbles-outline', route: '/(buyer)/messages' },
    { name: 'Settings', icon: 'settings-outline', route: '/(buyer)/settings' },
  ];

  const recentProducts: Product[] = [
    {
      id: '1',
      name: 'Fresh Tomatoes',
      price: 2.5,
      unit: 'kg',
      seller: 'Green Valley Farm',
      location: 'Rural County',
      imageUrl: 'https://placehold.co/100x100',
    },
    {
      id: '2',
      name: 'Organic Corn',
      price: 1.75,
      unit: 'kg',
      seller: 'Sunrise Fields',
      location: 'Farmington',
      imageUrl: 'https://placehold.co/100x100',
    },
    {
      id: '3',
      name: 'Premium Wheat',
      price: 3.0,
      unit: 'kg',
      seller: 'Golden Harvest',
      location: 'Wheatland',
      imageUrl: 'https://placehold.co/100x100',
    },
  ];

  const quickStats = [
    {
      id: 'orders',
      title: 'Active Orders',
      value: '5',
      icon: 'cart-outline',
      color: '#4CAF50',
      route: '/(buyer)/orders'
    },
    {
      id: 'saved',
      title: 'Saved Items',
      value: '12',
      icon: 'heart-outline',
      color: '#FF9800',
      route: '/(buyer)/saved-items'
    },
    {
      id: 'spent',
      title: 'Total Spent',
      value: 'BWP 2,500',
      icon: 'wallet-outline',
      color: '#2196F3',
      route: '/(buyer)/transactions'
    }
  ];

  const handleStatPress = (route: string) => {
    router.push(route);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              console.log('BuyerDashboard: Starting logout process');
              await signOut();
              console.log('BuyerDashboard: Logout completed successfully');
            } catch (error) {
              console.error('BuyerDashboard: Logout failed:', error);
              Alert.alert(
                'Logout Error',
                'Failed to log out. Please try again.'
              );
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.97)']}
        style={styles.overlay}
      >
        <ScrollView style={styles.scrollView}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' }}
            style={styles.headerBackground}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            >
              <View style={styles.headerContent}>
                <View>
                  <Text style={styles.welcomeText}>Welcome back</Text>
                  <Text style={styles.headerTitle}>Buyer Dashboard</Text>
                </View>
                <View style={styles.headerButtons}>
                  <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(buyer)/settings' as any)}>
                    <View style={styles.profileIcon}>
                      <Ionicons name="person" size={28} color="#fff" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>

          <View style={styles.quickStatsContainer}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsGrid}>
              {quickStats.map((stat) => (
                <TouchableOpacity
                  key={stat.id}
                  style={[styles.statCard, { backgroundColor: stat.color }]}
                  onPress={() => handleStatPress(stat.route)}
                >
                  <Ionicons name={stat.icon as any} size={24} color="white" />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.marketPreview}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.marketGradient}
            >
              <View style={styles.marketContent}>
                <View>
                  <Text style={styles.marketLocation}>Local Market</Text>
                  <Text style={styles.marketStats}>{recentProducts.length} New Items</Text>
                  <Text style={styles.marketDesc}>Fresh products available</Text>
                </View>
                <View style={styles.marketIcon}>
                  <Ionicons name="basket" size={60} color="#fff" />
                </View>
              </View>
              <TouchableOpacity 
                style={styles.marketButton} 
                onPress={() => router.push('/(buyer)/market' as any)}
              >
                <Text style={styles.marketButtonText}>Browse Market</Text>
                <Ionicons name="chevron-forward" size={16} color="#2196F3" />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Products</Text>
              <TouchableOpacity onPress={() => router.push('/(buyer)/market' as any)}>
                <Text style={styles.viewMoreText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentProductsScroll}>
              {recentProducts.map((product, index) => (
                <TouchableOpacity 
                  key={product.id} 
                  style={styles.productCard}
                  onPress={() => router.push(`/(buyer)/product/${product.id}` as any)}
                >
                  <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{formatBWP(product.price)}/{product.unit}</Text>
                    <Text style={styles.sellerName}>{product.seller}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
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
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.navItem}
              onPress={() => router.push(item.route as any)}
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
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    height: 180,
  },
  gradient: {
    height: '100%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  profileButton: {
    marginBottom: 8,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
    marginLeft: 8,
  },
  quickStatsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
  },
  marketPreview: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  marketGradient: {
    borderRadius: 12,
  },
  marketContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  marketLocation: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  marketStats: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  marketDesc: {
    fontSize: 16,
    color: '#fff',
  },
  marketIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketButton: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    marginRight: 4,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  recentProductsScroll: {
    paddingLeft: 16,
  },
  productCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 12,
    color: '#666',
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
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