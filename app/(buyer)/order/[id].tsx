import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    unit: string;
  };
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  seller: {
    id: string;
    name: string;
    image: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: {
    type: 'card' | 'bank';
    last4: string;
  };
}

// Sample order data - replace with actual data fetching
const sampleOrder: Order = {
  id: '1',
  date: '2024-03-15',
  status: 'delivered',
  items: [
    {
      id: '1',
      product: {
        id: '1',
        name: 'Organic Tomatoes',
        image: 'https://images.unsplash.com/photo-1546094097-24607dd23b8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        price: 2.99,
        unit: 'kg',
      },
      quantity: 2,
      total: 5.98,
    },
    {
      id: '2',
      product: {
        id: '2',
        name: 'Fresh Corn',
        image: 'https://images.unsplash.com/photo-1601593768799-76c78e9f1b8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        price: 1.99,
        unit: 'piece',
      },
      quantity: 3,
      total: 5.97,
    },
  ],
  total: 11.95,
  seller: {
    id: '1',
    name: 'Green Valley Farm',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  deliveryAddress: {
    street: '123 Main St',
    city: 'Gaborone',
    state: 'Botswana',
    zipCode: '12345',
  },
  paymentMethod: {
    type: 'card',
    last4: '4242',
  },
};

const statusColors = {
  pending: '#FFA000',
  confirmed: '#2196F3',
  shipped: '#9C27B0',
  delivered: '#4CAF50',
  cancelled: '#F44336',
};

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setOrder(sampleOrder);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const getStatusColor = (status: Order['status']) => statusColors[status];

  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground 
      source={require('../../../assets/images/login-bg.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Order Details</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Seller Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <View style={styles.sellerInfo}>
              <Image 
                source={{ uri: order.seller.image }} 
                style={styles.sellerImage}
              />
              <Text style={styles.sellerName}>{order.seller.name}</Text>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items</Text>
            {order.items.map(item => (
              <View key={item.id} style={styles.orderItem}>
                <Image 
                  source={{ uri: item.product.image }} 
                  style={styles.productImage}
                />
                <View style={styles.orderItemInfo}>
                  <Text style={styles.productName}>{item.product.name}</Text>
                  <Text style={styles.quantity}>
                    {item.quantity} {item.product.unit}
                  </Text>
                  <Text style={styles.itemTotal}>
                    BWP {item.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Delivery Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressInfo}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <View style={styles.addressText}>
                <Text>{order.deliveryAddress.street}</Text>
                <Text>{`${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}`}</Text>
              </View>
            </View>
          </View>

          {/* Payment Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.paymentInfo}>
              <Ionicons 
                name={order.paymentMethod.type === 'card' ? 'card-outline' : 'bank-outline'} 
                size={20} 
                color="#666" 
              />
              <Text style={styles.paymentText}>
                {order.paymentMethod.type === 'card' ? 'Card' : 'Bank'} ending in {order.paymentMethod.last4}
              </Text>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>BWP {order.total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>BWP 50.00</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>BWP {(order.total + 50).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    padding: 16,
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
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  orderItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    marginLeft: 12,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  orderSummary: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
}); 