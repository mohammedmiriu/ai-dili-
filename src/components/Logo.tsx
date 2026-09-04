import React from "react";
import { RobotAvatar } from "./RobotAvatar";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showTagline = false,
  className = "",
  onClick,
}) => {
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      {/* Robot Mascot Face Avatar */}
      <RobotAvatar
        size={size}
        withBackground={true}
        animated={true}
        className="group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
      />

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-wider text-slate-100 ${textSizes[size]} font-sans`}
          >
            Dili
          </span>
          <span
            className={`font-black bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent ${textSizes[size]}`}
          >
            Ai
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-0.5" />
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-widest text-slate-400 uppercase font-medium mt-0.5">
            Your Smart AI Assistant
          </span>
        )}
      </div>
    </div>
  );
};
