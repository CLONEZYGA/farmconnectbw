import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

interface ExpertSettings {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  notificationSettings: {
    consultationRequests: boolean;
    marketUpdates: boolean;
    systemNotifications: boolean;
    emailNotifications: boolean;
  };
  privacySettings: {
    showProfile: boolean;
    showContactInfo: boolean;
    showAvailability: boolean;
  };
}

const initialSettings: ExpertSettings = {
  id: '',
  name: '',
  email: '',
  phone: '',
  specialization: '',
  experience: '',
  availability: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  },
  notificationSettings: {
    consultationRequests: true,
    marketUpdates: true,
    systemNotifications: true,
    emailNotifications: true,
  },
  privacySettings: {
    showProfile: true,
    showContactInfo: true,
    showAvailability: true,
  },
};

export default function ExpertSettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState<ExpertSettings>({
    ...initialSettings,
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        id: user.id || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        specialization: user.specialization || '',
        experience: user.experience || '',
      }));
    }
    setIsLoading(false);
  }, [user]);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Settings updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSigningOut(true);
              await signOut();
              // Hard reset for web platform
              if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ImageBackground 
      source={require('../../assets/images/login-bg.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.settingsCard}>
            {/* Personal Information Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>
            
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={settings.name}
              onChangeText={(text) => setSettings(prev => ({ ...prev, name: text }))}
              placeholder="Enter your name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={settings.email}
              onChangeText={(text) => setSettings(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={settings.phone}
              onChangeText={(text) => setSettings(prev => ({ ...prev, phone: text }))}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Specialization</Text>
            <TextInput
              style={styles.input}
              value={settings.specialization}
              onChangeText={(text) => setSettings(prev => ({ ...prev, specialization: text }))}
              placeholder="Enter your specialization"
            />

            <Text style={styles.label}>Experience</Text>
            <TextInput
              style={styles.input}
              value={settings.experience}
              onChangeText={(text) => setSettings(prev => ({ ...prev, experience: text }))}
              placeholder="Enter your experience"
            />

            <View style={styles.divider} />

            {/* Availability Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Availability</Text>
            </View>

            {Object.entries(settings.availability).map(([day, value]) => (
              <View key={day} style={styles.preferenceRow}>
                <Text style={styles.preferenceText}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Text>
                <Switch 
                  value={value}
                  onValueChange={(newValue) => setSettings(prev => ({
                    ...prev,
                    availability: { ...prev.availability, [day]: newValue }
                  }))}
                  trackColor={{ false: '#ddd', true: '#a5d6a2' }}
                  thumbColor="#4CAF50"
                />
              </View>
            ))}

            <View style={styles.divider} />

            {/* Notification Settings Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="notifications-outline" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>

            {Object.entries(settings.notificationSettings).map(([key, value]) => (
              <View key={key} style={styles.preferenceRow}>
                <Text style={styles.preferenceText}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </Text>
                <Switch 
                  value={value}
                  onValueChange={(newValue) => setSettings(prev => ({
                    ...prev,
                    notificationSettings: { ...prev.notificationSettings, [key]: newValue }
                  }))}
                  trackColor={{ false: '#ddd', true: '#a5d6a2' }}
                  thumbColor="#4CAF50"
                />
              </View>
            ))}

            <View style={styles.divider} />

            {/* Privacy Settings Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-outline" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Privacy</Text>
            </View>

            {Object.entries(settings.privacySettings).map(([key, value]) => (
              <View key={key} style={styles.preferenceRow}>
                <Text style={styles.preferenceText}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </Text>
                <Switch 
                  value={value}
                  onValueChange={(newValue) => setSettings(prev => ({
                    ...prev,
                    privacySettings: { ...prev.privacySettings, [key]: newValue }
                  }))}
                  trackColor={{ false: '#ddd', true: '#a5d6a2' }}
                  thumbColor="#4CAF50"
                />
              </View>
            ))}

            <View style={styles.divider} />

            {/* Account Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="log-out-outline" size={24} color="#F44336" />
              <Text style={styles.logoutSectionTitle}>Account</Text>
            </View>

            <TouchableOpacity 
              style={styles.buttonDanger} 
              onPress={handleSignOut}
              disabled={isSigningOut}
              activeOpacity={0.7}
            >
              {isSigningOut ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Sign Out</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  preferenceText: {
    fontSize: 16,
    color: '#333',
  },
  logoutSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  buttonDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
}); 