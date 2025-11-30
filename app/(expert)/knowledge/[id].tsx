import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Import the resources array from the parent file
import { resources } from '../knowledge';

export default function KnowledgeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return (
      <View style={styles.container}>
        <Text>Resource not found</Text>
      </View>
    );
  }

  const getResourceIcon = (type: string) => {
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
    <ScrollView style={styles.container}>
      <ImageBackground 
        source={resource.imageUrl}
        style={styles.headerImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.resourceType}>
          <Ionicons name={getResourceIcon(resource.type)} size={20} color="#4CAF50" />
          <Text style={styles.resourceTypeText}>{resource.type}</Text>
        </View>

        <Text style={styles.title}>{resource.title}</Text>
        
        <View style={styles.metaInfo}>
          <View style={styles.category}>
            <Ionicons name="pricetag-outline" size={16} color="#666" />
            <Text style={styles.categoryText}>{resource.category}</Text>
          </View>
          <Text style={styles.date}>{resource.date}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{resource.description}</Text>
        </View>

        {resource.type === 'video' && (
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play-circle" size={64} color="#4CAF50" />
            <Text style={styles.playButtonText}>Watch Video</Text>
          </TouchableOpacity>
        )}

        {resource.type === 'guide' && (
          <View style={styles.guideContent}>
            <Text style={styles.sectionTitle}>Key Points</Text>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.bulletText}>Comprehensive coverage of {resource.category.toLowerCase()}</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.bulletText}>Step-by-step instructions and best practices</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.bulletText}>Practical examples and case studies</Text>
            </View>
          </View>
        )}

        {resource.type === 'article' && (
          <View style={styles.articleContent}>
            <Text style={styles.sectionTitle}>Article Content</Text>
            <Text style={styles.articleText}>
              This article provides in-depth information about {resource.title.toLowerCase()}. 
              It covers essential aspects of {resource.category.toLowerCase()} and includes 
              practical tips for implementation.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
  },
  headerImage: {
    height: 300,
    width: '100%',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  resourceType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resourceTypeText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 4,
  },
  date: {
    color: '#666',
    fontSize: 14,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  playButton: {
    alignItems: 'center',
    marginVertical: 24,
  },
  playButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  guideContent: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 12,
    flex: 1,
  },
  articleContent: {
    marginTop: 16,
  },
  articleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
}); 