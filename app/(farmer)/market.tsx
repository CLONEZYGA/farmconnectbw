import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import FarmerNavigation from '../../components/FarmerNavigation';

interface MarketListing {
  id: string;
  name: string;
  selling?: string;
  buying?: string;
  price: string;
  location: string;
  type: 'seller' | 'buyer';
}

const marketListings: MarketListing[] = [
  {
    id: '1',
    name: 'Sunny Farms',
    selling: 'Maize, Sorghum',
    price: 'BWP 200 per bag',
    location: 'Mahalapye',
    type: 'seller',
  },
  {
    id: '2',
    name: 'GreenLeaf Organics',
    selling: 'Organic Vegetables',
    price: 'BWP 150 per kg',
    location: 'Lobatse',
    type: 'seller',
  },
  {
    id: '3',
    name: 'ABC Agro Traders',
    buying: 'Maize, Beans, Wheat',
    price: 'Varies, Negotiable',
    location: 'Gaborone',
    type: 'buyer',
  },
  {
    id: '4',
    name: 'GreenHarvest Ltd.',
    buying: 'Organic Fruits, Vegetables',
    price: 'BWP 220 per ton',
    location: 'Francistown',
    type: 'buyer',
  },
];

// Sample product data
const PRODUCTS = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    price: 25.00,
    quantity: '5 kg',
    seller: 'Green Valley Farm',
    location: 'Gaborone',
    image: 'https://images.unsplash.com/photo-1592924357121-9d570f617bcc?q=80&w=1000&auto=format&fit=crop',
    description: 'Organic, locally grown tomatoes. Perfect for salads and cooking.',
  },
  {
    id: '2',
    name: 'Cabbage',
    price: 15.50,
    quantity: '2 kg',
    seller: 'Sunshine Fields',
    location: 'Francistown',
    image: 'https://images.unsplash.com/photo-1594282486552-05a9f303caf9?q=80&w=1000&auto=format&fit=crop',
    description: 'Fresh green cabbage. Great for salads and coleslaw.',
  },
  {
    id: '3',
    name: 'Potatoes',
    price: 20.00,
    quantity: '10 kg',
    seller: 'Hillside Farm',
    location: 'Maun',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop',
    description: 'Fresh potatoes, perfect for boiling, mashing, or roasting.',
  },
  {
    id: '4',
    name: 'Spinach',
    price: 12.00,
    quantity: '1 kg',
    seller: 'Green Acres',
    location: 'Serowe',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=1000&auto=format&fit=crop',
    description: 'Fresh, leafy spinach. Rich in iron and vitamins.',
  },
];

