import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from '../../config/firebase';

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  instructor: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  price: number;
  capacity: number;
  enrolled: number;
}

export default function TrainingScreen() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Crop Management', 'Livestock', 'Technology', 'Business'];

  useEffect(() => {
    loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
    try {
      const workshopsRef = firestore().collection('workshops');
      const snapshot = await workshopsRef.get();
      
      const loadedWorkshops: Workshop[] = [];
      snapshot.forEach(doc => {
        loadedWorkshops.push({ id: doc.id, ...doc.data() } as Workshop);
      });
      
      setWorkshops(loadedWorkshops);
    } catch (error) {
      console.error('Error loading workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkshops = selectedCategory === 'All'
    ? workshops
    : workshops.filter(w => w.category === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#2196F3';
      case 'Advanced': return '#F44336';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading workshops...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training & Workshops</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonSelected,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextSelected,
            ]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {filteredWorkshops.map(workshop => (
          <TouchableOpacity key={workshop.id} style={styles.workshopCard}>
            <Image
              source={{ uri: workshop.image }}
              style={styles.workshopImage}
              defaultSource={require('../../assets/images/placeholder.png')}
            />
            <View style={styles.workshopInfo}>
              <View style={styles.workshopHeader}>
                <Text style={styles.workshopTitle}>{workshop.title}</Text>
                <View style={[
                  styles.levelBadge,
                  { backgroundColor: getLevelColor(workshop.level) + '20' }
                ]}>
                  <Text style={[
                    styles.levelText,
                    { color: getLevelColor(workshop.level) }
                  ]}>{workshop.level}</Text>
                </View>
              </View>
              
              <Text style={styles.workshopDescription} numberOfLines={2}>
                {workshop.description}
              </Text>
              
              <View style={styles.workshopDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar" size={16} color="#666" />
                  <Text style={styles.detailText}>{workshop.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time" size={16} color="#666" />
                  <Text style={styles.detailText}>{workshop.duration}</Text>
                </View>
              </View>

              <View style={styles.workshopFooter}>
                <Text style={styles.price}>BWP {workshop.price.toFixed(2)}</Text>
                <View style={styles.enrollmentInfo}>
                  <Text style={styles.enrollmentText}>
                    {workshop.enrolled}/{workshop.capacity} enrolled
                  </Text>
                  <TouchableOpacity 
                    style={[
                      styles.enrollButton,
                      workshop.enrolled >= workshop.capacity && styles.enrollButtonDisabled
                    ]}
                    disabled={workshop.enrolled >= workshop.capacity}
                  >
                    <Text style={styles.enrollButtonText}>
                      {workshop.enrolled >= workshop.capacity ? 'Full' : 'Enroll'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  workshopCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  workshopImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  workshopInfo: {
    padding: 16,
  },
  workshopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workshopTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  workshopDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  workshopDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  workshopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  enrollmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  enrollmentText: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  enrollButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  enrollButtonDisabled: {
    backgroundColor: '#ccc',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 