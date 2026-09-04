import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = "plaintext", code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const cleanLang = language?.toLowerCase().trim() || "code";

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-cyan-500/20 bg-slate-950/80 shadow-lg shadow-black/40 font-mono text-sm">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-white/5 select-none">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
          </div>
          <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase ml-2 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-cyan-400" />
            {cleanLang}
          </span>
        </div>

        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto p-4 text-[13px] leading-relaxed text-slate-200 selection:bg-cyan-500/30">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
