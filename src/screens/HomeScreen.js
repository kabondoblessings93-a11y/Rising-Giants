import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const SUMMARY = [
  { label: 'Open Questions', value: 4, color: '#3b82f6' },
  { label: 'Prayer Requests', value: 7, color: '#8b5cf6' },
  { label: 'Testimonies', value: 2, color: '#10b981' },
];

const RECENT_ITEMS = [
  { type: 'Question', text: 'What does Romans 8:28 really mean?', time: '2h ago' },
  { type: 'Prayer Request', text: 'Please pray for my exams this week.', time: '5h ago' },
  { type: 'Testimony', text: 'God provided a job after months of waiting!', time: '1d ago' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Community Overview</Text>

      <View style={styles.row}>
        {SUMMARY.map((item) => (
          <View key={item.label} style={[styles.card, { borderTopColor: item.color }]}>
            <Text style={styles.cardValue}>{item.value}</Text>
            <Text style={styles.cardLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {RECENT_ITEMS.map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={styles.itemType}>{item.type}</Text>
          <Text style={styles.itemText}>{item.text}</Text>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>+ Capture from WhatsApp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderTopWidth: 4,
    elevation: 2,
  },
  cardValue: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  cardLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#0f172a', marginBottom: 12 },
  listItem: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10 },
  itemType: { fontSize: 11, color: '#3b82f6', fontWeight: '600', textTransform: 'uppercase' },
  itemText: { fontSize: 14, color: '#0f172a', marginTop: 4 },
  itemTime: { fontSize: 11, color: '#94a3b8', marginTop: 6 },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});