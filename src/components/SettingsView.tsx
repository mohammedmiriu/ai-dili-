import React, { useState } from "react";
import {
  Moon,
  Sun,
  User,
  Sliders,
  Trash2,
  LogOut,
  Save,
  Check,
  Shield,
  Volume2,
  Sparkles,
  AlertTriangle,
  Download,
} from "lucide-react";
import { UserProfile, UserSettings, StylePreference } from "../types";
import { WhoMadeThis } from "./WhoMadeThis";

interface SettingsViewProps {
  settings: UserSettings;
  user: UserProfile;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onUpdateUser: (newUser: Partial<UserProfile>) => void;
  onClearHistory: () => void;
  onLogout: () => void;
  isDark: boolean;
  onExportHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  user,
  onUpdateSettings,
  onUpdateUser,
  onClearHistory,
  onLogout,
  isDark,
  onExportHistory,
}) => {
  const [nameDraft, setNameDraft] = useState(user.name);
  const [emailDraft, setEmailDraft] = useState(user.email);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name: nameDraft, email: emailDraft });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Customize Dili Ai’s theme, response behavior, account details, and conversation data.
          </p>
        </div>

        {/* Section 1: Appearance & Theme */}
        <div
          className={`p-6 rounded-3xl border ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Interface Theme</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark Mode Card */}
            <div
              onClick={() => onUpdateSettings({ theme: "dark" })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                settings.theme === "dark"
                  ? "bg-cyan-500/15 border-cyan-500 shadow-md shadow-cyan-500/10 text-white"
                  : isDark
                  ? "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  : "bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Futuristic Dark Mode</div>
                  <div className="text-xs text-slate-400">
                    Obsidian & glowing neon accents (Default)
                  </div>
                </div>
              </div>
              {settings.theme === "dark" && <Check className="w-5 h-5 text-cyan-400" />}
            </div>

            {/* Light Mode Card */}
            <div
              onClick={() => onUpdateSettings({ theme: "light" })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                settings.theme === "light"
                  ? "bg-cyan-50 border-cyan-500 shadow-md text-cyan-950"
                  : isDark
                  ? "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  : "bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white text-amber-500 border border-slate-300 shadow-sm">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Clean Light Mode</div>
                  <div className="text-xs text-slate-400">
                    High contrast crisp day theme
                  </div>
                </div>
              </div>
              {settings.theme === "light" && <Check className="w-5 h-5 text-cyan-600" />}
            </div>
          </div>
        </div>

        {/* Section 2: Chat Preferences */}
        <div
          className={`p-6 rounded-3xl border ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Chat Preferences</h2>
          </div>

          <div className="space-y-6">
            {/* Response Style */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Response Verbosity & Depth
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["concise", "balanced", "detailed"] as StylePreference[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => onUpdateSettings({ stylePreference: style })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                      settings.stylePreference === style
                        ? "bg-cyan-500/20 border-cyan-500/80 text-cyan-300 shadow-sm"
                        : isDark
                        ? "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Creativity / Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="uppercase tracking-wider text-slate-400">
                  AI Creativity / Temperature
                </span>
                <span className="text-cyan-400 font-mono font-bold">
                  {settings.temperature.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={settings.temperature}
                onChange={(e) =>
                  onUpdateSettings({ temperature: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>0.2 (Precise, Deterministic)</span>
                <span>0.7 (Default)</span>
                <span>1.0 (Creative, Unconstrained)</span>
              </div>
            </div>

            {/* Streaming Toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-sm font-semibold text-slate-200">
                  Real-Time Streaming Generation
                </div>
                <div className="text-xs text-slate-400">
                  Display words as they are generated instead of waiting for the full response.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableStreaming}
                onChange={(e) =>
                  onUpdateSettings({ enableStreaming: e.target.checked })
                }
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Account Information */}
        <div
          className={`p-6 rounded-3xl border ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Account Profile</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none font-medium ${
                    isDark
                      ? "bg-slate-950 border-slate-700 text-white focus:border-cyan-400"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none font-medium ${
                    isDark
                      ? "bg-slate-950 border-slate-700 text-white focus:border-cyan-400"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500">
                Plan: <strong className="text-cyan-400">{user.tier}</strong> (Unlimited queries, fast inference)
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Section 4: Data Management & Danger Zone */}
        <div
          className={`p-6 rounded-3xl border ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-rose-400" />
            <h2 className="text-base font-bold text-slate-100">Data & Privacy</h2>
          </div>

          <div className="space-y-4">
            {/* Export Chats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div>
                <div className="text-sm font-semibold text-slate-200">
                  Export Chat History
                </div>
                <div className="text-xs text-slate-400">
                  Download all conversation threads as a backup JSON file.
                </div>
              </div>
              <button
                onClick={onExportHistory}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                  isDark
                    ? "bg-white/5 border-slate-700 hover:bg-white/10 text-slate-200"
                    : "bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800"
                }`}
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Clear History */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div>
                <div className="text-sm font-semibold text-rose-400">
                  Clear All Chat History
                </div>
                <div className="text-xs text-slate-400">
                  Permanently delete all previous conversation messages from this device.
                </div>
              </div>

              {showClearConfirm ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClearHistory();
                      setShowClearConfirm(false);
                    }}
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md cursor-pointer transition-all"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    type="button"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            {/* Logout */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-sm font-semibold text-slate-200">
                  Sign Out of Dili Ai
                </div>
                <div className="text-xs text-slate-400">
                  End your current session on this device.
                </div>
              </div>
              <button
                onClick={onLogout}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                  isDark
                    ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
                    : "bg-slate-200 border-slate-300 hover:bg-slate-300 text-slate-800"
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Who made this section */}
        <WhoMadeThis isDark={isDark} className="pt-4" />
      </div>
    </div>
  );
};
