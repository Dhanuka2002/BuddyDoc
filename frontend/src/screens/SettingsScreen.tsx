import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [settings, setSettings] = useState({
    llmOptIn: false,
    notificationsEnabled: true,
    medicationReminders: true,
    dataBackup: false,
    biometricAuth: false,
    language: 'en',
    theme: 'light',
  });

  const toggleSetting = (key: keyof typeof settings) => {
    if (key === 'llmOptIn') {
      Alert.alert(
        'AI Cloud Processing',
        settings.llmOptIn 
          ? 'Disable cloud-based AI processing? Your data will remain on-device only.'
          : 'Enable cloud-based AI for better responses? Some data may be processed externally with encryption.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: settings.llmOptIn ? 'Disable' : 'Enable', 
            onPress: () => setSettings(prev => ({ ...prev, [key]: !prev[key] }))
          }
        ]
      );
    } else {
      setSettings(prev => ({ ...prev, [key]: !prev[key] as any }));
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your symptoms, medications, and documents. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'All data has been cleared')
        }
      ]
    );
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
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your BuddyDoc experience</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Privacy & Security</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Cloud AI Processing</Text>
              <Text style={styles.settingDescription}>
                Enable cloud-based LLM for better AI responses
              </Text>
            </View>
            <Switch
              value={settings.llmOptIn}
              onValueChange={() => toggleSetting('llmOptIn')}
              trackColor={{ false: '#E0E0E0', true: '#667eea' }}
              thumbColor={settings.llmOptIn ? '#FFFFFF' : '#F4F4F4'}
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Biometric Authentication</Text>
              <Text style={styles.settingDescription}>
                Use fingerprint or Face ID to secure app
              </Text>
            </View>
            <Switch
              value={settings.biometricAuth}
              onValueChange={() => toggleSetting('biometricAuth')}
              trackColor={{ false: '#E0E0E0', true: '#667eea' }}
              thumbColor={settings.biometricAuth ? '#FFFFFF' : '#F4F4F4'}
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxIcon}>ℹ️</Text>
            <Text style={styles.infoBoxText}>
              Your health data is stored locally by default. Enable cloud processing only if you want AI-powered features that require external processing.
            </Text>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Data Management</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Cloud Backup</Text>
              <Text style={styles.settingDescription}>
                Backup your data to secure cloud storage
              </Text>
            </View>
            <Switch
              value={settings.dataBackup}
              onValueChange={() => toggleSetting('dataBackup')}
              trackColor={{ false: '#E0E0E0', true: '#667eea' }}
              thumbColor={settings.dataBackup ? '#FFFFFF' : '#F4F4F4'}
            />
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>📥</Text>
            <Text style={styles.actionButtonText}>Export Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>📤</Text>
            <Text style={styles.actionButtonText}>Import Data</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]} 
            onPress={clearAllData}
          >
            <Text style={styles.actionButtonIcon}>🗑️</Text>
            <Text style={[styles.actionButtonText, styles.dangerText]}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notifications</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive app notifications
              </Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={() => toggleSetting('notificationsEnabled')}
              trackColor={{ false: '#E0E0E0', true: '#667eea' }}
              thumbColor={settings.notificationsEnabled ? '#FFFFFF' : '#F4F4F4'}
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Medication Reminders</Text>
              <Text style={styles.settingDescription}>
                Get reminders for medications
              </Text>
            </View>
            <Switch
              value={settings.medicationReminders}
              onValueChange={() => toggleSetting('medicationReminders')}
              trackColor={{ false: '#E0E0E0', true: '#667eea' }}
              thumbColor={settings.medicationReminders ? '#FFFFFF' : '#F4F4F4'}
            />
          </View>
        </View>

        {/* Language & Region */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 Language & Region</Text>
          
          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingDescription}>English</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxIcon}>🇱🇰</Text>
            <Text style={styles.infoBoxText}>
              BuddyDoc is optimized for Sri Lankan healthcare system. More languages coming soon!
            </Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About</Text>
          
          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Version</Text>
              <Text style={styles.settingDescription}>1.0.0-beta</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Terms of Service</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Send Feedback</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for better healthcare</Text>
          <Text style={styles.footerText}>PatientPrep SL • Privacy First</Text>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  settingArrow: {
    fontSize: 24,
    color: '#CCC',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  dangerButton: {
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dangerText: {
    color: '#FF4444',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoBoxIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});
