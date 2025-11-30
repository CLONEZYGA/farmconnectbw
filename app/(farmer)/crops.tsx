import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crop categories for filtering
const CROP_CATEGORIES = [
  { id: 'all', name: 'All Crops' },
  { id: 'grains', name: 'Grains & Cereals' },
  { id: 'vegetables', name: 'Vegetables' },
  { id: 'fruits', name: 'Fruits' },
  { id: 'pulses', name: 'Pulses & Beans' },
];

interface Crop {
  id: string;
  name: string;
  variety: string;
  status: 'Planned' | 'Growing' | 'Fruiting' | 'Harvested';
  plantDate: string;
  harvestDate: string;
  area: string;
  location: string;
  healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  imageUrl: string;
  progress: number;
}

export default function CropsScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addCropModalVisible, setAddCropModalVisible] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: '',
    variety: '',
    plantDate: '',
    harvestDate: '',
    area: '',
    location: '',
  });
  const [cropDetailModalVisible, setCropDetailModalVisible] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  // Load user's crops on component mount
  useEffect(() => {
    const loadUserCrops = async () => {
      try {
        const storedCrops = await AsyncStorage.getItem(`crops_${user?.id}`);
        if (storedCrops) {
          setCrops(JSON.parse(storedCrops));
        }
      } catch (error) {
        console.error('Error loading crops:', error);
      }
    };

    if (user?.id) {
      loadUserCrops();
    }
  }, [user?.id]);

  // Navigation items
  const navItems = [
    { name: 'Dashboard', icon: 'home-outline' as const, route: 'index' },
    { name: 'Market', icon: 'basket-outline' as const, route: 'market' },
    { name: 'Chat', icon: 'chatbubble-outline' as const, route: 'advice' },
  ];

  // Handle navigation
  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    
    // Simple mapping of crops to categories
    const cropToCategoryMap: Record<string, string> = {
      'Maize': 'grains',
      'Wheat': 'grains',
      'Rice': 'grains',
      'Tomatoes': 'vegetables',
      'Carrots': 'vegetables',
      'Apples': 'fruits',
      'Bananas': 'fruits',
      'Soybeans': 'pulses',
      'Beans': 'pulses',
    };
    
    const cropCategory = cropToCategoryMap[crop.name] || 'other';
    return matchesSearch && cropCategory === selectedCategory;
  });

  const handleAddCrop = async () => {
    // Validate fields
    if (!newCrop.name || !newCrop.plantDate || !newCrop.area) {
      alert('Please fill in required fields: Crop Name, Planting Date, and Area');
      return;
    }

    // Add new crop
    const id = Date.now().toString();
    const crop: Crop = {
      id,
      ...newCrop,
      status: 'Planned',
      healthStatus: 'Good',
      progress: 0,
      imageUrl: require('../../assets/images/crops.png'),
    };

    const updatedCrops = [...crops, crop];
    setCrops(updatedCrops);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(`crops_${user?.id}`, JSON.stringify(updatedCrops));
    } catch (error) {
      console.error('Error saving crops:', error);
    }

    setNewCrop({
      name: '',
      variety: '',
      plantDate: '',
      harvestDate: '',
      area: '',
      location: '',
    });
    setAddCropModalVisible(false);
  };

  const handleCropPress = (crop: Crop) => {
    setSelectedCrop(crop);
    setCropDetailModalVisible(true);
  };

  const renderCropItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cropCard}
      onPress={() => handleCropPress(item)}
    >
      <View style={styles.cropCardHeader}>
        <View style={styles.cropCardTitleArea}>
          <Text style={styles.cropName}>{item.name}</Text>
          <Text style={styles.cropVariety}>{item.variety}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          item.status === 'Growing' ? styles.growingStatus :
          item.status === 'Fruiting' ? styles.fruitingStatus :
          item.status === 'Harvested' ? styles.harvestedStatus :
          styles.plannedStatus
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.cropImage} />
      )}
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
        <Text style={styles.progressText}>{item.progress}% Complete</Text>
      </View>
      
      <View style={styles.cropDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailLabel}>Planted:</Text>
            <Text style={styles.detailValue}>{item.plantDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.detailLabel}>Harvest:</Text>
            <Text style={styles.detailValue}>{item.harvestDate}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="resize-outline" size={16} color="#666" />
            <Text style={styles.detailLabel}>Area:</Text>
            <Text style={styles.detailValue}>{item.area}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{item.location}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.healthContainer}>
        <Text style={styles.healthLabel}>Health Status:</Text>
        <Text style={[
          styles.healthStatus,
          item.healthStatus === 'Excellent' ? styles.excellentHealth :
          item.healthStatus === 'Good' ? styles.goodHealth :
          item.healthStatus === 'Fair' ? styles.fairHealth :
          styles.poorHealth
        ]}>
          {item.healthStatus}
        </Text>
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
      <Text 
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Crops</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setAddCropModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Crop</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crops..."
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
          data={CROP_CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      <ScrollView style={styles.content}>
        {filteredCrops.length > 0 ? (
          filteredCrops.map(crop => (
            <View key={crop.id}>
              {renderCropItem({item: crop})}
            </View>
          ))
        ) : (
          <View style={styles.noCropsContainer}>
            <Ionicons name="leaf-outline" size={60} color="#ccc" />
            <Text style={styles.noCropsText}>No crops found</Text>
            <Text style={styles.noCropsSubtext}>
              {searchQuery 
                ? "Try a different search term" 
                : "Add your first crop to get started"}
            </Text>
            <TouchableOpacity 
              style={styles.addFirstCropButton}
              onPress={() => setAddCropModalVisible(true)}
            >
              <Text style={styles.addFirstCropButtonText}>Add First Crop</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      {/* Add Crop Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addCropModalVisible}
        onRequestClose={() => setAddCropModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Crop</Text>
              <TouchableOpacity onPress={() => setAddCropModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Crop Name*</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Maize, Tomatoes, etc."
                  value={newCrop.name}
                  onChangeText={(text) => setNewCrop({...newCrop, name: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Variety</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Highland Hybrid, Roma VF, etc."
                  value={newCrop.variety}
                  onChangeText={(text) => setNewCrop({...newCrop, variety: text})}
                />
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Planting Date*</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="YYYY-MM-DD"
                    value={newCrop.plantDate}
                    onChangeText={(text) => setNewCrop({...newCrop, plantDate: text})}
                  />
                </View>
                
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>Expected Harvest</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="YYYY-MM-DD"
                    value={newCrop.harvestDate}
                    onChangeText={(text) => setNewCrop({...newCrop, harvestDate: text})}
                  />
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Area*</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g., 5 hectares"
                    value={newCrop.area}
                    onChangeText={(text) => setNewCrop({...newCrop, area: text})}
                  />
                </View>
                
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>Location</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g., North Field"
                    value={newCrop.location}
                    onChangeText={(text) => setNewCrop({...newCrop, location: text})}
                  />
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.addCropButton}
                onPress={handleAddCrop}
              >
                <Text style={styles.addCropButtonText}>Add Crop</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Crop Details Modal */}
      {selectedCrop && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={cropDetailModalVisible}
          onRequestClose={() => setCropDetailModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedCrop.name} Details</Text>
                <TouchableOpacity onPress={() => setCropDetailModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent}>
                {selectedCrop.imageUrl && (
                  <Image source={{ uri: selectedCrop.imageUrl }} style={styles.detailCropImage} />
                )}
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Crop Information</Text>
                  <View style={styles.detailRow}>
                    <View style={styles.detailFullItem}>
                      <Text style={styles.detailLabel}>Variety:</Text>
                      <Text style={styles.detailValue}>{selectedCrop.variety}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailFullItem}>
                      <Text style={styles.detailLabel}>Status:</Text>
                      <Text style={[
                        styles.detailValue,
                        selectedCrop.status === 'Growing' ? styles.textGrowing :
                        selectedCrop.status === 'Fruiting' ? styles.textFruiting :
                        selectedCrop.status === 'Harvested' ? styles.textHarvested :
                        styles.textPlanned
                      ]}>{selectedCrop.status}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Dates & Location</Text>
                  <View style={styles.detailRow}>
                    <View style={styles.detailFullItem}>
                      <Text style={styles.detailLabel}>Planting Date:</Text>
                      <Text style={styles.detailValue}>{selectedCrop.plantDate}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailFullItem}>
                      <Text style={styles.detailLabel}>Expected Harvest:</Text>
                      <Text style={styles.detailValue}>{selectedCrop.harvestDate}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailFullItem}>
                      <Text style={styles.detailLabel}>Area:</Text>
                      <Text style={styles.detailValue}>{selectedCrop.area}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailFullItem}>
                      <Text style={styles.detailLabel}>Location:</Text>
                      <Text style={styles.detailValue}>{selectedCrop.location}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Health & Progress</Text>
                  <View style={styles.detailRow}>
                    <View style={styles.detailFullItem}>
                      <Text style={styles.detailLabel}>Health Status:</Text>
                      <Text style={[
                        styles.detailValue,
                        selectedCrop.healthStatus === 'Excellent' ? styles.textExcellent :
                        selectedCrop.healthStatus === 'Good' ? styles.textGood :
                        selectedCrop.healthStatus === 'Fair' ? styles.textFair :
                        styles.textPoor
                      ]}>{selectedCrop.healthStatus}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailFullItem}>
                      <Text style={styles.detailLabel}>Growth Progress:</Text>
                      <View style={styles.detailProgressContainer}>
                        <View style={[styles.detailProgressBar, { width: `${selectedCrop.progress}%` }]} />
                      </View>
                      <Text style={styles.detailProgressText}>{selectedCrop.progress}% Complete</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.detailActions}>
                  <TouchableOpacity style={styles.detailActionButton}>
                    <Ionicons name="create-outline" size={18} color="#4CAF50" />
                    <Text style={styles.detailActionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detailActionButton}>
                    <Ionicons name="water-outline" size={18} color="#4CAF50" />
                    <Text style={styles.detailActionText}>Log Activity</Text>
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
  cropCard: {
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
  cropCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cropCardTitleArea: {
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cropVariety: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  growingStatus: {
    backgroundColor: '#E8F5E9',
  },
  fruitingStatus: {
    backgroundColor: '#FFF8E1',
  },
  harvestedStatus: {
    backgroundColor: '#E3F2FD',
  },
  plannedStatus: {
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cropImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  cropDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  healthLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  healthStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  excellentHealth: {
    color: '#4CAF50',
  },
  goodHealth: {
    color: '#8BC34A',
  },
  fairHealth: {
    color: '#FFC107',
  },
  poorHealth: {
    color: '#F44336',
  },
  noCropsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noCropsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  noCropsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  addFirstCropButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addFirstCropButtonText: {
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
  addCropButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  addCropButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailCropImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailSection: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailFullItem: {
    flex: 1,
  },
  detailProgressContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  detailProgressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  detailProgressText: {
    fontSize: 12,
    color: '#666',
  },
  textGrowing: {
    color: '#4CAF50',
  },
  textFruiting: {
    color: '#FF9800',
  },
  textHarvested: {
    color: '#2196F3',
  },
  textPlanned: {
    color: '#9E9E9E',
  },
  textExcellent: {
    color: '#4CAF50',
  },
  textGood: {
    color: '#8BC34A',
  },
  textFair: {
    color: '#FFC107',
  },
  textPoor: {
    color: '#F44336',
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