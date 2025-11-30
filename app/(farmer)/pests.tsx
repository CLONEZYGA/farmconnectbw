import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

// Sample pest alerts data
const SAMPLE_ALERTS = [
  {
    id: '1',
    title: 'Fall Armyworm Alert',
    description: 'Fall armyworm infestations reported in the southern region. Check your maize crops for signs of damage.',
    severity: 'High',
    date: '2023-06-10',
    affected: 'Maize, Sorghum',
    regions: ['Southern', 'South-East'],
    imageUrl: 'https://www.cabi.org/wp-content/uploads/fall-armyworm-1.jpg',
  },
  {
    id: '2',
    title: 'Aphid Infestation',
    description: 'Increasing aphid populations observed on vegetable crops. Early intervention recommended.',
    severity: 'Medium',
    date: '2023-06-08',
    affected: 'Tomatoes, Cabbages, Leafy Vegetables',
    regions: ['Central', 'North-East'],
    imageUrl: 'https://ucanr.edu/blogs/sloCrops/blogfiles/32239_original.jpg',
  },
  {
    id: '3',
    title: 'Locust Swarm Warning',
    description: 'Potential locust swarm moving towards the northern regions. Prepare control measures.',
    severity: 'High',
    date: '2023-06-05',
    affected: 'Multiple Crops',
    regions: ['Northern', 'North-West'],
    imageUrl: 'https://cdn.downtoearth.org.in/library/large/2020-02-03/0.46019000_1580732275_46413.jpg',
  },
];

// Pest categories for reporting
const PEST_CATEGORIES = [
  { id: 'insects', name: 'Insects & Mites', icon: 'bug-outline' },
  { id: 'diseases', name: 'Diseases', icon: 'leaf-outline' },
  { id: 'weeds', name: 'Weeds', icon: 'flower-outline' },
  { id: 'vertebrates', name: 'Vertebrate Pests', icon: 'paw-outline' },
  { id: 'unknown', name: 'Unknown', icon: 'help-circle-outline' },
];

export default function PestScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const [alerts, setAlerts] = useState(SAMPLE_ALERTS);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedPestCategory, setSelectedPestCategory] = useState(null);
  const [reportDescription, setReportDescription] = useState('');
  const [reportLocation, setReportLocation] = useState('');

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

  // Function to handle pest report submission
  const handleSubmitReport = () => {
    console.log('Report submitted:', {
      category: selectedPestCategory,
      description: reportDescription,
      location: reportLocation,
    });
    // Reset form
    setSelectedPestCategory(null);
    setReportDescription('');
    setReportLocation('');
    setReportModalVisible(false);
    // In a real app, this would send the report to a backend service
  };

  // Function to render a single alert item
  const renderAlertItem = ({ item }) => (
    <TouchableOpacity style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleContainer}>
          <Text style={styles.alertTitle}>{item.title}</Text>
          <View style={[
            styles.severityBadge, 
            item.severity === 'High' ? styles.highSeverity : 
            item.severity === 'Medium' ? styles.mediumSeverity : 
            styles.lowSeverity
          ]}>
            <Text style={styles.severityText}>{item.severity}</Text>
          </View>
        </View>
        <Text style={styles.alertDate}>{item.date}</Text>
      </View>
      
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.alertImage} />
      )}
      
      <Text style={styles.alertDescription}>{item.description}</Text>
      
      <View style={styles.alertDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Affected Crops:</Text>
          <Text style={styles.detailValue}>{item.affected}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Affected Regions:</Text>
          <Text style={styles.detailValue}>{item.regions.join(', ')}</Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="information-circle-outline" size={18} color="#4CAF50" />
          <Text style={styles.actionButtonText}>More Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={18} color="#4CAF50" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Function to render a pest category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem, 
        selectedPestCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => setSelectedPestCategory(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={24} 
        color={selectedPestCategory === item.id ? '#fff' : '#4CAF50'} 
      />
      <Text 
        style={[
          styles.categoryText, 
          selectedPestCategory === item.id && styles.selectedCategoryText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pest Alerts</Text>
          <TouchableOpacity onPress={() => setReportModalVisible(true)}>
            <View style={styles.reportButton}>
              <Ionicons name="add-circle" size={18} color="#fff" />
              <Text style={styles.reportButtonText}>Report</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="notifications-outline" size={22} color="#4CAF50" />
              <Text style={styles.settingText}>Enable Pest Alerts</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d1d1', true: '#a5d6a7' }}
              thumbColor={notificationsEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Ionicons name="location-outline" size={22} color="#4CAF50" />
              <Text style={styles.settingText}>Share Location for Local Alerts</Text>
            </View>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: '#d1d1d1', true: '#a5d6a7' }}
              thumbColor={locationSharing ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.alertsContainer}>
          <Text style={styles.sectionTitle}>Current Alerts</Text>
          <FlatList
            data={alerts}
            renderItem={renderAlertItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Pest Management Tips</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb-outline" size={22} color="#FF9800" />
              <Text style={styles.tipTitle}>Integrated Pest Management</Text>
            </View>
            <Text style={styles.tipContent}>
              Implement a combination of cultural, biological, and chemical controls for sustainable pest management. Monitor crops regularly and identify pests early for effective control.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="flask-outline" size={22} color="#FF9800" />
              <Text style={styles.tipTitle}>Safe Pesticide Use</Text>
            </View>
            <Text style={styles.tipContent}>
              Always follow label instructions when using pesticides. Wear appropriate protective equipment and observe pre-harvest intervals to ensure food safety.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Report Pest Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report a Pest Issue</Text>
              <TouchableOpacity onPress={() => setReportModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.formLabel}>Pest Category:</Text>
              <FlatList
                data={PEST_CATEGORIES}
                renderItem={renderCategoryItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesList}
              />
              
              <Text style={styles.formLabel}>Description of Issue:</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe what you're seeing (symptoms, crop affected, extent of damage, etc.)"
                value={reportDescription}
                onChangeText={setReportDescription}
                multiline
                numberOfLines={4}
              />
              
              <Text style={styles.formLabel}>Location:</Text>
              <View style={styles.locationInput}>
                <TextInput
                  style={styles.locationTextInput}
                  placeholder="Enter location or use current location"
                  value={reportLocation}
                  onChangeText={setReportLocation}
                />
                <TouchableOpacity style={styles.locationButton}>
                  <Ionicons name="location" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.formLabel}>Add Photos (Optional):</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons name="camera-outline" size={24} color="#4CAF50" />
                <Text style={styles.uploadButtonText}>Take Photo or Choose from Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!selectedPestCategory || !reportDescription) && styles.disabledButton
                ]}
                onPress={handleSubmitReport}
                disabled={!selectedPestCategory || !reportDescription}
              >
                <Text style={styles.submitButtonText}>Submit Report</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reportButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  alertsContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  highSeverity: {
    backgroundColor: '#FFEBEE',
  },
  mediumSeverity: {
    backgroundColor: '#FFF8E1',
  },
  lowSeverity: {
    backgroundColor: '#E8F5E9',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  alertDate: {
    fontSize: 14,
    color: '#666',
  },
  alertImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  alertDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  alertDetails: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailItem: {
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
  },
  tipsContainer: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: 8,
  },
  tipContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalContent: {
    padding: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  categoriesList: {
    flexGrow: 0,
    marginBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  locationInput: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  locationTextInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  locationButton: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#a5d6a7',
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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