import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Square,
  Sparkles,
  Paperclip,
  Copy,
  Check,
  RefreshCw,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Image as ImageIcon,
  X,
  Bot,
  User,
  Sliders,
  Share2,
  ArrowDown,
  Edit2,
  CheckCircle2,
  Menu,
} from "lucide-react";
import { Conversation, ChatMessage, ToolMode, UserProfile, UserSettings, ChatAttachment } from "../types";
import { AI_TOOLS } from "../data/tools";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { RobotAvatar } from "./RobotAvatar";

interface ChatViewProps {
  conversation: Conversation | null;
  onSendMessage: (content: string, attachment?: ChatAttachment) => Promise<void>;
  onRegenerate: () => Promise<void>;
  onStopGeneration: () => void;
  isGenerating: boolean;
  onUpdateTitle: (title: string) => void;
  onClearMessages: () => void;
  onSelectToolMode: (mode: ToolMode) => void;
  user: UserProfile;
  settings: UserSettings;
  isDark: boolean;
  onToggleSidebar?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversation,
  onSendMessage,
  onRegenerate,
  onStopGeneration,
  isGenerating,
  onUpdateTitle,
  onClearMessages,
  onSelectToolMode,
  user,
  settings,
  isDark,
  onToggleSidebar,
}) => {
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, "up" | "down">>({});
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const activeTool = AI_TOOLS.find((t) => t.id === (conversation?.toolMode || "general")) || AI_TOOLS[0];

  useEffect(() => {
    if (conversation) {
      setTitleDraft(conversation.title);
    }
  }, [conversation?.id, conversation?.title]);

  // Auto-scroll on new messages or generation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, isGenerating]);

  // Track scroll position to show "scroll to bottom" button
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 180;
    setShowScrollBottom(isFarFromBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !attachment) || isGenerating) return;

    const messageText = input;
    const currentAttachment = attachment;

    setInput("");
    setAttachment(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await onSendMessage(messageText, currentAttachment || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // File Upload Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      alert("File size exceeds 15MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAttachment({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
        mimeType: file.type || "application/octet-stream",
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Copy message
  const handleCopyMessage = async (msgId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Text-To-Speech handler
  const handleSpeak = (msgId: string, text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported by your browser.");
      return;
    }

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown code fences before speaking
    const cleanText = text.replace(/```[\s\S]*?```/g, "Code block omitted.").replace(/[#*_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = settings.speechSpeed || 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleFeedback = (msgId: string, type: "up" | "down") => {
    setLikedMap((prev) => ({
      ...prev,
      [msgId]: prev[msgId] === type ? undefined! : type,
    }));
  };

  const handleSaveTitle = () => {
    if (titleDraft.trim()) {
      onUpdateTitle(titleDraft.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Header bar */}
      <div
        className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-4 select-none z-10 ${
          isDark
            ? "bg-[#0b0f1d]/80 border-slate-800/80 backdrop-blur-md"
            : "bg-white/80 border-slate-200 backdrop-blur-md"
        }`}
      >
        {/* Title and Tool Mode */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              type="button"
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Toggle chat history"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {isEditingTitle ? (
            <div className="flex items-center gap-2 max-w-md w-full">
              <input
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                autoFocus
                className={`w-full px-2.5 py-1 text-sm rounded-lg border outline-none font-medium ${
                  isDark
                    ? "bg-slate-900 border-cyan-500/50 text-white"
                    : "bg-slate-50 border-cyan-500/50 text-slate-900"
                }`}
              />
              <button
                onClick={handleSaveTitle}
                className="p-1 text-cyan-400 hover:text-cyan-300"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 truncate">
              <h2 className="text-sm sm:text-base font-bold truncate text-slate-100">
                {conversation?.title || "New Conversation"}
              </h2>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                title="Rename conversation"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Active Tool Chip */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-slate-900/60 border-slate-800 text-slate-300">
            <span className={`w-2 h-2 rounded-full bg-cyan-400`} />
            <span>{activeTool.name}</span>
          </div>
        </div>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-2">
          {/* Tool selector dropdown */}
          <div className="relative group">
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isDark
                  ? "bg-white/5 border-slate-700 hover:border-cyan-500/40 text-slate-300"
                  : "bg-slate-100 border-slate-300 hover:border-cyan-500/40 text-slate-700"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Mode:</span>
              <span className="font-semibold text-cyan-400">{activeTool.name}</span>
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 top-full mt-1 w-56 p-1.5 rounded-xl border shadow-xl backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${
                isDark
                  ? "bg-[#0d1222] border-slate-700 text-slate-200 shadow-black/80"
                  : "bg-white border-slate-200 text-slate-800 shadow-slate-300"
              }`}
            >
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch AI Assistant Mode
              </div>
              {AI_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onSelectToolMode(tool.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    tool.id === activeTool.id
                      ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                      : "hover:bg-white/5 text-slate-300"
                  }`}
                >
                  <span>{tool.name}</span>
                  {tool.id === activeTool.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {conversation?.messages && conversation.messages.length > 0 && (
            <button
              onClick={onClearMessages}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              title="Clear messages in this chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6"
      >
        {/* Empty State Screen */}
        {(!conversation || conversation.messages.length === 0) && (
          <div className="max-w-2xl mx-auto py-8 sm:py-16 text-center select-none space-y-6">
            <div className="relative inline-block">
              <RobotAvatar
                size="xl"
                withBackground={true}
                animated={true}
                className="mx-auto drop-shadow-2xl"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-400 text-slate-950 shadow-md uppercase tracking-wider">
                Online
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
                Welcome to Dili Ai
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-lg mx-auto">
                Your intelligent companion for mathematics, science, education, coding, business, and creative exploration.
              </p>
            </div>

            {/* Mode-specific starter suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left pt-2 max-w-xl mx-auto">
              {activeTool.starterPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(prompt);
                    textareaRef.current?.focus();
                  }}
                  className={`p-3 rounded-xl border text-xs leading-relaxed transition-all text-slate-300 hover:text-white cursor-pointer group flex flex-col justify-between ${
                    isDark
                      ? "bg-slate-900/50 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/60 shadow-sm"
                      : "bg-white border-slate-200 hover:border-cyan-500/40 hover:bg-cyan-50/50 shadow-sm"
                  }`}
                >
                  <span className="line-clamp-2">{prompt}</span>
                  <span className="text-[10px] text-cyan-400 font-semibold mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Ask this</span>
                    <span>→</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Stream */}
        {conversation?.messages.map((msg, index) => {
          const isUser = msg.role === "user";
          const isLastAssistant =
            !isUser &&
            index === conversation.messages.length - 1;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 max-w-4xl mx-auto ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* Assistant Avatar */}
              {!isUser && (
                <div className="shrink-0 pt-0.5">
                  <RobotAvatar
                    size={32}
                    withBackground={true}
                    className="drop-shadow-sm"
                  />
                </div>
              )}

              {/* Message Content Bubble */}
              <div
                className={`flex flex-col max-w-[88%] sm:max-w-[80%] ${
                  isUser ? "items-end" : "items-start"
                }`}
              >
                {/* Bubble Container */}
                <div
                  className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm text-sm ${
                    isUser
                      ? "bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 text-white rounded-br-sm selection:bg-white/30"
                      : isDark
                      ? "bg-slate-900/90 border border-slate-800/90 text-slate-100 rounded-bl-sm"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                  }`}
                >
                  {/* Attached Image / File if present */}
                  {msg.attachment && (
                    <div className="mb-3">
                      {msg.attachment.mimeType.startsWith("image/") ? (
                        <div className="rounded-xl overflow-hidden border border-white/20 max-w-xs shadow-md">
                          <img
                            src={msg.attachment.dataUrl}
                            alt={msg.attachment.name}
                            className="w-full max-h-60 object-cover"
                          />
                          <div className="px-2 py-1 bg-black/60 text-[11px] text-white/90 truncate">
                            {msg.attachment.name}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/20 text-xs">
                          <Paperclip className="w-3.5 h-3.5 text-cyan-300" />
                          <span className="font-mono truncate">{msg.attachment.name}</span>
                          <span className="text-[10px] text-white/70">
                            ({(msg.attachment.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Body */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  ) : msg.content ? (
                    <div className="relative">
                      <MarkdownRenderer content={msg.content} />
                      {isLastAssistant && isGenerating && (
                        <span className="inline-block w-2 h-4 ml-1.5 bg-cyan-400 animate-pulse align-middle rounded-xs shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      )}
                    </div>
                  ) : isLastAssistant && isGenerating ? (
                    <div className="flex items-center gap-3 py-1 text-slate-300">
                      <div className="flex space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                      </div>
                      <span className="text-xs font-medium text-cyan-300/90 animate-pulse">
                        Dili Ai is generating your response...
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Empty response</span>
                  )}
                </div>

                {/* Stop Generating Button below active assistant message */}
                {!isUser && isLastAssistant && isGenerating && (
                  <button
                    onClick={onStopGeneration}
                    type="button"
                    className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 transition-all cursor-pointer"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop generating</span>
                  </button>
                )}

                {/* Bottom Action Row (for Assistant Responses) */}
                {!isUser && msg.content && (!isGenerating || !isLastAssistant) && (
                  <div className="flex items-center gap-1.5 mt-1.5 px-1 select-none text-slate-400 text-xs">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="p-1 rounded hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Speech / Audio Button */}
                    <button
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className={`p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${
                        speakingId === msg.id ? "text-cyan-400" : "hover:text-white"
                      }`}
                      title={speakingId === msg.id ? "Stop voice" : "Read aloud"}
                    >
                      {speakingId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Thumbs Up / Down */}
                    <button
                      onClick={() => handleFeedback(msg.id, "up")}
                      className={`p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${
                        likedMap[msg.id] === "up" ? "text-emerald-400" : "hover:text-white"
                      }`}
                      title="Good response"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, "down")}
                      className={`p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${
                        likedMap[msg.id] === "down" ? "text-rose-400" : "hover:text-white"
                      }`}
                      title="Poor response"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Regenerate button for the last response */}
                    {isLastAssistant && !isGenerating && (
                      <button
                        onClick={onRegenerate}
                        className="flex items-center gap-1 ml-2 px-2 py-0.5 rounded text-[11px] font-medium hover:text-white hover:bg-white/5 text-slate-400 transition-colors cursor-pointer"
                        title="Regenerate this response"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Regenerate</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="shrink-0 pt-0.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-cyan-500/40 shadow-sm"
                  />
                </div>
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll-to-Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute right-6 bottom-28 z-20 p-2 rounded-full bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Scroll to latest message"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

      {/* Input Composer Box */}
      <div
        className={`p-3 sm:p-4 border-t select-none ${
          isDark ? "bg-[#090d17] border-slate-800/80" : "bg-white border-slate-200"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Attachment Preview Chip */}
          {attachment && (
            <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 w-fit max-w-full">
              {attachment.mimeType.startsWith("image/") ? (
                <img
                  src={attachment.dataUrl}
                  alt="Attachment"
                  className="w-7 h-7 rounded object-cover border border-cyan-400/40"
                />
              ) : (
                <Paperclip className="w-4 h-4 text-cyan-400" />
              )}
              <span className="text-xs font-mono text-cyan-200 truncate max-w-xs">
                {attachment.name}
              </span>
              <button
                onClick={() => setAttachment(null)}
                className="text-slate-400 hover:text-white p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Form Composer */}
          <form
            onSubmit={handleSubmit}
            className={`relative rounded-2xl border transition-all duration-200 shadow-lg ${
              isDark
                ? "bg-slate-900/80 border-slate-700/80 focus-within:border-cyan-500/60 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                : "bg-slate-50 border-slate-300 focus-within:border-cyan-500/60 focus-within:shadow-md"
            }`}
          >
            {/* Auto-growing Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Ask Dili Ai anything (${activeTool.name})...`}
              disabled={isGenerating}
              className={`w-full pt-3.5 pb-12 px-4 bg-transparent outline-none resize-none text-sm leading-relaxed ${
                isDark ? "text-slate-100 placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
              }`}
            />

            {/* Bottom bar of composer */}
            <div className="absolute left-3 right-3 bottom-2.5 flex items-center justify-between pointer-events-auto">
              {/* Left Controls: File Attachment & Tool Indicator */}
              <div className="flex items-center gap-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,.txt,.pdf,.doc,.docx,.json,.js,.py,.html,.css"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark
                      ? "text-slate-400 hover:text-cyan-400 hover:bg-white/5"
                      : "text-slate-500 hover:text-cyan-600 hover:bg-slate-200"
                  }`}
                  title="Attach image or document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                  Press <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">Enter ↵</kbd> to send
                </span>
              </div>

              {/* Right Controls: Send / Stop Button */}
              <div className="flex items-center gap-2">
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={onStopGeneration}
                    className="p-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-md cursor-pointer"
                    title="Stop generation"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() && !attachment}
                    className={`p-2 sm:px-4 sm:py-2 rounded-xl font-semibold text-xs text-white flex items-center gap-1.5 transition-all cursor-pointer ${
                      input.trim() || attachment
                        ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/25 active:scale-95"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <span className="hidden sm:inline">Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Subtext info */}
          <div className="mt-2 text-center text-[11px] text-slate-400">
            Dili Ai may make mistakes. Verify critical academic, medical, or financial information.
          </div>
        </div>
      </div>
    </div>
  );
};
