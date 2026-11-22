import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { HomeDashboard } from "./components/HomeDashboard";
import { CommunityScreen } from "./screens/CommunityScreen";
import { MinistryScreen } from "./screens/MinistryScreen";
import { ProductivityScreen } from "./screens/ProductivityScreen";
import { AssistantScreen } from "./screens/AssistantScreen";
import { SettingsScreen, type RetentionDays } from "./screens/SettingsScreen";
import { DailyMoodCheckIn } from "./screens/DailyMoodCheckIn";
import {
  INITIAL_GROUP_PROFILE,
  INITIAL_COMMUNITY_ITEMS,
  INITIAL_ACTIVITIES,
  INITIAL_PRODUCTIVITY_DAYS,
  INITIAL_ROUTINES,
  INITIAL_FOCUS_SESSIONS,
  INITIAL_DRAFTS,
  INITIAL_AI_MESSAGES,
  INITIAL_CAPTURE_SOURCES,
  INITIAL_AUDIT_EVENTS,
} from "./data/seedData";
import {
  getAssistantHealth,
  requestAssistantReply,
  type AssistantHealth,
} from "./lib/api/assistant";
import { readPersistedState, writePersistedState } from "./lib/persistence";
import type {
  ActivityLifecycle,
  AiChatMessage,
  AuditEvent,
  CaptureSourceConfig,
  AppCategory,
  CommunityItemStatus,
  ContentDraft,
  DailyMood,
  MoodCheckInRecord,
  NavDestination,
} from "./types/domain";

const pageTitles: Record<NavDestination, string> = {
  home: "Home",
  community: "Community",
  ministry: "Ministry",
  productivity: "Productivity",
  ai: "AI Assistant",
  settings: "Settings",
};

