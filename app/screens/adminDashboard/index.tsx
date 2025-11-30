import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function AdminDashboard() {
  const { logout, user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#343a40" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.grid}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Users</Text>
              <Text style={styles.cardSubtitle}>Manage user accounts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Reports</Text>
              <Text style={styles.cardSubtitle}>System statistics</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Settings</Text>
              <Text style={styles.cardSubtitle}>Configure system</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Content</Text>
              <Text style={styles.cardSubtitle}>Manage platform content</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Logs</Text>
              <Text style={styles.cardSubtitle}>System activity</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Backup</Text>
              <Text style={styles.cardSubtitle}>Data management</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#343a40',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: width > 600 ? 28 : 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  welcomeText: {
    fontSize: width > 600 ? 16 : 14,
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#dc3545',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width > 600 ? 16 : 14,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: width * 0.04,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: width > 600 ? width * 0.28 : width * 0.44,
    aspectRatio: 1.2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: width > 600 ? 22 : 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: width > 600 ? 16 : 14,
    color: '#666',
  },
}); 