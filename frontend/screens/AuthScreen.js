import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { t } from '../i18n';
import { useAuth } from '../AuthProvider';

export default function AuthScreen() {
  const { signIn, signUp, signInAnon } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      console.warn(err);
      Alert.alert('Sign-in failed', err.message || String(err));
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp(email.trim(), password);
    } catch (err) {
      console.warn(err);
      Alert.alert('Sign-up failed', err.message || String(err));
    }
  };

  const handleAnon = async () => {
    // show consent screen before allowing anonymous/guest access
    Alert.alert(t('consentTitle'), t('consentBody'), [
      { text: 'Cancel', style: 'cancel' },
      { text: t('continue'), onPress: async () => { try { await signInAnon(); } catch (err) { Alert.alert('Sign-in failed', String(err)); } } }
    ]);
  };

  return (
    <View style={styles.container}>
  <Text style={styles.title}>{t('signInTitle')}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttons}>
        <Button title={t('signIn')} onPress={handleSignIn} />
        <Button title={t('signUp')} onPress={handleSignUp} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title="Continue as Guest" onPress={handleAnon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginBottom: 8 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 }
});
