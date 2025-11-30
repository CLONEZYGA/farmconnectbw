import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Report {
  id: string;
  title: string;
  type: 'consultation' | 'analysis' | 'recommendation';
  farmer: string;
  date: string;
  status: 'draft' | 'published';
}

const reports: Report[] = [
  {
    id: '1',
    title: 'Tomato Disease Analysis Report',
    type: 'analysis',
    farmer: 'John Smith',
    date: '2024-03-18',
    status: 'published',
  },
  {
    id: '2',
    title: 'Soil Health Assessment',
    type: 'analysis',
    farmer: 'Maria Garcia',
    date: '2024-03-17',
    status: 'draft',
  },
  {
    id: '3',
    title: 'Pest Control Recommendations',
    type: 'recommendation',
    farmer: 'David Brown',
    date: '2024-03-16',
    status: 'published',
  },
];

export default function Reports() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | Report['type']>('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getReportIcon = (type: Report['type']) => {
    switch (type) {
      case 'consultation':
        return 'people-outline';
      case 'analysis':
        return 'analytics-outline';
      case 'recommendation':
        return 'bulb-outline';
      default:
        return 'document-outline';
    }
  };

  const handleCreateReport = () => {
    router.push('/(expert)/reports/create');
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
          <Text style={styles.headerTitle}>Reports</Text>
          <TouchableOpacity onPress={handleCreateReport} style={styles.createButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={[
            { id: 'all', label: 'All' },
            { id: 'consultation', label: 'Consultations' },
            { id: 'analysis', label: 'Analysis' },
            { id: 'recommendation', label: 'Recommendations' }
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedType === item.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedType(item.id)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType === item.id && styles.filterButtonTextActive
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
        />
      </View>

      <ScrollView style={styles.content}>
        {filteredReports.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={styles.reportCard}
            onPress={() => router.push(`/(expert)/reports/${report.id}`)}
          >
            <View style={styles.reportHeader}>
              <View style={styles.reportType}>
                <Ionicons name={getReportIcon(report.type)} size={20} color="#4CAF50" />
                <Text style={styles.reportTypeText}>{report.type}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: report.status === 'published' ? '#4CAF50' : '#FFA000' }]}>
                <Text style={styles.statusText}>{report.status}</Text>
              </View>
            </View>
            <Text style={styles.reportTitle}>{report.title}</Text>
            <View style={styles.reportInfo}>
              <View style={styles.reportInfoItem}>
                <Ionicons name="person-outline" size={16} color="#666" />
                <Text style={styles.reportInfoText}>{report.farmer}</Text>
              </View>
              <View style={styles.reportInfoItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.reportInfoText}>{report.date}</Text>
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
  createButton: {
    padding: 8,
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
  filterContainer: {
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 8,
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportTypeText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
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
    textTransform: 'capitalize',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  reportInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportInfoText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 4,
  },
}); 