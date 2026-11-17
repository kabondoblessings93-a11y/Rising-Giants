import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function ProductivityScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Personal Productivity</Text>
      <Text style={styles.subtitle}>
        Track screen time, focus sessions, and spiritual routines.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Screen Time</Text>
        <Text style={styles.cardValue}>-- h -- m</Text>
        <Text style={styles.cardHint}>Enable Usage Access to start tracking.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Routines</Text>
        <Text style={styles.cardHint}>No routines configured yet.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 6, marginBottom: 24 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 14, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a', marginBottom: 8 },
  cardValue: { fontSize: 26, fontWeight: '700', color: '#2563eb' },
  cardHint: { fontSize: 13, color: '#64748b', marginTop: 8 },
});