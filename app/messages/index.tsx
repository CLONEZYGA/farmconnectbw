import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = 'messages';

export default function MessagesScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedReceiver, setSelectedReceiver] = useState<{id: string; name: string} | null>(null);

  // Load messages
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const storedMessages = await SecureStore.getItemAsync(STORAGE_KEY);
      if (storedMessages) {
        const parsedMessages: Message[] = JSON.parse(storedMessages);
        // Filter messages for current user
        const userMessages = parsedMessages.filter(
          msg => msg.senderId === user?.id || msg.receiverId === user?.id
        );
        setMessages(userMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedReceiver) {
      Alert.alert('Error', 'Please select a receiver and enter a message');
      return;
    }

    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user?.id || '',
        senderName: user?.name || '',
        senderRole: user?.role || '',
        receiverId: selectedReceiver.id,
        receiverName: selectedReceiver.name,
        content: newMessage.trim(),
        timestamp: Date.now(),
        read: false,
      };

      // Get existing messages
      const storedMessages = await SecureStore.getItemAsync(STORAGE_KEY);
      const existingMessages: Message[] = storedMessages ? JSON.parse(storedMessages) : [];
      
      // Add new message
      const updatedMessages = [...existingMessages, message];
      
      // Save to storage
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updatedMessages));
      
      // Update state
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const updatedMessages = messages.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      );
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUserSender = item.senderId === user?.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.messageContainer,
          isUserSender ? styles.sentMessage : styles.receivedMessage,
          !item.read && !isUserSender && styles.unreadMessage,
        ]}
        onPress={() => !item.read && !isUserSender && markAsRead(item.id)}
      >
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>
            {isUserSender ? 'You' : item.senderName}
            <Text style={styles.roleTag}> ({item.senderRole})</Text>
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
        <Text style={styles.messageContent}>{item.content}</Text>
        {!item.read && !isUserSender && (
          <View style={styles.unreadIndicator} />
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        {user?.role === 'expert' && (
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="#4CAF50" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Ionicons name="send" size={24} color="#fff" />
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  unreadMessage: {
    backgroundColor: '#E3F2FD',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  roleTag: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  messageContent: {
    fontSize: 16,
    color: '#333',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
}); 