import { usePersistedState } from '../hooks/usePersistedState';
import { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

const INITIAL_ROUTINES = [
  { id: '1', label: 'Morning Prayer', done: false },
  { id: '2', label: 'Bible Study', done: false },
  { id: '3', label: 'Evening Reflection', done: false },
];

const INITIAL_TASKS = [
  { id: '1', title: 'Prepare Sunday message notes', dueDate: '', done: false },
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
  const [tasks, setTasks] = usePersistedState('tasks', INITIAL_TASKS);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

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

  const addTask = () => {
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      { id: String(Date.now()), title: trimmed, dueDate: newTaskDate.trim(), done: false },
      ...prev,
    ]);
    setNewTaskTitle('');
    setNewTaskDate('');
    setTaskModalVisible(false);
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const completed = routines.filter((r) => r.done).length;
  const completedTasks = tasks.filter((t) => t.done).length;

  const totalThings = routines.length + tasks.length;
  const doneThings = completed + completedTasks;
  const summaryText =
    totalThings === 0
      ? 'Nothing to track yet — add a routine or task.'
      : doneThings === 0
      ? 'Ready to start the day.'
      : doneThings === totalThings
      ? 'Everything done today 🎉'
      : `${doneThings} of ${totalThings} things done today.`;

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Personal Productivity</Text>
      <Text style={styles.subtitle}>
        Track focus sessions and daily spiritual routines.
      </Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{sessions}</Text>
          <Text style={styles.summaryLabel}>Focus</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{completed}/{routines.length}</Text>
          <Text style={styles.summaryLabel}>Routines</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{completedTasks}/{tasks.length}</Text>
          <Text style={styles.summaryLabel}>Tasks</Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Today's Insights</Text>
        <Text style={styles.insightSummary}>{summaryText}</Text>
        <View style={styles.insightRow}>
          <Text style={styles.insightIcon}>⏱</Text>
          <Text style={styles.insightText}>
            {sessions === 0
              ? 'No focus sessions completed yet'
              : `${sessions} focus session${sessions === 1 ? '' : 's'} completed today`}
          </Text>
        </View>
        <View style={styles.insightRow}>
          <Text style={styles.insightIcon}>🙏</Text>
          <Text style={styles.insightText}>
            {completed} of {routines.length} routines done
          </Text>
        </View>
        <View style={styles.insightRow}>
          <Text style={styles.insightIcon}>✅</Text>
          <Text style={styles.insightText}>
            {completedTasks} of {tasks.length} tasks done
          </Text>
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

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Daily Tasks</Text>
          <TouchableOpacity style={styles.addTaskBtn} onPress={() => setTaskModalVisible(true)}>
            <Text style={styles.addTaskText}>+ Add</Text>
          </TouchableOpacity>
        </View>
        {tasks.length === 0 && (
          <Text style={styles.emptyTasks}>No tasks yet. Tap + Add to create one.</Text>
        )}
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <TouchableOpacity
              style={styles.taskLeft}
              onPress={() => toggleTask(task.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
                {task.done && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.taskTextBox}>
                <Text style={[styles.taskTitle, task.done && styles.taskDone]}>
                  {task.title}
                </Text>
                {task.dueDate ? <Text style={styles.taskDue}>Due: {task.dueDate}</Text> : null}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(task.id)}>
              <Ionicons name="trash-outline" size={18} color="#dc2626" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      </ScrollView>

      <Modal
        visible={taskModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setTaskModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.backdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Due date (optional, e.g. 25 Dec)"
              value={newTaskDate}
              onChangeText={setNewTaskDate}
            />
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => {
                  setNewTaskTitle('');
                  setNewTaskDate('');
                  setTaskModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.addBtn]} onPress={addTask}>
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
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addTaskBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#2563eb' },
  addTaskText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  emptyTasks: { textAlign: 'center', color: '#94a3b8', paddingVertical: 16, fontSize: 13 },
  taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  taskLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  taskTextBox: { flex: 1, marginLeft: 14 },
  taskTitle: { fontSize: 15, color: '#0f172a' },
  taskDone: { color: '#94a3b8', textDecorationLine: 'line-through' },
  taskDue: { fontSize: 12, color: '#64748b', marginTop: 2 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', padding: 24, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 14, fontSize: 15, color: '#0f172a', marginBottom: 12 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  cancelBtn: { backgroundColor: '#f1f5f9' },
  cancelText: { color: '#0f172a', fontWeight: '600' },
  addBtn: { backgroundColor: '#2563eb' },
  addText: { color: '#fff', fontWeight: '600' },
  insightCard: { backgroundColor: '#eff6ff', padding: 16, borderRadius: 12, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: '#2563eb' },
  insightTitle: { fontSize: 14, fontWeight: '700', color: '#1e40af', marginBottom: 6 },
  insightSummary: { fontSize: 15, fontWeight: '600', color: '#0f172a', marginBottom: 12, lineHeight: 20 },
  insightRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  insightIcon: { fontSize: 16, marginRight: 10, width: 22 },
  insightText: { fontSize: 13, color: '#334155', flex: 1 },
});
