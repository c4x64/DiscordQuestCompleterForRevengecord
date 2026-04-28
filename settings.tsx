import { findByProps } from "@vendetta/metro";
import { React, ReactNative as RN } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";

const { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Switch } = RN;

interface Quest {
  id: string;
  name: string;
  description: string;
  progress: number;
  isCompleted: boolean;
  completionTime?: number;
}

interface PluginSettings {
  autoRefresh: boolean;
  showCompletedQuests: boolean;
  confirmBeforeComplete: boolean;
  notifyOnComplete: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
  autoRefresh: true,
  showCompletedQuests: false,
  confirmBeforeComplete: false,
  notifyOnComplete: true,
};

let settings = { ...DEFAULT_SETTINGS };

// Module finding with better error handling
function findQuestsModule() {
  try {
    return findByProps("getQuests", "completeQuest");
  } catch (e) {
    console.error("[QuestAutoComplete] Module not found:", e);
    return null;
  }
}

// Main Settings Component
export function QuestAutoCompleteSettings() {
  const [quests, setQuests] = React.useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = React.useState<Quest[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [localSettings, setLocalSettings] = React.useState<PluginSettings>(settings);
  const [showSettings, setShowSettings] = React.useState(false);
  const [selectedQuest, setSelectedQuest] = React.useState<Quest | null>(null);
  const [confirmAction, setConfirmAction] = React.useState<{
    type: "completeOne" | "completeAll" | null;
    questId?: string;
  }>({ type: null });

  const questsModule = findQuestsModule();

  const loadQuests = React.useCallback(() => {
    setLoading(true);
    try {
      if (!questsModule) {
        showToast({
          content: "❌ Unable to access quest system",
          source: "QuestAutoComplete",
        });
        setLoading(false);
        return;
      }

      const allQuests = questsModule.getQuests();
      const incomplete = allQuests.filter((q) => !q.isCompleted);
      const completed = allQuests.filter((q) => q.isCompleted);

      setQuests(incomplete);
      setCompletedQuests(completed);
    } catch (error) {
      console.error("[QuestAutoComplete] Error loading quests:", error);
      showToast({
        content: "❌ Error loading quests",
        source: "QuestAutoComplete",
      });
    } finally {
      setLoading(false);
    }
  }, [questsModule]);

  React.useEffect(() => {
    loadQuests();
    if (localSettings.autoRefresh) {
      const interval = setInterval(loadQuests, 10000); // Auto-refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [loadQuests, localSettings.autoRefresh]);

  const completeQuest = React.useCallback(
    (quest: Quest) => {
      try {
        if (!questsModule) {
          showToast({
            content: "❌ Quest system not available",
            source: "QuestAutoComplete",
          });
          return;
        }

        if (quest.progress < 100) {
          questsModule.updateQuestProgress(quest.id, 100);
        }

        questsModule.completeQuest(quest.id);

        if (localSettings.notifyOnComplete) {
          showToast({
            content: `✅ Completed: ${quest.name}`,
            source: "QuestAutoComplete",
          });
        }

        // Refresh list
        setTimeout(loadQuests, 500);
      } catch (error) {
        console.error("[QuestAutoComplete] Error completing quest:", error);
        showToast({
          content: `❌ Failed to complete quest`,
          source: "QuestAutoComplete",
        });
      }
    },
    [questsModule, localSettings.notifyOnComplete, loadQuests]
  );

  const completeAllQuests = React.useCallback(() => {
    try {
      if (!questsModule || quests.length === 0) return;

      let completed = 0;
      quests.forEach((quest) => {
        try {
          if (quest.progress < 100) {
            questsModule.updateQuestProgress(quest.id, 100);
          }
          questsModule.completeQuest(quest.id);
          completed++;
        } catch (e) {
          console.error(`[QuestAutoComplete] Failed to complete quest ${quest.id}:`, e);
        }
      });

      if (localSettings.notifyOnComplete) {
        showToast({
          content: `✅ Completed ${completed} quest(s)`,
          source: "QuestAutoComplete",
        });
      }

      setTimeout(loadQuests, 500);
    } catch (error) {
      console.error("[QuestAutoComplete] Error in completeAllQuests:", error);
      showToast({
        content: "❌ Error completing quests",
        source: "QuestAutoComplete",
      });
    }
  }, [questsModule, quests, localSettings.notifyOnComplete, loadQuests]);

  const updateSetting = (key: keyof PluginSettings, value: boolean) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    settings = newSettings;
  };

  // Confirmation Modal
  const ConfirmationModal = () => {
    if (confirmAction.type === null) return null;

    const message =
      confirmAction.type === "completeAll"
        ? `Complete all ${quests.length} available quest(s)?`
        : `Complete "${selectedQuest?.name}"?`;

    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <View
          style={{
            backgroundColor: "#36393F",
            borderRadius: 12,
            padding: 20,
            width: "85%",
            maxWidth: 300,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Confirm Action
          </Text>
          <Text style={{ color: "#B0BCC1", fontSize: 14, marginBottom: 20 }}>
            {message}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              onPress={() => setConfirmAction({ type: null })}
              style={{
                flex: 1,
                backgroundColor: "#4E555E",
                paddingVertical: 10,
                borderRadius: 6,
                marginRight: 8,
              }}
            >
              <Text style={{ color: "#FFFFFF", textAlign: "center", fontWeight: "bold" }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (confirmAction.type === "completeAll") {
                  completeAllQuests();
                } else if (confirmAction.type === "completeOne" && selectedQuest) {
                  completeQuest(selectedQuest);
                }
                setConfirmAction({ type: null });
              }}
              style={{
                flex: 1,
                backgroundColor: "#5865F2",
                paddingVertical: 10,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#FFFFFF", textAlign: "center", fontWeight: "bold" }}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Settings Panel
  const SettingsPanel = () => (
    <View
      style={{
        backgroundColor: "#2C2F33",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: "bold",
          marginBottom: 12,
        }}
      >
        ⚙️ Settings
      </Text>

      <SettingRow
        label="Auto Refresh"
        subtext="Refresh quest list every 10 seconds"
        value={localSettings.autoRefresh}
        onValueChange={(value) => updateSetting("autoRefresh", value)}
      />

      <SettingRow
        label="Show Completed Quests"
        subtext="Display already completed quests"
        value={localSettings.showCompletedQuests}
        onValueChange={(value) => updateSetting("showCompletedQuests", value)}
      />

      <SettingRow
        label="Confirm Before Completing"
        subtext="Show confirmation before completing quests"
        value={localSettings.confirmBeforeComplete}
        onValueChange={(value) => updateSetting("confirmBeforeComplete", value)}
      />

      <SettingRow
        label="Show Notifications"
        subtext="Notify when quests are completed"
        value={localSettings.notifyOnComplete}
        onValueChange={(value) => updateSetting("notifyOnComplete", value)}
      />
    </View>
  );

  // Settings Row Component
  function SettingRow({
    label,
    subtext,
    value,
    onValueChange,
  }: {
    label: string;
    subtext: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#202225",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "bold" }}>
            {label}
          </Text>
          <Text style={{ color: "#72767D", fontSize: 11, marginTop: 2 }}>
            {subtext}
          </Text>
        </View>
        <Switch value={value} onValueChange={onValueChange} />
      </View>
    );
  }

  // Quest Item Component
  function QuestItem({ quest }: { quest: Quest }) {
    return (
      <TouchableOpacity
        onPress={() => setSelectedQuest(selectedQuest?.id === quest.id ? null : quest)}
        style={{
          backgroundColor: "#36393F",
          padding: 12,
          marginBottom: 8,
          borderRadius: 6,
          borderLeftWidth: 3,
          borderLeftColor: "#5865F2",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          {quest.name}
        </Text>
        <Text style={{ color: "#B0BCC1", fontSize: 11, marginBottom: 8 }}>
          {quest.description}
        </Text>

        {/* Progress Bar */}
        <View
          style={{
            height: 6,
            backgroundColor: "#202225",
            borderRadius: 3,
            overflow: "hidden",
            marginBottom: 6,
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${Math.min(quest.progress, 100)}%`,
              backgroundColor: "#43B581",
            }}
          />
        </View>

        <Text style={{ color: "#72767D", fontSize: 10, marginBottom: 8 }}>
          {quest.progress}% Complete
        </Text>

        {selectedQuest?.id === quest.id && (
          <TouchableOpacity
            onPress={() => {
              if (localSettings.confirmBeforeComplete) {
                setConfirmAction({ type: "completeOne", questId: quest.id });
              } else {
                completeQuest(quest);
              }
            }}
            style={{
              backgroundColor: "#5865F2",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              ✓ Complete Quest
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#36393F",
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          🎯 Quest Auto-Completer
        </Text>
        <TouchableOpacity
          onPress={() => setShowSettings(!showSettings)}
          style={{
            padding: 8,
            backgroundColor: "#4E555E",
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          disabled={loading || quests.length === 0}
          onPress={() => {
            if (localSettings.confirmBeforeComplete) {
              setConfirmAction({ type: "completeAll" });
            } else {
              completeAllQuests();
            }
          }}
          style={{
            flex: 1,
            backgroundColor: quests.length === 0 ? "#4E555E" : "#5865F2",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            ⚡ Complete All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={loadQuests}
          disabled={loading}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            backgroundColor: "#4E555E",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "bold" }}>
              🔄
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Settings Panel */}
      {showSettings && <SettingsPanel />}

      {/* Quest Stats */}
      <View
        style={{
          backgroundColor: "#2C2F33",
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#5865F2", fontSize: 16, fontWeight: "bold" }}>
            {quests.length}
          </Text>
          <Text style={{ color: "#72767D", fontSize: 11 }}>Available</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#43B581", fontSize: 16, fontWeight: "bold" }}>
            {completedQuests.length}
          </Text>
          <Text style={{ color: "#72767D", fontSize: 11 }}>Completed</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#FAA61A", fontSize: 16, fontWeight: "bold" }}>
            {quests.length + completedQuests.length}
          </Text>
          <Text style={{ color: "#72767D", fontSize: 11 }}>Total</Text>
        </View>
      </View>

      {/* Quest List */}
      <ScrollView style={{ flex: 1 }}>
        {loading && quests.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <ActivityIndicator color="#5865F2" size="large" />
            <Text style={{ color: "#72767D", fontSize: 12, marginTop: 10 }}>
              Loading quests...
            </Text>
          </View>
        ) : quests.length > 0 ? (
          <>
            {quests.map((quest) => (
              <QuestItem key={quest.id} quest={quest} />
            ))}

            {localSettings.showCompletedQuests && completedQuests.length > 0 && (
              <>
                <Text
                  style={{
                    color: "#72767D",
                    fontSize: 12,
                    fontWeight: "bold",
                    marginTop: 16,
                    marginBottom: 8,
                  }}
                >
                  ✓ Completed Quests ({completedQuests.length})
                </Text>
                {completedQuests.map((quest) => (
                  <View
                    key={quest.id}
                    style={{
                      backgroundColor: "#2C2F33",
                      padding: 10,
                      marginBottom: 8,
                      borderRadius: 6,
                      borderLeftWidth: 3,
                      borderLeftColor: "#43B581",
                    }}
                  >
                    <Text
                      style={{
                        color: "#72767D",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {quest.name}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <Text style={{ color: "#72767D", fontSize: 14 }}>
              🎉 All quests completed!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      {localSettings.confirmBeforeComplete && <ConfirmationModal />}
    </View>
  );
}

export default QuestAutoCompleteSettings;
