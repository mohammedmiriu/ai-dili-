import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  isDark: boolean;
}

type AuthMode = "login" | "signup" | "forgot";

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isDark,
}) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "forgot") {
      if (!email.trim()) {
        setError("Please enter your email address.");
        return;
      }
      setForgotSent(true);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: mode === "signup" ? name.trim() : email.split("@")[0] || "Dili Member",
      email: email.trim(),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      tier: "Pro",
      joinedDate: new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" }),
      isAuthenticated: true,
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleDemoLogin = () => {
    const demoUser: UserProfile = {
      id: "user_pro_demo",
      name: "Alex Vance",
      email: "alex.vance@dili.ai",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      tier: "Pro",
      joinedDate: "January 2026",
      isAuthenticated: true,
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div
        className={`relative w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl transition-all ${
          isDark
            ? "bg-[#0d1222] border-slate-700/80 text-slate-100 shadow-black/90"
            : "bg-white border-slate-200 text-slate-900 shadow-xl"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <Logo size="md" showTagline={false} className="justify-center mb-2" />
          <h3 className="text-xl font-extrabold tracking-tight mt-3">
            {mode === "login" && "Welcome back"}
            {mode === "signup" && "Create your Dili Ai account"}
            {mode === "forgot" && "Reset your password"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === "login" && "Sign in to access your chat history and Pro capabilities"}
            {mode === "signup" && "Get started with unlimited AI questions and tools"}
            {mode === "forgot" && "We will email you a secure recovery link"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {forgotSent ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-300">
              A password reset link has been dispatched to <strong className="text-cyan-400">{email}</strong>. Check your inbox to proceed.
            </p>
            <button
              type="button"
              onClick={() => {
                setForgotSent(false);
                setMode("login");
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Full Name
                </label>
                <div
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs ${
                    isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-300"
                  }`}
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-transparent outline-none text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Email Address
              </label>
              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs ${
                  isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-300"
                }`}
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent outline-none text-xs"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-400">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setMode("forgot");
                      }}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs ${
                    isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-300"
                  }`}
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-xs"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>
                {mode === "login" && "Sign In"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot" && "Send Reset Link"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* 1-Click Demo Login */}
            {mode === "login" && (
              <button
                type="button"
                onClick={handleDemoLogin}
                className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300"
                    : "bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>1-Click Demo Sign In (Alex Vance - Pro)</span>
              </button>
            )}
          </form>
        )}

        {/* Toggle Mode Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 text-center text-xs text-slate-400">
          {mode === "login" && (
            <span>
              Don't have an account yet?{" "}
              <button
                onClick={() => {
                  setError("");
                  setMode("signup");
                }}
                className="text-cyan-400 font-bold hover:underline"
              >
                Sign Up
              </button>
            </span>
          )}

          {mode === "signup" && (
            <span>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setError("");
                  setMode("login");
                }}
                className="text-cyan-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          )}

          {mode === "forgot" && (
            <button
              onClick={() => {
                setError("");
                setMode("login");
              }}
              className="text-cyan-400 font-bold hover:underline"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
