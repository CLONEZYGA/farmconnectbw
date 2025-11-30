import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Share, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const ordersJson = await AsyncStorage.getItem('orders');
      if (ordersJson) {
        const orders = JSON.parse(ordersJson);
        const foundOrder = orders.find(o => o.id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        }
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      setIsProcessing(true);
      const ordersJson = await AsyncStorage.getItem('orders');
      if (ordersJson) {
        const orders = JSON.parse(ordersJson);
        const updatedOrders = orders.map(o => 
          o.id === id ? { ...o, status: newStatus } : o
        );
        await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            await updateOrderStatus('Cancelled');
            Alert.alert('Order Cancelled', 'Your order has been cancelled successfully.');
          }
        }
      ]
    );
  };

  const generateInvoice = () => {
    if (!order) return '';

    const date = new Date(order.date).toLocaleDateString('en-GB');
    const items = order.items.map(item => 
      `${item.name} (${item.quantity} ${item.unit}) - ${item.price} = ${item.total}`
    ).join('\n');

    return `
INVOICE

Order ID: ${order.id}
Date: ${date}
Status: ${order.status}

Items:
${items}

Subtotal: ${order.subtotal}
Delivery Fee: ${order.deliveryFee}
Total Amount: ${order.total}

Delivery Details:
Address: ${order.delivery.address}
Method: ${order.delivery.method}
Estimated Delivery: ${order.delivery.estimatedDelivery}

Payment Information:
Method: ${order.payment.method} (*${order.payment.last4})
Status: ${order.payment.status}
    `.trim();
  };

  const handleDownloadInvoice = async () => {
    try {
      setIsProcessing(true);
      const invoice = generateInvoice();
      const fileUri = `${FileSystem.documentDirectory}invoice-${order.id}.txt`;
      
      await FileSystem.writeAsStringAsync(fileUri, invoice);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: `Invoice for Order ${order.id}`,
          UTI: 'public.plain-text'
        });
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      Alert.alert('Error', 'Failed to generate invoice');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return '#FF9800';
      case 'in transit':
        return '#2196F3';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const renderStatusTimeline = () => {
    const steps = ['Ordered', 'Processing', 'In Transit', 'Delivered'];
    let currentStep;
    
    switch (order.status.toLowerCase()) {
      case 'cancelled':
        currentStep = -1;
        break;
      case 'processing':
        currentStep = 1;
        break;
      case 'in transit':
        currentStep = 2;
        break;
      case 'delivered':
        currentStep = 3;
        break;
      default:
        currentStep = 0;
    }

    return (
      <View style={styles.timeline}>
        {steps.map((step, index) => (
          <View key={step} style={styles.timelineStep}>
            <View style={[
              styles.timelineDot,
              { backgroundColor: index <= currentStep ? '#4CAF50' : '#ddd' }
            ]} />
            <Text style={[
              styles.timelineText,
              { color: index <= currentStep ? '#333' : '#999' }
            ]}>
              {step}
            </Text>
            {index < steps.length - 1 && (
              <View style={[
                styles.timelineLine,
                { backgroundColor: index < currentStep ? '#4CAF50' : '#ddd' }
              ]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  if (isLoading || !order) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading order details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
      </View>

      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>Order {order.id}</Text>
            <Text style={styles.orderDate}>
              {new Date(order.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) }
          ]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>
        {renderStatusTimeline()}
      </View>

      {/* Items List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {order.items.map(item => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>
                {item.quantity} {item.unit} × {item.price}
              </Text>
              <Text style={styles.itemTotal}>{item.total}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Seller Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seller</Text>
        <View style={styles.sellerCard}>
          <Image source={order.seller.image} style={styles.sellerImage} />
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>{order.seller.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text style={styles.ratingText}>{order.seller.rating}</Text>
            </View>
            <Text style={styles.sellerLocation}>{order.seller.location}</Text>
          </View>
          <TouchableOpacity style={styles.messageButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Delivery Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{order.delivery.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="bicycle-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{order.delivery.method}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              Estimated Delivery: {order.delivery.estimatedDelivery}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              {order.payment.method} ending in {order.payment.last4}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
            <Text style={[styles.infoText, { color: '#4CAF50' }]}>
              {order.payment.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Total */}
      <View style={styles.totalSection}>
        <View style={styles.totalBreakdown}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{order.subtotal}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery Fee</Text>
            <Text style={styles.totalValue}>{order.deliveryFee}</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>{order.total}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[
            styles.actionButton,
            isProcessing && styles.actionButtonDisabled
          ]}
          onPress={handleDownloadInvoice}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="document-text-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Download Invoice</Text>
            </>
          )}
        </TouchableOpacity>

        {order.status === 'Processing' && (
          <TouchableOpacity 
            style={[
              styles.actionButton,
              styles.cancelButton,
              isProcessing && styles.actionButtonDisabled
            ]}
            onPress={handleCancelOrder}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Cancel Order</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  orderSummary: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  timelineStep: {
    flex: 1,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  timelineLine: {
    position: 'absolute',
    top: 6,
    left: '50%',
    right: -'50%',
    height: 2,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 4,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  sellerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  sellerLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  messageButton: {
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  totalSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  totalBreakdown: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
}); 