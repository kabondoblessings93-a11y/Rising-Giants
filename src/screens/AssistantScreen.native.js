import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { usePersistedState } from '../hooks/usePersistedState';
import { loadData } from '../lib/storage';
import { sendChatMessage } from '../lib/groq';

export default function AssistantScreen() {
  const [messages, setMessages] = usePersistedState('chatHistory', []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const scrollRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      loadData('apiKey', '').then((k) => {
        setHasKey(typeof k === 'string' && k.trim().length > 0);
      });
    }, [])
  );

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = {
      id: String(Date.now()),
      role: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const key = await loadData('apiKey', '');
      const reply = await sendChatMessage(key, newMessages);
      const assistantMsg = {
        id: String(Date.now() + 1),
        role: 'assistant',
        text: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const errorMsg = {
        id: String(Date.now() + 2),
        role: 'assistant',
        text: e.message || 'Something went wrong. Try again.',
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ministry Assistant</Text>
        {messages.length > 0 && (
          <TouchableOpacity onPress={clearChat}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {!hasKey && (
        <View style={styles.warningCard}>
          <Ionicons name="warning-outline" size={18} color="#f59e0b" />
          <Text style={styles.warningText}>
            Add your Groq API key in Settings to start chatting.
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollRef.current && scrollRef.current.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <View style={styles.emptyBox}>
            <Ionicons name="chatbubbles-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Ask me anything</Text>
            <Text style={styles.emptySub}>
              Questions about Scripture, sermon prep, prayer, or ministry planning.
            </Text>
          </View>
        )}

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubbleRow,
              msg.role === 'user' ? styles.bubbleRowUser : styles.bubbleRowAssistant,
            ]}
          >
            <View
              style={[
                styles.bubble,
                msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
                msg.isError && styles.bubbleError,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  msg.role === 'user' && styles.bubbleTextUser,
                ]}
              >
                {msg.text}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={[styles.bubbleRow, styles.bubbleRowAssistant]}>
            <View style={[styles.bubble, styles.bubbleAssistant]}>
              <Text style={styles.typingText}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask anything..."
          placeholderTextColor="#94a3b8"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  clearText: { fontSize: 13, color: '#dc2626', fontWeight: '600' },
  warningCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7', padding: 12, marginHorizontal: 16, marginBottom: 8, borderRadius: 10 },
  warningText: { flex: 1, marginLeft: 10, fontSize: 12, color: '#92400e' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginTop: 16 },
  emptySub: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 6, paddingHorizontal: 32, lineHeight: 18 },
  bubbleRow: { marginBottom: 10, flexDirection: 'row' },
  bubbleRowUser: { justifyContent: 'flex-end' },
  bubbleRowAssistant: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  bubbleUser: { backgroundColor: '#2563eb', borderBottomRightRadius: 4 },
  bubbleAssistant: { backgroundColor: '#fff', borderBottomLeftRadius: 4, elevation: 1 },
  bubbleError: { backgroundColor: '#fee2e2' },
  bubbleText: { fontSize: 14, color: '#0f172a', lineHeight: 20 },
  bubbleTextUser: { color: '#fff' },
  typingText: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  input: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#0f172a', maxHeight: 100, marginRight: 8 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#cbd5e1' },
});
