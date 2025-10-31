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

interface MedicationScreenProps {
  onBack: () => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  prescribedBy: string;
  notes: string;
  active: boolean;
}

export default function MedicationScreen({ onBack }: MedicationScreenProps) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMed, setCurrentMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescribedBy: '',
    notes: '',
  });

  const addMedication = () => {
    if (!currentMed.name.trim()) {
      Alert.alert('Error', 'Please enter medication name');
      return;
    }

    const newMed: Medication = {
      id: Date.now().toString(),
      name: currentMed.name,
      dosage: currentMed.dosage,
      frequency: currentMed.frequency,
      startDate: new Date(),
      prescribedBy: currentMed.prescribedBy,
      notes: currentMed.notes,
      active: true,
    };

    setMedications(prev => [newMed, ...prev]);
    setModalVisible(false);
    setCurrentMed({ name: '', dosage: '', frequency: '', prescribedBy: '', notes: '' });
    Alert.alert('Success', 'Medication added successfully!');
  };

  const toggleMedicationActive = (id: string) => {
    setMedications(prev =>
      prev.map(med =>
        med.id === id ? { ...med, active: !med.active } : med
      )
    );
  };

  const deleteMedication = (id: string) => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setMedications(prev => prev.filter(m => m.id !== id))
        }
      ]
    );
  };

  const activeMeds = medications.filter(m => m.active);
  const inactiveMeds = medications.filter(m => !m.active);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medications</Text>
        <Text style={styles.headerSubtitle}>Track your medication schedule and refills</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Add Medication Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.addGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.addIcon}>💊</Text>
            <Text style={styles.addButtonText}>Add Medication</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Active Medications */}
        <View style={styles.medicationSection}>
          <Text style={styles.sectionTitle}>
            Active Medications ({activeMeds.length})
          </Text>

          {activeMeds.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>💊</Text>
              <Text style={styles.emptyStateText}>No active medications</Text>
              <Text style={styles.emptyStateSubtext}>
                Add your current medications to track dosage and schedules
              </Text>
            </View>
          ) : (
            activeMeds.map((med) => (
              <View key={med.id} style={styles.medicationCard}>
                <View style={styles.medHeader}>
                  <View style={styles.medIconContainer}>
                    <Text style={styles.medIcon}>💊</Text>
                  </View>
                  <View style={styles.medInfo}>
                    <Text style={styles.medName}>{med.name}</Text>
                    {med.dosage && (
                      <Text style={styles.medDetail}>💉 {med.dosage}</Text>
                    )}
                    {med.frequency && (
                      <Text style={styles.medDetail}>⏰ {med.frequency}</Text>
                    )}
                    {med.prescribedBy && (
                      <Text style={styles.medDetail}>👨‍⚕️ Dr. {med.prescribedBy}</Text>
                    )}
                  </View>
                </View>

                {med.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{med.notes}</Text>
                  </View>
                )}

                <View style={styles.medActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleMedicationActive(med.id)}
                  >
                    <Text style={styles.actionButtonText}>✓ Mark Inactive</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteActionButton]}
                    onPress={() => deleteMedication(med.id)}
                  >
                    <Text style={[styles.actionButtonText, styles.deleteActionText]}>✕ Delete</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.medDate}>
                  Started: {med.startDate.toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Inactive Medications */}
        {inactiveMeds.length > 0 && (
          <View style={styles.medicationSection}>
            <Text style={styles.sectionTitle}>
              Inactive Medications ({inactiveMeds.length})
            </Text>

            {inactiveMeds.map((med) => (
              <View key={med.id} style={[styles.medicationCard, styles.inactiveMedCard]}>
                <View style={styles.medHeader}>
                  <View style={[styles.medIconContainer, styles.inactiveMedIcon]}>
                    <Text style={styles.medIcon}>💊</Text>
                  </View>
                  <View style={styles.medInfo}>
                    <Text style={[styles.medName, styles.inactiveMedName]}>{med.name}</Text>
                    {med.dosage && (
                      <Text style={styles.medDetail}>💉 {med.dosage}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.medActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleMedicationActive(med.id)}
                  >
                    <Text style={styles.actionButtonText}>↻ Reactivate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteActionButton]}
                    onPress={() => deleteMedication(med.id)}
                  >
                    <Text style={[styles.actionButtonText, styles.deleteActionText]}>✕ Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 Medication Tips</Text>
          <Text style={styles.infoText}>
            • Keep dosage and timing accurate{'\n'}
            • Note any side effects{'\n'}
            • Set reminders for regular medications{'\n'}
            • Update list after doctor visits{'\n'}
            • Mark medications as inactive when stopped
          </Text>
        </View>
      </ScrollView>

      {/* Add Medication Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Medication</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Medication Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Paracetamol, Amoxicillin"
                value={currentMed.name}
                onChangeText={(text) => setCurrentMed(prev => ({ ...prev, name: text }))}
              />

              <Text style={styles.inputLabel}>Dosage</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 500mg, 2 tablets"
                value={currentMed.dosage}
                onChangeText={(text) => setCurrentMed(prev => ({ ...prev, dosage: text }))}
              />

              <Text style={styles.inputLabel}>Frequency</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Twice daily, Every 8 hours"
                value={currentMed.frequency}
                onChangeText={(text) => setCurrentMed(prev => ({ ...prev, frequency: text }))}
              />

              <Text style={styles.inputLabel}>Prescribed By</Text>
              <TextInput
                style={styles.input}
                placeholder="Doctor's name"
                value={currentMed.prescribedBy}
                onChangeText={(text) => setCurrentMed(prev => ({ ...prev, prescribedBy: text }))}
              />

              <Text style={styles.inputLabel}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Special instructions, side effects to watch, etc."
                value={currentMed.notes}
                onChangeText={(text) => setCurrentMed(prev => ({ ...prev, notes: text }))}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity style={styles.submitButton} onPress={addMedication}>
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.submitButtonText}>Add Medication</Text>
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
  medicationSection: {
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
  medicationCard: {
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
  inactiveMedCard: {
    opacity: 0.6,
  },
  medHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  medIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inactiveMedIcon: {
    backgroundColor: '#F5F5F5',
  },
  medIcon: {
    fontSize: 24,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  inactiveMedName: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  medDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notesContainer: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  medActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  deleteActionButton: {
    backgroundColor: '#FFE0E0',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deleteActionText: {
    color: '#FF4444',
  },
  medDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
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
