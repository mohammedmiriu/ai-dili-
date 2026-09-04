import React, { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Search,
  Zap,
  GraduationCap,
  Lightbulb,
  PenTool,
  Code2,
  HelpCircle,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  ChevronRight,
  Bot,
} from "lucide-react";
import { AI_TOOLS, HOMEPAGE_SUGGESTIONS } from "../data/tools";
import { ToolMode } from "../types";
import { WhoMadeThis } from "./WhoMadeThis";
import { RobotAvatar } from "./RobotAvatar";

interface HomeViewProps {
  onStartChat: (initialPrompt?: string, toolMode?: ToolMode) => void;
  isDark: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartChat, isDark }) => {
  const [promptInput, setPromptInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      onStartChat(promptInput.trim(), "general");
    } else {
      onStartChat();
    }
  };

  const getToolIcon = (id: ToolMode) => {
    switch (id) {
      case "study":
        return <GraduationCap className="w-5 h-5 text-emerald-400" />;
      case "ideas":
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case "writing":
        return <PenTool className="w-5 h-5 text-purple-400" />;
      case "coding":
        return <Code2 className="w-5 h-5 text-blue-400" />;
      case "explainer":
        return <HelpCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Background Decorative Glows */}
      <div className="relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[400px] h-[250px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Hero Section */}
        <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 text-center">
          {/* Mascot Avatar & Badge */}
          <div className="flex flex-col items-center justify-center mb-6">
            <RobotAvatar
              size="xl"
              withBackground={true}
              animated={true}
              className="mb-4 drop-shadow-[0_12px_28px_rgba(6,182,212,0.35)]"
            />
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-sm shadow-cyan-500/10">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Next-Gen Neural Intelligence</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-sans">
            <span className="text-slate-100">Dili </span>
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Ai
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-xl sm:text-2xl font-medium text-slate-300 tracking-wide max-w-2xl mx-auto">
            Your AI. Your Ideas. Your Answers.
          </p>

          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            A state-of-the-art intelligent assistant for educational mastery, advanced mathematics, software development, creative brainstorming, and everyday problem-solving.
          </p>

          {/* Large Hero Input Box */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className={`relative rounded-2xl p-2 border transition-all duration-300 shadow-xl ${
                isDark
                  ? "bg-slate-900/90 border-cyan-500/30 shadow-cyan-950/40 focus-within:border-cyan-400 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                  : "bg-white border-cyan-300 shadow-slate-200 focus-within:border-cyan-500 focus-within:shadow-lg"
              }`}
            >
              <div className="flex items-center gap-3 px-3 py-1">
                <Search className="w-5 h-5 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className={`w-full bg-transparent text-base outline-none font-medium ${
                    isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
                  }`}
                />
                <button
                  type="submit"
                  id="hero-start-chat-btn"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/30 shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <span>Start Chatting</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Suggestions Chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1">Suggestions:</span>
              {HOMEPAGE_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onStartChat(item.prompt, item.tool as ToolMode)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    isDark
                      ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800/80"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:text-cyan-700 hover:border-cyan-400 hover:bg-cyan-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* AI Tools Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Specialized AI Capabilities
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Choose a dedicated assistant mode tailored to your task or dive straight into any conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_TOOLS.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onStartChat(tool.starterPrompts[0], tool.id)}
                className={`group relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isDark
                    ? "bg-slate-900/60 border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 shadow-md hover:shadow-cyan-950/40 hover:-translate-y-1"
                    : "bg-white border-slate-200 hover:border-cyan-400 hover:bg-slate-50 shadow-sm hover:shadow-md hover:-translate-y-1"
                }`}
              >
                {/* Glow accent */}
                <div
                  className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-br ${tool.gradient}`}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                      {getToolIcon(tool.id)}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-cyan-400 transition-colors">
                      {tool.tagline}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {tool.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-cyan-400">
                  <span>Launch Tool</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Versatility Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-800/60">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`p-6 rounded-2xl border ${
                isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
              }`}
            >
              <ShieldCheck className="w-8 h-8 text-cyan-400 mb-3" />
              <h4 className="text-base font-bold text-slate-100">Private & Secure</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                All communications are routed through secure, server-side encrypted channels. Keys and private sessions are never exposed to browser scripts.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border ${
                isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
              }`}
            >
              <Zap className="w-8 h-8 text-amber-400 mb-3" />
              <h4 className="text-base font-bold text-slate-100">Real-Time Streaming</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Experience instant, token-by-token response generation with smooth animated typography and markdown code rendering.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border ${
                isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
              }`}
            >
              <Layers className="w-8 h-8 text-emerald-400 mb-3" />
              <h4 className="text-base font-bold text-slate-100">Multi-Disciplinary</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Trained across science, calculus, commerce, full-stack software development, creative copy, and structured analytical reasoning.
              </p>
            </div>
          </div>
        </section>

        {/* Who Made This Section */}
        <WhoMadeThis isDark={isDark} />

        {/* CTA Footer Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-900/30 via-slate-900/70 to-indigo-900/30 border border-cyan-500/20 relative overflow-hidden">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Ready to experience Dili Ai?
            </h3>
            <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
              Ask your first question and discover how Dili Ai accelerates your learning, coding, and problem-solving.
            </p>
            <button
              onClick={() => onStartChat()}
              className="mt-6 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Launch Dili Ai Chat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
