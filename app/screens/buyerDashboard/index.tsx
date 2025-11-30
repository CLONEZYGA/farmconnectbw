import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  Image
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useOrders } from '../../../context/OrderContext';
import { useCart } from '../../../context/CartContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const STATUS_COLORS = {
  pending: '#FFA000',
  confirmed: '#2196F3',
  processing: '#9C27B0',
  shipped: '#FF5722',
  delivered: '#4CAF50',
  cancelled: '#F44336',
};

export default function BuyerDashboard() {
  const { logout, user } = useAuth();
  const { orders } = useOrders();
  const { cart, total } = useCart();
  const router = useRouter();

  const recentOrders = orders.slice(0, 2); // Show only 2 most recent orders

  const handleOrdersPress = () => {
    router.push('/(buyer)/orders');
  };

  const handleCartPress = () => {
    router.push('/(buyer)/cart');
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      router.push('/(buyer)/marketplace');
    } else {
      router.push('/(buyer)/checkout');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#007bff" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Buyer Dashboard</Text>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.grid}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('/(buyer)/marketplace')}
            >
              <Text style={styles.cardTitle}>Marketplace</Text>
              <Text style={styles.cardSubtitle}>Browse available products</Text>
            </TouchableOpacity>

            <View style={[styles.card, styles.ordersCard]}>
              <View style={styles.ordersHeader}>
                <Text style={styles.cardTitle}>Orders & Cart</Text>
                <TouchableOpacity onPress={handleOrdersPress}>
                  <Text style={styles.viewAllText}>View All Orders</Text>
                </TouchableOpacity>
              </View>
              
              {cart.length > 0 && (
                <View style={styles.cartSection}>
                  <View style={styles.cartHeader}>
                    <Text style={styles.sectionTitle}>Current Cart</Text>
                    <TouchableOpacity onPress={handleCartPress}>
                      <Text style={styles.viewCartText}>View Cart</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cartSummary}>
                    <Text style={styles.cartItems}>{cart.length} items</Text>
                    <Text style={styles.cartTotal}>BWP {total.toFixed(2)}</Text>
                  </View>
                </View>
              )}

              {recentOrders.length > 0 && (
                <View style={styles.recentOrders}>
                  <Text style={styles.sectionTitle}>Recent Orders</Text>
                  {recentOrders.map((order) => (
                    <TouchableOpacity 
                      key={order.id}
                      style={styles.orderItem}
                      onPress={() => router.push(`/(buyer)/orders/${order.id}`)}
                    >
                      <View style={styles.orderInfo}>
                        <Text style={styles.orderId}>#{order.id}</Text>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: STATUS_COLORS[order.status] + '20' }
                        ]}>
                          <Text style={[
                            styles.statusText,
                            { color: STATUS_COLORS[order.status] }
                          ]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.orderTotal}>
                        BWP {order.total.toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity 
                style={styles.placeOrderButton}
                onPress={handlePlaceOrder}
              >
                <Ionicons 
                  name={cart.length > 0 ? "cart-outline" : "add-circle-outline"} 
                  size={20} 
                  color="#fff" 
                />
                <Text style={styles.placeOrderText}>
                  {cart.length > 0 ? 'Proceed to Checkout' : 'Start Shopping'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Farmers</Text>
              <Text style={styles.cardSubtitle}>Find trusted producers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Payments</Text>
              <Text style={styles.cardSubtitle}>Manage transactions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Analytics</Text>
              <Text style={styles.cardSubtitle}>Track your purchases</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Support</Text>
              <Text style={styles.cardSubtitle}>Get assistance</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: width > 600 ? 28 : 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  welcomeText: {
    fontSize: width > 600 ? 16 : 14,
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#dc3545',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width > 600 ? 16 : 14,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: width * 0.04,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: width > 600 ? width * 0.28 : width * 0.44,
    aspectRatio: 1.2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ordersCard: {
    aspectRatio: 1.5,
    justifyContent: 'flex-start',
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cartSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewCartText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  cartSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItems: {
    fontSize: 14,
    color: '#666',
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  recentOrders: {
    flex: 1,
  },
  orderItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderTotal: {
    fontSize: 14,
    color: '#666',
  },
  noOrdersText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: width > 600 ? 22 : 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: width > 600 ? 16 : 14,
    color: '#666',
  },
}); 