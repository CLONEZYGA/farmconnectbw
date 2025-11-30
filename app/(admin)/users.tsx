import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../_services/storage';
import { User, UserRole, UserStatus } from '../_types/admin';

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, selectedRole, searchQuery]);

  const loadUsers = async () => {
    const loadedUsers = await StorageService.getUsers();
    setUsers(loadedUsers);
  };

  const filterUsers = () => {
    let filtered = users;
    
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'inactive' : 'active',
        };
      }
      return user;
    });

    await StorageService.saveUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const deleteUser = async (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    await StorageService.saveUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userMeta}>
          <Text style={styles.userRole}>{item.role}</Text>
          <Text style={[
            styles.userStatus,
            { color: item.status === 'active' ? '#4CAF50' : '#F44336' }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          onPress={() => toggleUserStatus(item.id)}
          style={styles.actionButton}
        >
          <Ionicons
            name={item.status === 'active' ? 'pause-circle' : 'play-circle'}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteUser(item.id)}
          style={styles.actionButton}
        >
          <Ionicons name="trash" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.roleFilter}>
          {(['all', 'admin', 'farmer', 'buyer', 'expert'] as const).map(role => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleButton,
                selectedRole === role && styles.roleButtonActive,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={[
                styles.roleButtonText,
                selectedRole === role && styles.roleButtonTextActive,
              ]}>
                {role === 'all' ? 'All' : role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.userList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filters: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  roleFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
  },
  roleButtonText: {
    color: '#333',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  userList: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  userRole: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  userStatus: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  userActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
}); 