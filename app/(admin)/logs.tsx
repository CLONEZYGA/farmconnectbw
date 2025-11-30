import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../_services/storage';
import { SystemLog } from '../_types/admin';

export default function LogsTab() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const loadedLogs = await StorageService.getLogs();
    setLogs(loadedLogs);
  };

  const filteredLogs = selectedFilter
    ? logs.filter(log => log.action === selectedFilter)
    : logs;

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  const renderLogItem = ({ item }: { item: SystemLog }) => (
    <View style={styles.logItem}>
      <View style={styles.logInfo}>
        <Text style={styles.logAction}>{item.action}</Text>
        <Text style={styles.logDetails}>{item.details}</Text>
        <Text style={styles.logTimestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            !selectedFilter && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter(null)}
        >
          <Text style={[
            styles.filterButtonText,
            !selectedFilter && styles.filterButtonTextActive,
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        {uniqueActions.map(action => (
          <TouchableOpacity
            key={action}
            style={[
              styles.filterButton,
              selectedFilter === action && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(action)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === action && styles.filterButtonTextActive,
            ]}>
              {action}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredLogs}
        renderItem={renderLogItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.logList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterBar: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f5f5f5',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#333',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  logList: {
    padding: 16,
  },
  logItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  logInfo: {
    flex: 1,
  },
  logAction: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  logDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  logTimestamp: {
    fontSize: 12,
    color: '#999',
  },
}); 