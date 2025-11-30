import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const auth = useAuth();
  const { signIn, loading, predefinedUsers } = auth;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Get any message passed through params (e.g., logout success message)
  const params = useLocalSearchParams();
  const message = params.message as string | undefined;
  
  // Show toast message if provided
  React.useEffect(() => {
    if (message) {
      console.log("LOGIN: Showing toast message:", message);
      
      // Small delay to ensure the component is mounted
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: message,
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 50,
        });
        console.log("LOGIN: Toast show command issued");
      }, 500);
    }
  }, [message]);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter email and password');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      console.log('Attempting login with:', { email });
      
      // Check if signIn function exists
      if (typeof signIn !== 'function') {
        console.error('Sign in function is not available:', auth);
        setErrorMessage('Authentication function not available. Please try again.');
        return;
      }
      
      await signIn({ email, password });
      // Navigation is handled in the AuthContext based on user role
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (userType: keyof typeof predefinedUsers) => {
    const user = predefinedUsers[userType];
    setEmail(user.email);
    setPassword(user.password);
    setErrorMessage('');
  };

  const navigateToRegister = () => {
    router.push('/(auth)/register');
  };

  const isButtonDisabled = !email || !password || isSubmitting;

  return (
    <ImageBackground
      source={require('../assets/images/login-bg.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/user-icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>FarmConnectBW</Text>
              <Text style={styles.tagline}>Smart farming solutions</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Login to your account</Text>
              
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={20} color="#ff4d4f" />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Ionicons name="mail-outline" size={22} color="#555" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isSubmitting}
                  placeholderTextColor="#777"
                />
              </View>

              <View style={styles.inputGroup}>
                <Ionicons name="lock-closed-outline" size={22} color="#555" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isSubmitting}
                  placeholderTextColor="#777"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={isSubmitting}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                onPress={() => router.push('/(auth)/forgot-password')}
                disabled={isSubmitting}
              >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isButtonDisabled && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isButtonDisabled}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              {/* Quick Login Section */}
              <View style={styles.quickLoginSection}>
                <Text style={styles.quickLoginTitle}>Quick Login (Test Accounts)</Text>
                <View style={styles.quickLoginButtons}>
                  <TouchableOpacity
                    style={[styles.quickLoginButton, styles.farmerButton]}
                    onPress={() => handleQuickLogin('farmer')}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="leaf-outline" size={16} color="#fff" />
                    <Text style={styles.quickLoginText}>Farmer</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.quickLoginButton, styles.buyerButton]}
                    onPress={() => handleQuickLogin('buyer')}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="cart-outline" size={16} color="#fff" />
                    <Text style={styles.quickLoginText}>Buyer</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.quickLoginButton, styles.expertButton]}
                    onPress={() => handleQuickLogin('expert')}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="school-outline" size={16} color="#fff" />
                    <Text style={styles.quickLoginText}>Expert</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.quickLoginButton, styles.adminButton]}
                    onPress={() => handleQuickLogin('admin')}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="settings-outline" size={16} color="#fff" />
                    <Text style={styles.quickLoginText}>Admin</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={navigateToRegister} disabled={isSubmitting}>
                  <Text style={styles.registerLink}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>

            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#3e8b3a" />
                <Text style={styles.loadingText}>Initializing...</Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2f0',
    border: '1px solid #ffccc7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff4d4f',
    marginLeft: 8,
    flex: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    color: '#3e8b3a',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#3e8b3a',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#3e8b3a',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickLoginSection: {
    marginBottom: 24,
  },
  quickLoginTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  quickLoginButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickLoginButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  farmerButton: {
    backgroundColor: '#4caf50',
  },
  buyerButton: {
    backgroundColor: '#2196f3',
  },
  expertButton: {
    backgroundColor: '#ff9800',
  },
  adminButton: {
    backgroundColor: '#9c27b0',
  },
  quickLoginText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#3e8b3a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#3e8b3a',
  },
}); 