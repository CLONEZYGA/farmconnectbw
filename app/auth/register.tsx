import React, { useState } from 'react';
import { 
  View, 
  Text,
  TextInput, 
  TouchableOpacity,
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const auth = useAuth();
  const { register } = auth;
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    farmName: '',
    location: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);  

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // Validation
    console.log("Register button pressed");
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      console.log("Validation failed: missing required fields");
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log("Validation failed: passwords don't match");
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    console.log("Starting registration process");
    setIsRegistering(true);
    
    try {
      // Store credentials in AsyncStorage for verification
      console.log("Attempting to store credentials in AsyncStorage");
      try {
        await AsyncStorage.setItem('userCredentials', JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role
        }));
        console.log("Credentials stored successfully");
        
        // Verify credentials are stored
        const storedCredentials = await AsyncStorage.getItem('userCredentials');
        console.log("Verification - stored credentials:", storedCredentials);
      } catch (storageError) {
        console.error('Error storing credentials:', storageError);
      }
      
      // Check if register function exists
      if (typeof register !== 'function') {
        console.error('Register function is not available:', auth);
        Alert.alert('Registration Failed', 'Registration function not available. Please try again.');
      return;
    }

      // Call the register function from AuthContext
      await register({
        name: formData.fullName,
        email: formData.email,
        username: formData.email.split('@')[0], // Generate username from email
        password: formData.password,
        role: formData.role as 'farmer' | 'expert' | 'buyer' | 'admin',
        farmName: formData.role === 'farmer' ? formData.farmName : undefined
      });

      // Note: The router navigation will happen automatically in the AuthContext
      // via its useEffect hook after the user state is updated
      
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', 'There was an error creating your account. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register on FarmConnect BW</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
              editable={!isRegistering}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isRegistering}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              keyboardType="phone-pad"
              editable={!isRegistering}
            />
          </View>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.role}
              style={styles.picker}
              onValueChange={(value) => handleChange('role', value)}
              enabled={!isRegistering}
            >
              <Picker.Item label="Farmer" value="farmer" />
              <Picker.Item label="Buyer" value="buyer" />
              <Picker.Item label="Expert" value="expert" />
            </Picker>
          </View>

          {formData.role === 'farmer' && (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Farm Name (optional)"
                  value={formData.farmName}
                  onChangeText={(text) => handleChange('farmName', text)}
                  editable={!isRegistering}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Location"
                  value={formData.location}
                  onChangeText={(text) => handleChange('location', text)}
                  editable={!isRegistering}
                />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry={!showPassword}
              editable={!isRegistering}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              disabled={isRegistering}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              secureTextEntry={!showConfirmPassword}
              editable={!isRegistering}
            />
                  <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
              disabled={isRegistering}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

            <TouchableOpacity 
            style={[styles.registerButton, isRegistering && styles.registeringButton]} 
            onPress={handleRegister}
            disabled={isRegistering}
            activeOpacity={0.7}
          >
            <Text style={styles.registerButtonText}>
              {isRegistering ? 'Creating Account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registeringButton: {
    backgroundColor: '#a5d6a7',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 