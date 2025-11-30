import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Sample chat data
const SAMPLE_CHATS = [
  {
    id: '1',
    name: 'Agricultural Expert',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'I can help with your crop rotation question',
    time: '10:30 AM',
    unread: 2,
    role: 'expert'
  },
  {
    id: '2',
    name: 'Sunny Farms',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'The maize is still available for purchase',
    time: 'Yesterday',
    unread: 0,
    role: 'seller'
  },
  {
    id: '3',
    name: 'GreenLeaf Organics',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
    lastMessage: 'Organic fertilizers will be delivered tomorrow',
    time: '2 days ago',
    unread: 0,
    role: 'seller'
  },
  {
    id: '4',
    name: 'Irrigation Support',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    lastMessage: 'Your scheduled maintenance is tomorrow',
    time: '3 days ago',
    unread: 1,
    role: 'support'
  }
];

// Sample messages for a conversation
const SAMPLE_MESSAGES = [
  {
    id: 'm1',
    text: 'Hello, I am an agricultural expert. How can I help you today?',
    sender: 'expert',
    time: '10:00 AM',
    date: 'Today'
  },
  {
    id: 'm2',
    text: 'I have questions about crop rotation for my maize field.',
    sender: 'user',
    time: '10:05 AM',
    date: 'Today'
  },
  {
    id: 'm3',
    text: 'Crop rotation is essential for soil health. What crops are you currently growing?',
    sender: 'expert',
    time: '10:10 AM',
    date: 'Today'
  },
  {
    id: 'm4',
    text: 'Currently just maize, but I want to plan for next season.',
    sender: 'user',
    time: '10:15 AM',
    date: 'Today'
  },
  {
    id: 'm5',
    text: 'For maize, I recommend rotating with legumes like beans or soybeans. They add nitrogen to the soil that was depleted by maize.',
    sender: 'expert',
    time: '10:20 AM',
    date: 'Today'
  }
];

