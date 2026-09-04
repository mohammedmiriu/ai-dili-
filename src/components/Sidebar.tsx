import React, { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Pin,
  Settings as SettingsIcon,
  MessageSquare,
  Sparkles,
  LayoutDashboard,
  Calendar,
  X,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Logo } from "./Logo";
import { Conversation, UserProfile } from "../types";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  onTogglePin?: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenDashboard: () => void;
  onOpenWhoMadeThis?: () => void;
  user: UserProfile;
  isDark: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onTogglePin,
  isOpen,
  onClose,
  onOpenSettings,
  onOpenDashboard,
  onOpenWhoMadeThis,
  user,
  isDark,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations by date (Today, Yesterday, Older)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const pinned = filteredConversations.filter((c) => c.isPinned);
  const unpinned = filteredConversations.filter((c) => !c.isPinned);

  const formatConversationDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const isToday = d >= today;
    if (isToday) return "Today";
    const isYesterday = d >= yesterday;
    if (isYesterday) return "Yesterday";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isDark
            ? "bg-[#0a0e19] border-r border-slate-800/80 text-slate-200"
            : "bg-slate-50 border-r border-slate-200 text-slate-800"
        }`}
      >
        {/* Top Header & Logo */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/50">
          <Logo size="sm" showTagline={true} />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            id="sidebar-new-chat-btn"
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 active:scale-[0.99] transition-all cursor-pointer group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search Conversations */}
        <div className="px-3 pb-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${
              isDark
                ? "bg-slate-900/60 border-slate-800 text-slate-300 focus-within:border-cyan-500/50"
                : "bg-white border-slate-200 text-slate-700 focus-within:border-cyan-500/50"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-xs placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 select-none">
          {/* Pinned Section */}
          {pinned.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400/80 flex items-center gap-1.5">
                <Pin className="w-3 h-3" />
                <span>Pinned</span>
              </div>
              <div className="space-y-0.5">
                {pinned.map((conv) => renderConversationItem(conv))}
              </div>
            </div>
          )}

          {/* All Conversations */}
          <div>
            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span>History ({filteredConversations.length})</span>
              </span>
            </div>

            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-xs text-slate-400">
                  {searchQuery ? "No matching conversations" : "No conversations yet."}
                </p>
                <button
                  onClick={onNewChat}
                  className="mt-2 text-xs text-cyan-400 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Start your first chat</span>
                </button>
              </div>
            ) : (
              <div className="space-y-0.5">
                {unpinned.map((conv) => renderConversationItem(conv))}
              </div>
            )}
          </div>
        </div>

        {/* Footer & User Profile */}
        <div
          className={`p-3 border-t space-y-1 ${
            isDark ? "border-slate-800/80 bg-slate-950/40" : "border-slate-200 bg-white"
          }`}
        >
          <button
            onClick={() => {
              onOpenDashboard();
              if (window.innerWidth < 1024) onClose();
            }}
            id="sidebar-dashboard-btn"
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isDark ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>User Dashboard</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => {
              onOpenSettings();
              if (window.innerWidth < 1024) onClose();
            }}
            id="sidebar-settings-btn"
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isDark ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <SettingsIcon className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {onOpenWhoMadeThis && (
            <button
              onClick={() => {
                onOpenWhoMadeThis();
                if (window.innerWidth < 1024) onClose();
              }}
              id="sidebar-who-made-this-btn"
              type="button"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isDark
                  ? "text-amber-300/90 hover:text-amber-300 hover:bg-amber-500/10"
                  : "text-amber-700 hover:bg-amber-50"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400/80" />
                <span>Who made this</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400/60" />
            </button>
          )}

          {/* User Badge */}
          <div
            onClick={() => {
              onOpenDashboard();
              if (window.innerWidth < 1024) onClose();
            }}
            className={`mt-2 pt-2 flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer transition-colors ${
              isDark ? "hover:bg-white/5" : "hover:bg-slate-100"
            }`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-cyan-400/40"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate text-slate-200">
                {user.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user.email}
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {user.tier}
            </span>
          </div>
        </div>
      </aside>
    </>
  );

  function renderConversationItem(conv: Conversation) {
    const isActive = conv.id === activeConversationId;
    return (
      <div
        key={conv.id}
        onClick={() => {
          onSelectConversation(conv.id);
          if (window.innerWidth < 1024) onClose();
        }}
        className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
          isActive
            ? isDark
              ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
              : "bg-cyan-50 text-cyan-800 border border-cyan-200"
            : isDark
            ? "text-slate-300 hover:bg-white/5 hover:text-white"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
          <MessageSquare
            className={`w-3.5 h-3.5 shrink-0 ${
              isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-300"
            }`}
          />
          <div className="truncate flex-1">
            <span className="truncate block">{conv.title || "Untitled Conversation"}</span>
            <span className="text-[10px] text-slate-400 block font-normal">
              {formatConversationDate(conv.updatedAt || conv.createdAt)}
            </span>
          </div>
        </div>

        {/* Action icons on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onTogglePin && (
            <button
              onClick={(e) => onTogglePin(conv.id, e)}
              className={`p-1 rounded hover:bg-white/10 ${
                conv.isPinned ? "text-cyan-400" : "text-slate-400 hover:text-white"
              }`}
              title={conv.isPinned ? "Unpin conversation" : "Pin conversation"}
            >
              <Pin className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={(e) => onDeleteConversation(conv.id, e)}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete conversation"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }
};
