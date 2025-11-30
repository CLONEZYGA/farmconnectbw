import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TransactionsScreen() {
  const router = useRouter();

  const transactions = [
    {
      id: '1',
      date: '2024-03-20',
      type: 'Order Payment',
      description: 'Order #1234',
      amount: 'BWP 500.00',
      seller: 'Fresh Farm Produce',
      status: 'Completed'
    },
    {
      id: '2',
      date: '2024-03-18',
      type: 'Order Payment',
      description: 'Order #1233',
      amount: 'BWP 750.00',
      seller: 'Organic Farms',
      status: 'Completed'
    },
    {
      id: '3',
      date: '2024-03-15',
      type: 'Refund',
      description: 'Order #1230',
      amount: 'BWP 250.00',
      seller: 'Green Gardens',
      status: 'Completed'
    },
    // Add more transactions as needed
  ];

  const totalSpent = 'BWP 2,500.00';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Transaction History</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Spent</Text>
        <Text style={styles.totalAmount}>{totalSpent}</Text>
      </View>

      <View style={styles.transactionsList}>
        {transactions.map(transaction => (
          <TouchableOpacity 
            key={transaction.id}
            style={styles.transactionCard}
            onPress={() => router.push(`/(buyer)/order-details/${transaction.id}`)}
          >
            <View style={styles.transactionIcon}>
              <Ionicons 
                name={transaction.type === 'Purchase' ? 'cart-outline' : 'refresh-outline'} 
                size={24} 
                color={transaction.type === 'Purchase' ? '#4CAF50' : '#FF9800'} 
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionSeller}>{transaction.seller}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={[
                styles.amountText,
                { color: transaction.type === 'Purchase' ? '#F44336' : '#4CAF50' }
              ]}>
                {transaction.type === 'Purchase' ? '-' : '+'}{transaction.amount}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
  totalCard: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  transactionsList: {
    padding: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transactionSeller: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    minWidth: 100,
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 