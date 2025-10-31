import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import ChatInput from './ChatInput';
import { ORCHESTRATION_URL } from '../config';

export default function AgenticChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text) return;
    const userMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await fetch(`${ORCHESTRATION_URL}/api/v1/orchestrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ text }] }),
      });
      const data = await res.json();
      if (data && Array.isArray(data.agent_responses)) {
        const agentMsgs = data.agent_responses.map((r, i) => ({
          id: `agent-${i}-${Date.now()}`,
          role: 'agent',
          agent: r.agent,
          text: r.reply && (r.reply.reply_text || JSON.stringify(r.reply)) || 'No reply',
        }));
        setMessages((m) => [...m, ...agentMsgs]);
      } else if (data && data.reply) {
        setMessages((m) => [...m, { id: `agent-0-${Date.now()}`, role: 'agent', text: data.reply }]);
      } else {
        setMessages((m) => [...m, { id: `agent-err-${Date.now()}`, role: 'agent', text: 'No response from orchestrator' }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { id: `agent-err-${Date.now()}`, role: 'agent', text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.bubble, item.role === 'user' ? styles.user : styles.agent]}>
      {item.agent ? <Text style={styles.meta}>{item.agent}</Text> : null}
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      {loading ? <ActivityIndicator style={{ padding: 8 }} /> : null}
      <ChatInput onSend={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  list: { paddingBottom: 12 },
  bubble: { marginVertical: 6, padding: 10, borderRadius: 8, maxWidth: '90%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  agent: { alignSelf: 'flex-start', backgroundColor: '#EEE' },
  meta: { fontSize: 10, color: '#666', marginBottom: 4 },
});
