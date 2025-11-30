import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'guide';
  imageUrl: any;
  date: string;
}

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Common Crop Diseases and Their Treatments',
    description: 'A comprehensive guide to identifying and treating common crop diseases in various agricultural settings.',
    category: 'Disease Management',
    type: 'guide',
    imageUrl: require('../../assets/images/disease-guide.jpeg'),
    date: '2024-03-15',
  },
  {
    id: '2',
    title: 'Soil Health Management',
    description: 'Best practices for maintaining soil health and fertility in different farming systems.',
    category: 'Soil Management',
    type: 'article',
    imageUrl: require('../../assets/images/soil-health.jpg'),
    date: '2024-03-10',
  },
  {
    id: '3',
    title: 'Pest Control Methods',
    description: 'Video tutorial on effective pest control methods for organic farming.',
    category: 'Pest Control',
    type: 'video',
    imageUrl: require('../../assets/images/pest-control.jpg'),
    date: '2024-03-05',
  },
  {
    id: '4',
    title: 'Crop Rotation Strategies',
    description: 'Learn about effective crop rotation techniques to maximize yield and maintain soil health.',
    category: 'Crop Management',
    type: 'guide',
    imageUrl: require('../../assets/images/crop-rotation.jpg'),
    date: '2024-03-20',
  },
  {
    id: '5',
    title: 'Smart Irrigation Systems',
    description: 'Modern irrigation techniques and automated systems for efficient water management.',
    category: 'Irrigation',
    type: 'article',
    imageUrl: require('../../assets/images/irrigation.jpg'),
    date: '2024-03-18',
  },
  {
    id: '6',
    title: 'Precision Agriculture Technologies',
    description: 'How to implement IoT and sensor-based technologies for precision farming.',
    category: 'Technology',
    type: 'video',
    imageUrl: require('../../assets/images/agric-tech.jpg'),
    date: '2024-03-16',
  },
  {
    id: '7',
    title: 'Seasonal Crop Planning',
    description: 'Comprehensive guide to planning crop cycles and seasonal farming activities.',
    category: 'Crop Management',
    type: 'guide',
    imageUrl: require('../../assets/images/crop-planning.jpg'),
    date: '2024-03-14',
  },
  {
    id: '8',
    title: 'Drip Irrigation Systems',
    description: 'Step-by-step guide to setting up and maintaining drip irrigation systems.',
    category: 'Irrigation',
    type: 'video',
    imageUrl: require('../../assets/images/drip-irrigation.jpg'),
    date: '2024-03-12',
  },
  {
    id: '9',
    title: 'Agricultural Drones',
    description: 'Using drone technology for crop monitoring and precision agriculture.',
    category: 'Technology',
    type: 'article',
    imageUrl: require('../../assets/images/agri-drones.jpg'),
    date: '2024-03-08',
  }
];

const categories = [
  'All',
  'Disease Management',
  'Soil Management',
  'Pest Control',
  'Crop Management',
  'Irrigation',
  'Technology',
];

export default function KnowledgeBase() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return 'document-text-outline';
      case 'video':
        return 'videocam-outline';
      case 'guide':
        return 'book-outline';
      default:
        return 'document-outline';
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/knowledge-bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
        style={styles.overlay}
      >
        <LinearGradient
          colors={['#4CAF50', '#45a049']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Knowledge Base</Text>
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search resources..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === item && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === item && styles.categoryButtonTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <FlatList
          data={filteredResources}
          renderItem={({ item: resource }) => (
            <TouchableOpacity
              style={styles.resourceCard}
              onPress={() => router.push({
                pathname: '/(expert)/knowledge/[id]',
                params: { id: resource.id }
              })}
            >
              <Image
                source={resource.imageUrl}
                style={styles.resourceImage}
              />
              <View style={styles.resourceContent}>
                <View style={styles.resourceHeader}>
                  <View style={styles.resourceType}>
                    <Ionicons name={getResourceIcon(resource.type)} size={16} color="#4CAF50" />
                    <Text style={styles.resourceTypeText}>{resource.type}</Text>
                  </View>
                  <Text style={styles.resourceDate}>{resource.date}</Text>
                </View>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
                <View style={styles.resourceCategory}>
                  <Ionicons name="pricetag-outline" size={16} color="#666" />
                  <Text style={styles.resourceCategoryText}>{resource.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resourceList}
        />
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 40,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  resourceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resourceImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  resourceContent: {
    padding: 16,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourceType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceTypeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  resourceDate: {
    color: '#666',
    fontSize: 12,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  resourceCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceCategoryText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 4,
  },
  resourceList: {
    padding: 16,
  },
}); 