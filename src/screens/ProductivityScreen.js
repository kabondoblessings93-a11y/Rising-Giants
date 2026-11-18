import { usePersistedState } from '../hooks/usePersistedState';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const INITIAL_ROUTINES = [
  { id: '1', label: 'Morning Prayer', done: false },
  { id: '2', label: 'Bible Study', done: false },
  { id: '3', label: 'Evening Reflection', done: false },
];

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return m + ':' + s;
}

export default function ProductivityScreen() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [routines, setRoutines] = usePersistedState('routines', INITIAL_ROUTINES);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const stopAndCount = () => {
    setRunning(false);
    if (seconds >= 60) setSessions((n) => n + 1);
    setSeconds(0);
  };

  const toggleRoutine = (id) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    );
  };

  const completed = routines.filter((r) => r.done).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Personal Productivity</Text>
      <Text style={styles.subtitle}>
        Track focus sessions and daily spiritual routines.
      </Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{sessions}</Text>
          <Text style={styles.summaryLabel}>Focus Sessions</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{completed}/{routines.length}</Text>
          <Text style={styles.summaryLabel}>Routines Done</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Focus Session</Text>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        <Text style={styles.sessionCount}>
          {sessions} session{sessions === 1 ? '' : 's'} completed today
        </Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.btn, styles.primaryBtn]}
            onPress={() => setRunning((r) => !r)}
          >
            <Text style={styles.primaryBtnText}>
              {running ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.secondaryBtn]}
            onPress={stopAndCount}
          >
            <Text style={styles.secondaryBtnText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Spiritual Routines</Text>
        <Text style={styles.progress}>
          {completed}/{routines.length} completed
        </Text>
        {routines.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.routineRow}
            onPress={() => toggleRoutine(r.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, r.done && styles.checkboxDone]}>
              {r.done && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.routineLabel, r.done && styles.routineDone]}>
              {r.label}
            </Text>
          </TouchableOpacity>
        ))}
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
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a', marginBottom: 12 },
  timer: { fontSize: 48, fontWeight: '700', color: '#2563eb', textAlign: 'center', fontVariant: ['tabular-nums'] },
  sessionCount: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 4, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'center' },
  btn: { paddingVertical: 12, paddingHorizontal: 28, borderRadius: 10, marginHorizontal: 6 },
  primaryBtn: { backgroundColor: '#2563eb' },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  secondaryBtn: { backgroundColor: '#f1f5f9' },
  secondaryBtnText: { color: '#0f172a', fontWeight: '600', fontSize: 15 },
  progress: { fontSize: 13, color: '#64748b', marginBottom: 12 },
  routineRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxDone: { backgroundColor: '#10b981', borderColor: '#10b981' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  routineLabel: { fontSize: 15, color: '#0f172a' },
  routineDone: { color: '#94a3b8', textDecorationLine: 'line-through' },
  summaryRow: { flexDirection: 'row', marginBottom: 14 },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
  },
  summaryValue: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  summaryLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
});
