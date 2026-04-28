import { QuestAutoCompleteSettings } from "./settings";

export const manifest = {
  name: "Quest Auto-Completer",
  description: "Automatically complete Discord quests with ease. Complete all quests at once or individual quests with full control.",
  authors: [
    {
      name: "YourName",
      id: "0",
    },
  ],
  version: "1.0.0",
  vendetta: {
    icon: "ic_verified_user",
    settings: "QuestAutoCompleteSettings",
  },
};

export default {
  onLoad: () => {
    console.log("[QuestAutoComplete] Plugin v1.0.0 loaded successfully");
    console.log("[QuestAutoComplete] Ready to auto-complete quests!");
  },

  onUnload: () => {
    console.log("[QuestAutoComplete] Plugin unloaded");
  },

  settings: QuestAutoCompleteSettings,
};
