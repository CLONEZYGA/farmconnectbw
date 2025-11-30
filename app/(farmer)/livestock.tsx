import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

// Sample livestock data
const SAMPLE_LIVESTOCK = [
  {
    id: '1',
    type: 'Cattle',
    breed: 'Holstein',
    count: 12,
    healthStatus: 'Healthy',
    location: 'Main Pasture',
    lastCheckup: '2023-05-20',
    notes: 'Due for vaccination next month',
    imageUrl: 'https://cdn.britannica.com/55/174255-050-526314B6/brown-Guernsey-cow.jpg',
  },
  {
    id: '2',
    type: 'Goats',
    breed: 'Boer',
    count: 25,
    healthStatus: 'Good',
    location: 'East Field',
    lastCheckup: '2023-05-15',
    notes: 'Two females pregnant, expected delivery in August',
    imageUrl: 'https://cdn.britannica.com/07/183407-050-C35648B5/Boer-goat-South-Africa.jpg',
  },
  {
    id: '3',
    type: 'Chickens',
    breed: 'Rhode Island Red',
    count: 50,
    healthStatus: 'Fair',
    location: 'Poultry House 1',
    lastCheckup: '2023-05-18',
    notes: 'Some respiratory issues observed, treatment in progress',
    imageUrl: 'https://cdn.britannica.com/88/76088-050-1344C478/Rhode-Island-Red-roosters-hens.jpg',
  },
];

// Livestock categories for filtering
const LIVESTOCK_CATEGORIES = [
  { id: 'all', name: 'All Livestock' },
  { id: 'cattle', name: 'Cattle' },
  { id: 'goats', name: 'Goats & Sheep' },
  { id: 'poultry', name: 'Poultry' },
  { id: 'pigs', name: 'Pigs' },
];

