import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FarmerNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      icon: 'home-outline',
      activeIcon: 'home',
      route: '/(farmer)',
    },
    {
      name: 'Market',
      icon: 'cart-outline',
      activeIcon: 'cart',
      route: '/(farmer)/market',
    },
    {
      name: 'Messages',
      icon: 'chatbubbles-outline',
      activeIcon: 'chatbubbles',
      route: '/(farmer)/messages',
    },
    {
      name: 'Settings',
      icon: 'settings-outline',
      activeIcon: 'settings',
      route: '/(farmer)/settings',
    },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
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
            <Text style={[styles.navText, isActive && styles.activeNavText]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
}); 