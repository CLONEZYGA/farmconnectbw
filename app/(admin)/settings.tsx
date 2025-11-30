import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { StorageService } from '../_services/storage';
import { SystemSettings } from '../_types/admin';

export default function SettingsTab() {
  const [settings, setSettings] = useState<SystemSettings>({
    registrationOpen: true,
    maintenanceMode: false,
    featureFlags: {},
  });
  const [newFeatureFlag, setNewFeatureFlag] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = await StorageService.getSettings();
    setSettings(loadedSettings);
  };

  const updateSettings = async (updatedSettings: SystemSettings) => {
    await StorageService.saveSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  const toggleSetting = (key: keyof SystemSettings) => {
    if (key === 'featureFlags') return;
    
    const updatedSettings = {
      ...settings,
      [key]: !settings[key],
    };
    updateSettings(updatedSettings);
  };

  const toggleFeatureFlag = (flag: string) => {
    const updatedSettings = {
      ...settings,
      featureFlags: {
        ...settings.featureFlags,
        [flag]: !settings.featureFlags[flag],
      },
    };
    updateSettings(updatedSettings);
  };

  const addFeatureFlag = () => {
    if (!newFeatureFlag.trim()) return;
    
    const updatedSettings = {
      ...settings,
      featureFlags: {
        ...settings.featureFlags,
        [newFeatureFlag.trim()]: false,
      },
    };
    updateSettings(updatedSettings);
    setNewFeatureFlag('');
  };

  const removeFeatureFlag = (flag: string) => {
    const { [flag]: _, ...remainingFlags } = settings.featureFlags;
    const updatedSettings = {
      ...settings,
      featureFlags: remainingFlags,
    };
    updateSettings(updatedSettings);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Registration Open</Text>
            <Text style={styles.settingDescription}>
              Allow new users to register on the platform
            </Text>
          </View>
          <Switch
            value={settings.registrationOpen}
            onValueChange={() => toggleSetting('registrationOpen')}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Maintenance Mode</Text>
            <Text style={styles.settingDescription}>
              Temporarily disable the platform for maintenance
            </Text>
          </View>
          <Switch
            value={settings.maintenanceMode}
            onValueChange={() => toggleSetting('maintenanceMode')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feature Flags</Text>
        
        <View style={styles.featureFlagInput}>
          <TextInput
            style={styles.input}
            placeholder="New feature flag name"
            value={newFeatureFlag}
            onChangeText={setNewFeatureFlag}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addFeatureFlag}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {Object.entries(settings.featureFlags).map(([flag, enabled]) => (
          <View key={flag} style={styles.featureFlagItem}>
            <View style={styles.featureFlagInfo}>
              <Text style={styles.featureFlagLabel}>{flag}</Text>
            </View>
            <View style={styles.featureFlagActions}>
              <Switch
                value={enabled}
                onValueChange={() => toggleFeatureFlag(flag)}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFeatureFlag(flag)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  featureFlagInput: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  featureFlagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  featureFlagInfo: {
    flex: 1,
  },
  featureFlagLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureFlagActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    color: '#F44336',
  },
}); 