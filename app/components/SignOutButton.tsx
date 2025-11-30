import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

interface SignOutButtonProps {
  style?: any;
  iconSize?: number;
  textColor?: string;
}

export default function SignOutButton({ style, iconSize = 24, textColor = '#666' }: SignOutButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = () => {
    if (isSigningOut) return; // Prevent multiple sign-out attempts

    Alert.alert(
      'Confirm Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Sign out cancelled')
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              setIsSigningOut(true);
              console.log('SignOutButton: Starting sign out process');
              await signOut();
              console.log('SignOutButton: Sign out completed successfully');
            } catch (error) {
              console.error('SignOutButton: Sign out failed:', error);
              Alert.alert(
                'Sign Out Error',
                'Failed to sign out. Please try again.'
              );
            } finally {
              setIsSigningOut(false);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.button, style, isSigningOut && styles.disabledButton]} 
      onPress={handleSignOut}
      activeOpacity={0.7}
      disabled={isSigningOut}
    >
      {isSigningOut ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          <Ionicons name="log-out-outline" size={iconSize} color={textColor} />
          <Text style={[styles.text, { color: textColor }]}>Sign Out</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 