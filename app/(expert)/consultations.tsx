import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Consultation {
  id: string;
  farmer: string;
  topic: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
  location?: string;
  notes?: string;
}

const consultations: Consultation[] = [
  {
    id: '1',
    farmer: 'John Smith',
    topic: 'Tomato Disease',
    status: 'Pending',
    date: '2024-03-18',
    location: 'Farm Location A',
    notes: 'Suspected fungal infection in tomato plants',
  },
  {
    id: '2',
    farmer: 'Maria Garcia',
    topic: 'Soil Analysis',
    status: 'In Progress',
    date: '2024-03-17',
    location: 'Farm Location B',
    notes: 'Soil pH and nutrient analysis required',
  },
  {
    id: '3',
    farmer: 'David Brown',
    topic: 'Pest Control',
    status: 'Resolved',
    date: '2024-03-16',
    location: 'Farm Location C',
    notes: 'Aphid infestation in corn field',
  },
  {
    id: '4',
    farmer: 'Sarah Wilson',
    topic: 'Irrigation System',
    status: 'Pending',
    date: '2024-03-15',
    location: 'Farm Location D',
    notes: 'Drip irrigation system installation',
  },
  {
    id: '5',
    farmer: 'James Chen',
    topic: 'Crop Rotation',
    status: 'In Progress',
    date: '2024-03-14',
    location: 'Farm Location E',
    notes: 'Planning next season crop rotation',
  },
];

export default function ConsultationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Consultation['status'] | 'All'>('All');

  const getStatusColor = (status: Consultation['status']) => {
    switch (status) {
      case 'Pending':
        return '#FFA000';
      case 'In Progress':
        return '#4CAF50';
      case 'Resolved':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || consultation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Consultations</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search consultations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                statusFilter === status && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter(status as Consultation['status'] | 'All')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  statusFilter === status && styles.filterButtonTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredConsultations.map((consultation) => (
          <TouchableOpacity
            key={consultation.id}
            style={styles.consultationCard}
            onPress={() => router.push(`/(expert)/consultation/${consultation.id}`)}
          >
            <View style={styles.consultationHeader}>
              <Text style={styles.farmerName}>{consultation.farmer}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(consultation.status) },
                ]}
              >
                <Text style={styles.statusText}>{consultation.status}</Text>
              </View>
            </View>
            <Text style={styles.topic}>{consultation.topic}</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{consultation.date}</Text>
              </View>
              {consultation.location && (
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{consultation.location}</Text>
                </View>
              )}
            </View>
            {consultation.notes && (
              <Text style={styles.notes} numberOfLines={2}>
                {consultation.notes}
              </Text>
            )}
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerRight: {
    width: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
  },
  consultationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  topic: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsContainer: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  notes: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
}); 