import React, { useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Flame,
  MessageCircle,
  Sparkles,
  Twitter,
  UserCheck,
  Heart,
  Share2,
} from "lucide-react";

interface WhoMadeThisProps {
  isDark?: boolean;
  className?: string;
}

export const WhoMadeThis: React.FC<WhoMadeThisProps> = ({
  isDark = true,
  className = "",
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const twitterHandle = "attract_ga29482";
  const discordUsername = "mohammed040047";
  const discordName = "🔥Mohammed | Dlicom🔥";
  const creatorStatement =
    "This Ai website is made by a dlicom community member name ( Mohammed | dlicom )";

  const fullTextToCopy = `${creatorStatement}

Tweeter : ${twitterHandle}
Discord: ${discordUsername}
Name in discord: 
${discordName}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <section
      id="who-made-this"
      className={`relative max-w-4xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20 ${className}`}
    >
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm shadow-cyan-500/10">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>Creator Spotlight</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-100 tracking-tight font-sans">
          Who made this
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Learn more about the creator and community behind Dili Ai.
        </p>
      </div>

      {/* Main Card */}
      <div
        className={`relative z-10 rounded-3xl border p-6 sm:p-8 transition-all duration-300 shadow-xl overflow-hidden ${
          isDark
            ? "bg-slate-900/80 border-cyan-500/30 shadow-cyan-950/40 backdrop-blur-xl"
            : "bg-white border-cyan-200 shadow-slate-200"
        }`}
      >
        {/* Subtle top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          {/* Avatar / Flame Shield */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/30">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-amber-500/10" />
                  <Flame className="w-12 h-12 text-amber-400 fill-amber-400/80 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-bounce" />
                  <span className="text-[10px] font-black tracking-widest text-cyan-300 uppercase mt-1">
                    DLICOM
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-cyan-400 text-slate-950 shadow-md">
                <UserCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            <span className="mt-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 inline-flex items-center gap-1">
              <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>Community Member</span>
            </span>
          </div>

          {/* Details & Exact Text Presentation */}
          <div className="flex-1 w-full space-y-5 text-center md:text-left">
            {/* Creator Statement Quote */}
            <div
              className={`p-4 rounded-2xl border text-sm sm:text-base font-medium leading-relaxed ${
                isDark
                  ? "bg-slate-950/60 border-slate-800 text-slate-200"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <p className="text-cyan-300 font-semibold mb-1 text-xs uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Attribution & Origin</span>
              </p>
              <p className="font-semibold text-slate-100">
                This Ai website is made by a dlicom community member name ( <span className="text-cyan-400 font-bold">Mohammed | dlicom</span> )
              </p>
            </div>

            {/* Social & Contact Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Twitter / Tweeter */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isDark
                    ? "bg-slate-950/40 border-slate-800/90 hover:border-cyan-500/40"
                    : "bg-white border-slate-200 hover:border-cyan-400 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                    <Twitter className="w-4 h-4 fill-sky-400/20" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Tweeter
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                      attract_ga29482
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button
                    onClick={() => copyToClipboard(twitterHandle, "twitter")}
                    type="button"
                    title="Copy Twitter handle"
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    {copiedKey === "twitter" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`https://twitter.com/${twitterHandle}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    title="Open Twitter Profile"
                    className="p-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 transition-colors inline-flex items-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Discord Username */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isDark
                    ? "bg-slate-950/40 border-slate-800/90 hover:border-indigo-500/40"
                    : "bg-white border-slate-200 hover:border-indigo-400 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Discord
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                      mohammed040047
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(discordUsername, "discord")}
                  type="button"
                  title="Copy Discord username"
                  className="p-2 rounded-lg bg-slate-800/60 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 transition-colors cursor-pointer shrink-0 ml-2"
                >
                  {copiedKey === "discord" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Name in Discord Card */}
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDark
                  ? "bg-slate-950/50 border-amber-500/30 shadow-inner"
                  : "bg-amber-50/50 border-amber-200"
              }`}
            >
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Name in discord:
                </span>
                <span className="text-sm sm:text-base font-black text-slate-100 tracking-wide inline-flex items-center gap-1.5 mt-0.5">
                  <span className="text-amber-400">🔥</span>
                  <span>Mohammed | Dlicom</span>
                  <span className="text-amber-400">🔥</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(discordName, "discordName")}
                  type="button"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === "discordName" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Name</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => copyToClipboard(fullTextToCopy, "fullInfo")}
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === "fullInfo" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>All Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy All Info</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
