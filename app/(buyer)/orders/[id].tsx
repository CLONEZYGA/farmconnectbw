import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../../context/OrderContext';

const STATUS_COLORS = {
  pending: '#FFA000',
  confirmed: '#2196F3',
  processing: '#9C27B0',
  shipped: '#FF5722',
  delivered: '#4CAF50',
  cancelled: '#F44336',
};

const STATUS_ICONS = {
  pending: 'time-outline',
  confirmed: 'checkmark-circle-outline',
  processing: 'refresh-circle-outline',
  shipped: 'car-outline',
  delivered: 'checkmark-done-circle-outline',
  cancelled: 'close-circle-outline',
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getOrderById, cancelOrder, isLoading } = useOrders();
  const order = getOrderById(id as string);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
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

  const handleCancelOrder = () => {
    if (order.status === 'pending' || order.status === 'confirmed') {
      cancelOrder(order.id);
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLORS[order.status] + '20' }
            ]}>
              <Ionicons 
                name={STATUS_ICONS[order.status] as any} 
                size={16} 
                color={STATUS_COLORS[order.status]} 
              />
              <Text style={[
                styles.statusText,
                { color: STATUS_COLORS[order.status] }
              ]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
          </View>

          {order.trackingInfo && (
            <View style={styles.trackingInfo}>
              <Text style={styles.sectionTitle}>Order Updates</Text>
              <View style={styles.timeline}>
                {order.trackingInfo.updates.map((update, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={[
                      styles.timelineDot,
                      { backgroundColor: STATUS_COLORS[update.status as keyof typeof STATUS_COLORS] || '#666' }
                    ]} />
                    {index !== order.trackingInfo.updates.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>{update.description}</Text>
                      <Text style={styles.timelineDate}>
                        {new Date(update.timestamp).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items</Text>
            {order.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Image 
                  source={item.image} 
                  style={styles.itemImage}
                  defaultSource={require('../../../assets/images/placeholder.png')}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    BWP {item.price.toFixed(2)} / {item.unit}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    Quantity: {item.quantity}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  BWP {(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
              <Text style={styles.addressText}>{order.deliveryAddress.street}</Text>
              <Text style={styles.addressText}>{order.deliveryAddress.city}</Text>
              <Text style={styles.addressText}>{order.deliveryAddress.region}</Text>
              {order.deliveryAddress.details && (
                <Text style={styles.addressDetails}>
                  {order.deliveryAddress.details}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.paymentCard}>
              <View style={styles.paymentMethod}>
                <Ionicons 
                  name={order.paymentMethod.type === 'cash' ? 'cash-outline' : 'card-outline'} 
                  size={24} 
                  color="#666" 
                />
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentType}>
                    {order.paymentMethod.type.charAt(0).toUpperCase() + order.paymentMethod.type.slice(1)}
                  </Text>
                  {order.paymentMethod.last4 && (
                    <Text style={styles.paymentDetails}>
                      **** **** **** {order.paymentMethod.last4}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                BWP {order.total.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                BWP {order.deliveryFee.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                BWP {(order.total + order.deliveryFee).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {(order.status === 'pending' || order.status === 'confirmed') && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelOrder}
          >
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#666',
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  orderInfo: {
    padding: 20,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  trackingInfo: {
    marginBottom: 24,
  },
  timeline: {
    paddingLeft: 24,
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: 24,
  },
  timelineDot: {
    position: 'absolute',
    left: -24,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  timelineLine: {
    position: 'absolute',
    left: -19,
    top: 12,
    bottom: 0,
    width: 2,
    backgroundColor: '#e0e0e0',
  },
  timelineContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: '#666',
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  addressCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  paymentCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentInfo: {
    marginLeft: 12,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  paymentDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  summary: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 