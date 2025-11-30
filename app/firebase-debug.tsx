import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { getCurrentUserProfile } from '../utils/firebaseDebug';
import { auth } from '../config/firebase';

export default function FirebaseDebugScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const p = await getCurrentUserProfile();
      setProfile(p);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Firebase Debug</Text>
      <Text>Signed in: {auth.currentUser ? auth.currentUser.email : 'No'}</Text>
      <Button title="Refresh" onPress={load} />
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '500' }}>Profile</Text>
        <Text>{profile ? JSON.stringify(profile, null, 2) : (loading ? 'Loading...' : 'No profile found')}</Text>
      </View>
    </ScrollView>
  );
}
