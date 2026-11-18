const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';

const SYSTEM_PROMPT = 'You are the Rising Giants Ministry Assistant, a helpful Christian AI assistant. Answer biblically and with care. When you reference Scripture, cite the reference. Label your suggestions as suggestions. Never claim spiritual authority. Be concise, warm, and practical. If a question touches on mental health, crisis, or matters beyond your knowledge, encourage the user to seek help from their pastor or a professional.';

export async function sendChatMessage(apiKey, messages) {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error('No API key configured. Add your Groq API key in Settings.');
  }

  const formatted = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.text,
    })),
  ];

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey.trim(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: formatted,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    let detail = '';
    try {
      const err = await res.json();
      detail = (err && err.error && err.error.message) || '';
    } catch (e) {}
    if (res.status === 401) {
      throw new Error('Invalid API key. Check your key in Settings.');
    }
    if (res.status === 429) {
      throw new Error('Rate limit reached. Wait a moment and try again.');
    }
    throw new Error(detail || 'Groq API error (' + res.status + ').');
  }

  const data = await res.json();
  const reply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!reply) {
    throw new Error('Empty response from the AI. Try again.');
  }
  return reply.trim();
}
