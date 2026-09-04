export type ToolMode =
  | "general"
  | "study"
  | "ideas"
  | "writing"
  | "coding"
  | "explainer";

export type StylePreference = "concise" | "balanced" | "detailed";

export interface ChatAttachment {
  name: string;
  type: string;
  size: number;
  dataUrl: string; // base64
  mimeType: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  attachment?: ChatAttachment;
  toolMode?: ToolMode;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  toolMode: ToolMode;
  isPinned?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: "Free" | "Pro" | "Enterprise";
  joinedDate: string;
  isAuthenticated: boolean;
}

export interface UserSettings {
  theme: "dark" | "light";
  stylePreference: StylePreference;
  temperature: number;
  enableStreaming: boolean;
  enableSound: boolean;
  speechSpeed: number;
}

export interface ToolDefinition {
  id: ToolMode;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  starterPrompts: string[];
}
