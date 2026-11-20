import type {
  ActivityItem,
  AiChatMessage,
  AuditEvent,
  CaptureSourceConfig,
  CommunityItem,
  ContentDraft,
  DailyProductivityRecord,
  FocusSessionRecord,
  GroupProfile,
  RoutineItem,
} from "../types/domain";

export const INITIAL_GROUP_PROFILE: GroupProfile = {
  name: "Rising Giants",
  tagline:
    "A Christ-centered community for young believers growing in purpose, character, and daily faithfulness.",
  preferredTranslation: "NIV",
  weeklyFocusTheme: "Faithful in the Small Things",
  weeklyFocusScripture: "Luke 16:10",
  weeklyFocusObjective:
    "Help members see that daily faithfulness in small habits builds the character needed for bigger assignments.",
  principles: [
    "Grace-first language — never shame-based.",
    "Always cite scripture with its translation.",
    "Never pressure, guilt, or manipulate members.",
    "Keep responses short, warm, and actionable.",
  ],
};

export const INITIAL_COMMUNITY_ITEMS: CommunityItem[] = [
  {
    id: "ci-1",
    category: "question",
    source: "WhatsApp · Youth Group",
    capturedAt: "Today, 09:14",
    summary: "How do I deal with anxiety without feeling like I lack faith?",
    topics: ["anxiety", "faith", "mental health"],
    sensitivity: "normal",
    status: "open",
    sourceText:
      "Hey team, lately I've been really anxious about exams and my family. I keep feeling like if I trusted God more I wouldn't feel this way. Does that mean my faith is weak?",
    scriptureRefs: ["Philippians 4:6-7", "1 Peter 5:7"],
  },
  {
    id: "ci-2",
    category: "prayer_request",
    source: "Manual Note · Leader",
    capturedAt: "Today, 08:02",
    summary: "Prayer for a member's mother awaiting surgery results.",
    topics: ["health", "family", "prayer"],
    sensitivity: "sensitive",
    status: "review_required",
    sourceText:
      "Please keep my mum in prayer. She had surgery last week and we get the results Thursday. I'm trying to stay strong for my younger siblings.",
    scriptureRefs: ["Psalm 46:1", "James 5:15"],
  },
  {
    id: "ci-3",
    category: "testimony",
    source: "WhatsApp · Testimonies",
    capturedAt: "Yesterday, 18:40",
    summary: "Member shared a testimony about landing an internship after months of prayer.",
    topics: ["testimony", "work", "provision"],
    sensitivity: "normal",
    status: "answered",
    sourceText:
      "I just wanted to share — after 7 months of rejections, I got an internship offer today. I honestly almost gave up. God is faithful.",
    scriptureRefs: ["Lamentations 3:22-23"],
  },
  {
    id: "ci-4",
    category: "concern",
    source: "Clipboard · Leader",
    capturedAt: "Yesterday, 14:11",
    summary: "Question about fasting: is it required, and how should a beginner start?",
    topics: ["fasting", "spiritual disciplines", "doctrine"],
    sensitivity: "normal",
    status: "open",
    sourceText:
      "Some people say fasting is mandatory for every Christian. Others say it's optional. I'm confused and don't want to do it wrong. How should I start?",
    scriptureRefs: ["Matthew 6:16-18", "Isaiah 58:6-7"],
  },
  {
    id: "ci-5",
    category: "announcement",
    source: "Email · Programs",
    capturedAt: "Mon, 11:20",
    summary: "Youth night this Friday — finalize a short invitation copy.",
    topics: ["youth night", "announcement", "invitation"],
    sensitivity: "normal",
    status: "draft_prepared",
    sourceText:
      "We're hosting youth night this Friday at 6pm. We need a warm, inviting message to share with the group and on the story channel.",
    scriptureRefs: ["Hebrews 10:24-25"],
    linkedDraftId: "draft-1",
  },
  {
    id: "ci-6",
    category: "question",
    source: "WhatsApp · New Members",
    capturedAt: "Sun, 20:05",
    summary: "A new believer asked how to start reading the Bible consistently.",
    topics: ["bible reading", "habits", "new believers"],
    sensitivity: "normal",
    status: "open",
    sourceText:
      "I just gave my life to Christ and I want to read the Bible but I don't know where to start. Every time I open it I get lost.",
    scriptureRefs: ["Psalm 119:105", "2 Timothy 3:16-17"],
  },
];

