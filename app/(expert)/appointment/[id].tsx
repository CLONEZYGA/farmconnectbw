import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// This would typically come from your backend/API
const appointments = [
  {
    id: '1',
    farmer: 'John Smith',
    date: '2024-03-20',
    time: '10:00 AM',
    topic: 'Soil Analysis Consultation',
    status: 'scheduled',
    location: 'Farm Location A',
    notes: 'Bring soil samples for analysis',
    contact: '+1234567890',
    duration: '1 hour',
  },
  {
    id: '2',
    farmer: 'Maria Garcia',
    date: '2024-03-20',
    time: '2:30 PM',
    topic: 'Pest Control Advice',
    status: 'scheduled',
    location: 'Farm Location B',
    notes: 'Recent pest infestation in corn field',
    contact: '+1234567891',
    duration: '45 minutes',
  },
  {
    id: '3',
    farmer: 'David Brown',
    date: '2024-03-21',
    time: '11:00 AM',
    topic: 'Crop Disease Management',
    status: 'scheduled',
    location: 'Farm Location C',
    notes: 'Suspected fungal infection in wheat',
    contact: '+1234567892',
    duration: '1.5 hours',
  },
];

export default function AppointmentDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [appointment, setAppointment] = useState(appointments.find(a => a.id === id));

  if (!appointment) {
    return (
      <View style={styles.container}>
        <Text>Appointment not found</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: '/(expert)/appointment/edit/[id]',
      params: { id: appointment.id }
    });
  };

  const handleMarkComplete = () => {
    Alert.alert(
      'Mark as Complete',
      'Are you sure you want to mark this appointment as complete?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Complete',
          onPress: () => {
            setAppointment(prev => ({
              ...prev!,
              status: 'completed'
            }));
            // Here you would typically update the appointment in your backend
            Alert.alert('Success', 'Appointment marked as complete');
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setAppointment(prev => ({
              ...prev!,
              status: 'cancelled'
            }));
            // Here you would typically update the appointment in your backend
            Alert.alert('Success', 'Appointment cancelled');
          }
        }
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Appointment Details</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.card}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(appointment.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(appointment.status)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment Information</Text>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Farmer:</Text>
              <Text style={styles.infoValue}>{appointment.farmer}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{appointment.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Time:</Text>
              <Text style={styles.infoValue}>{appointment.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="hourglass-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Duration:</Text>
              <Text style={styles.infoValue}>{appointment.duration}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location & Contact</Text>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>{appointment.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Contact:</Text>
              <Text style={styles.infoValue}>{appointment.contact}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{appointment.notes}</Text>
          </View>

          {appointment.status === 'scheduled' && (
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]}
                onPress={handleMarkComplete}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Mark as Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={handleCancel}
              >
                <Ionicons name="close-circle-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Cancel Appointment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 90 : 70, // Add padding for navigation bar
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    marginRight: 8,
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  notes: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actions: {
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 