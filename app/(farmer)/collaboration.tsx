import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from '../../config/firebase';

interface Farmer {
  id: string;
  name: string;
  farmName: string;
  region: string;
  specialties: string[];
  experience: number;
  rating: number;
  profileImage: string;
  bio: string;
  isOnline: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  farmers: string[];
  status: 'Open' | 'In Progress' | 'Completed';
  startDate: string;
  category: string;
}

export default function CollaborationScreen() {
  const { user } = useAuth();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'farmers' | 'projects'>('farmers');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load farmers
      const farmersRef = firestore().collection('farmers');
      const farmersSnapshot = await farmersRef.get();
      const loadedFarmers: Farmer[] = [];
      farmersSnapshot.forEach(doc => {
        loadedFarmers.push({ id: doc.id, ...doc.data() } as Farmer);
      });
      setFarmers(loadedFarmers);

      // Load projects
      const projectsRef = firestore().collection('projects');
      const projectsSnapshot = await projectsRef.get();
      const loadedProjects: Project[] = [];
      projectsSnapshot.forEach(doc => {
        loadedProjects.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Farmer Collaboration</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder={activeTab === 'farmers' ? "Search farmers..." : "Search projects..."}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'farmers' && styles.activeTab]}
          onPress={() => setActiveTab('farmers')}
        >
          <Text style={[styles.tabText, activeTab === 'farmers' && styles.activeTabText]}>
            Farmers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'projects' && styles.activeTab]}
          onPress={() => setActiveTab('projects')}
        >
          <Text style={[styles.tabText, activeTab === 'projects' && styles.activeTabText]}>
            Projects
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'farmers' ? (
          <>
            {filteredFarmers.map(farmer => (
              <TouchableOpacity key={farmer.id} style={styles.farmerCard}>
                <Image
                  source={{ uri: farmer.profileImage }}
                  style={styles.farmerImage}
                  defaultSource={require('../../assets/images/placeholder.png')}
                />
                <View style={styles.farmerInfo}>
                  <View style={styles.farmerHeader}>
                    <Text style={styles.farmerName}>{farmer.name}</Text>
                    {farmer.isOnline && <View style={styles.onlineIndicator} />}
                  </View>
                  <Text style={styles.farmName}>{farmer.farmName}</Text>
                  <Text style={styles.region}>{farmer.region}</Text>
                  <View style={styles.specialtiesContainer}>
                    {farmer.specialties.map(specialty => (
                      <View key={specialty} style={styles.specialtyTag}>
                        <Text style={styles.specialtyText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.farmerFooter}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFB300" />
                      <Text style={styles.rating}>{farmer.rating.toFixed(1)}</Text>
                    </View>
                    <TouchableOpacity style={styles.connectButton}>
                      <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {filteredProjects.map(project => (
              <TouchableOpacity key={project.id} style={styles.projectCard}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(project.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(project.status) }
                    ]}>{project.status}</Text>
                  </View>
                </View>
                <Text style={styles.projectDescription}>{project.description}</Text>
                <View style={styles.projectDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={16} color="#666" />
                    <Text style={styles.detailText}>{project.startDate}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="people" size={16} color="#666" />
                    <Text style={styles.detailText}>{project.farmers.length} farmers</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join Project</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name={activeTab === 'farmers' ? "person-add" : "add"} size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open': return '#4CAF50';
    case 'In Progress': return '#2196F3';
    case 'Completed': return '#9C27B0';
    default: return '#666';
  }
};

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  farmerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  farmerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },
  farmerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  farmerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  farmName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  region: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  specialtyTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  specialtyText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  farmerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  connectButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  projectDetails: {
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
  joinButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 