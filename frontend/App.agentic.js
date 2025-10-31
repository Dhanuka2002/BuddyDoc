import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AgenticChat from './components/AgenticChat';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AgenticChat />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
