import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

// Minimal App for debugging: shows a simple screen so we can confirm Expo Go
// runs this JS bundle. If this screen shows, Firebase/auth related code is
// likely the cause of the previous crashes.

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>BuddyDoc Debug</Text>
        <Text>Simple debug screen — Expo bundle loaded successfully.</Text>
      </View>
    </SafeAreaView>
  );
}

// NOTE: When running on Android emulator use 10.0.2.2 to reach a backend running on host machine.
const DEFAULT_BACKEND = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
const BACKEND_URL = process.env.BUDDYDOC_BACKEND_URL || DEFAULT_BACKEND;

function _AppContent() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', from: 'system', text: 'Welcome to BuddyDoc! Describe your symptoms to begin.' }
  ]);

  const { user, token, loading, initError } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const send = async () => {
    if (!text.trim()) return;
    const userMsg = { id: String(Date.now()), from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setText('');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/api/v1/patient/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userMsg.text })
      });
      const data = await res.json();
      const botReply = typeof data === 'object' ? (data.reply || JSON.stringify(data)) : String(data);
      const botMsg = { id: String(Date.now() + 1), from: 'bot', text: botReply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errMsg = { id: String(Date.now() + 2), from: 'bot', text: 'Error: could not reach backend. Check BACKEND_URL.' };
      setMessages(prev => [...prev, errMsg]);
      console.warn(err);
    }
  };

  // If firebase init failed expose a message but continue to auth (mock) screen
  if (initError) {
    console.warn('Firebase init error visible in UI:', initError);
  }

  // If not authenticated show auth screen
  if (!user) {
    return (
      <View style={{ flex: 1 }}>
        {initError ? (
          <View style={{ padding: 12, backgroundColor: '#fff3cd' }}>
            <Text style={{ color: '#856404' }}>Warning: Firebase failed to initialize. Running in local mock auth mode.</Text>
          </View>
        ) : null}
        <AuthScreen />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.msg, item.from === 'user' ? styles.user : styles.bot]}>
            <Text>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Describe your symptoms (e.g. headache, nausea...)"
          multiline
        />
        <Button title="Send" onPress={send} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <_AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 }
});