export const INITIAL_DRAFTS: ContentDraft[] = [
  {
    id: "draft-1",
    title: "You're Invited — Youth Night This Friday",
    kind: "announcement",
    targetProgram: "Youth Night",
    userNotes: "Keep it warm and short. Add the location before sharing.",
    body:
      "Hey family! 🎉\n\nThis Friday at 6PM we're gathering for a night of worship, real conversation, and good food. Bring a friend — this is one you don't want to miss.\n\n\"And let us consider how we may spur one another on toward love and good deeds.\" — Hebrews 10:24 (NIV)\n\nSee you there!",
    scriptureRefs: ["Hebrews 10:24-25"],
    translation: "NIV",
    status: "awaiting_approval",
    version: 1,
    updatedAt: new Date().toISOString(),
    aiGeneratedPortion: true,
    linkedItemId: "ci-5",
  },
  {
    id: "draft-2",
    title: "When Anxiety Feels Bigger Than Your Faith",
    kind: "question_response",
    targetProgram: "Ask Anything Sundays",
    userNotes: "Soften the opening line. Verify the Philippians passage.",
    body:
      "Thank you for being honest — that takes courage.\n\nFeeling anxious does not mean your faith is weak. Even the most faithful people in scripture wrestled with fear. What matters is where you take it.\n\n\"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.\" — Philippians 4:6 (NIV)\n\nStart small: name the worry, hand it to God, and take one faithful step today.",
    scriptureRefs: ["Philippians 4:6-7", "1 Peter 5:7"],
    translation: "NIV",
    status: "awaiting_approval",
    version: 2,
    updatedAt: new Date().toISOString(),
    aiGeneratedPortion: true,
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: "act-1", title: "Sunday Gathering", type: "Service", nextOccurrence: "Sun, 10:00 AM", status: "planned", owner: "Leadership Team" },
  { id: "act-2", title: "Truth Tuesdays", type: "Teaching", nextOccurrence: "Tue, 7:00 PM", status: "in_progress", owner: "Teaching Team" },
  { id: "act-3", title: "Ask Anything Sundays", type: "Q&A", nextOccurrence: "Sun, 5:00 PM", status: "planned", owner: "Community Team" },
  { id: "act-4", title: "Youth Night", type: "Social", nextOccurrence: "Fri, 6:00 PM", status: "planned", owner: "Youth Leaders" },
];

export const INITIAL_PRODUCTIVITY_DAYS: DailyProductivityRecord[] = [
  {
    dateKey: "Today",
    totalMinutes: 312,
    apps: [
      { packageName: "com.whatsapp", appName: "WhatsApp", minutes: 96, category: "neutral" },
      { packageName: "com.instagram.android", appName: "Instagram", minutes: 74, category: "distracting" },
      { packageName: "com.google.android.youtube", appName: "YouTube", minutes: 52, category: "distracting" },
      { packageName: "com.notion.id", appName: "Notion", minutes: 44, category: "productive" },
      { packageName: "com.bible.app", appName: "Bible", minutes: 32, category: "productive" },
      { packageName: "com.spotify.music", appName: "Spotify", minutes: 14, category: "neutral" },
    ],
  },
  {
    dateKey: "Yesterday",
    totalMinutes: 268,
    apps: [
      { packageName: "com.whatsapp", appName: "WhatsApp", minutes: 82, category: "neutral" },
      { packageName: "com.instagram.android", appName: "Instagram", minutes: 61, category: "distracting" },
      { packageName: "com.notion.id", appName: "Notion", minutes: 58, category: "productive" },
      { packageName: "com.bible.app", appName: "Bible", minutes: 41, category: "productive" },
      { packageName: "com.google.android.youtube", appName: "YouTube", minutes: 26, category: "distracting" },
    ],
  },
  {
    dateKey: "Mon",
    totalMinutes: 301,
    apps: [
      { packageName: "com.whatsapp", appName: "WhatsApp", minutes: 71, category: "neutral" },
      { packageName: "com.google.android.youtube", appName: "YouTube", minutes: 66, category: "distracting" },
      { packageName: "com.notion.id", appName: "Notion", minutes: 63, category: "productive" },
      { packageName: "com.bible.app", appName: "Bible", minutes: 37, category: "productive" },
      { packageName: "com.instagram.android", appName: "Instagram", minutes: 64, category: "distracting" },
    ],
  },
];

