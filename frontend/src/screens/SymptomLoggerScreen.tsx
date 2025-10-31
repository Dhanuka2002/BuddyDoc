import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SymptomLoggerScreenProps {
  onBack: () => void;
}

interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: Date;
  notes: string;
  duration: string;
}

export default function SymptomLoggerScreen({ onBack }: SymptomLoggerScreenProps) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState({
    name: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe',
    notes: '',
    duration: '',
  });

  const addSymptom = () => {
    if (!currentSymptom.name.trim()) {
      Alert.alert('Error', 'Please enter a symptom name');
      return;
    }

    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: currentSymptom.name,
      severity: currentSymptom.severity,
      date: new Date(),
      notes: currentSymptom.notes,
      duration: currentSymptom.duration,
    };

    setSymptoms(prev => [newSymptom, ...prev]);
    setModalVisible(false);
    setCurrentSymptom({ name: '', severity: 'mild', notes: '', duration: '' });
    Alert.alert('Success', 'Symptom logged successfully!');
  };

  const deleteSymptom = (id: string) => {
    Alert.alert(
      'Delete Symptom',
      'Are you sure you want to delete this symptom log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setSymptoms(prev => prev.filter(s => s.id !== id))
        }
      ]
    );
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'mild': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'severe': return '#F44336';
      default: return '#999';
    }
  };

  const getSeverityIcon = (severity: string): string => {
    switch (severity) {
      case 'mild': return '😐';
      case 'moderate': return '😟';
      case 'severe': return '😣';
      default: return '🤔';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Symptom Tracker</Text>
        <Text style={styles.headerSubtitle}>Log and monitor your health symptoms</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Add Symptom Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            style={styles.addGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.addIcon}>➕</Text>
            <Text style={styles.addButtonText}>Log New Symptom</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Symptom List */}
        <View style={styles.symptomsSection}>
          <Text style={styles.sectionTitle}>
            {symptoms.length > 0 ? `Symptom History (${symptoms.length})` : 'No symptoms logged'}
          </Text>

          {symptoms.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📋</Text>
              <Text style={styles.emptyStateText}>No symptoms logged yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start tracking your symptoms to help your doctor understand your condition better
              </Text>
            </View>
          ) : (
            symptoms.map((symptom) => (
              <View key={symptom.id} style={styles.symptomCard}>
                <View style={styles.symptomHeader}>
                  <View style={styles.symptomTitleRow}>
                    <Text style={styles.symptomIcon}>{getSeverityIcon(symptom.severity)}</Text>
                    <View style={styles.symptomTitleContainer}>
                      <Text style={styles.symptomName}>{symptom.name}</Text>
                      <Text style={styles.symptomDate}>
                        {symptom.date.toLocaleDateString()} at {symptom.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteSymptom(symptom.id)}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.symptomDetails}>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(symptom.severity) + '20' }]}>
                    <Text style={[styles.severityText, { color: getSeverityColor(symptom.severity) }]}>
                      {symptom.severity.toUpperCase()}
                    </Text>
                  </View>

                  {symptom.duration ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Duration:</Text>
                      <Text style={styles.detailValue}>{symptom.duration}</Text>
                    </View>
                  ) : null}

                  {symptom.notes ? (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesText}>{symptom.notes}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 Tracking Tips</Text>
          <Text style={styles.infoText}>
            • Log symptoms as soon as they occur{'\n'}
            • Rate severity honestly{'\n'}
            • Note what you were doing when it started{'\n'}
            • Track duration and frequency{'\n'}
            • Mention any triggers
          </Text>
        </View>
      </ScrollView>

      {/* Add Symptom Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log New Symptom</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Symptom Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Headache, Fever, Cough"
                value={currentSymptom.name}
                onChangeText={(text) => setCurrentSymptom(prev => ({ ...prev, name: text }))}
              />

              <Text style={styles.inputLabel}>Severity *</Text>
              <View style={styles.severityButtons}>
                {(['mild', 'moderate', 'severe'] as const).map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.severityButton,
                      currentSymptom.severity === level && styles.severityButtonActive,
                      { borderColor: getSeverityColor(level) }
                    ]}
                    onPress={() => setCurrentSymptom(prev => ({ ...prev, severity: level }))}
                  >
                    <Text style={styles.severityButtonIcon}>{getSeverityIcon(level)}</Text>
                    <Text style={[
                      styles.severityButtonText,
                      currentSymptom.severity === level && styles.severityButtonTextActive
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Duration</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 2 hours, 3 days"
                value={currentSymptom.duration}
                onChangeText={(text) => setCurrentSymptom(prev => ({ ...prev, duration: text }))}
              />

              <Text style={styles.inputLabel}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any additional details..."
                value={currentSymptom.notes}
                onChangeText={(text) => setCurrentSymptom(prev => ({ ...prev, notes: text }))}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity style={styles.submitButton} onPress={addSymptom}>
                <LinearGradient
                  colors={['#f093fb', '#f5576c']}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.submitButtonText}>Log Symptom</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addButton: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  symptomsSection: {
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
  symptomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  symptomHeader: {
    marginBottom: 12,
  },
  symptomTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  symptomIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  symptomTitleContainer: {
    flex: 1,
  },
  symptomName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  symptomDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FF4444',
    fontWeight: '700',
  },
  symptomDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalClose: {
    fontSize: 28,
    color: '#999',
    fontWeight: '300',
  },
  modalForm: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  severityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  severityButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
  },
  severityButtonActive: {
    backgroundColor: '#F0F0F0',
  },
  severityButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  severityButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  severityButtonTextActive: {
    color: '#333',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
