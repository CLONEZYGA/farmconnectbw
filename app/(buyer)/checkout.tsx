import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

interface DeliveryAddress {
  street: string;
  city: string;
  region: string;
  phone: string;
}

const validatePhoneNumber = (phone: string): boolean => {
  // Botswana phone number format: 8 digits
  // Can start with 71, 72, 73, 74, 75, 76, 77 (mobile) or 24 (landline)
  const botswanaPhoneRegex = /^(7[1-7]|24)\d{6}$/;
  return botswanaPhoneRegex.test(phone);
};

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart = [], total = 0, clearCart } = useCart() || {};
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: '',
    city: '',
    region: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [errors, setErrors] = useState<Partial<DeliveryAddress>>({});

  const validateForm = () => {
    const newErrors: Partial<DeliveryAddress> = {};
    
    if (!deliveryAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!deliveryAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!deliveryAddress.region.trim()) {
      newErrors.region = 'Region is required';
    }
    if (!deliveryAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(deliveryAddress.phone)) {
      newErrors.phone = 'Please enter a valid 8-digit Botswana phone number (e.g., 71234567)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (text: string) => {
    // Only allow digits
    const numbersOnly = text.replace(/[^0-9]/g, '');
    // Limit to 8 digits
    const truncated = numbersOnly.slice(0, 8);
    setDeliveryAddress(prev => ({ ...prev, phone: truncated }));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to place an order');
      return;
    }

    if (!cart || cart.length === 0) {
      router.push('/(buyer)/market');
      return;
    }

    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create the order
      const order = await addOrder({
        items: cart,
        total: total,
        deliveryFee: 50,
        deliveryAddress: deliveryAddress,
        paymentMethod: {
          type: paymentMethod,
        },
        buyer: {
          id: user.id,
          name: user.name,
        },
      });

      // Clear the cart after successful order placement
      if (clearCart) {
        clearCart();
      }

      // Show success message
      Alert.alert(
        'Order Placed Successfully',
        `Your order #${order.id} has been placed successfully.`,
        [
          {
            text: 'View Order',
            onPress: () => router.push(`/(buyer)/orders/${order.id}`),
          },
          {
            text: 'Continue Shopping',
            onPress: () => router.push('/(buyer)'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
      console.error('Order placement error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Placing your order...</Text>
      </View>
    );
  }

  // Show loading state while cart is being fetched
  if (typeof cart === 'undefined') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  // Show empty cart message with redirect
  if (cart.length === 0) {
    router.replace('/(buyer)/market');
    return null;
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>× {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                BWP {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <TextInput
                style={[styles.input, errors.street && styles.inputError]}
                value={deliveryAddress.street}
                onChangeText={(text) => setDeliveryAddress(prev => ({ ...prev, street: text }))}
                placeholder="Enter street address"
              />
              {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                value={deliveryAddress.city}
                onChangeText={(text) => setDeliveryAddress(prev => ({ ...prev, city: text }))}
                placeholder="Enter city"
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Region</Text>
              <TextInput
                style={[styles.input, errors.region && styles.inputError]}
                value={deliveryAddress.region}
                onChangeText={(text) => setDeliveryAddress(prev => ({ ...prev, region: text }))}
                placeholder="Enter region"
              />
              {errors.region && <Text style={styles.errorText}>{errors.region}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={deliveryAddress.phone}
                onChangeText={handlePhoneChange}
                placeholder="Enter phone number (e.g., 71234567)"
                keyboardType="phone-pad"
                maxLength={8}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              <Text style={styles.helperText}>Enter 8-digit Botswana phone number</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'cash' && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod('cash')}
            >
              <Ionicons 
                name="cash-outline" 
                size={24} 
                color={paymentMethod === 'cash' ? '#4CAF50' : '#666'} 
              />
              <Text style={[
                styles.paymentText,
                paymentMethod === 'cash' && styles.paymentTextSelected,
              ]}>Cash on Delivery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'card' && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <Ionicons 
                name="card-outline" 
                size={24} 
                color={paymentMethod === 'card' ? '#4CAF50' : '#666'} 
              />
              <Text style={[
                styles.paymentText,
                paymentMethod === 'card' && styles.paymentTextSelected,
              ]}>Credit/Debit Card</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>BWP {total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>BWP 50.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              BWP {(total + 50).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  shopButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
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
  cartItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  addressForm: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  paymentOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF5020',
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  paymentTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
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
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  placeOrderButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginRight: 16,
  },
}); 