"use client";

import { useEffect, useState } from "react";

/** Paced to cover a ~11s call without stalling on the last line too long. */
const MESSAGES: { text: string; hold: number }[] = [
  { text: "Reading your mission...", hold: 1200 },
  { text: "Figuring out what this might take...", hold: 1500 },
  { text: "Mapping the people and capabilities around it...", hold: 1800 },
  { text: "Working out why each piece matters...", hold: 2000 },
  { text: "Almost there.", hold: 0 },
];

export function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= MESSAGES.length - 1) return;
    const timer = setTimeout(
      () => setIndex((current) => current + 1),
      MESSAGES[index].hold,
    );
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className="flex flex-col items-center justify-center gap-6 px-6 py-14 text-center"
      role="status"
      aria-live="polite"
    >
      <ThinkingMark />
      <p key={index} className="animate-fade text-body text-ink-soft">
        {MESSAGES[index].text}
      </p>
      <span className="sr-only">Working on your mission</span>
    </div>
  );
}

/** The logo mark, drawing itself: mission out to capabilities and people. */
function ThinkingMark() {
  return (
    <svg
      viewBox="0 0 96 48"
      className="h-12 w-24 text-accent"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      >
        <path d="M26 24h18" strokeDasharray="60" style={{ animation: "trace 1.4s ease-in-out infinite" }} />
        <path
          d="M48 22 66 13"
          strokeDasharray="60"
          style={{ animation: "trace 1.4s ease-in-out 0.2s infinite" }}
        />
        <path
          d="M48 26 66 35"
          strokeDasharray="60"
          style={{ animation: "trace 1.4s ease-in-out 0.4s infinite" }}
        />
      </g>
      <g fill="currentColor">
        <circle cx="20" cy="24" r="5">
          <animate attributeName="opacity" values="1;0.35;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="12" r="3.5">
          <animate
            attributeName="opacity"
            values="0.35;1;0.35"
            dur="1.8s"
            begin="0.3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="70" cy="36" r="3.5">
          <animate
            attributeName="opacity"
            values="0.35;1;0.35"
            dur="1.8s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}
