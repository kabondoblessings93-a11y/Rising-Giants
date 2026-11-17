import { ScrollView, View, Text, StyleSheet } from 'react-native';

const ACTIVITIES = [
  { name: 'Truth Tuesdays', status: 'Draft ready', color: '#3b82f6' },
  { name: 'Faith Fridays', status: 'Awaiting approval', color: '#8b5cf6' },
  { name: 'Ask Anything Sundays', status: 'Scheduled', color: '#10b981' },
];

export default function PlanningScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Ministry Planning</Text>
      <Text style={styles.subtitle}>
        Recurring activities, drafts, and the week ahead.
      </Text>

      {ACTIVITIES.map((item) => (
        <View key={item.name} style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={[styles.badge, { color: item.color }]}>{item.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 6, marginBottom: 24 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 14, elevation: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  badge: { fontSize: 12, fontWeight: '600' },
});