import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Share
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ConsultationPrepScreenProps {
  onBack: () => void;
}

export default function ConsultationPrepScreen({ onBack }: ConsultationPrepScreenProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'questions'>('summary');

  // Mock data - in real app, this would come from your data store
  const symptoms = [
    { name: 'Headache', severity: 'moderate', duration: '3 days' },
    { name: 'Fever', severity: 'mild', duration: '2 days' },
  ];

  const medications = [
    { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily' },
  ];

  const documents = [
    { name: 'Blood Test Report.pdf', date: '2025-10-25' },
  ];

  const suggestedQuestions = [
    'What could be causing my symptoms?',
    'Are there any tests I should take?',
    'Should I continue my current medications?',
    'What lifestyle changes would you recommend?',
    'When should I schedule a follow-up?',
    'Are there any warning signs I should watch for?',
  ];

  const shareConsultationSummary = async () => {
    const summary = `
BuddyDoc - Consultation Summary
Generated: ${new Date().toLocaleDateString()}

SYMPTOMS:
${symptoms.map(s => `• ${s.name} (${s.severity}) - ${s.duration}`).join('\n')}

CURRENT MEDICATIONS:
${medications.map(m => `• ${m.name} - ${m.dosage}, ${m.frequency}`).join('\n')}

DOCUMENTS:
${documents.map(d => `• ${d.name} (${d.date})`).join('\n')}

QUESTIONS FOR DOCTOR:
${suggestedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
    `.trim();

    try {
      await Share.share({
        message: summary,
        title: 'Consultation Summary',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#11998e', '#38ef7d']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultation Prep</Text>
        <Text style={styles.headerSubtitle}>Organized summary for your doctor visit</Text>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>
            📋 Summary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'questions' && styles.activeTab]}
          onPress={() => setActiveTab('questions')}
        >
          <Text style={[styles.tabText, activeTab === 'questions' && styles.activeTabText]}>
            ❓ Questions
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'summary' ? (
          <>
            {/* Patient Info Card */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>👤</Text>
                <Text style={styles.sectionTitle}>Visit Date</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardText}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
            </View>

            {/* Symptoms Summary */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🤒</Text>
                <Text style={styles.sectionTitle}>Current Symptoms ({symptoms.length})</Text>
              </View>
              {symptoms.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No symptoms logged</Text>
                </View>
              ) : (
                symptoms.map((symptom, index) => (
                  <View key={index} style={styles.card}>
                    <View style={styles.cardRow}>
                      <Text style={styles.cardTitle}>{symptom.name}</Text>
                      <View style={[styles.badge, { backgroundColor: getBadgeColor(symptom.severity) }]}>
                        <Text style={styles.badgeText}>{symptom.severity.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardSubtext}>Duration: {symptom.duration}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Medications */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>💊</Text>
                <Text style={styles.sectionTitle}>Current Medications ({medications.length})</Text>
              </View>
              {medications.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No medications listed</Text>
                </View>
              ) : (
                medications.map((med, index) => (
                  <View key={index} style={styles.card}>
                    <Text style={styles.cardTitle}>{med.name}</Text>
                    <Text style={styles.cardSubtext}>{med.dosage} • {med.frequency}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Documents */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>📄</Text>
                <Text style={styles.sectionTitle}>Medical Documents ({documents.length})</Text>
              </View>
              {documents.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No documents uploaded</Text>
                </View>
              ) : (
                documents.map((doc, index) => (
                  <View key={index} style={styles.card}>
                    <Text style={styles.cardTitle}>{doc.name}</Text>
                    <Text style={styles.cardSubtext}>Uploaded: {doc.date}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Key Points */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>💡</Text>
                <Text style={styles.sectionTitle}>Key Points to Mention</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.keyPoint}>• Duration and pattern of symptoms</Text>
                <Text style={styles.keyPoint}>• Any triggers or relieving factors</Text>
                <Text style={styles.keyPoint}>• Impact on daily activities</Text>
                <Text style={styles.keyPoint}>• Medication effectiveness</Text>
                <Text style={styles.keyPoint}>• Any side effects experienced</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Suggested Questions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>❓</Text>
                <Text style={styles.sectionTitle}>Suggested Questions</Text>
              </View>
              <Text style={styles.helperText}>
                These AI-generated questions can help you have a more productive consultation
              </Text>
              {suggestedQuestions.map((question, index) => (
                <View key={index} style={styles.questionCard}>
                  <View style={styles.questionNumber}>
                    <Text style={styles.questionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.questionText}>{question}</Text>
                </View>
              ))}
            </View>

            {/* Custom Questions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>✍️</Text>
                <Text style={styles.sectionTitle}>Add Your Own Questions</Text>
              </View>
              <TouchableOpacity style={styles.addQuestionButton}>
                <Text style={styles.addQuestionText}>+ Add a question</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.shareButton} onPress={shareConsultationSummary}>
            <LinearGradient
              colors={['#11998e', '#38ef7d']}
              style={styles.shareGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.shareButtonIcon}>📤</Text>
              <Text style={styles.shareButtonText}>Share Summary</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxText}>
              💡 Tip: Print or share this summary before your appointment to make the most of your consultation time
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getBadgeColor(severity: string): string {
  switch (severity) {
    case 'mild': return '#4CAF5020';
    case 'moderate': return '#FF980020';
    case 'severe': return '#F4433620';
    default: return '#E0E0E0';
  }
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#11998e',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#11998e',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },
  keyPoint: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  questionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#11998e20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#11998e',
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  addQuestionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#11998e',
    borderStyle: 'dashed',
  },
  addQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11998e',
  },
  actionSection: {
    marginTop: 12,
  },
  shareButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  shareGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB900',
  },
  infoBoxText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
