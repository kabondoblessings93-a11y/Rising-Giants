export type NavDestination =
  | "home"
  | "community"
  | "ministry"
  | "productivity"
  | "ai"
  | "settings";

export type CommunityItemCategory =
  | "question"
  | "prayer_request"
  | "testimony"
  | "announcement"
  | "concern";

export type CommunityItemSensitivity = "normal" | "sensitive" | "restricted";

export type CommunityItemStatus =
  | "open"
  | "review_required"
  | "draft_prepared"
  | "answered"
  | "archived";

export interface CommunityItem {
  id: string;
  category: CommunityItemCategory;
  source: string;
  capturedAt: string;
  summary: string;
  topics: string[];
  sensitivity: CommunityItemSensitivity;
  status: CommunityItemStatus;
  sourceText: string;
  scriptureRefs: string[];
  linkedDraftId?: string;
}

export type DraftKind =
  | "question_response"
  | "reflection"
  | "announcement"
  | "devotional";

export type DraftStatus =
  | "draft"
  | "awaiting_approval"
  | "approved_for_user_sharing"
  | "shared_manually";

export interface ContentDraft {
  id: string;
  title: string;
  kind: DraftKind;
  targetProgram: string;
  userNotes: string;
  body: string;
  scriptureRefs: string[];
  translation: string;
  status: DraftStatus;
  version: number;
  updatedAt: string;
  approvedVersion?: number;
  approvedAt?: string;
  aiGeneratedPortion: boolean;
  linkedItemId?: string;
}

export type ActivityLifecycle =
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ActivityItem {
  id: string;
  title: string;
  type: string;
  nextOccurrence: string;
  status: ActivityLifecycle;
  owner: string;
}

export interface GroupProfile {
  name: string;
  tagline: string;
  preferredTranslation: string;
  weeklyFocusTheme: string;
  weeklyFocusScripture: string;
  weeklyFocusObjective: string;
  principles: string[];
}

export type AppCategory = "productive" | "neutral" | "distracting" | "unclassified";

export interface AppUsageEntry {
  packageName: string;
  appName: string;
  minutes: number;
  category: AppCategory;
}

export interface DailyProductivityRecord {
  dateKey: string;
  totalMinutes: number;
  apps: AppUsageEntry[];
}

export interface RoutineItem {
  id: string;
  title: string;
  cadence: string;
  category: string;
  checkedInToday: boolean;
  lastCheckedIn?: string;
}

export interface FocusSessionRecord {
  id: string;
  label: string;
  durationMinutes: number;
  completedAt: string;
}

export interface CaptureSourceConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  permission: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resourceType: string;
  detail: string;
}

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  rationale?: string;
  evidenceIds?: string[];
  scriptureRefs?: string[];
  suggestedDraftTitle?: string;
  model?: string;
  productivityIncluded?: boolean;
}


export type DailyMood = "good" | "not_bad" | "bad";

export interface MoodCheckInRecord {
  id: string;
  dateKey: string;
  mood: DailyMood;
  note: string;
  submittedAt: string;
}
