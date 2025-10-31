import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function JourneyTimeline({ events = [] }) {
  const renderItem = ({ item }) => (
    <View style={styles.event}>
      <View style={styles.dot} />
      <View style={styles.content}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventMeta}>{item.date} • {item.location || '—'}</Text>
        <Text style={styles.eventNote}>{item.note}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={events}
      keyExtractor={(i, idx) => `${idx}-${i.date}`}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  event: { flexDirection: 'row', marginBottom: 16 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0ea5a4', marginTop: 6 },
  content: { marginLeft: 12, flex: 1 },
  eventTitle: { fontWeight: '700', color: '#0f172a' },
  eventMeta: { color: '#64748b', fontSize: 12, marginTop: 2 },
  eventNote: { color: '#475569', marginTop: 6 },
});