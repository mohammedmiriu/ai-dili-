import React from "react";
import {
  MessageSquare,
  Sparkles,
  LayoutDashboard,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Menu,
  X,
  User,
  Zap,
  Flame,
} from "lucide-react";
import { Logo } from "./Logo";
import { RobotAvatar } from "./RobotAvatar";
import { UserProfile, UserSettings } from "../types";

export type NavTab = "home" | "chat" | "tools" | "dashboard" | "settings";

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: UserProfile;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenAuth: () => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  settings,
  onUpdateSettings,
  onOpenAuth,
  isMobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const isDark = settings.theme === "dark";

  const toggleTheme = () => {
    onUpdateSettings({ theme: isDark ? "light" : "dark" });
  };

  const navItems: Array<{ id: NavTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: "home", label: "Home", icon: Sparkles },
    { id: "chat", label: "AI Chat", icon: MessageSquare },
    { id: "tools", label: "AI Tools", icon: Zap },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-200 ${
        isDark
          ? "bg-[#090d16]/80 border-slate-800/80 text-slate-100"
          : "bg-white/85 border-slate-200 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Logo
            size="md"
            showTagline={false}
            onClick={() => onSelectTab("home")}
          />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  type="button"
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? isDark
                        ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                        : "bg-cyan-50 text-cyan-700 border border-cyan-200"
                      : isDark
                      ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : ""}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Direct Link to Who Made This Section */}
            <button
              id="nav-link-who-made-this"
              onClick={() => {
                if (currentTab !== "home") {
                  onSelectTab("home");
                  setTimeout(() => {
                    document.getElementById("who-made-this")?.scrollIntoView({ behavior: "smooth" });
                  }, 120);
                } else {
                  document.getElementById("who-made-this")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-300 hover:bg-amber-500/20"
                  : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Who made this</span>
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* AI Status Badge */}
          <div
            className={`hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isDark
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            <RobotAvatar size={16} withBackground={false} />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dili Ai • v3.8 Flash</span>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            type="button"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? "text-slate-300 hover:text-white hover:bg-white/10"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Settings Shortcut */}
          <button
            onClick={() => onSelectTab("settings")}
            id="nav-settings-btn"
            type="button"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              currentTab === "settings"
                ? isDark
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-cyan-100 text-cyan-800"
                : isDark
                ? "text-slate-300 hover:text-white hover:bg-white/10"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* User Profile / Sign In */}
          {user.isAuthenticated ? (
            <button
              onClick={() => onSelectTab("dashboard")}
              id="user-profile-btn"
              type="button"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover border border-cyan-400/50"
              />
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                {user.name.split(" ")[0]}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/30 text-cyan-300 font-bold uppercase tracking-wider">
                {user.tier}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              id="nav-login-btn"
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 cursor-pointer transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleMobileMenu}
            id="mobile-menu-toggle-btn"
            type="button"
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden px-4 pt-2 pb-5 border-b space-y-2 ${
            isDark ? "bg-[#0c101c] border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onToggleMobileMenu();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? isDark
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                      : "bg-cyan-50 text-cyan-700 border border-cyan-200"
                    : isDark
                    ? "text-slate-300 hover:bg-white/5"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              onSelectTab("settings");
              onToggleMobileMenu();
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              isDark ? "text-slate-300 hover:bg-white/5" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Settings & Preferences</span>
          </button>

          <button
            onClick={() => {
              onSelectTab("home");
              onToggleMobileMenu();
              setTimeout(() => {
                document.getElementById("who-made-this")?.scrollIntoView({ behavior: "smooth" });
              }, 120);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold border ${
              isDark
                ? "bg-amber-500/10 border-amber-500/25 text-amber-300"
                : "bg-amber-50 border-amber-200 text-amber-700"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Who made this</span>
          </button>

          {!user.isAuthenticated && (
            <button
              onClick={() => {
                onOpenAuth();
                onToggleMobileMenu();
              }}
              className="w-full mt-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Sign In to Dili Ai</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
