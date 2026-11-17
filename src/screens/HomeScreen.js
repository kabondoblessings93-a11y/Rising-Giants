import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const SUMMARY = [
  { label: 'Open Questions', value: 4, color: '#3b82f6' },
  { label: 'Prayer Requests', value: 7, color: '#8b5cf6' },
  { label: 'Testimonies', value: 2, color: '#10b981' },
];

const CATEGORIES = ['Question', 'Prayer Request', 'Testimony', 'Teaching', 'Announcement'];

const INITIAL_ITEMS = [
  { id: '1', type: 'Question', text: 'What does Romans 8:28 really mean?', time: '2h ago' },
  { id: '2', type: 'Prayer Request', text: 'Please pray for my exams this week.', time: '5h ago' },
  { id: '3', type: 'Testimony', text: 'God provided a job after months of waiting!', time: '1d ago' },
];

export default function HomeScreen() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [modalVisible, setModalVisible] = useState(false);
  const [captureText, setCaptureText] = useState('');
  const [captureCategory, setCaptureCategory] = useState('Question');

  const saveCapture = () => {
    const trimmed = captureText.trim();
    if (!trimmed) return;
    const newItem = {
      id: String(Date.now()),
      type: captureCategory,
      text: trimmed,
      time: 'Just now',
    };
    setItems((prev) => [newItem, ...prev]);
    setCaptureText('');
    setCaptureCategory('Question');
    setModalVisible(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
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
        {items.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <Text style={styles.itemType}>{item.type}</Text>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.itemTime}>{item.time}</Text>
          </View>
        ))}

        {items.length === 0 && (
          <Text style={styles.empty}>No activity yet. Tap + below to capture one.</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.backdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Capture Item</Text>
            <Text style={styles.modalSub}>Paste a message or type a note to save.</Text>
            <TextInput
              style={styles.input}
              placeholder="Paste or type the message..."
              value={captureText}
              onChangeText={setCaptureText}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, captureCategory === cat && styles.chipActive]}
                  onPress={() => setCaptureCategory(cat)}
                >
                  <Text style={[styles.chipText, captureCategory === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => {
                  setCaptureText('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.addBtn]} onPress={saveCapture}>
                <Text style={styles.addText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20, paddingBottom: 100 },
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
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 20 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 30 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  modalSub: { fontSize: 13, color: '#64748b', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 16,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  label: { fontSize: 13, fontWeight: '600', color: '#0f172a', marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: '#2563eb' },
  chipText: { fontSize: 12, color: '#0f172a', fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginLeft: 12 },
  cancelBtn: { backgroundColor: '#f1f5f9' },
  cancelText: { color: '#0f172a', fontWeight: '600' },
  addBtn: { backgroundColor: '#2563eb' },
  addText: { color: '#fff', fontWeight: '600' },
});
