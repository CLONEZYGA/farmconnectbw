import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const PAYMENT_METHODS = [
  { id: '1', name: 'Orange Money', type: 'mobile_money' },
  { id: '2', name: 'MyZaka', type: 'mobile_money' },
  { id: '3', name: 'Visa Card', type: 'card', lastFour: '4242' },
];

const RECENT_TRANSACTIONS = [
  {
    id: '1',
    amount: 250.00,
    date: '2024-03-15',
    description: 'Order #1234',
    status: 'completed',
  },
  {
    id: '2',
    amount: 150.00,
    date: '2024-03-14',
    description: 'Order #1233',
    status: 'pending',
  },
];

export default function PaymentScreen() {
  const { user } = useAuth();

  const handleAddPayment = () => {
    Alert.alert(
      'Add Payment Method',
      'Choose payment type:',
      [
        {
          text: 'Mobile Money',
          onPress: () => Alert.alert('Coming Soon', 'Mobile money integration coming soon'),
        },
        {
          text: 'Credit/Debit Card',
          onPress: () => Alert.alert('Coming Soon', 'Card integration coming soon'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleWithdraw = () => {
    Alert.alert(
      'Withdraw Funds',
      'Choose withdrawal method:',
      [
        {
          text: 'Mobile Money',
          onPress: () => Alert.alert('Coming Soon', 'Mobile money withdrawal coming soon'),
        },
        {
          text: 'Bank Transfer',
          onPress: () => Alert.alert('Coming Soon', 'Bank transfer coming soon'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>BWP 1,250.00</Text>
          <TouchableOpacity 
            style={styles.withdrawButton}
            onPress={handleWithdraw}
          >
            <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity onPress={handleAddPayment}>
              <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {PAYMENT_METHODS.map(method => (
            <View key={method.id} style={styles.methodCard}>
              <Ionicons 
                name={method.type === 'card' ? 'card' : 'phone-portrait'}
                size={24}
                color="#4CAF50"
              />
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>{method.name}</Text>
                {method.lastFour && (
                  <Text style={styles.methodDetails}>•••• {method.lastFour}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {RECENT_TRANSACTIONS.map(transaction => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionAmount}>
                  BWP {transaction.amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.transactionFooter}>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: transaction.status === 'completed' ? '#E8F5E9' : '#FFF3E0' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: transaction.status === 'completed' ? '#4CAF50' : '#FFA000' }
                  ]}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  withdrawButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  methodInfo: {
    marginLeft: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  methodDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#333',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 