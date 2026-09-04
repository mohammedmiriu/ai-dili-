import React from "react";
import {
  MessageSquare,
  Sparkles,
  Zap,
  Bookmark,
  User,
  Clock,
  Trash2,
  ExternalLink,
  Shield,
  Activity,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Conversation, UserProfile } from "../types";
import { WhoMadeThis } from "./WhoMadeThis";

interface DashboardViewProps {
  conversations: Conversation[];
  user: UserProfile;
  onOpenConversation: (id: string) => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  isDark: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  conversations,
  user,
  onOpenConversation,
  onDeleteConversation,
  onNewChat,
  onOpenSettings,
  isDark,
}) => {
  const totalConversations = conversations.length;
  const totalMessages = conversations.reduce(
    (acc, c) => acc + (c.messages ? c.messages.length : 0),
    0
  );
  // Estimate tokens (approx 150 words / ~200 tokens per message)
  const estimatedTokens = totalMessages * 180;
  const savedChats = conversations.filter((c) => c.isPinned);
  const recentChats = [...conversations]
    .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              User Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Overview of your AI conversations, system usage, and Dili Ai account profile.
            </p>
          </div>

          <button
            onClick={onNewChat}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start New Chat</span>
          </button>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Conversations */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? "bg-slate-900/60 border-slate-800 shadow-md"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Conversations
              </span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-100">
              {totalConversations}
            </div>
            <span className="text-[11px] text-cyan-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Active threads</span>
            </span>
          </div>

          {/* Card 2: Total Messages */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? "bg-slate-900/60 border-slate-800 shadow-md"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Messages
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-100">
              {totalMessages}
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              Prompts & responses
            </span>
          </div>

          {/* Card 3: AI Usage / Tokens */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? "bg-slate-900/60 border-slate-800 shadow-md"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Estimated Tokens
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-100">
              {estimatedTokens.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>High throughput</span>
            </span>
          </div>

          {/* Card 4: Saved Chats */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? "bg-slate-900/60 border-slate-800 shadow-md"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Saved Chats
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-100">
              {savedChats.length}
            </div>
            <span className="text-[11px] text-purple-400 font-medium mt-1 block">
              Pinned for quick review
            </span>
          </div>
        </div>

        {/* Account Information & Tier */}
        <div
          className={`p-6 rounded-3xl border ${
            isDark
              ? "bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-100">{user.name}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                    {user.tier} Tier
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{user.email}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Member since: {user.joinedDate}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onOpenSettings}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDark
                    ? "bg-white/5 border-slate-700 hover:bg-white/10 text-slate-200"
                    : "bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800"
                }`}
              >
                Edit Account Settings
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Section: Recent Conversations & Saved Chats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Conversations */}
          <div
            className={`p-6 rounded-3xl border ${
              isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Recent Conversations
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {recentChats.length} shown
              </span>
            </div>

            {recentChats.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                No recent conversations found.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentChats.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onOpenConversation(c.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isDark
                        ? "bg-slate-950/60 border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900"
                        : "bg-slate-50 border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-300">
                        {c.title || "Untitled Conversation"}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>{c.messages.length} messages</span>
                        <span>•</span>
                        <span>
                          {new Date(c.updatedAt || c.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => onDeleteConversation(c.id, e)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved / Pinned Chats */}
          <div
            className={`p-6 rounded-3xl border ${
              isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-slate-100">Saved Chats</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {savedChats.length} pinned
              </span>
            </div>

            {savedChats.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                You have not pinned any conversations yet. Click the pin icon in the sidebar to save important threads.
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedChats.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onOpenConversation(c.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isDark
                        ? "bg-slate-950/60 border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-900"
                        : "bg-slate-50 border-slate-200 hover:border-purple-400 hover:bg-purple-50/50"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="text-xs font-bold text-slate-200 truncate group-hover:text-purple-300">
                        {c.title || "Untitled Conversation"}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                        <span className="text-purple-400 font-semibold uppercase text-[10px]">
                          Pinned
                        </span>
                        <span>•</span>
                        <span>{c.messages.length} messages</span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Who made this section */}
        <WhoMadeThis isDark={isDark} className="pt-4" />
      </div>
    </div>
  );
};
