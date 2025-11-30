import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

// Expert specialization areas
export type ExpertSpecialization = 
  | 'Crop Management'
  | 'Pest Control'
  | 'Soil Science'
  | 'Irrigation'
  | 'Animal Husbandry'
  | 'Agricultural Economics';

// Expert profile interface
export interface ExpertProfile {
  expertId: string;
  userId: string;
  specializations: ExpertSpecialization[];
  qualifications: {
    degree: string;
    institution: string;
    year: number;
  }[];
  experience: number; // Years of experience
  certifications: {
    name: string;
    issuingBody: string;
    year: number;
  }[];
  consultationFee: number;
  availability: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  };
  rating: number;
  totalConsultations: number;
  activeConsultations: string[]; // Array of consultation IDs
}

// Consultation interface
export interface Consultation {
  id: string;
  farmerId: string;
  expertId: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  topic: string;
  description: string;
  attachments?: string[]; // URLs to attached files
  scheduledDate?: Date;
  messages: {
    senderId: string;
    message: string;
    timestamp: Date;
    attachments?: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

interface ExpertContextType {
  expertProfile: ExpertProfile | null;
  consultations: Consultation[];
  loading: boolean;
  updateProfile: (profile: Partial<ExpertProfile>) => Promise<void>;
  acceptConsultation: (consultationId: string) => Promise<void>;
  completeConsultation: (consultationId: string) => Promise<void>;
  sendMessage: (consultationId: string, message: string, attachments?: string[]) => Promise<void>;
  getActiveConsultations: () => Promise<Consultation[]>;
  getPendingConsultations: () => Promise<Consultation[]>;
}

const ExpertContext = createContext<ExpertContextType | undefined>(undefined);

export function ExpertProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  // Load expert profile
  useEffect(() => {
    const loadExpertProfile = async () => {
      if (user?.role !== 'expert') return;
      
      try {
        const storedProfile = await AsyncStorage.getItem(`expertProfile:${user.id}`);
        if (storedProfile) {
          setExpertProfile(JSON.parse(storedProfile));
        }

        const storedConsultations = await AsyncStorage.getItem(`expertConsultations:${user.id}`);
        if (storedConsultations) {
          setConsultations(JSON.parse(storedConsultations));
        }
      } catch (error) {
        console.error('Error loading expert profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExpertProfile();
  }, [user]);

  const updateProfile = async (profileUpdate: Partial<ExpertProfile>) => {
    if (!user || !expertProfile) return;

    try {
      const updatedProfile = { ...expertProfile, ...profileUpdate };
      await AsyncStorage.setItem(`expertProfile:${user.id}`, JSON.stringify(updatedProfile));
      setExpertProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating expert profile:', error);
      throw error;
    }
  };

  const acceptConsultation = async (consultationId: string) => {
    if (!user || !expertProfile) return;

    try {
      const updatedConsultations = consultations.map(consultation => 
        consultation.id === consultationId
          ? { ...consultation, status: 'accepted' as const }
          : consultation
      );

      await AsyncStorage.setItem(`expertConsultations:${user.id}`, JSON.stringify(updatedConsultations));
      setConsultations(updatedConsultations);
    } catch (error) {
      console.error('Error accepting consultation:', error);
      throw error;
    }
  };

  const completeConsultation = async (consultationId: string) => {
    if (!user || !expertProfile) return;

    try {
      const updatedConsultations = consultations.map(consultation => 
        consultation.id === consultationId
          ? { ...consultation, status: 'completed' as const }
          : consultation
      );

      await AsyncStorage.setItem(`expertConsultations:${user.id}`, JSON.stringify(updatedConsultations));
      setConsultations(updatedConsultations);
    } catch (error) {
      console.error('Error completing consultation:', error);
      throw error;
    }
  };

  const sendMessage = async (consultationId: string, message: string, attachments: string[] = []) => {
    if (!user || !expertProfile) return;

    try {
      const updatedConsultations = consultations.map(consultation => {
        if (consultation.id === consultationId) {
          return {
            ...consultation,
            messages: [
              ...consultation.messages,
              {
                senderId: user.id,
                message,
                attachments,
                timestamp: new Date(),
              },
            ],
            updatedAt: new Date(),
          };
        }
        return consultation;
      });

      await AsyncStorage.setItem(`expertConsultations:${user.id}`, JSON.stringify(updatedConsultations));
      setConsultations(updatedConsultations);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const getActiveConsultations = async () => {
    return consultations.filter(c => c.status === 'accepted');
  };

  const getPendingConsultations = async () => {
    return consultations.filter(c => c.status === 'pending');
  };

  const value = {
    expertProfile,
    consultations,
    loading,
    updateProfile,
    acceptConsultation,
    completeConsultation,
    sendMessage,
    getActiveConsultations,
    getPendingConsultations,
  };

  return <ExpertContext.Provider value={value}>{children}</ExpertContext.Provider>;
}

export function useExpert() {
  const context = useContext(ExpertContext);
  if (context === undefined) {
    throw new Error('useExpert must be used within an ExpertProvider');
  }
  return context;
} 