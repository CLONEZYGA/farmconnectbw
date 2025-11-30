import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  text: string;
  sender: 'expert' | 'farmer';
  timestamp: string;
}

export default function ConsultationDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Resolved'>('Pending');

  // Mock data - in a real app, this would come from an API
  const consultation = {
    id,
    farmer: 'John Smith',
    topic: 'Tomato Disease',
    status: 'In Progress',
    date: '2024-03-18',
    description: 'My tomato plants are showing signs of yellowing leaves and brown spots. The issue started about a week ago and has been spreading.',
    location: 'Farm Location A',
    cropType: 'Tomatoes',
    affectedArea: '2 acres',
    images: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  };

  const messages: Message[] = [
    {
      id: '1',
      text: 'Hello, I am an agricultural expert. How can I help you today?',
      sender: 'expert',
      timestamp: '2024-03-18 10:00',
    },
    {
      id: '2',
      text: 'My tomato plants are showing signs of yellowing leaves and brown spots.',
      sender: 'farmer',
      timestamp: '2024-03-18 10:05',
    },
    {
      id: '3',
      text: 'Could you please share some photos of the affected plants?',
      sender: 'expert',
      timestamp: '2024-03-18 10:07',
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to a backend
      Alert.alert('Message sent', 'Your response has been sent to the farmer.');
      setMessage('');
    }
  };

  const handleStatusChange = (newStatus: 'Pending' | 'In Progress' | 'Resolved') => {
    setStatus(newStatus);
    // In a real app, this would update the status in the backend
    Alert.alert('Status updated', `Consultation status changed to ${newStatus}`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Consultation Details</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.farmerName}>{consultation.farmer}</Text>
            <View style={[styles.statusBadge, { backgroundColor: status === 'Resolved' ? '#4CAF50' : status === 'In Progress' ? '#FFA000' : '#2196F3' }]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Issue Details</Text>
            <Text style={styles.description}>{consultation.description}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Farm Information</Text>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{consultation.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="leaf-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{consultation.cropType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="resize-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{consultation.affectedArea}</Text>
            </View>
          </View>

          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>Update Status</Text>
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[styles.statusButton, status === 'Pending' && styles.statusButtonActive]}
                onPress={() => handleStatusChange('Pending')}
              >
                <Text style={[styles.statusButtonText, status === 'Pending' && styles.statusButtonTextActive]}>Pending</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, status === 'In Progress' && styles.statusButtonActive]}
                onPress={() => handleStatusChange('In Progress')}
              >
                <Text style={[styles.statusButtonText, status === 'In Progress' && styles.statusButtonTextActive]}>In Progress</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, status === 'Resolved' && styles.statusButtonActive]}
                onPress={() => handleStatusChange('Resolved')}
              >
                <Text style={[styles.statusButtonText, status === 'Resolved' && styles.statusButtonTextActive]}>Resolved</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.chatSection}>
          <Text style={styles.sectionTitle}>Conversation</Text>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageContainer,
                msg.sender === 'expert' ? styles.expertMessage : styles.farmerMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.messageTime}>{msg.timestamp}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  farmerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#4CAF50',
  },
  statusButtonText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  chatSection: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  expertMessage: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-end',
  },
  farmerMessage: {
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 