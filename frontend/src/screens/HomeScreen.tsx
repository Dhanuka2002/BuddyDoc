import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HomeScreenProps {
  onNavigateToChat: () => void;
  onNavigateToDocuments: () => void;
  onNavigateToSymptoms: () => void;
  onNavigateToMedications: () => void;
  onNavigateToConsultation: () => void;
  onNavigateToSettings: () => void;
}

const { width } = Dimensions.get('window');

export default function HomeScreen({ 
  onNavigateToChat, 
  onNavigateToDocuments,
  onNavigateToSymptoms,
  onNavigateToMedications,
  onNavigateToConsultation,
  onNavigateToSettings 
}: HomeScreenProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Try to ping local backend health endpoint to help test connectivity.
    const check = async () => {
      setLoading(true);
      const hosts = [
        'http://localhost:8000/health',
        'http://127.0.0.1:8000/health',
        'http://10.0.2.2:8000/health' // Android emulator
      ];
      for (const h of hosts) {
        try {
          const res = await fetch(h, { method: 'GET' });
          if (res.ok) {
            const body = await res.json();
            setStatus(`Backend OK (${h})`);
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore and try next
        }
      }
      setStatus('Backend unreachable (try running backend)');
      setLoading(false);
    };
    check();
  }, []);

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View 
            style={[
              styles.headerSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>🏥</Text>
              </View>
              <View style={styles.logoBadge}>
                <Text style={styles.badgeText}>AI</Text>
              </View>
            </View>
            <Text style={styles.title}>BuddyDoc</Text>
            <Text style={styles.subtitle}>Your AI Health Companion</Text>
            <View style={styles.taglineContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagIcon}>🇱🇰</Text>
                <Text style={styles.tagline}>PatientPrep SL</Text>
              </View>
              <View style={styles.tagDivider} />
              <View style={styles.tag}>
                <Text style={styles.tagIcon}>🔒</Text>
                <Text style={styles.tagline}>Privacy First</Text>
              </View>
            </View>
          </Animated.View>

          {/* Status Card */}
          <Animated.View style={[styles.statusCard, { opacity: fadeAnim }]}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusIcon}>{loading ? '⏳' : status?.includes('OK') ? '✅' : '⚠️'}</Text>
              <Text style={styles.statusTitle}>Backend Status</Text>
            </View>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#667eea" />
                <Text style={styles.statusText}>Checking connection...</Text>
              </View>
            ) : (
              <Text style={styles.statusText}>{status || 'Unknown'}</Text>
            )}
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View style={[styles.actionsSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            {/* Chat Card */}
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={onNavigateToChat}
              activeOpacity={0.7}
            >
              <View style={styles.actionGradient}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#EEF2FF' }]}>
                  <Text style={styles.actionIcon}>💬</Text>
                </View>
                <View style={styles.actionContent}>
                  <View style={styles.actionTitleRow}>
                    <Text style={styles.actionTitle}>AI Health Chat</Text>
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>LIVE</Text>
                    </View>
                  </View>
                  <Text style={styles.actionDescription}>
                    Get instant answers about symptoms and medications
                  </Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Symptom Log Card */}
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={onNavigateToSymptoms}
              activeOpacity={0.7}
            >
              <View style={styles.actionGradient}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#FEF2F2' }]}>
                  <Text style={styles.actionIcon}>📋</Text>
                </View>
                <View style={styles.actionContent}>
                  <View style={styles.actionTitleRow}>
                    <Text style={styles.actionTitle}>Symptom Tracker</Text>
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  </View>
                  <Text style={styles.actionDescription}>
                    Log and monitor your health symptoms
                  </Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </View>
            </TouchableOpacity>

            {/* Medication Reminder Card */}
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={onNavigateToMedications}
              activeOpacity={0.7}
            >
              <View style={styles.actionGradient}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#F0F9FF' }]}>
                  <Text style={styles.actionIcon}>💊</Text>
                </View>
                <View style={styles.actionContent}>
                  <View style={styles.actionTitleRow}>
                    <Text style={styles.actionTitle}>Medications</Text>
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  </View>
                  <Text style={styles.actionDescription}>
                    Track medication schedule and refills
                  </Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Features Section */}
          <Animated.View style={[styles.featuresSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>Why BuddyDoc?</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🔒</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Privacy First</Text>
                  <Text style={styles.featureText}>Your health data stays on your device</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🤖</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>AI-Powered</Text>
                  <Text style={styles.featureText}>Multi-agent system for accurate insights</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🇱🇰</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Sri Lanka Focused</Text>
                  <Text style={styles.featureText}>Tailored for local healthcare needs</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Built with ❤️ for better healthcare</Text>
            <Text style={styles.versionText}>v1.0.0-beta</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  background: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: 40,
  },
  logoBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 12,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  tagDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 12,
  },
  tagline: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 8,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 16,
  },
  actionCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginRight: 8,
  },
  newBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  actionArrow: {
    fontSize: 20,
    color: '#CBD5E1',
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