export const INITIAL_ROUTINES: RoutineItem[] = [
  { id: "rt-1", title: "Morning prayer", cadence: "Daily", category: "spiritual", checkedInToday: true, lastCheckedIn: "Today, 06:42" },
  { id: "rt-2", title: "Bible reading", cadence: "Daily", category: "spiritual", checkedInToday: true, lastCheckedIn: "Today, 07:05" },
  { id: "rt-3", title: "Gratitude journal", cadence: "Daily", category: "reflection", checkedInToday: false },
  { id: "rt-4", title: "Move for 30 min", cadence: "4× / week", category: "health", checkedInToday: false },
  { id: "rt-5", title: "Evening reflection", cadence: "Daily", category: "reflection", checkedInToday: false },
];

export const INITIAL_FOCUS_SESSIONS: FocusSessionRecord[] = [
  { id: "focus-1", label: "Sermon prep", durationMinutes: 45, completedAt: "Today, 08:10" },
  { id: "focus-2", label: "Draft review", durationMinutes: 25, completedAt: "Today, 07:20" },
  { id: "focus-3", label: "Prayer walk", durationMinutes: 20, completedAt: "Yesterday, 18:30" },
];

export const INITIAL_CAPTURE_SOURCES: CaptureSourceConfig[] = [
  { id: "src-wa", name: "WhatsApp exports", description: "Ingest shared group conversations you choose to export.", enabled: true, permission: "Files & Media" },
  { id: "src-clip", name: "Clipboard", description: "Grab text you deliberately copy into the workspace.", enabled: true, permission: "Clipboard" },
  { id: "src-notif", name: "Notification summaries", description: "Summarize selected notification streams on-device.", enabled: false, permission: "Notification Access" },
  { id: "src-screen", name: "Screen time", description: "Pull Android Digital Wellbeing usage into Productivity.", enabled: true, permission: "Usage Access" },
  { id: "src-notes", name: "Manual notes", description: "Quick capture typed directly by leaders.", enabled: true, permission: "None" },
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  { id: "aud-1", timestamp: "2025-01-12 09:31 CAT", actor: "Primary Admin", action: "WORKSPACE_INITIALIZED", resourceType: "Workspace", detail: "Workspace created with default privacy posture." },
  { id: "aud-2", timestamp: "2025-01-12 09:34 CAT", actor: "Primary Admin", action: "PERMISSION_GRANTED", resourceType: "CaptureSource", detail: "Enabled WhatsApp exports adapter." },
  { id: "aud-3", timestamp: "2025-01-12 10:02 CAT", actor: "Primary Admin", action: "RETENTION_UPDATED", resourceType: "Workspace", detail: "Set retention to 30 days." },
];

export const INITIAL_AI_MESSAGES: AiChatMessage[] = [
  {
    id: "ai-a-seed",
    role: "assistant",
    content:
      "Welcome back. This week the community is exploring faithfulness in small things. I can help you draft responses, summarize captured questions, or plan the upcoming programs. What would you like to work on?",
    timestamp: "08:00 CAT",
    model: "gemini-4-hydrogen",
    rationale: "Greeted the primary admin and surfaced the active weekly focus.",
    evidenceIds: [],
    scriptureRefs: ["Luke 16:10"],
    productivityIncluded: false,
  },
];
