import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { checkNetworkStatus } from '../config/network';
// Try to dynamically import NetInfo (optional dependency)
let NetInfo: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  NetInfo = require('@react-native-community/netinfo');
} catch (e) {
  NetInfo = null;
}

interface NetworkStatusProps {
  showOfflineMessage?: boolean;
}

export default function NetworkStatus({ showOfflineMessage = true }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const fadeAnim = new Animated.Value(1);

  const checkNetwork = async () => {
    setIsChecking(true);
    try {
      const online = await checkNetworkStatus();
      setIsOnline(online);
      
      if (!online && showOfflineMessage) {
        // Fade in the offline message
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        // Fade out the offline message
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.error('Network check error:', error);
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // If NetInfo is available, subscribe to connectivity changes
    if (NetInfo && NetInfo.addEventListener) {
      const unsubscribe = NetInfo.addEventListener((state: any) => {
        const online = !!state.isConnected && !!state.isInternetReachable;
        setIsOnline(online);
        if (!online && showOfflineMessage) {
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
        } else {
          Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        }
      });

      // initial check
      checkNetwork();

      return () => unsubscribe();
    }

    // Fallback: Check network status on mount and periodically
    checkNetwork();
    const interval = setInterval(checkNetwork, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isOnline || !showOfflineMessage) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <Ionicons 
          name={isChecking ? "refresh" : "wifi-outline"} 
          size={20} 
          color="#fff" 
          style={isChecking ? styles.spinning : undefined}
        />
        <Text style={styles.text}>
          {isChecking ? 'Checking connection...' : 'You\'re offline'}
        </Text>
        <Text style={styles.subtext}>
          Some features may be limited
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff6b35',
    zIndex: 1000,
    paddingTop: 50, // Account for status bar
    paddingBottom: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  subtext: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 8,
    opacity: 0.8,
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
  },
}); 