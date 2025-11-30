import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FarmerNavigation from '../../components/FarmerNavigation';

const messages = [
  {
    id: '1',
    name: 'John Buyer',
    lastMessage: 'Is the tomato stock still available?',
    time: '10:30 AM',
    unread: true,
    avatar: require('../../assets/images/avatar1.png'),
  },
  {
    id: '2',
    name: 'Market Support',
    lastMessage: 'Your listing has been approved',
    time: 'Yesterday',
    unread: false,
    avatar: require('../../assets/images/avatar2.png'),
  },
  {
    id: '3',
    name: 'Sarah Smith',
    lastMessage: 'Can you deliver to Gaborone?',
    time: 'Yesterday',
    unread: true,
    avatar: require('../../assets/images/avatar3.png'),
  },
];

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.newMessageButton}>
            <Ionicons name="create-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <View style={styles.messagesList}>
          {messages.map((message) => (
            <TouchableOpacity 
              key={message.id} 
              style={styles.messageItem}
              onPress={() => router.push(`/(farmer)/messages/${message.id}`)}
            >
              <Image source={message.avatar} style={styles.avatar} />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.name}>{message.name}</Text>
                  <Text style={styles.time}>{message.time}</Text>
                </View>
                <View style={styles.messagePreview}>
                  <Text 
                    style={[
                      styles.lastMessage,
                      message.unread && styles.unreadMessage
                    ]}
                    numberOfLines={1}
                  >
                    {message.lastMessage}
                  </Text>
                  {message.unread && <View style={styles.unreadDot} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: '#333',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
}); 