import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../_services/storage';
import { ContentItem } from '../_types/admin';

export default function ContentTab() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedType, setSelectedType] = useState<'news' | 'announcement' | 'help'>('news');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'news' as const,
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const loadedContent = await StorageService.getContent();
    setContent(loadedContent);
  };

  const saveContent = async (item: ContentItem) => {
    const updatedContent = editingContent
      ? content.map(c => (c.id === item.id ? item : c))
      : [...content, item];
    
    await StorageService.saveContent(updatedContent);
    setContent(updatedContent);
    setIsModalVisible(false);
    setEditingContent(null);
    setFormData({ title: '', content: '', type: 'news' });
  };

  const deleteContent = async (id: string) => {
    const updatedContent = content.filter(item => item.id !== id);
    await StorageService.saveContent(updatedContent);
    setContent(updatedContent);
  };

  const openEditModal = (item: ContentItem) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    const now = new Date().toISOString();
    const item: ContentItem = {
      id: editingContent?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      type: formData.type,
      createdAt: editingContent?.createdAt || now,
      updatedAt: now,
    };
    saveContent(item);
  };

  const filteredContent = content.filter(item => item.type === selectedType);

  const renderContentItem = ({ item }: { item: ContentItem }) => (
    <View style={styles.contentItem}>
      <View style={styles.contentInfo}>
        <Text style={styles.contentTitle}>{item.title}</Text>
        <Text style={styles.contentDate}>
          Updated: {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.contentActions}>
        <TouchableOpacity
          onPress={() => openEditModal(item)}
          style={styles.actionButton}
        >
          <Ionicons name="pencil" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteContent(item.id)}
          style={styles.actionButton}
        >
          <Ionicons name="trash" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        {(['news', 'announcement', 'help'] as const).map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              selectedType === type && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedType === type && styles.filterButtonTextActive,
            ]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredContent}
        renderItem={renderContentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contentList}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingContent ? 'Edit Content' : 'Add New Content'}
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={formData.title}
              onChangeText={text => setFormData({ ...formData, title: text })}
            />
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="Content"
              value={formData.content}
              onChangeText={text => setFormData({ ...formData, content: text })}
              multiline
              numberOfLines={4}
            />
            <View style={styles.typeSelector}>
              {(['news', 'announcement', 'help'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    formData.type === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, type })}
                >
                  <Text style={[
                    styles.typeButtonText,
                    formData.type === type && styles.typeButtonTextActive,
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSubmit}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
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
  contentList: {
    padding: 16,
  },
  contentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contentDate: {
    fontSize: 12,
    color: '#666',
  },
  contentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  form: {
    padding: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  contentInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    color: '#333',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  cancelButton: {
    padding: 12,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 