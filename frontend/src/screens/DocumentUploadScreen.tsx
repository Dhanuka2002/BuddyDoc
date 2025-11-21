import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';

interface DocumentUploadScreenProps {
  onBack: () => void;
}

interface UploadedDocument {
  id: string;
  name: string;
  uri: string;
  type: string;
  size: number;
  uploadDate: Date;
}

export default function DocumentUploadScreen({ onBack }: DocumentUploadScreenProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    try {
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const newDoc: UploadedDocument = {
          id: Date.now().toString(),
          name: file.name,
          uri: file.uri,
          type: file.mimeType || 'unknown',
          size: file.size || 0,
          uploadDate: new Date(),
        };
        setDocuments(prev => [...prev, newDoc]);
        Alert.alert('Success', 'Document uploaded successfully!');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = (id: string) => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setDocuments(prev => prev.filter(doc => doc.id !== id))
        }
      ]
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string): string => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📎';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Documents</Text>
        <Text style={styles.headerSubtitle}>Upload lab reports, prescriptions, and medical records</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Upload Button */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickDocument}
          disabled={uploading}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.uploadGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.uploadIcon}>📤</Text>
            <Text style={styles.uploadButtonText}>
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Text>
            <Text style={styles.uploadButtonSubtext}>
              PDF, Images, Word documents
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Document List */}
        <View style={styles.documentsSection}>
          <Text style={styles.sectionTitle}>
            {documents.length > 0 ? `Your Documents (${documents.length})` : 'No documents yet'}
          </Text>

          {documents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📋</Text>
              <Text style={styles.emptyStateText}>No documents uploaded</Text>
              <Text style={styles.emptyStateSubtext}>
                Upload your medical records, lab reports, or prescriptions to keep them organized
              </Text>
            </View>
          ) : (
            documents.map((doc) => (
              <View key={doc.id} style={styles.documentCard}>
                <View style={styles.documentIcon}>
                  <Text style={styles.documentIconText}>{getFileIcon(doc.type)}</Text>
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName} numberOfLines={2}>
                    {doc.name}
                  </Text>
                  <Text style={styles.documentMeta}>
                    {formatFileSize(doc.size)} • {doc.uploadDate.toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeDocument(doc.id)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>🔒 Privacy Notice</Text>
          <Text style={styles.infoText}>
            Your documents are stored locally on your device. They are never uploaded to external servers unless you explicitly enable cloud backup in settings.
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 Tips</Text>
          <Text style={styles.infoText}>
            • Keep recent lab reports handy{'\n'}
            • Include prescription photos{'\n'}
            • Upload discharge summaries{'\n'}
            • Add vaccination records
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  uploadButton: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadGradient: {
    padding: 24,
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  documentsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentIconText: {
    fontSize: 24,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 12,
    color: '#999',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 18,
    color: '#FF4444',
    fontWeight: '700',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