export default function ChatScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();
  
  const [chats, setChats] = useState(SAMPLE_CHATS);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if we have params from navigation (from market screen)
  useEffect(() => {
    if (params.sellerId && params.sellerName) {
      // Find if seller already exists in chats
      const existingSeller = chats.find(chat => chat.id === params.sellerId);
      
      if (existingSeller) {
        // If seller exists, set as active chat
        handleChatSelect(existingSeller, params.initialMessage);
      } else {
        // If seller doesn't exist, create a new chat
        const newSeller = {
          id: params.sellerId,
          name: params.sellerName,
          avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
          lastMessage: params.initialMessage || 'New conversation',
          time: 'Just now',
          unread: 0,
          role: 'seller'
        };
        
        setChats(prevChats => [newSeller, ...prevChats]);
        handleChatSelect(newSeller, params.initialMessage);
      }
    }
  }, [params]);

  const handleChatSelect = (chat, initialMessage = null) => {
    setActiveChat(chat);
    setIsLoading(true);
    
    // Simulate loading messages with a longer timeout for stability
    setTimeout(() => {
      if (initialMessage) {
        // If coming from market with an initial message
        const initialUserMessage = {
          id: `m${Date.now()}`,
          text: initialMessage,
          sender: 'user',
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          date: 'Today'
        };
        
        const sellerResponse = {
          id: `m${Date.now() + 1}`,
          text: `Thank you for your interest! Yes, we currently have this available. Would you like more information?`,
          sender: 'expert',
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          date: 'Today'
        };
        
        // Set both messages at once to prevent flickering
        setMessages([sellerResponse, initialUserMessage]);
      } else {
        // For normal chat selection, use sample messages
        setMessages(SAMPLE_MESSAGES);
      }
      
      // Mark as read
      setChats(prevChats => 
        prevChats.map(c => 
          c.id === chat.id ? {...c, unread: 0} : c
        )
      );
      
      // Set loading to false after all state updates
      setIsLoading(false);
    }, 1500); // Increased timeout for more stability
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: `m${Date.now()}`,
      text: newMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      date: 'Today'
    };
    
    // Add message to conversation
    setMessages(prevMessages => [newMsg, ...prevMessages]);
    
    // Update last message in chat list
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChat.id 
          ? {...chat, lastMessage: newMessage, time: 'Just now'} 
          : chat
      )
    );
    
    setNewMessage('');
    
    // Simulate response
    setTimeout(() => {
      const responseMsg = {
        id: `m${Date.now() + 1}`,
        text: "I'll check and get back to you shortly on this request.",
        sender: 'expert',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        date: 'Today'
      };
      
      setMessages(prevMessages => [responseMsg, ...prevMessages]);
    }, 2000);
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.chatItem,
        activeChat?.id === item.id && styles.activeChatItem
      ]} 
      onPress={() => handleChatSelect(item)}
    >
      <View style={styles.chatAvatar}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.role === 'expert' && (
          <View style={styles.expertBadge}>
            <Ionicons name="star" size={10} color="#fff" />
          </View>
        )}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.otherMessage
    ]}>
      {item.sender !== 'user' && (
        <Image 
          source={{ uri: activeChat?.avatar }}
          style={styles.messageAvatar}
        />
      )}
      
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.otherBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </View>
  );

  // Navigation items
  const navItems = [
    { name: 'Dashboard', icon: 'home-outline', route: '/(farmer)/' },
    { name: 'Market', icon: 'cart-outline', route: '/(farmer)/market' },
    { name: 'Chat', icon: 'chatbubbles-outline', route: '/(farmer)/chat' },
    { name: 'Settings', icon: 'settings-outline', route: '/(farmer)/settings' },
  ];

  // Handle navigation
  const handleNavigation = (route) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {!activeChat ? (
          // Chat list view
          <>
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
            />
            
            <View style={styles.chatTypeContainer}>
              <TouchableOpacity style={[styles.chatTypeButton, styles.activeChatType]}>
                <Text style={styles.activeChatTypeText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatTypeButton}>
                <Text style={styles.chatTypeText}>Experts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatTypeButton}>
                <Text style={styles.chatTypeText}>Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatTypeButton}>
                <Text style={styles.chatTypeText}>Sellers</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={chats}
              renderItem={renderChatItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.chatList}
            />
            
            <TouchableOpacity style={styles.newChatButton}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          // Active chat view
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={styles.chatHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setActiveChat(null)}
              >
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              
              <View style={styles.activeChatInfo}>
                <Image source={{ uri: activeChat.avatar }} style={styles.activeChatAvatar} />
                <View>
                  <Text style={styles.activeChatName}>{activeChat.name}</Text>
                  <Text style={styles.activeChatStatus}>
                    {activeChat.role === 'expert' ? 'Agricultural Expert' : 
                     activeChat.role === 'support' ? 'Support Agent' : 'Seller'}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call-outline" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </View>
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
                <Text style={styles.loadingText}>Loading conversation...</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={messages}
                  renderItem={renderMessage}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.messageList}
                  inverted
                />
                
                <View style={styles.inputContainer}>
                  <TouchableOpacity style={styles.attachButton}>
                    <Ionicons name="attach" size={24} color="#666" />
                  </TouchableOpacity>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                  />
                  
                  <TouchableOpacity 
                    style={[
                      styles.sendButton,
                      newMessage.trim() === '' && styles.disabledSendButton
                    ]}
                    onPress={handleSendMessage}
                    disabled={newMessage.trim() === ''}
                  >
                    <Ionicons 
                      name="send" 
                      size={20} 
                      color={newMessage.trim() === '' ? '#ccc' : '#fff'} 
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        )}
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => handleNavigation(item.route)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={pathname === item.route ? '#4CAF50' : '#666'}
            />
            <Text
              style={[
                styles.navText,
                pathname === item.route && styles.activeNavText,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
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
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  searchInput: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  chatTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chatTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  activeChatType: {
    backgroundColor: '#4CAF50',
  },
  chatTypeText: {
    color: '#666',
  },
  activeChatTypeText: {
    color: '#fff',
    fontWeight: '500',
  },
  chatList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
  },
  activeChatItem: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  chatAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  expertBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  newChatButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  activeChatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  activeChatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  activeChatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeChatStatus: {
    fontSize: 12,
    color: '#666',
  },
  callButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginBottom: 8,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
    color: props => props.sender === 'user' ? '#fff' : '#333',
  },
  messageTime: {
    fontSize: 12,
    color: props => props.sender === 'user' ? '#E0E0E0' : '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: '#f0f0f0',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#4CAF50',
  },
}); 