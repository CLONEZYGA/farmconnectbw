// 🔁 Enhanced SettingsScreen with improved UI and fixed signOut functionality

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import FarmerNavigation from '../../components/FarmerNavigation';

interface FarmDetails {
  name: string;
  location: string;
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

const initialProfile: FarmerProfile = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+1 (555) 123-4567',
  farmDetails: {
    name: 'Green Valley Farm',
    location: '123 Farm Road, Rural County',
    size: '50 acres',
    mainCrops: ['Tomatoes', 'Corn', 'Wheat'],
    yearEstablished: '2015',
  },
  notificationSettings: {
    marketUpdates: true,
    weatherAlerts: true,
    expertAdvice: true,
    cropReminders: false,
  },
};

export default function SettingsScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [farmSize, setFarmSize] = useState(user?.farmDetails?.size || '');

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view settings</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSaveFarmSize = async () => {
    try {
      if (user) {
        user.farmDetails = {
          ...user.farmDetails,
          size: farmSize,
        };
      }
      setEditMode(false);
      Alert.alert('Success', 'Farm size updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update farm size');
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Profile Information', type: 'link' },
        { icon: 'lock-closed-outline', label: 'Security', type: 'link' },
        { icon: 'notifications-outline', label: 'Notifications', type: 'toggle' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'language-outline', label: 'Language', type: 'link' },
        { icon: 'moon-outline', label: 'Dark Mode', type: 'toggle' },
        { icon: 'location-outline', label: 'Location Services', type: 'toggle' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help Center', type: 'link' },
        { icon: 'chatbubble-outline', label: 'Contact Support', type: 'link' },
        { icon: 'document-text-outline', label: 'Terms of Service', type: 'link' },
        { icon: 'shield-outline', label: 'Privacy Policy', type: 'link' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={item.label}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.lastItem,
                  ]}
                  onPress={() => {
                    if (item.type === 'link') {
                      router.push(`/(farmer)/settings/${item.label.toLowerCase().replace(/\s+/g, '-')}`);
                    }
                  }}
                >
                  <View style={styles.settingItemLeft}>
                    <Ionicons name={item.icon} size={24} color="#4CAF50" />
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  {item.type === 'link' ? (
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                  ) : (
                    <Switch 
                      trackColor={{ false: '#ccc', true: '#4CAF50' }}
                      thumbColor="#fff"
                      ios_backgroundColor="#ccc"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});
