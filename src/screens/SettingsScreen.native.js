import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveData, loadData } from '../lib/storage';

const STORAGE_KEYS = ['items', 'routines', 'activities', 'tasks', 'chatHistory'];

export default function SettingsScreen() {
  const [exportVisible, setExportVisible] = useState(false);
  const [exportData, setExportData] = useState('');
  const [resetVisible, setResetVisible] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    loadData('apiKey', '').then((k) => setApiKey(typeof k === 'string' ? k : ''));
  }, []);

  const saveKey = async () => {
    await saveData('apiKey', apiKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleExport = async () => {
    try {
      const data = {};
      for (const key of STORAGE_KEYS) {
        const raw = await AsyncStorage.getItem(key);
        data[key] = raw ? JSON.parse(raw) : null;
      }
      setExportData(JSON.stringify(data, null, 2));
      setExportVisible(true);
    } catch (e) {
      console.warn('export error', e);
    }
  };

  const handleReset = async () => {
    try {
      await AsyncStorage.multiRemove(STORAGE_KEYS);
      setResetVisible(false);
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.alert('All data cleared. Refresh the page to see the reset.');
        }
      } else {
        Alert.alert('Data cleared', 'Close and reopen the app to see the reset.');
      }
    } catch (e) {
      console.warn('reset error', e);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your data and learn about the app.</Text>

      <Text style={styles.sectionTitle}>Data</Text>

      <TouchableOpacity style={styles.row} onPress={handleExport}>
        <View style={styles.rowLeft}>
          <Ionicons name="download-outline" size={22} color="#2563eb" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Export All Data</Text>
            <Text style={styles.rowSub}>View all saved data as JSON</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => setResetVisible(true)}>
        <View style={styles.rowLeft}>
          <Ionicons name="trash-outline" size={22} color="#dc2626" />
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, styles.danger]}>Reset All Data</Text>
            <Text style={styles.rowSub}>Delete all captures, routines, and activities</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>AI Assistant</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Groq API Key</Text>
        <Text style={styles.infoText}>
          Get a free key from console.groq.com. Paste it below to enable the Assistant tab.
        </Text>
        <TextInput
          style={styles.keyInput}
          placeholder="gsk_..."
          value={apiKey}
          onChangeText={setApiKey}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        <TouchableOpacity style={styles.saveKeyBtn} onPress={saveKey}>
          <Text style={styles.saveKeyText}>{keySaved ? 'Saved ✓' : 'Save Key'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>About</Text>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>Rising Giants</Text>
        <Text style={styles.aboutSub}>Ministry and Productivity Assistant</Text>
        <Text style={styles.aboutVersion}>Version 1.0.0</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>WhatsApp Capture</Text>
        <Text style={styles.infoText}>
          To capture a message, open WhatsApp, long-press the message, tap Share, and choose Rising Giants. Or use the + button on the Community tab to paste manually.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Privacy</Text>
        <Text style={styles.infoText}>
          All data is stored locally on your device. Nothing is shared with servers or third parties. Your captures, routines, and activities are private to you.
        </Text>
      </View>

      <Text style={styles.footer}>Built with Expo</Text>

      <Modal visible={exportVisible} animationType="slide" transparent onRequestClose={() => setExportVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Export Data</Text>
            <ScrollView style={styles.exportScroll}>
              <Text style={styles.exportText} selectable>{exportData}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setExportVisible(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={resetVisible} animationType="fade" transparent onRequestClose={() => setResetVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reset all data?</Text>
            <Text style={styles.modalText}>This will permanently delete all captures, routines, and activities. This cannot be undone.</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setResetVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={handleReset}>
                <Text style={styles.deleteText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 6, marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: 10, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10, elevation: 2 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowText: { marginLeft: 14, flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  rowSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  danger: { color: '#dc2626' },
  aboutCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 12, alignItems: 'center', elevation: 2 },
  aboutTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  aboutSub: { fontSize: 13, color: '#64748b', marginTop: 4 },
  aboutVersion: { fontSize: 12, color: '#94a3b8', marginTop: 12 },
  infoCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10, elevation: 2 },
  infoTitle: { fontSize: 14, fontWeight: '600', color: '#0f172a', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#475569', lineHeight: 20 },
  footer: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 20 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  modalText: { fontSize: 14, color: '#475569', marginBottom: 20, lineHeight: 20 },
  exportScroll: { maxHeight: 300, marginBottom: 16 },
  exportText: { fontSize: 12, color: '#0f172a', fontFamily: 'monospace' },
  closeBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginLeft: 12 },
  cancelBtn: { backgroundColor: '#f1f5f9' },
  cancelText: { color: '#0f172a', fontWeight: '600' },
  deleteBtn: { backgroundColor: '#fee2e2' },
  deleteText: { color: '#dc2626', fontWeight: '600' },
  keyInput: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 13, color: '#0f172a', marginTop: 12, marginBottom: 10 },
  saveKeyBtn: { backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveKeyText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
