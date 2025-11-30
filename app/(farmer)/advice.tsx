import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

interface Consultation {
  id: string;
  farmerId: string;
  expertId?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  topic: string;
  description: string;
  cropType: string;
  location: string;
  affectedArea: string;
  attachments: string[];
  messages: {
    senderId: string;
    message: string;
    timestamp: string;
    attachments?: string[];
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function AdviceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  // New consultation form state
  const [newConsultation, setNewConsultation] = useState({
    topic: '',
    description: '',
    cropType: '',
    location: '',
    affectedArea: '',
  });

  const [formErrors, setFormErrors] = useState({
    topic: '',
    description: '',
    cropType: '',
    location: '',
    affectedArea: '',
  });

  // Load consultations
  React.useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const storedConsultations = await AsyncStorage.getItem(`farmerConsultations:${user?.id}`);
      if (storedConsultations) {
        setConsultations(JSON.parse(storedConsultations));
      }
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {
      topic: '',
      description: '',
      cropType: '',
      location: '',
      affectedArea: '',
    };
    let isValid = true;

    if (!newConsultation.topic.trim()) {
      errors.topic = 'Topic is required';
      isValid = false;
    } else if (newConsultation.topic.length < 5) {
      errors.topic = 'Topic must be at least 5 characters';
      isValid = false;
    }

    if (!newConsultation.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    } else if (newConsultation.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
      isValid = false;
    }

    if (!newConsultation.cropType.trim()) {
      errors.cropType = 'Crop type is required';
      isValid = false;
    }

    if (!newConsultation.location.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    }

    if (!newConsultation.affectedArea.trim()) {
      errors.affectedArea = 'Affected area is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddConsultation = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to create a consultation');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const consultation: Consultation = {
        id: Date.now().toString(),
        farmerId: user.id,
        status: 'pending',
        topic: newConsultation.topic.trim(),
        description: newConsultation.description.trim(),
        cropType: newConsultation.cropType.trim(),
        location: newConsultation.location.trim(),
        affectedArea: newConsultation.affectedArea.trim(),
        attachments: attachments,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedConsultations = [...consultations, consultation];
      await AsyncStorage.setItem(`farmerConsultations:${user.id}`, JSON.stringify(updatedConsultations));
      setConsultations(updatedConsultations);
      setModalVisible(false);
      setNewConsultation({
        topic: '',
        description: '',
        cropType: '',
        location: '',
        affectedArea: '',
      });
      setFormErrors({
        topic: '',
        description: '',
        cropType: '',
        location: '',
        affectedArea: '',
      });
      setAttachments([]);
      Alert.alert('Success', 'Consultation request submitted successfully');
    } catch (error) {
      console.error('Error creating consultation:', error);
      Alert.alert('Error', 'Failed to create consultation request');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedConsultation || !newMessage.trim() || !user) return;

    try {
      const message = {
        senderId: user.id,
        message: newMessage,
        timestamp: new Date().toISOString(),
        attachments: attachments,
      };

      const updatedConsultation = {
        ...selectedConsultation,
        messages: [...selectedConsultation.messages, message],
        updatedAt: new Date().toISOString(),
      };

      const updatedConsultations = consultations.map(c =>
        c.id === selectedConsultation.id ? updatedConsultation : c
      );

      await AsyncStorage.setItem(`farmerConsultations:${user.id}`, JSON.stringify(updatedConsultations));
      setConsultations(updatedConsultations);
      setSelectedConsultation(updatedConsultation);
      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photo library to attach images.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }
            }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const newAttachments = [...attachments, ...result.assets.map(asset => asset.uri)];
        if (newAttachments.length > 5) {
          Alert.alert('Warning', 'You can only attach up to 5 images');
          setAttachments(newAttachments.slice(0, 5));
        } else {
          setAttachments(newAttachments);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: Consultation['status']) => {
    switch (status) {
      case 'pending':
        return '#FFA000';
      case 'accepted':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Agricultural Advice</Text>
        <TouchableOpacity 
          style={styles.newButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {consultations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color="#666" />
            <Text style={styles.emptyStateText}>No consultations yet</Text>
            <TouchableOpacity 
              style={styles.newConsultationButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.newConsultationButtonText}>Request Consultation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          consultations.map((consultation) => (
            <TouchableOpacity
              key={consultation.id}
              style={styles.consultationCard}
              onPress={() => setSelectedConsultation(consultation)}
            >
              <View style={styles.consultationHeader}>
                <Text style={styles.consultationTopic}>{consultation.topic}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(consultation.status) }]}>
                  <Text style={styles.statusText}>{consultation.status}</Text>
                </View>
              </View>
              <Text style={styles.consultationDescription} numberOfLines={2}>
                {consultation.description}
              </Text>
              <View style={styles.consultationFooter}>
                <Text style={styles.consultationDate}>
                  {new Date(consultation.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.messageCount}>
                  {consultation.messages.length} messages
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* New Consultation Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Consultation</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <TextInput
                style={[styles.input, formErrors.topic ? styles.inputError : null]}
                placeholder="Topic"
                value={newConsultation.topic}
                onChangeText={(text) => {
                  setNewConsultation({ ...newConsultation, topic: text });
                  if (formErrors.topic) {
                    setFormErrors({ ...formErrors, topic: '' });
                  }
                }}
              />
              {formErrors.topic ? <Text style={styles.errorText}>{formErrors.topic}</Text> : null}

              <TextInput
                style={[styles.input, styles.textArea, formErrors.description ? styles.inputError : null]}
                placeholder="Description"
                multiline
                numberOfLines={4}
                value={newConsultation.description}
                onChangeText={(text) => {
                  setNewConsultation({ ...newConsultation, description: text });
                  if (formErrors.description) {
                    setFormErrors({ ...formErrors, description: '' });
                  }
                }}
              />
              {formErrors.description ? <Text style={styles.errorText}>{formErrors.description}</Text> : null}

              <TextInput
                style={[styles.input, formErrors.cropType ? styles.inputError : null]}
                placeholder="Crop Type"
                value={newConsultation.cropType}
                onChangeText={(text) => {
                  setNewConsultation({ ...newConsultation, cropType: text });
                  if (formErrors.cropType) {
                    setFormErrors({ ...formErrors, cropType: '' });
                  }
                }}
              />
              {formErrors.cropType ? <Text style={styles.errorText}>{formErrors.cropType}</Text> : null}

              <TextInput
                style={[styles.input, formErrors.location ? styles.inputError : null]}
                placeholder="Location"
                value={newConsultation.location}
                onChangeText={(text) => {
                  setNewConsultation({ ...newConsultation, location: text });
                  if (formErrors.location) {
                    setFormErrors({ ...formErrors, location: '' });
                  }
                }}
              />
              {formErrors.location ? <Text style={styles.errorText}>{formErrors.location}</Text> : null}

              <TextInput
                style={[styles.input, formErrors.affectedArea ? styles.inputError : null]}
                placeholder="Affected Area"
                value={newConsultation.affectedArea}
                onChangeText={(text) => {
                  setNewConsultation({ ...newConsultation, affectedArea: text });
                  if (formErrors.affectedArea) {
                    setFormErrors({ ...formErrors, affectedArea: '' });
                  }
                }}
              />
              {formErrors.affectedArea ? <Text style={styles.errorText}>{formErrors.affectedArea}</Text> : null}

              <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={24} color="#4CAF50" />
                <Text style={styles.attachButtonText}>Attach Images</Text>
              </TouchableOpacity>

              {attachments.length > 0 && (
                <View style={styles.attachmentsContainer}>
                  {attachments.map((uri, index) => (
                    <View key={index} style={styles.attachmentWrapper}>
                      <Image source={{ uri }} style={styles.attachmentPreview} />
                      <TouchableOpacity
                        style={styles.removeAttachmentButton}
                        onPress={() => removeAttachment(index)}
                      >
                        <Ionicons name="close-circle" size={24} color="#F44336" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleAddConsultation}>
                <Text style={styles.submitButtonText}>Submit Consultation</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Consultation Detail Modal */}
      <Modal
        visible={!!selectedConsultation}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedConsultation(null)}
      >
        {selectedConsultation && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedConsultation.topic}</Text>
                <TouchableOpacity onPress={() => setSelectedConsultation(null)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.messagesContainer}>
                {selectedConsultation.messages.map((message, index) => (
                  <View
                    key={index}
                    style={[
                      styles.messageBubble,
                      message.senderId === user?.id ? styles.sentMessage : styles.receivedMessage,
                    ]}
                  >
                    <Text style={styles.messageText}>{message.message}</Text>
                    <Text style={styles.messageTime}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.messageInputContainer}>
                <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
                  <Ionicons name="image-outline" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChangeText={setNewMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                  <Ionicons name="send" size={24} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  newButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  newConsultationButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  newConsultationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  consultationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  consultationTopic: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  consultationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  consultationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consultationDate: {
    fontSize: 12,
    color: '#999',
  },
  messageCount: {
    fontSize: 12,
    color: '#4CAF50',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    marginBottom: 16,
  },
  attachButtonText: {
    color: '#4CAF50',
    marginLeft: 8,
    fontSize: 16,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  attachmentWrapper: {
    position: 'relative',
    margin: 4,
  },
  attachmentPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  sentMessage: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#E8E8E8',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  sendButton: {
    padding: 8,
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
  },
}); 