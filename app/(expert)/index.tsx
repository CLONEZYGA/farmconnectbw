import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Alert,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';

interface ConsultationCard {
  id: string;
  farmer: string;
  topic: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
}

const consultations: ConsultationCard[] = [
  {
    id: '1',
    farmer: 'John Smith',
    topic: 'Tomato Disease',
    status: 'Pending',
    date: '2024-03-18',
  },
  {
    id: '2',
    farmer: 'Maria Garcia',
    topic: 'Soil Analysis',
    status: 'In Progress',
    date: '2024-03-17',
  },
  {
    id: '3',
    farmer: 'David Brown',
    topic: 'Pest Control',
    status: 'Resolved',
    date: '2024-03-16',
  },
];

interface DashboardCard {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: '/(expert)/knowledge' | '/(expert)/reports' | '/(expert)/calendar' | '/(expert)/consultation/[id]';
  color: string;
}

interface StatItem {
  id: string;
  farmer?: string;
  topic?: string;
  date?: string;
  rating?: number;
  comment?: string;
}

// Sample data for stats
const activeCases = [
  { id: '1', farmer: 'John Smith', topic: 'Soil Analysis', date: '2024-03-20' },
  { id: '2', farmer: 'Maria Garcia', topic: 'Pest Control', date: '2024-03-21' },
  { id: '3', farmer: 'David Brown', topic: 'Crop Disease', date: '2024-03-22' },
];

const resolvedCases = [
  { id: '1', farmer: 'James Wilson', topic: 'Irrigation System', date: '2024-03-15', rating: 5 },
  { id: '2', farmer: 'Sarah Lee', topic: 'Fertilizer Application', date: '2024-03-16', rating: 4 },
  { id: '3', farmer: 'Robert Chen', topic: 'Harvest Planning', date: '2024-03-17', rating: 5 },
];

const ratings = [
  { id: '1', rating: 5, comment: 'Excellent service and advice' },
  { id: '2', rating: 4, comment: 'Very helpful consultation' },
  { id: '3', rating: 5, comment: 'Great expertise in crop management' },
];

export default function ExpertDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [selectedStat, setSelectedStat] = useState<null | 'active' | 'resolved' | 'rating'>(null);

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Consultations',
      description: 'Manage farmer consultations',
      icon: 'people-outline',
      route: '/(expert)/consultation/[id]',
      color: '#4CAF50'
    },
    {
      title: 'Knowledge Base',
      description: 'Access agricultural resources',
      icon: 'library-outline',
      route: '/(expert)/knowledge',
      color: '#FF9800'
    },
    {
      title: 'Reports',
      description: 'View and create reports',
      icon: 'document-text-outline',
      route: '/(expert)/reports',
      color: '#2196F3'
    },
    {
      title: 'Calendar',
      description: 'Schedule appointments',
      icon: 'calendar-outline',
      route: '/(expert)/calendar',
      color: '#9C27B0'
    }
  ];

  const getStatusColor = (status: ConsultationCard['status']) => {
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

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              console.log('ExpertDashboard: Starting logout process');
              await signOut();
              console.log('ExpertDashboard: Logout completed successfully');
            } catch (error) {
              console.error('ExpertDashboard: Logout failed:', error);
              Alert.alert(
                'Logout Error',
                'Failed to log out. Please try again.'
              );
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderStatModal = () => {
    if (!selectedStat) return null;

    const getModalTitle = () => {
      switch (selectedStat) {
        case 'active':
          return 'Active Cases';
        case 'resolved':
          return 'Resolved Cases';
        case 'rating':
          return 'Recent Ratings';
        default:
          return '';
      }
    };

    const renderItem = ({ item }: { item: StatItem }) => {
      switch (selectedStat) {
        case 'active':
          return (
            <View style={styles.modalItem}>
              <Text style={styles.modalItemTitle}>{item.farmer}</Text>
              <Text style={styles.modalItemSubtitle}>{item.topic}</Text>
              <Text style={styles.modalItemDate}>{item.date}</Text>
            </View>
          );
        case 'resolved':
          return (
            <View style={styles.modalItem}>
              <Text style={styles.modalItemTitle}>{item.farmer}</Text>
              <Text style={styles.modalItemSubtitle}>{item.topic}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.modalItemDate}>{item.date}</Text>
                <View style={styles.starsContainer}>
                  {item.rating && [...Array(item.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={16} color="#FFD700" />
                  ))}
                </View>
              </View>
            </View>
          );
        case 'rating':
          return (
            <View style={styles.modalItem}>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {item.rating && [...Array(item.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={16} color="#FFD700" />
                  ))}
                </View>
                <Text style={styles.modalItemComment}>{item.comment}</Text>
              </View>
            </View>
          );
        default:
          return null;
      }
    };

    return (
      <Modal
        visible={selectedStat !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedStat(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedStat(null)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList<StatItem>
              data={
                selectedStat === 'active'
                  ? activeCases
                  : selectedStat === 'resolved'
                  ? resolvedCases
                  : ratings
              }
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.modalList}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/background.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.97)']}
        style={styles.overlay}
      >
        <ScrollView style={styles.scrollView}>
          <ImageBackground 
            source={require('../../assets/images/background.jpg')}
            style={styles.headerBackground}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            >
              <View style={styles.headerContent}>
                <View>
                  <Text style={styles.welcomeText}>Welcome back</Text>
                  <Text style={styles.headerTitle}>{user?.name || 'Expert'}</Text>
                </View>
                <View style={styles.headerButtons}>
                  <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(expert)/profile')}>
                    <View style={styles.profileIcon}>
                      {user?.profileImage ? (
                        <Image
                          source={{ uri: user.profileImage }}
                          style={styles.profileImage}
                        />
                      ) : (
                        <Ionicons name="person" size={28} color="#fff" />
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>

          <View style={styles.quickStats}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsContainer}>
              <TouchableOpacity 
                style={[styles.statItem, styles.statItemGreen]}
                onPress={() => setSelectedStat('active')}
              >
                <Ionicons name="people" size={24} color="#fff" />
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Active Cases</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statItem, styles.statItemOrange]}
                onPress={() => setSelectedStat('resolved')}
              >
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>Resolved</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statItem, styles.statItemBlue]}
                onPress={() => setSelectedStat('rating')}
              >
                <Ionicons name="star" size={24} color="#fff" />
                <Text style={styles.statValue}>4.9</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Consultations</Text>
              <TouchableOpacity onPress={() => router.push('/(expert)/consultations')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {consultations.map((consultation) => (
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
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.date}>{consultation.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.cardsContainer}>
            {dashboardCards.map((card, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.card}
                onPress={() => router.push(card.route)}
              >
                <View style={[styles.cardIconContainer, { backgroundColor: card.color }]}>
                  <Ionicons name={card.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDescription}>{card.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {renderStatModal()}
      </LinearGradient>
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
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    height: 200,
    justifyContent: 'flex-end',
  },
  gradient: {
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  quickStats: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    margin: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statItemGreen: {
    backgroundColor: '#4CAF50',
  },
  statItemOrange: {
    backgroundColor: '#FF9800',
  },
  statItemBlue: {
    backgroundColor: '#2196F3',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  cardsContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalList: {
    paddingBottom: 16,
  },
  modalItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  modalItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  modalItemDate: {
    fontSize: 12,
    color: '#999',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalItemComment: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginLeft: 8,
  },
});
