import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExpertNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Home',
      icon: 'home-outline',
      activeIcon: 'home',
      route: '/(expert)',
    },
    {
      name: 'Knowledge',
      icon: 'library-outline',
      activeIcon: 'library',
      route: '/(expert)/knowledge',
    },
    {
      name: 'Reports',
      icon: 'document-text-outline',
      activeIcon: 'document-text',
      route: '/(expert)/reports',
    },
    {
      name: 'Profile',
      icon: 'person-outline',
      activeIcon: 'person',
      route: '/(expert)/profile',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
        style={styles.gradient}
      >
        <View style={styles.navigation}>
          {navigationItems.map((item) => {
            const isActive = pathname === item.route;
            return (
              <TouchableOpacity
                key={item.name}
                style={styles.navItem}
                onPress={() => router.push(item.route)}
              >
                <Ionicons
                  name={isActive ? item.activeIcon : item.icon}
                  size={24}
                  color={isActive ? '#4CAF50' : '#666'}
                />
                <View style={[styles.indicator, isActive && styles.activeIndicator]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  gradient: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navigation: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginTop: 4,
  },
  activeIndicator: {
    backgroundColor: '#4CAF50',
  },
}); 