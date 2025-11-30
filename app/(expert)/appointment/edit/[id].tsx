import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
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

export default function EditAppointment() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    farmer: '',
    date: '',
    time: '',
    topic: '',
    location: '',
    notes: '',
    contact: '',
    duration: '',
  });

  useEffect(() => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      setFormData({
        farmer: appointment.farmer,
        date: appointment.date,
        time: appointment.time,
        topic: appointment.topic,
        location: appointment.location,
        notes: appointment.notes,
        contact: appointment.contact,
        duration: appointment.duration,
      });
    }
  }, [id]);

  const handleSubmit = () => {
    // Here you would typically update the appointment in your backend
    console.log('Updated appointment:', formData);
    Alert.alert(
      'Success',
      'Appointment updated successfully',
      [
        {
          text: 'OK',
          onPress: () => router.back()
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
          <Text style={styles.headerTitle}>Edit Appointment</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Farmer Name</Text>
            <TextInput
              style={styles.input}
              value={formData.farmer}
              onChangeText={(text) => setFormData(prev => ({ ...prev, farmer: text }))}
              placeholder="Enter farmer's name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              value={formData.time}
              onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
              placeholder="HH:MM AM/PM"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Topic</Text>
            <TextInput
              style={styles.input}
              value={formData.topic}
              onChangeText={(text) => setFormData(prev => ({ ...prev, topic: text }))}
              placeholder="Enter consultation topic"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
              placeholder="Enter meeting location"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact</Text>
            <TextInput
              style={styles.input}
              value={formData.contact}
              onChangeText={(text) => setFormData(prev => ({ ...prev, contact: text }))}
              placeholder="Enter contact number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(text) => setFormData(prev => ({ ...prev, duration: text }))}
              placeholder="Enter appointment duration"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              placeholder="Enter any additional notes"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
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
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 90 : 70, // Add padding for navigation bar
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
  },
}); 