export default function LivestockScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const [livestock, setLivestock] = useState(SAMPLE_LIVESTOCK);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newLivestock, setNewLivestock] = useState({
    type: '',
    breed: '',
    count: '',
    location: '',
    healthStatus: 'Healthy',
    notes: '',
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedLivestock, setSelectedLivestock] = useState(null);

  // Navigation items
  const navItems = [
    { name: 'Dashboard', icon: 'home-outline' as const, route: 'index' },
    { name: 'Market', icon: 'basket-outline' as const, route: 'market' },
    { name: 'Chat', icon: 'chatbubble-outline' as const, route: 'advice' },
  ];

  // Handle navigation
  const handleNavigation = (route) => {
    router.push(route);
  };

  const filteredLivestock = livestock.filter(item => {
    const matchesSearch = 
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    
    // Simple mapping of livestock to categories
    const typeToCategory = {
      'Cattle': 'cattle',
      'Goats': 'goats',
      'Sheep': 'goats',
      'Chickens': 'poultry',
      'Ducks': 'poultry',
      'Pigs': 'pigs',
    };
    
    return matchesSearch && typeToCategory[item.type] === selectedCategory;
  });

  const handleAddLivestock = () => {
    // Validate fields
    if (!newLivestock.type || !newLivestock.count) {
      alert('Please fill in required fields: Type and Count');
      return;
    }

    // Add new livestock
    const id = Date.now().toString();
    const lastCheckup = new Date().toISOString().split('T')[0];
    const item = {
      id,
      ...newLivestock,
      lastCheckup,
      imageUrl: 'https://via.placeholder.com/150',
    };

    setLivestock([...livestock, item]);
    setNewLivestock({
      type: '',
      breed: '',
      count: '',
      location: '',
      healthStatus: 'Healthy',
      notes: '',
    });
    setAddModalVisible(false);
  };

  const handleItemPress = (item) => {
    setSelectedLivestock(item);
    setDetailModalVisible(true);
  };

  const renderLivestockItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.livestockCard}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.livestockType}>{item.type}</Text>
          <Text style={styles.livestockBreed}>{item.breed}</Text>
        </View>
        <View style={styles.countContainer}>
          <Text style={styles.countValue}>{item.count}</Text>
          <Text style={styles.countLabel}>head</Text>
        </View>
      </View>
      
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.livestockImage} />
      )}
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{item.location}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="medkit-outline" size={16} color="#666" />
            <Text style={styles.infoLabel}>Health:</Text>
            <Text style={[
              styles.infoValue,
              item.healthStatus === 'Healthy' ? styles.healthyStatus : 
              item.healthStatus === 'Good' ? styles.goodStatus :
              item.healthStatus === 'Fair' ? styles.fairStatus :
              styles.poorStatus
            ]}>
              {item.healthStatus}
            </Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoLabel}>Last Check:</Text>
            <Text style={styles.infoValue}>{item.lastCheckup}</Text>
          </View>
        </View>
      </View>
      
      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
      
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={18} color="#4CAF50" />
          <Text style={styles.actionText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="medical-outline" size={18} color="#4CAF50" />
          <Text style={styles.actionText}>Health Log</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Livestock</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search livestock..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={LIVESTOCK_CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      <ScrollView style={styles.content}>
        {filteredLivestock.length > 0 ? (
          filteredLivestock.map(item => (
            <View key={item.id}>
              {renderLivestockItem({item})}
            </View>
          ))
        ) : (
          <View style={styles.noItemsContainer}>
            <Ionicons name="paw-outline" size={60} color="#ccc" />
            <Text style={styles.noItemsText}>No livestock found</Text>
            <Text style={styles.noItemsSubtext}>
              {searchQuery 
                ? "Try a different search term" 
                : "Add your first livestock to get started"}
            </Text>
            <TouchableOpacity 
              style={styles.addFirstButton}
              onPress={() => setAddModalVisible(true)}
            >
              <Text style={styles.addFirstButtonText}>Add Livestock</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      {/* Add Livestock Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Livestock</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Type*</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Cattle, Goats, Chickens, etc."
                  value={newLivestock.type}
                  onChangeText={(text) => setNewLivestock({...newLivestock, type: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Breed</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Holstein, Boer, Rhode Island Red, etc."
                  value={newLivestock.breed}
                  onChangeText={(text) => setNewLivestock({...newLivestock, breed: text})}
                />
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Count*</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Number of animals"
                    keyboardType="numeric"
                    value={newLivestock.count}
                    onChangeText={(text) => setNewLivestock({...newLivestock, count: text})}
                  />
                </View>
                
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>Health Status</Text>
                  <View style={styles.healthStatusContainer}>
                    {['Healthy', 'Good', 'Fair', 'Poor'].map(status => (
                      <TouchableOpacity 
                        key={status}
                        style={[
                          styles.healthStatusOption,
                          newLivestock.healthStatus === status && styles.selectedHealthStatus
                        ]}
                        onPress={() => setNewLivestock({...newLivestock, healthStatus: status})}
                      >
                        <Text style={[
                          styles.healthStatusText,
                          newLivestock.healthStatus === status && styles.selectedHealthStatusText
                        ]}>
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Location</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., North Pasture, Poultry House, etc."
                  value={newLivestock.location}
                  onChangeText={(text) => setNewLivestock({...newLivestock, location: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Any additional information..."
                  multiline
                  numberOfLines={4}
                  value={newLivestock.notes}
                  onChangeText={(text) => setNewLivestock({...newLivestock, notes: text})}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.addButton2}
                onPress={handleAddLivestock}
              >
                <Text style={styles.addButtonText2}>Add Livestock</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Livestock Details Modal */}
      {selectedLivestock && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={detailModalVisible}
          onRequestClose={() => setDetailModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedLivestock.type} Details
                </Text>
                <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent}>
                {selectedLivestock.imageUrl && (
                  <Image 
                    source={{ uri: selectedLivestock.imageUrl }} 
                    style={styles.detailImage} 
                  />
                )}
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Basic Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type:</Text>
                    <Text style={styles.detailValue}>{selectedLivestock.type}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Breed:</Text>
                    <Text style={styles.detailValue}>{selectedLivestock.breed}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Count:</Text>
                    <Text style={styles.detailValue}>{selectedLivestock.count} head</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{selectedLivestock.location}</Text>
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Health Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Health Status:</Text>
                    <Text style={[
                      styles.detailValue,
                      selectedLivestock.healthStatus === 'Healthy' ? styles.healthyText :
                      selectedLivestock.healthStatus === 'Good' ? styles.goodText :
                      selectedLivestock.healthStatus === 'Fair' ? styles.fairText :
                      styles.poorText
                    ]}>
                      {selectedLivestock.healthStatus}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Last Checkup:</Text>
                    <Text style={styles.detailValue}>{selectedLivestock.lastCheckup}</Text>
                  </View>
                </View>
                
                {selectedLivestock.notes && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Notes</Text>
                    <Text style={styles.detailNotes}>{selectedLivestock.notes}</Text>
                  </View>
                )}
                
                <View style={styles.detailActions}>
                  <TouchableOpacity style={styles.detailActionButton}>
                    <Ionicons name="create-outline" size={18} color="#4CAF50" />
                    <Text style={styles.detailActionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detailActionButton}>
                    <Ionicons name="document-text-outline" size={18} color="#4CAF50" />
                    <Text style={styles.detailActionText}>Health Records</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detailActionButton}>
                    <Ionicons name="trash-outline" size={18} color="#f44336" />
                    <Text style={[styles.detailActionText, { color: '#f44336' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
      
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#4CAF50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  livestockCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  livestockType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  livestockBreed: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  countContainer: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  countLabel: {
    fontSize: 12,
    color: '#4CAF50',
  },
  livestockImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  healthyStatus: {
    color: '#4CAF50',
  },
  goodStatus: {
    color: '#8BC34A',
  },
  fairStatus: {
    color: '#FFC107',
  },
  poorStatus: {
    color: '#F44336',
  },
  notesContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
  },
  noItemsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noItemsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  noItemsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  healthStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthStatusOption: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
  },
  selectedHealthStatus: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  healthStatusText: {
    fontSize: 12,
    color: '#666',
  },
  selectedHealthStatusText: {
    color: '#fff',
  },
  addButton2: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  addButtonText2: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailSection: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  healthyText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  goodText: {
    color: '#8BC34A',
    fontWeight: '500',
  },
  fairText: {
    color: '#FFC107',
    fontWeight: '500',
  },
  poorText: {
    color: '#F44336',
    fontWeight: '500',
  },
  detailNotes: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  detailActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  detailActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  detailActionText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activeNavText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
}); 