export default function FarmerMarketScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const sellers = marketListings.filter(listing => listing.type === 'seller');
  const buyers = marketListings.filter(listing => listing.type === 'buyer');

  // Filter products based on search query
  const filteredProducts = PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.location.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Function to handle chat button
  const handleChatButton = (seller) => {
    // Navigate to chat screen with seller info and initial message
    router.push({
      pathname: '/(farmer)/chat',
      params: { 
        sellerId: seller.id, 
        sellerName: seller.name,
        initialMessage: `Hello, I'm interested in your offer for ${seller.type === 'seller' ? seller.selling : seller.buying}.`
      }
    });
  };

  // Function to handle contact button
  const handleContactButton = (seller) => {
    setSelectedSeller(seller);
    setContactModalVisible(true);
  };

  // Render product item
  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => {
        setSelectedProduct(item);
        setModalVisible(true);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>P {item.price.toFixed(2)}</Text>
        <Text style={styles.productQuantity}>{item.quantity}</Text>
        <View style={styles.sellerContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.sellerText}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Market</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/(farmer)/market/add')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="cart-outline" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up-outline" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>BWP 2,500</Text>
            <Text style={styles.statLabel}>Today's Sales</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Listings</Text>
          <View style={styles.listingsContainer}>
            {sellers.map(seller => (
              <View key={seller.id} style={styles.listingCard}>
                <View style={styles.listingInfo}>
                  <Text style={styles.listingName}>{seller.name}</Text>
                  <View style={styles.listingDetail}>
                    <Ionicons name="leaf-outline" size={16} color="green" />
                    <Text style={styles.listingText}>Selling: {seller.selling}</Text>
                  </View>
                  <View style={styles.listingDetail}>
                    <Ionicons name="cash-outline" size={16} color="orange" />
                    <Text style={styles.listingText}>Price: {seller.price}</Text>
                  </View>
                  <View style={styles.listingDetail}>
                    <Ionicons name="location-outline" size={16} color="red" />
                    <Text style={styles.listingText}>Location: {seller.location}</Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.chatButton}
                    onPress={() => handleChatButton(seller)}
                  >
                    <Text style={styles.buttonText}>Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => handleContactButton(seller)}
                  >
                    <Text style={styles.buttonText}>Contact</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {/* Add your recent orders list here */}
        </View>
      </ScrollView>
      <FarmerNavigation />

      {/* Product Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-outline" size={24} color="#333" />
            </TouchableOpacity>
            
            {selectedProduct && (
              <ScrollView>
                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                <View style={styles.modalDetails}>
                  <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                  <Text style={styles.modalProductPrice}>P {selectedProduct.price.toFixed(2)}</Text>
                  <Text style={styles.modalQuantity}>Quantity: {selectedProduct.quantity}</Text>
                  
                  <View style={styles.sellerInfo}>
                    <Text style={styles.sellerTitle}>Seller:</Text>
                    <Text style={styles.sellerName}>{selectedProduct.seller}</Text>
                    <View style={styles.locationContainer}>
                      <Ionicons name="location-outline" size={16} color="#666" />
                      <Text style={styles.locationText}>{selectedProduct.location}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.descriptionTitle}>Description:</Text>
                  <Text style={styles.descriptionText}>{selectedProduct.description}</Text>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.contactButton}>
                      <Ionicons name="chatbubble-outline" size={18} color="white" />
                      <Text style={styles.contactButtonText}>Contact Seller</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.buyButton}>
                      <Ionicons name="cart-outline" size={18} color="white" />
                      <Text style={styles.buyButtonText}>Buy Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Contact Information Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={contactModalVisible}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.contactModalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setContactModalVisible(false)}
            >
              <Ionicons name="close-outline" size={24} color="#333" />
            </TouchableOpacity>
            
            {selectedSeller && (
              <ScrollView>
                <Text style={styles.contactModalTitle}>{selectedSeller.name}</Text>
                
                <View style={styles.contactItem}>
                  <Ionicons name="person-outline" size={24} color="#4CAF50" style={styles.contactIcon} />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Contact Person</Text>
                    <Text style={styles.contactValue}>John {selectedSeller.name.split(' ')[0]}</Text>
                  </View>
                </View>
                
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={24} color="#4CAF50" style={styles.contactIcon} />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Phone</Text>
                    <Text style={styles.contactValue}>+267 7{Math.floor(1000000 + Math.random() * 9000000)}</Text>
                  </View>
                </View>
                
                <View style={styles.contactItem}>
                  <Ionicons name="mail-outline" size={24} color="#4CAF50" style={styles.contactIcon} />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>contact@{selectedSeller.name.toLowerCase().replace(/\s+/g, '')}farms.com</Text>
                  </View>
                </View>
                
                <View style={styles.contactItem}>
                  <Ionicons name="location-outline" size={24} color="#4CAF50" style={styles.contactIcon} />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Address</Text>
                    <Text style={styles.contactValue}>Plot 1234, {selectedSeller.location} Agricultural Area</Text>
                  </View>
                </View>
                
                <View style={styles.contactItem}>
                  <Ionicons name="calendar-outline" size={24} color="#4CAF50" style={styles.contactIcon} />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Business Hours</Text>
                    <Text style={styles.contactValue}>Monday to Friday: 8:00 AM - 5:00 PM</Text>
                    <Text style={styles.contactValue}>Saturday: 8:00 AM - 12:00 PM</Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.callButton} onPress={() => {}}>
                  <Ionicons name="call" size={20} color="#fff" />
                  <Text style={styles.callButtonText}>Call Now</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  listingsContainer: {
    gap: 10,
  },
  listingCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listingInfo: {
    marginBottom: 10,
  },
  listingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  listingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  listingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  contactButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
  },
  modalImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  modalDetails: {
    padding: 16,
  },
  modalProductName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalProductPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  modalQuantity: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  sellerInfo: {
    backgroundColor: '#f5f5f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sellerTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 8,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
  },
  contactModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '70%',
  },
  contactModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  contactIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
}); 