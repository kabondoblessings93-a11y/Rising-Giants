import { usePersistedState } from '../hooks/usePersistedState';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const STATUS_COLORS = {
  Planned: '#64748b',
  Preparing: '#3b82f6',
  'Awaiting Approval': '#f59e0b',
  Scheduled: '#8b5cf6',
  Completed: '#10b981',
};

const STATUS_ORDER = ['Planned', 'Preparing', 'Awaiting Approval', 'Scheduled', 'Completed'];

const INITIAL_ACTIVITIES = [
  { id: '1', name: 'Truth Tuesdays', status: 'Preparing' },
  { id: '2', name: 'Faith Fridays', status: 'Awaiting Approval' },
  { id: '3', name: 'Ask Anything Sundays', status: 'Scheduled' },
];

export default function PlanningScreen() {
  const [activities, setActivities] = usePersistedState('activities', INITIAL_ACTIVITIES);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const advanceStatus = (id) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const idx = STATUS_ORDER.indexOf(a.status);
        const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
        return { ...a, status: next };
      })
    );
  };

  const addActivity = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setActivities((prev) => [
      { id: String(Date.now()), name: trimmed, status: 'Planned' },
      ...prev,
    ]);
    setNewName('');
    setModalVisible(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Ministry Planning</Text>
        <Text style={styles.subtitle}>Tap an activity to advance its status.</Text>

        {activities.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => advanceStatus(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={[styles.badge, { color: STATUS_COLORS[item.status] }]}>
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {activities.length === 0 && (
          <Text style={styles.empty}>No activities yet. Tap + to create one.</Text>
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
            <Text style={styles.modalTitle}>New Activity</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Weekly Focus, Prayer Night"
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => {
                  setNewName('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.addBtn]} onPress={addActivity}>
                <Text style={styles.addText}>Add</Text>
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
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 6, marginBottom: 24 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 14, elevation: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a', flex: 1 },
  badge: { fontSize: 12, fontWeight: '600', marginLeft: 8 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40 },
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
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 16,
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginLeft: 12 },
  cancelBtn: { backgroundColor: '#f1f5f9' },
  cancelText: { color: '#0f172a', fontWeight: '600' },
  addBtn: { backgroundColor: '#2563eb' },
  addText: { color: '#fff', fontWeight: '600' },
});
