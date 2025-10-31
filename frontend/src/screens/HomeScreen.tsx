import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';

export default function HomeScreen() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to ping local backend health endpoint to help test connectivity.
    const check = async () => {
      setLoading(true);
      const hosts = [
        'http://localhost:3333/health',
        'http://127.0.0.1:3333/health',
        'http://10.0.2.2:3333/health' // Android emulator
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>BuddyDoc</Text>
      <Text style={styles.subtitle}>PatientPrep SL — Home</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick actions</Text>
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrap}>
            <Button title="Open Chat" onPress={() => alert('Chat not implemented yet')} />
          </View>
          <View style={styles.buttonWrap}>
            <Button title="Symptom Log" onPress={() => alert('Symptom Log not implemented yet')} />
          </View>
        </View>
      </View>

      <View style={styles.statusBox}>
        {loading ? <ActivityIndicator /> : <Text>{status}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20
  },
  card: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f6f6f6',
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonWrap: {
    flex: 1,
    marginHorizontal: 6
  },
  statusBox: {
    marginTop: 12
  }
});
