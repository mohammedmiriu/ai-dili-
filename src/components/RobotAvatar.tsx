import React from "react";

interface RobotAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  withBackground?: boolean;
  className?: string;
  animated?: boolean;
}

export const RobotAvatar: React.FC<RobotAvatarProps> = ({
  size = "md",
  withBackground = false,
  className = "",
  animated = false,
}) => {
  // Map standard sizes to pixel dimensions
  const getPixelSize = (): number => {
    if (typeof size === "number") return size;
    switch (size) {
      case "xs":
        return 24;
      case "sm":
        return 32;
      case "md":
        return 44;
      case "lg":
        return 64;
      case "xl":
        return 96;
      default:
        return 44;
    }
  };

  const px = getPixelSize();

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: px, height: px }}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        className={`overflow-visible ${animated ? "transition-transform hover:scale-105 duration-300" : ""}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Outer glow filter */}
          <filter id="robot-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* 3D Drop Shadow */}
          <filter id="robot-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0284c7" floodOpacity="0.4" />
          </filter>

          {/* Eye 3D Shadow */}
          <filter id="eye-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
          </filter>

          {/* Deep Space Background Radial */}
          <radialGradient id="space-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#0f172a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </radialGradient>

          {/* Outer Bevel / Base Rim Gradient */}
          <linearGradient id="body-bevel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="20%" stopColor="#2563eb" />
            <stop offset="85%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Front Face Pill Gradient (Glossy Blue) */}
          <linearGradient id="body-face" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="35%" stopColor="#2563eb" />
            <stop offset="80%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>

          {/* Top Specular Curved Highlight */}
          <linearGradient id="top-specular" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Eye White Gradient */}
          <linearGradient id="eye-white" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Pupil Black Gradient */}
          <linearGradient id="pupil-black" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>

          {/* Mouth 3D Depth */}
          <linearGradient id="mouth-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>
        </defs>

        {/* Optional Neural Space Background Circle */}
        {withBackground && (
          <g>
            <circle cx="100" cy="100" r="94" fill="url(#space-bg)" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.3" />
            {/* Ambient Cyan Rings & Particles */}
            <ellipse cx="100" cy="100" rx="85" ry="85" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 8" />
            <circle cx="45" cy="45" r="2" fill="#38bdf8" opacity="0.6" />
            <circle cx="160" cy="55" r="1.5" fill="#38bdf8" opacity="0.5" />
            <circle cx="155" cy="155" r="2.5" fill="#60a5fa" opacity="0.4" />
            <circle cx="35" cy="140" r="1.5" fill="#38bdf8" opacity="0.5" />
          </g>
        )}

        {/* Main Robot Face Group (Centered at 100, 100) */}
        <g filter="url(#robot-shadow)" className={animated ? "animate-pulse" : ""}>
          {/* 1. Outer Pill Bevel / 3D Extrusion with speech bubble tail */}
          {/* Main capsule bounds: x=24 to 176 (width 152), y=54 to 134 (height 80), radius=40 */}
          {/* Notch at bottom: starts x=95, dips to (100, 148), returns at x=105 */}
          <path
            d="
              M 64,52
              L 136,52
              A 42,42 0 0 1 178,94
              A 42,42 0 0 1 136,136
              L 110,136
              L 100,150
              L 93,136
              L 64,136
              A 42,42 0 0 1 22,94
              A 42,42 0 0 1 64,52
              Z
            "
            fill="url(#body-bevel)"
          />

          {/* 2. Inner Pill Front Surface */}
          <path
            d="
              M 64,56
              L 136,56
              A 38,38 0 0 1 174,94
              A 38,38 0 0 1 136,132
              L 108,132
              L 100,144
              L 94,132
              L 64,132
              A 38,38 0 0 1 26,94
              A 38,38 0 0 1 64,56
              Z
            "
            fill="url(#body-face)"
          />

          {/* 3. Top Specular 3D Curved Sheen */}
          <path
            d="
              M 58,58
              L 142,58
              C 160,58 170,72 170,82
              C 152,66 130,64 100,64
              C 70,64 48,66 30,82
              C 30,72 40,58 58,58
              Z
            "
            fill="url(#top-specular)"
            opacity="0.65"
          />

          {/* 4. Eyes Group */}
          {/* Left Eye: Centered at ~65, 92 */}
          <g filter="url(#eye-shadow)">
            {/* White diamond rotated 45 deg */}
            <rect
              x="53"
              y="80"
              width="24"
              height="24"
              rx="4"
              transform="rotate(45 65 92)"
              fill="url(#eye-white)"
            />
            {/* Black pupil in the inner right quadrant */}
            <rect
              x="62"
              y="86"
              width="10"
              height="10"
              rx="2"
              transform="rotate(45 67 91)"
              fill="url(#pupil-black)"
            />
            {/* Eye Tiny Catchlight */}
            <circle cx="62" cy="88" r="1.5" fill="#ffffff" opacity="0.9" />
          </g>

          {/* Right Eye: Centered at ~135, 92 */}
          <g filter="url(#eye-shadow)">
            {/* White diamond rotated 45 deg */}
            <rect
              x="123"
              y="80"
              width="24"
              height="24"
              rx="4"
              transform="rotate(45 135 92)"
              fill="url(#eye-white)"
            />
            {/* Black pupil in the inner left quadrant */}
            <rect
              x="128"
              y="86"
              width="10"
              height="10"
              rx="2"
              transform="rotate(45 133 91)"
              fill="url(#pupil-black)"
            />
            {/* Eye Tiny Catchlight */}
            <circle cx="138" cy="88" r="1.5" fill="#ffffff" opacity="0.9" />
          </g>

          {/* 5. Cute Smile Mouth (Centered at 100, 102) */}
          <path
            d="M 90,98 Q 100,111 110,98"
            fill="none"
            stroke="url(#mouth-grad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Soft specular highlight on bottom of smile */}
          <path
            d="M 93,101 Q 100,111 107,101"
            fill="none"
            stroke="#64748b"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* 6. Speech Bubble Tab Highlight Accent */}
          <path
            d="M 96,134 L 100,141 L 104,134"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
};
