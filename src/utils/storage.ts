import { Conversation, UserProfile, UserSettings } from "../types";

const CONVERSATIONS_KEY = "dlicom_ai_conversations";
const SETTINGS_KEY = "dlicom_ai_settings";
const USER_KEY = "dlicom_ai_user";

export const DEFAULT_USER: UserProfile = {
  id: "user_pro_01",
  name: "Alex Vance",
  email: "alex.vance@dlicom.ai",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  tier: "Pro",
  joinedDate: "January 2026",
  isAuthenticated: true,
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: "dark",
  stylePreference: "balanced",
  temperature: 0.7,
  enableStreaming: true,
  enableSound: true,
  speechSpeed: 1.0,
};

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_seed_1",
    title: "Understanding Photosynthesis",
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    toolMode: "study",
    isPinned: true,
    messages: [
      {
        id: "msg_1",
        role: "user",
        content: "What is photosynthesis?",
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
      },
      {
        id: "msg_2",
        role: "assistant",
        content: `**Photosynthesis** is the biological process by which green plants, algae, and certain bacteria use sunlight, water, and carbon dioxide to produce food (glucose) and release oxygen.

### The Chemical Equation
$$6CO_2 + 6H_2O + \\text{Light} \\longrightarrow C_6H_{12}O_6 + 6O_2$$

### Key Stages
1. **Light-Dependent Reactions (in the Thylakoids):**
   - Chlorophyll absorbs solar energy.
   - Water molecules ($H_2O$) are split into oxygen, protons, and high-energy electrons.
   - ATP and NADPH are synthesized.

2. **Light-Independent Reactions / Calvin Cycle (in the Stroma):**
   - Carbon dioxide ($CO_2$) is fixed into glyceraldehyde-3-phosphate (G3P).
   - These molecules convert into glucose and essential plant nutrients.

> **Summary:** Without photosynthesis, Earth's oxygen-rich atmosphere and the foundational base of our food chain would not exist.`,
        timestamp: Date.now() - 1000 * 60 * 59 * 2,
      },
    ],
  },
  {
    id: "conv_seed_2",
    title: "Innovative AI SaaS Ideas",
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // yesterday
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    toolMode: "ideas",
    messages: [
      {
        id: "msg_3",
        role: "user",
        content: "Give me 3 innovative AI SaaS product ideas for 2026.",
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        id: "msg_4",
        role: "assistant",
        content: `Here are 3 high-potential AI SaaS concepts tailored for modern teams in 2026:

1. **NeuralSpec — Automated Engineering PRD & Architecture Engine**
   - **Problem:** Engineering leaders spend weeks writing and reconciling product requirement documents with architectural constraints.
   - **Solution:** Ingests design mocks and user stories to automatically produce verified API schemas, database schemas, and edge-case security checklists.

2. **AuditFlux — Real-time Financial & Tax Compliance Agent**
   - **Problem:** Multi-jurisdiction commerce companies face constantly shifting compliance mandates.
   - **Solution:** Continuously monitors ledger entries against localized regulations, predicting compliance flags before tax filings.

3. **CognitiveTutor — Adaptive Multimodal STEM Coach**
   - **Problem:** Generic learning platforms fail to adapt to a student's distinct cognitive roadblocks.
   - **Solution:** Analyzes student problem-solving steps live via audio and canvas strokes to deliver targeted micro-hints rather than giving away full answers.`,
        timestamp: Date.now() - 1000 * 60 * 59 * 24,
      },
    ],
  },
];

export function getStoredConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(SEED_CONVERSATIONS));
      return SEED_CONVERSATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_CONVERSATIONS;
  } catch (err) {
    console.error("Failed to read conversations from localStorage:", err);
    return SEED_CONVERSATIONS;
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (err) {
    console.error("Failed to save conversations to localStorage:", err);
  }
}

export function getStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error("Failed to save settings:", err);
  }
}

export function getStoredUser(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return DEFAULT_USER;
    return { ...DEFAULT_USER, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_USER;
  }
}

export function saveUser(user: UserProfile): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Failed to save user profile:", err);
  }
}
