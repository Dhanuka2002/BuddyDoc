import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const t = text.trim();
    if (!t) return;
    setText('');
    onSend && onSend(t);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message"
        style={styles.input}
        onSubmitEditing={handleSend}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 4, paddingHorizontal: 8, marginRight: 8, height: 40 },
});
