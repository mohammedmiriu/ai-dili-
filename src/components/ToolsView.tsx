import React, { useState } from "react";
import {
  Sparkles,
  GraduationCap,
  Lightbulb,
  PenTool,
  Code2,
  HelpCircle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Copy,
  Terminal,
} from "lucide-react";
import { AI_TOOLS } from "../data/tools";
import { ToolMode } from "../types";

interface ToolsViewProps {
  onSelectTool: (toolId: ToolMode, customPrompt?: string) => void;
  isDark: boolean;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ onSelectTool, isDark }) => {
  const [selectedToolId, setSelectedToolId] = useState<ToolMode>("general");
  const [customPrompt, setCustomPrompt] = useState("");

  const activeTool = AI_TOOLS.find((t) => t.id === selectedToolId) || AI_TOOLS[0];

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

  const handleLaunch = (promptToUse?: string) => {
    const prompt = promptToUse || customPrompt.trim();
    onSelectTool(selectedToolId, prompt || undefined);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Tool Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Specialized Neural Assistants
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Select a specialized tool below to optimize Dili Ai’s reasoning parameters and system focus for your exact task.
          </p>
        </div>

        {/* Tool Mode Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {AI_TOOLS.map((tool) => {
            const isSelected = tool.id === selectedToolId;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setSelectedToolId(tool.id);
                  setCustomPrompt("");
                }}
                className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? isDark
                      ? "bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-white"
                      : "bg-cyan-50 border-cyan-300 shadow-sm text-cyan-950"
                    : isDark
                    ? "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5 mb-2">
                  {getToolIcon(tool.id)}
                </div>
                <span className="text-xs font-bold truncate w-full">{tool.name}</span>
                <span className="text-[10px] text-slate-500 mt-0.5 truncate w-full">
                  {tool.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tool Showcase Panel */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all ${
            isDark
              ? "bg-slate-900/80 border-slate-800 shadow-xl"
              : "bg-white border-slate-200 shadow-md"
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Info */}
            <div className="lg:w-1/2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  {getToolIcon(activeTool.id)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{activeTool.name}</h2>
                  <span className="text-xs font-semibold text-cyan-400 tracking-wide uppercase">
                    {activeTool.tagline}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeTool.description}
              </p>

              {/* Tool Highlights */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  How this mode tunes the AI:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Specialized cognitive prompt tuning for domain precision</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Structured Markdown outputs with custom headings & lists</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Context-aware follow-up queries and step-by-step logic</span>
                  </li>
                </ul>
              </div>

              {/* Starter Prompts */}
              <div className="pt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  Popular starter questions:
                </div>
                <div className="space-y-2">
                  {activeTool.starterPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLaunch(prompt)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                        isDark
                          ? "bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-slate-900"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-cyan-400 hover:bg-cyan-50/50"
                      }`}
                    >
                      <span className="line-clamp-1">{prompt}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Custom Prompt Composer */}
            <div className="lg:w-1/2 w-full space-y-4">
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <h3 className="text-sm font-bold text-slate-200 mb-2">
                  Direct Prompt with {activeTool.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Type your custom question or problem below to immediately launch a dedicated conversation in this mode.
                </p>

                <textarea
                  rows={5}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={`E.g., ${activeTool.starterPrompts[0]}`}
                  className={`w-full p-3 rounded-xl border text-xs leading-relaxed outline-none resize-none transition-all ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                  }`}
                />

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Mode: <strong className="text-cyan-400">{activeTool.name}</strong>
                  </span>
                  <button
                    onClick={() => handleLaunch()}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <span>Launch in Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sample Output Preview Card */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDark
                    ? "bg-slate-950/40 border-slate-800/80 text-slate-400"
                    : "bg-slate-100 border-slate-200 text-slate-600"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Interactive Real-Time Preview</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Dili Ai will format this response using high-contrast syntax highlighting, LaTeX formulas for mathematics, and hierarchical markdown outlines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
