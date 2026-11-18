import { usePersistedState } from '../hooks/usePersistedState';
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
import { Ionicons } from '@expo/vector-icons';

const SUMMARY = [
  { label: 'Open Questions', value: 4, color: '#3b82f6' },
  { label: 'Prayer Requests', value: 7, color: '#8b5cf6' },
  { label: 'Testimonies', value: 2, color: '#10b981' },
];

const CATEGORIES = ['Question', 'Prayer Request', 'Testimony', 'Teaching', 'Announcement'];

const INITIAL_ITEMS = [
  { id: '1', type: 'Question', text: 'What does Romans 8:28 really mean?', time: '2h ago' , createdAt: Date.now() - 2 * 60 * 60 * 1000 },
  { id: '2', type: 'Prayer Request', text: 'Please pray for my exams this week.', time: '5h ago' , createdAt: Date.now() - 5 * 60 * 60 * 1000 },
  { id: '3', type: 'Testimony', text: 'God provided a job after months of waiting!', time: '1d ago' , createdAt: Date.now() - 24 * 60 * 60 * 1000 },
];

export default function HomeScreen() {
  const [items, setItems] = usePersistedState('items', INITIAL_ITEMS);
  const [modalVisible, setModalVisible] = useState(false);
  const [captureText, setCaptureText] = useState('');
  const [captureCategory, setCaptureCategory] = useState('Question');
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editCategory, setEditCategory] = useState('Question');
  const [reportVisible, setReportVisible] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchSearch =
      searchText.trim() === '' ||
      item.text.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = filterCategory === 'All' || item.type === filterCategory;
    return matchSearch && matchCategory;
  });

  const saveCapture = () => {
    const trimmed = captureText.trim();
    if (!trimmed) return;
    const newItem = {
      id: String(Date.now()),
      type: captureCategory,
      text: trimmed,
      time: 'Just now',
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    setCaptureText('');
    setCaptureCategory('Question');
    setModalVisible(false);
  };

  const openDetail = (item) => {
    setSelectedItem(item);
    setEditCategory(item.type);
  };

  const saveDetail = () => {
    if (!selectedItem) return;
    setItems((prev) =>
      prev.map((i) => (i.id === selectedItem.id ? { ...i, type: editCategory } : i))
    );
    setSelectedItem(null);
  };

  const deleteItem = () => {
    if (!selectedItem) return;
    setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
    setSelectedItem(null);
  };

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = items.filter((i) => (i.createdAt || 0) >= weekAgo);
  const weekCounts = {
    Question: thisWeek.filter((i) => i.type === 'Question').length,
    Prayer: thisWeek.filter((i) => i.type === 'Prayer Request').length,
    Testimony: thisWeek.filter((i) => i.type === 'Testimony').length,
  };

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const dailyCounts = Array.from({ length: 7 }, (_, i) => {
    const dayEnd = now - (6 - i) * dayMs;
    const dayStart = dayEnd - dayMs;
    const count = items.filter((it) => {
      const t = it.createdAt || 0;
      return t >= dayStart && t < dayEnd;
    }).length;
    const mid = new Date(dayEnd - dayMs / 2);
    return { label: mid.toLocaleDateString('en', { weekday: 'short' }), count };
  });

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

        <TouchableOpacity
          style={styles.weekCard}
          onPress={() => setReportVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.weekTitle}>This Week</Text>
          <View style={styles.weekRow}>
            <View style={styles.weekStat}>
              <Text style={styles.weekValue}>{weekCounts.Question}</Text>
              <Text style={styles.weekLabel}>Questions</Text>
            </View>
            <View style={styles.weekStat}>
              <Text style={styles.weekValue}>{weekCounts.Prayer}</Text>
              <Text style={styles.weekLabel}>Prayers</Text>
            </View>
            <View style={styles.weekStat}>
              <Text style={styles.weekValue}>{weekCounts.Testimony}</Text>
              <Text style={styles.weekLabel}>Testimonies</Text>
            </View>
          </View>
          <Text style={styles.weekHint}>Tap for full report →</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Search captures..."
          placeholderTextColor="#94a3b8"
          value={searchText}
          onChangeText={setSearchText}
        />

        <View style={styles.filterRow}>
          {['All', 'Question', 'Prayer Request', 'Testimony', 'Teaching', 'Announcement'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, filterCategory === cat && styles.filterChipActive]}
              onPress={() => setFilterCategory(cat)}
            >
              <Text style={[styles.filterChipText, filterCategory === cat && styles.filterChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.listItem}
            onPress={() => openDetail(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.itemType}>{item.type}</Text>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.itemTime}>{item.time}</Text>
          </TouchableOpacity>
        ))}

        {filteredItems.length === 0 && (
          <Text style={styles.empty}>
            {items.length === 0
              ? 'No activity yet. Tap + below to capture one.'
              : 'No matches. Try a different search or filter.'}
          </Text>
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

      <Modal
        visible={selectedItem !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedItem(null)}
      >
        <KeyboardAvoidingView
          style={styles.backdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Capture Details</Text>
            <Text style={styles.detailText}>{selectedItem?.text}</Text>
            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, editCategory === cat && styles.chipActive]}
                  onPress={() => setEditCategory(cat)}
                >
                  <Text style={[styles.chipText, editCategory === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={deleteItem}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setSelectedItem(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.addBtn]} onPress={saveDetail}>
                <Text style={styles.addText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        visible={reportVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setReportVisible(false)}
      >
        <View style={styles.reportBackdrop}>
          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>Weekly Report</Text>
              <TouchableOpacity onPress={() => setReportVisible(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.reportScroll}>
              <Text style={styles.reportTotal}>
                {thisWeek.length} {thisWeek.length === 1 ? 'capture' : 'captures'} this week
              </Text>

              <Text style={styles.reportSection}>By Category</Text>
              {CATEGORIES.map((cat) => {
                const count = thisWeek.filter((i) => i.type === cat).length;
                const pct = thisWeek.length === 0 ? 0 : (count / thisWeek.length) * 100;
                return (
                  <View key={cat} style={styles.catRow}>
                    <Text style={styles.catName}>{cat}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: pct + '%' }]} />
                    </View>
                    <Text style={styles.catCount}>{count}</Text>
                  </View>
                );
              })}

              <Text style={styles.reportSection}>Last 7 Days</Text>
              <View style={styles.dayChart}>
                {dailyCounts.map((d, i) => {
                  const maxCount = Math.max(...dailyCounts.map((x) => x.count), 1);
                  const height = d.count === 0 ? 4 : (d.count / maxCount) * 60;
                  return (
                    <View key={i} style={styles.dayCol}>
                      <Text style={styles.dayCount}>{d.count}</Text>
                      <View style={[styles.dayBar, { height }]} />
                      <Text style={styles.dayLabel}>{d.label}</Text>
                    </View>
                  );
                })}
              </View>

              <Text style={styles.reportSection}>Open Questions</Text>
              {thisWeek.filter((i) => i.type === 'Question').length === 0 ? (
                <Text style={styles.reportEmpty}>None this week</Text>
              ) : (
                thisWeek.filter((i) => i.type === 'Question').map((q) => (
                  <View key={q.id} style={styles.reportItem}>
                    <Text style={styles.reportItemText}>{q.text}</Text>
                  </View>
                ))
              )}

              <Text style={styles.reportSection}>Prayer Requests</Text>
              {thisWeek.filter((i) => i.type === 'Prayer Request').length === 0 ? (
                <Text style={styles.reportEmpty}>None this week</Text>
              ) : (
                thisWeek.filter((i) => i.type === 'Prayer Request').map((p) => (
                  <View key={p.id} style={styles.reportItem}>
                    <Text style={styles.reportItemText}>{p.text}</Text>
                  </View>
                ))
              )}

              <Text style={styles.reportSection}>Testimonies</Text>
              {thisWeek.filter((i) => i.type === 'Testimony').length === 0 ? (
                <Text style={styles.reportEmpty}>None this week</Text>
              ) : (
                thisWeek.filter((i) => i.type === 'Testimony').map((t) => (
                  <View key={t.id} style={styles.reportItem}>
                    <Text style={styles.reportItemText}>{t.text}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
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
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    marginRight: 6,
    marginBottom: 6,
  },
  filterChipActive: { backgroundColor: '#2563eb' },
  filterChipText: { fontSize: 12, color: '#0f172a', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },
  weekCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2 },
  weekTitle: { fontSize: 14, fontWeight: '600', color: '#0f172a', marginBottom: 12 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekStat: { flex: 1, alignItems: 'center' },
  weekValue: { fontSize: 22, fontWeight: '700', color: '#2563eb' },
  weekLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  detailText: { fontSize: 15, color: '#0f172a', backgroundColor: '#f8fafc', padding: 14, borderRadius: 10, marginBottom: 16, lineHeight: 22 },
  deleteBtn: { backgroundColor: '#fee2e2' },
  deleteText: { color: '#dc2626', fontWeight: '600' },
  weekHint: { fontSize: 11, color: '#2563eb', textAlign: 'right', marginTop: 10, fontWeight: '500' },
  reportBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 16 },
  reportCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reportTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  reportScroll: { flex: 1 },
  reportTotal: { fontSize: 14, color: '#64748b', marginBottom: 16 },
  reportSection: { fontSize: 14, fontWeight: '600', color: '#0f172a', marginTop: 16, marginBottom: 10 },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  catName: { width: 110, fontSize: 12, color: '#0f172a' },
  barTrack: { flex: 1, height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, marginHorizontal: 8, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: '#2563eb', borderRadius: 4 },
  catCount: { width: 28, fontSize: 12, fontWeight: '600', color: '#0f172a', textAlign: 'right' },
  dayChart: { flexDirection: 'row', alignItems: 'flex-end', height: 90, marginBottom: 20 },
  dayCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  dayCount: { fontSize: 10, color: '#64748b', marginBottom: 2 },
  dayBar: { width: 20, backgroundColor: '#2563eb', borderRadius: 4 },
  dayLabel: { fontSize: 10, color: '#64748b', marginTop: 4 },
  reportItem: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 8 },
  reportItemText: { fontSize: 13, color: '#0f172a', lineHeight: 18 },
  reportEmpty: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic', paddingVertical: 8 },
});
