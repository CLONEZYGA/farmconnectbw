import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Switch,
  Alert,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

interface FarmDetails {
  size: string;
  mainCrops: string[];
  yearEstablished: string;
}

interface FarmerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  farmDetails: FarmDetails;
  notificationSettings: {
    marketUpdates: boolean;
    weatherAlerts: boolean;
    expertAdvice: boolean;
    cropReminders: boolean;
  };
}

const navItems = [
  { name: 'Dashboard', icon: 'home-outline' as const, route: 'index' },
  { name: 'Market', icon: 'basket-outline' as const, route: 'market' },
  { name: 'Chat', icon: 'chatbubble-outline' as const, route: 'advice' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [farmSize, setFarmSize] = useState(user?.farmDetails?.size || '');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveProfile = async () => {
    try {
      // Here you would typically update the user's profile in your backend
      // For now, we'll just update the local state
      if (user) {
        user.farmDetails = {
          ...user.farmDetails,
          size: farmSize,
        };
      }
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => logout()
        },
      ]
    );
  };

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photo library to change your profile picture.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }
            }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsUpdating(true);
        try {
          // Here you would typically upload the image to your backend/storage
          // For now, we'll just update the local state
          await updateUser({
            ...user,
            profileImage: result.assets[0].uri
          });
          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
          console.error('Error updating profile picture:', error);
          Alert.alert('Error', 'Failed to update profile picture');
        } finally {
          setIsUpdating(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const renderProfileSection = (title: string, content: JSX.Element) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {content}
    </View>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowSettingsModal(true)}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={user?.profileImage ? { uri: user.profileImage } : require('../../assets/images/user-icon.png')}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={[styles.editImageButton, isUpdating && styles.editImageButtonDisabled]}
              onPress={pickImage}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            {user.farmName && <Text style={styles.farmName}>{user.farmName}</Text>}
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode(true)}
          >
            <Ionicons name="create-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {renderProfileSection(
          'Personal Information',
          <View style={styles.sectionContent}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={24} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={24} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
            {user.phoneNumber && (
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={24} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{user.phoneNumber}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {renderProfileSection(
          'Farm Details',
          <View style={styles.sectionContent}>
            {user.farmName && (
              <View style={styles.infoItem}>
                <Ionicons name="business-outline" size={24} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Farm Name</Text>
                  <Text style={styles.infoValue}>{user.farmName}</Text>
                </View>
              </View>
            )}
            {user.region && (
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={24} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Region</Text>
                  <Text style={styles.infoValue}>{user.region}</Text>
                </View>
              </View>
            )}
            <View style={styles.infoItem}>
              <Ionicons name="resize-outline" size={24} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Farm Size</Text>
                <Text style={styles.infoValue}>{user.farmDetails?.size || 'Not set'}</Text>
              </View>
            </View>
            {user.farmDetails?.mainCrops && user.farmDetails.mainCrops.length > 0 && (
              <View style={styles.cropsContainer}>
                <Text style={styles.cropsTitle}>Main Crops:</Text>
                <View style={styles.cropTags}>
                  {user.farmDetails.mainCrops.map((crop) => (
                    <View key={crop} style={styles.cropTag}>
                      <Text style={styles.cropTagText}>{crop}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editMode}
        onRequestClose={() => setEditMode(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Farm Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setEditMode(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.inputLabel}>Farm Size</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter farm size (e.g., 50 acres)"
                value={farmSize}
                onChangeText={setFarmSize}
              />
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditMode(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.navItem,
              pathname === item.route && styles.activeNavItem,
            ]}
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

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettingsModal}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSettingsModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.settingsSection}>Notifications</Text>
            <View style={styles.settingsList}>
              {Object.entries(user.notificationSettings).map(([key, value]) => (
                <View key={key} style={styles.settingItem}>
                  <Text style={styles.settingLabel}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={(newValue) => {
                      // Implement the logic to update the notification settings in the backend
                      // For now, we'll just update the local state
                      user.notificationSettings = {
                        ...user.notificationSettings,
                        [key]: newValue,
                      };
                    }}
                    trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  farmName: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionContent: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  cropsContainer: {
    marginTop: 8,
  },
  cropsTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  cropTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cropTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cropTagText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  settingsSection: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
  },
  settingsList: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  activeNavItem: {
    // Optional: Add any additional styles for active nav item
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  editImageButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
}); 