import React, { useState } from 'react';
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

interface BuyerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  notificationSettings: {
    orderUpdates: boolean;
    promotions: boolean;
    newProducts: boolean;
    priceAlerts: boolean;
  };
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  isDefault: boolean;
}

export default function BuyerSettingsScreen() {
  const router = useRouter();
  const { user, signOut, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress, addPaymentMethod, setDefaultPaymentMethod } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  const [newPaymentMethod, setNewPaymentMethod] = useState<{
    type: 'card' | 'bank';
    last4: string;
    isDefault: boolean;
  }>({
    type: 'card',
    last4: '',
    isDefault: false
  });

  const initialProfile: BuyerProfile = {
    id: user?.id || '1',
    name: user?.name || '',
    email: user?.email || '',
    phone:  user?.phone || '',
    addresses: [
      {
        id: '1',
        street: '123 Main St',
        city: 'Gaborone',
        state: 'Botswana',
        zipCode: '12345',
        isDefault: true,
      },
    ],
    paymentMethods: [
      {
        id: '1',
        type: 'card',
        last4: '4242',
        isDefault: true,
      },
    ],
    notificationSettings: {
      orderUpdates: true,
      promotions: true,
      newProducts: true,
      priceAlerts: false,
    },
  };

  const [profile, setProfile] = useState<BuyerProfile>(initialProfile);
  const [editedProfile, setEditedProfile] = useState<BuyerProfile>(initialProfile);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Update the user profile
      await updateProfile({
        name: editedProfile.name,
        email: editedProfile.email,
        phone: editedProfile.phone
      });

      // Update local state
      setProfile(editedProfile);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => console.log('Settings: Sign out cancelled')
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            if (isSigningOut) {
              console.log('Settings: Sign out already in progress');
              return;
            }
            try {
              setIsSigningOut(true);
              console.log('Settings: Sign out button pressed');
              if (!signOut) {
                throw new Error('Sign out function not available');
              }
              await signOut();
              console.log('Settings: Sign out completed successfully');
            } catch (error) {
              console.error('Settings: Sign out failed:', error);
              Alert.alert(
                'Sign Out Error',
                'Failed to sign out. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ]
    );
  };

  const handleAddAddress = async () => {
    try {
      setIsAddingAddress(true);
      await addAddress(newAddress);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false
      });
      Alert.alert('Success', 'Address added successfully');
    } catch (error) {
      console.error('Failed to add address:', error);
      Alert.alert('Error', 'Failed to add address. Please try again.');
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handleUpdateAddress = async (addressId: string, updates: Partial<Address>) => {
    try {
      await updateAddress(addressId, updates);
      Alert.alert('Success', 'Address updated successfully');
    } catch (error) {
      console.error('Failed to update address:', error);
      Alert.alert('Error', 'Failed to update address. Please try again.');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAddress(addressId);
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              console.error('Failed to delete address:', error);
              Alert.alert('Error', 'Failed to delete address. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      Alert.alert('Success', 'Default address updated successfully');
    } catch (error) {
      console.error('Failed to set default address:', error);
      Alert.alert('Error', 'Failed to set default address. Please try again.');
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      if (!newPaymentMethod.last4) {
        Alert.alert('Error', 'Please enter card last 4 digits');
        return;
      }

      // If this is being set as default, update other payment methods
      if (newPaymentMethod.isDefault) {
        const updatedMethods = editedProfile.paymentMethods.map(method => ({
          ...method,
          isDefault: false
        }));
        setEditedProfile(prev => ({
          ...prev,
          paymentMethods: updatedMethods
        }));
      }

      await addPaymentMethod(newPaymentMethod);
      setNewPaymentMethod({
        type: 'card',
        last4: '',
        isDefault: false
      });
      Alert.alert('Success', 'Payment method added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method');
    }
  };

  const handleSetDefaultPaymentMethod = async (methodId: string) => {
    try {
      // Update local state first
      const updatedMethods = editedProfile.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }));
      setEditedProfile(prev => ({
        ...prev,
        paymentMethods: updatedMethods
      }));

      await setDefaultPaymentMethod(methodId);
      Alert.alert('Success', 'Default payment method updated');
    } catch (error) {
      // Revert local state if the API call fails
      setEditedProfile(prev => ({
        ...prev,
        paymentMethods: editedProfile.paymentMethods
      }));
      Alert.alert('Error', 'Failed to update default payment method');
    }
  };

  const renderAddressItem = (address: Address) => (
    <View key={address.id} style={styles.addressItem}>
      <View style={styles.addressContent}>
        <Text style={styles.addressText}>{address.street}</Text>
        <Text style={styles.addressText}>{`${address.city}, ${address.state} ${address.zipCode}`}</Text>
        {address.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
      </View>
      <View style={styles.addressActions}>
        {!address.isDefault && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSetDefaultAddress(address.id)}
          >
            <Ionicons name="star-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteAddress(address.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPaymentMethodItem = (method: PaymentMethod) => (
    <View key={method.id} style={styles.paymentItem}>
      <View style={styles.paymentContent}>
        <Ionicons 
          name={method.type === 'card' ? 'card-outline' : 'wallet-outline'} 
          size={24} 
          color="#4CAF50" 
        />
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentText}>
            {method.type === 'card' ? 'Card' : 'Bank Account'} ending in {method.last4}
          </Text>
          {method.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.paymentActions}>
        {!method.isDefault && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSetDefaultPaymentMethod(method.id)}
          >
            <Ionicons name="star-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading settings...</Text>
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
              onPress={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.profileCard}>
            {/* Personal Information Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>
            
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={editedProfile.name}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
              placeholder="Enter your name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={editedProfile.email}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={editedProfile.phone}
              onChangeText={(text) => setEditedProfile(prev => ({ ...prev, phone: text }))}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />

            <View style={styles.divider} />

            {/* Addresses Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Delivery Addresses</Text>
            </View>

            {user?.addresses && user.addresses.length > 0 ? (
              user.addresses.map(renderAddressItem)
            ) : (
              <Text style={styles.noAddressesText}>No addresses added yet</Text>
            )}

            {/* Add New Address Form */}
            <View style={styles.addAddressForm}>
              <Text style={styles.label}>Add New Address</Text>
              <TextInput
                style={styles.input}
                value={newAddress.street}
                onChangeText={(text) => setNewAddress(prev => ({ ...prev, street: text }))}
                placeholder="Street Address"
              />
              <TextInput
                style={styles.input}
                value={newAddress.city}
                onChangeText={(text) => setNewAddress(prev => ({ ...prev, city: text }))}
                placeholder="City"
              />
              <TextInput
                style={styles.input}
                value={newAddress.state}
                onChangeText={(text) => setNewAddress(prev => ({ ...prev, state: text }))}
                placeholder="State"
              />
              <TextInput
                style={styles.input}
                value={newAddress.zipCode}
                onChangeText={(text) => setNewAddress(prev => ({ ...prev, zipCode: text }))}
                placeholder="ZIP Code"
              />
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddAddress}
                disabled={isAddingAddress}
              >
                {isAddingAddress ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Address</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Payment Methods Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="card-outline" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Payment Methods</Text>
            </View>

            {user?.paymentMethods && user.paymentMethods.length > 0 ? (
              user.paymentMethods.map(renderPaymentMethodItem)
            ) : (
              <Text style={styles.noItemsText}>No payment methods added yet</Text>
            )}

            {/* Add New Payment Method Form */}
            <View style={styles.addPaymentForm}>
              <Text style={styles.label}>Add New Payment Method</Text>
              <View style={styles.paymentTypeSelector}>
                <TouchableOpacity 
                  style={[
                    styles.paymentTypeButton,
                    newPaymentMethod.type === 'card' && styles.paymentTypeButtonActive
                  ]}
                  onPress={() => setNewPaymentMethod(prev => ({ ...prev, type: 'card' }))}
                >
                  <Ionicons name="card-outline" size={20} color={newPaymentMethod.type === 'card' ? '#fff' : '#4CAF50'} />
                  <Text style={[
                    styles.paymentTypeText,
                    newPaymentMethod.type === 'card' && styles.paymentTypeTextActive
                  ]}>Card</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.paymentTypeButton,
                    newPaymentMethod.type === 'bank' && styles.paymentTypeButtonActive
                  ]}
                  onPress={() => setNewPaymentMethod(prev => ({ ...prev, type: 'bank' }))}
                >
                  <Ionicons name="wallet-outline" size={20} color={newPaymentMethod.type === 'bank' ? '#fff' : '#4CAF50'} />
                  <Text style={[
                    styles.paymentTypeText,
                    newPaymentMethod.type === 'bank' && styles.paymentTypeTextActive
                  ]}>Bank Account</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                value={newPaymentMethod.last4}
                onChangeText={(text) => setNewPaymentMethod(prev => ({ ...prev, last4: text }))}
                placeholder="Last 4 digits"
                keyboardType="numeric"
                maxLength={4}
              />

              <View style={styles.defaultOption}>
                <Text style={styles.defaultOptionText}>Set as default payment method</Text>
                <Switch 
                  value={newPaymentMethod.isDefault}
                  onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, isDefault: value }))}
                  trackColor={{ false: '#ddd', true: '#a5d6a2' }}
                  thumbColor="#4CAF50"
                />
              </View>

              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddPaymentMethod}
                disabled={!newPaymentMethod.last4}
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={[styles.addButtonText, { color: '#fff' }]}>Add Payment Method</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Notification Settings Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="notifications-outline" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Notification Settings</Text>
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceText}>Order Updates</Text>
              <Switch 
                value={editedProfile.notificationSettings.orderUpdates}
                onValueChange={(value) => setEditedProfile(prev => ({
                  ...prev,
                  notificationSettings: { ...prev.notificationSettings, orderUpdates: value }
                }))}
                trackColor={{ false: '#ddd', true: '#a5d6a2' }}
                thumbColor="#4CAF50"
              />
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceText}>Promotions</Text>
              <Switch 
                value={editedProfile.notificationSettings.promotions}
                onValueChange={(value) => setEditedProfile(prev => ({
                  ...prev,
                  notificationSettings: { ...prev.notificationSettings, promotions: value }
                }))}
                trackColor={{ false: '#ddd', true: '#a5d6a2' }}
                thumbColor="#4CAF50"
              />
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceText}>New Products</Text>
              <Switch 
                value={editedProfile.notificationSettings.newProducts}
                onValueChange={(value) => setEditedProfile(prev => ({
                  ...prev,
                  notificationSettings: { ...prev.notificationSettings, newProducts: value }
                }))}
                trackColor={{ false: '#ddd', true: '#a5d6a2' }}
                thumbColor="#4CAF50"
              />
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceText}>Price Alerts</Text>
              <Switch 
                value={editedProfile.notificationSettings.priceAlerts}
                onValueChange={(value) => setEditedProfile(prev => ({
                  ...prev,
                  notificationSettings: { ...prev.notificationSettings, priceAlerts: value }
                }))}
                trackColor={{ false: '#ddd', true: '#a5d6a2' }}
                thumbColor="#4CAF50"
              />
            </View>

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
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  logoutSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginLeft: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  addressItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addressContent: {
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  preferenceText: {
    fontSize: 16,
    color: '#333',
  },
  buttonDanger: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  noAddressesText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
    fontSize: 16,
  },
  addAddressForm: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addPaymentForm: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  paymentTypeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  paymentTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    gap: 8,
  },
  paymentTypeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  paymentTypeText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  paymentTypeTextActive: {
    color: '#fff',
  },
  defaultOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  defaultOptionText: {
    fontSize: 14,
    color: '#666',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 8,
  },
  paymentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noItemsText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
    fontSize: 16,
  },
}); 