function makeMessageId() {
  return `message-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function localDateKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function currentTime() {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  const [activeDest, setActiveDest] = useState<NavDestination>("home");

  const [darkMode, setDarkMode] = useState(() =>
    readPersistedState("dark-mode", false)
  );
  const [routines, setRoutines] = useState(() =>
    readPersistedState("routines", INITIAL_ROUTINES)
  );
  const [communityItems, setCommunityItems] = useState(() =>
    readPersistedState("community-items", INITIAL_COMMUNITY_ITEMS)
  );
  const [groupProfile, setGroupProfile] = useState(() =>
    readPersistedState("group-profile", INITIAL_GROUP_PROFILE)
  );
  const [activities, setActivities] = useState(() =>
    readPersistedState("activities", INITIAL_ACTIVITIES)
  );
  const [drafts, setDrafts] = useState(() =>
    readPersistedState("drafts", INITIAL_DRAFTS)
  );
  const [productivityDays, setProductivityDays] = useState(() =>
    readPersistedState("productivity-days", INITIAL_PRODUCTIVITY_DAYS)
  );
  const [captureSources, setCaptureSources] = useState<CaptureSourceConfig[]>(() =>
    readPersistedState("capture-sources", INITIAL_CAPTURE_SOURCES)
  );
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() =>
    readPersistedState("audit-events", INITIAL_AUDIT_EVENTS)
  );
  const [retentionDays, setRetentionDays] = useState<RetentionDays>(() =>
    readPersistedState<RetentionDays>("retention-days", 30)
  );
  const [moodRecords, setMoodRecords] = useState<MoodCheckInRecord[]>(() =>
    readPersistedState("mood-checkins", [])
  );
  // Opens once on each fresh application launch. In-app navigation does not reopen it.
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(true);

  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>(() =>
    readPersistedState("ai-messages", INITIAL_AI_MESSAGES)
  );

  const [assistantHealth, setAssistantHealth] =
    useState<AssistantHealth | null>(null);
  const [isAiSending, setIsAiSending] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    writePersistedState("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => writePersistedState("routines", routines), [routines]);
  useEffect(() => writePersistedState("community-items", communityItems), [communityItems]);
  useEffect(() => writePersistedState("group-profile", groupProfile), [groupProfile]);
  useEffect(() => writePersistedState("activities", activities), [activities]);
  useEffect(() => writePersistedState("drafts", drafts), [drafts]);
  useEffect(() => writePersistedState("productivity-days", productivityDays), [productivityDays]);
  useEffect(() => writePersistedState("capture-sources", captureSources), [captureSources]);
  useEffect(() => writePersistedState("audit-events", auditEvents), [auditEvents]);
  useEffect(() => writePersistedState("mood-checkins", moodRecords), [moodRecords]);
  useEffect(() => writePersistedState("retention-days", retentionDays), [retentionDays]);
  useEffect(() => writePersistedState("ai-messages", aiMessages), [aiMessages]);

  useEffect(() => {
    let active = true;

    getAssistantHealth()
      .then((health) => {
        if (active) setAssistantHealth(health);
      })
      .catch(() => {
        if (active) setAssistantHealth(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const recordAuditEvent = (
    action: string,
    resourceType: string,
    detail: string
  ) => {
    const event: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      actor: "Workspace admin",
      action,
      resourceType,
      detail,
    };
    setAuditEvents((current) => [event, ...current].slice(0, 500));
  };

  const toggleCaptureSource = (id: string) => {
    const source = captureSources.find((item) => item.id === id);
    if (!source) return;

    const enabled = !source.enabled;
    setCaptureSources((current) =>
      current.map((item) =>
        item.id === id ? { ...item, enabled } : item
      )
    );

    recordAuditEvent(
      enabled ? "CAPTURE_SOURCE_PREFERENCE_ENABLED" : "CAPTURE_SOURCE_PREFERENCE_DISABLED",
      "CaptureSource",
      `${source.name} preference changed to ${enabled ? "on" : "off"}. No device permission was granted.`
    );
  };

  const updateRetention = (days: RetentionDays) => {
    setRetentionDays(days);
    recordAuditEvent(
      "RETENTION_PREFERENCE_UPDATED",
      "PrivacySettings",
      `Preferred retention period set to ${days} days. Automatic expiry is not implemented.`
    );
  };

  const exportWorkspaceData = () => {
    const exportEvent: AuditEvent = {
      id: `audit-${Date.now()}-export`,
      timestamp: new Date().toISOString(),
      actor: "Workspace admin",
      action: "WORKSPACE_DATA_EXPORTED",
      resourceType: "Workspace",
      detail: "Workspace data exported as a JSON file by user action.",
    };
    const exportAudit = [exportEvent, ...auditEvents].slice(0, 500);
    setAuditEvents(exportAudit);

    const backup = {
      exportVersion: 1,
      exportedAt: new Date().toISOString(),
      product: "Rising Giants",
      data: {
        groupProfile,
        communityItems,
        activities,
        drafts,
        routines,
        productivityDays,
        focusSessions: INITIAL_FOCUS_SESSIONS,
        aiMessages,
        moodCheckIns: moodRecords,
        captureSources,
        privacy: { retentionDays },
        auditEvents: exportAudit,
      },
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rising-giants-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const toggleRoutine = (id: string) => {
    setRoutines((current) =>
      current.map((routine) =>
        routine.id === id
          ? { ...routine, checkedInToday: !routine.checkedInToday }
          : routine
      )
    );
  };

  const updateCommunityStatus = (
    id: string,
    status: CommunityItemStatus
  ) => {
    setCommunityItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const updateActivityStatus = (
    id: string,
    status: ActivityLifecycle
  ) => {
    setActivities((current) =>
      current.map((activity) =>
        activity.id === id ? { ...activity, status } : activity
      )
    );
  };

  const updateDraft = (updatedDraft: ContentDraft) => {
    setDrafts((current) =>
      current.map((draft) =>
        draft.id === updatedDraft.id ? updatedDraft : draft
      )
    );
  };

  const createDraft = () => {
    const id = `draft-${Date.now()}`;

    const newDraft: ContentDraft = {
      id,
      title: "New ministry draft",
      kind: "reflection",
      targetProgram: "",
      userNotes: "",
      body: "",
      scriptureRefs: [],
      translation: groupProfile.preferredTranslation,
      status: "draft",
      version: 1,
      updatedAt: new Date().toISOString(),
      aiGeneratedPortion: false,
    };

    setDrafts((current) => [newDraft, ...current]);
    return id;
  };

  const updateAppCategory = (
    dayKey: string,
    packageName: string,
    category: AppCategory
  ) => {
    setProductivityDays((current) =>
      current.map((day) =>
        day.dateKey !== dayKey
          ? day
          : {
              ...day,
              apps: day.apps.map((app) =>
                app.packageName === packageName
                  ? { ...app, category }
                  : app
              ),
            }
      )
    );
  };

  const sendAiMessage = async (content: string) => {
    const userMessage: AiChatMessage = {
      id: makeMessageId(),
      role: "user",
      content,
      timestamp: currentTime(),
      productivityIncluded: false,
    };

    const conversation = [...aiMessages, userMessage];
    setAiMessages(conversation);
    setAiError(null);
    setIsAiSending(true);

    try {
      const result = await requestAssistantReply(conversation.slice(-12));

      const assistantMessage: AiChatMessage = {
        id: makeMessageId(),
        role: "assistant",
        content: result.reply,
        timestamp: currentTime(),
        model: result.model,
        productivityIncluded: false,
      };

      setAiMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      setAiError(
        error instanceof Error
          ? error.message
          : "The assistant could not complete your request."
      );
    } finally {
      setIsAiSending(false);
    }
  };

  const clearConversation = () => {
    setAiMessages(INITIAL_AI_MESSAGES);
    setAiError(null);
  };

  const todayKey = localDateKey();
  const todayMood = moodRecords.find((record) => record.dateKey === todayKey) ?? null;

  const saveMoodCheckIn = (mood: DailyMood, note: string) => {
    const record: MoodCheckInRecord = {
      id: `mood-${todayKey}`,
      dateKey: todayKey,
      mood,
      note,
      submittedAt: new Date().toISOString(),
    };
    setMoodRecords((current) => [
      record,
      ...current.filter((item) => item.dateKey !== todayKey),
    ].slice(0, 365));
  };

  const needsReviewCount = communityItems.filter(
    (item) => item.status === "review_required" || item.status === "open"
  ).length;

  return (
    <>
    <AppShell
      activeDest={activeDest}
      onNavigate={setActiveDest}
      onOpenCapture={() => alert("Capture workspace coming soon.")}
      onOpenAssistant={() => setActiveDest("ai")}
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode((value) => !value)}
      needsReviewCount={needsReviewCount}
      allCapturePaused={false}
    >
      {activeDest === "community" ? (
        <CommunityScreen
          items={communityItems}
          onUpdateStatus={updateCommunityStatus}
        />
      ) : activeDest === "ministry" ? (
        <MinistryScreen
          profile={groupProfile}
          activities={activities}
          drafts={drafts}
          onUpdateProfile={setGroupProfile}
          onUpdateActivity={updateActivityStatus}
          onUpdateDraft={updateDraft}
          onCreateDraft={createDraft}
        />
      ) : activeDest === "productivity" ? (
        <ProductivityScreen
          days={productivityDays}
          focusSessions={INITIAL_FOCUS_SESSIONS}
          onUpdateCategory={updateAppCategory}
        />
      ) : activeDest === "ai" ? (
        <AssistantScreen
          messages={aiMessages}
          health={assistantHealth}
          isSending={isAiSending}
          error={aiError}
          onSendMessage={sendAiMessage}
          onClearConversation={clearConversation}
        />
      ) : activeDest === "settings" ? (
        <SettingsScreen
          captureSources={captureSources}
          auditEvents={auditEvents}
          retentionDays={retentionDays}
          onToggleCaptureSource={toggleCaptureSource}
          onRetentionChange={updateRetention}
          onExportData={exportWorkspaceData}
        />
      ) : activeDest === "home" ? (
        <HomeDashboard
          groupProfile={groupProfile}
          communityItems={communityItems}
          activities={activities}
          todayProductivity={productivityDays[0] ?? INITIAL_PRODUCTIVITY_DAYS[0]!}
          routines={routines}
          focusSessions={INITIAL_FOCUS_SESSIONS}
          onNavigate={setActiveDest}
          onToggleRoutine={toggleRoutine}
          onOpenCapture={() => alert("Capture workspace coming soon.")}
        />
      ) : (
        <section className="mx-auto max-w-5xl p-8">
          <p className="text-sm font-medium text-amber-600">
            RISING GIANTS WORKSPACE
          </p>
          <h1 className="mt-2 text-3xl font-semibold dark:text-white">
            {pageTitles[activeDest]}
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            This section is next in our development sequence.
          </p>
          <button
            onClick={() => setActiveDest("home")}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-white dark:bg-white dark:text-slate-900"
          >
            Back to dashboard
          </button>
        </section>
      )}
    </AppShell>

    {showMoodCheckIn && (
      <DailyMoodCheckIn
        existing={todayMood}
        onSave={saveMoodCheckIn}
        onContinue={() => setShowMoodCheckIn(false)}
      />
    )}
    </>
  );
}
