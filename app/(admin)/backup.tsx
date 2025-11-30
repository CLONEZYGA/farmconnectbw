import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../_services/storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function BackupTab() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await StorageService.exportData();
      const fileName = `backup_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, data);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Backup',
        });
      } else {
        Alert.alert('Sharing not available', 'Unable to share the backup file.');
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export data. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);
      // In a real app, you would use a file picker here
      // For this example, we'll simulate importing from a file
      Alert.alert(
        'Import Backup',
        'This would open a file picker in a real app. For now, we\'ll simulate importing.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Simulate Import',
            onPress: async () => {
              try {
                // Simulate importing data
                const mockData = JSON.stringify({
                  users: [],
                  logs: [],
                  content: [],
                  settings: {
                    registrationOpen: true,
                    maintenanceMode: false,
                    featureFlags: {},
                  },
                  analytics: {
                    totalUsers: 0,
                    activeUsers: 0,
                    userGrowth: [],
                    roleDistribution: [],
                  },
                });
                
                await StorageService.importData(mockData);
                Alert.alert('Success', 'Data imported successfully!');
              } catch (error) {
                Alert.alert('Import Failed', 'Failed to import data. Please try again.');
                console.error('Import error:', error);
              }
            },
          },
        ]
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Backup</Text>
        <Text style={styles.sectionDescription}>
          Export your current data to a JSON file or import data from a previous backup.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton]}
          onPress={handleExport}
          disabled={isExporting}
        >
          <Ionicons name="download" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.importButton]}
          onPress={handleImport}
          disabled={isImporting}
        >
          <Ionicons name="cloud-upload" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>
            {isImporting ? 'Importing...' : 'Import Data'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Backup Information</Text>
        <Text style={styles.infoText}>
          • The backup file contains all system data including users, content, settings, and logs.
        </Text>
        <Text style={styles.infoText}>
          • Export your data regularly to prevent data loss.
        </Text>
        <Text style={styles.infoText}>
          • Importing data will replace all current data with the imported data.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  exportButton: {
    backgroundColor: '#007AFF',
  },
  importButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
}); 