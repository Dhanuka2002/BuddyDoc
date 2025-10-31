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
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
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
            </View>
            <Text style={styles.title}>BuddyDoc</Text>
            <Text style={styles.subtitle}>Your AI Health Companion</Text>
            <Text style={styles.tagline}>PatientPrep SL • Privacy First</Text>
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
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIconContainer}>
                  <Text style={styles.actionIcon}>💬</Text>
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>AI Health Chat</Text>
                  <Text style={styles.actionDescription}>
                    Get instant answers about symptoms and medications
                  </Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Symptom Log Card */}
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={onNavigateToSymptoms}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIconContainer}>
                  <Text style={styles.actionIcon}>📋</Text>
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Symptom Tracker</Text>
                  <Text style={styles.actionDescription}>
                    Log and monitor your health symptoms
                  </Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Medication Reminder Card */}
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={onNavigateToMedications}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIconContainer}>
                  <Text style={styles.actionIcon}>💊</Text>
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Medications</Text>
                  <Text style={styles.actionDescription}>
                    Track medication schedule and refills
                  </Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </LinearGradient>
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
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  actionCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  actionArrow: {
    fontSize: 24,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  featureText: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.5,
  },
});
