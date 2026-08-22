import type { ReactNode } from "react";
import type { IconName } from "@/lib/types";

const PATHS: Record<IconName, ReactNode> = {
  accessibility: (
    <>
      <circle cx="12" cy="4.6" r="2" />
      <path d="M4.6 8.4c2.4 1 4.9 1.5 7.4 1.5s4.9-.5 7.4-1.5" />
      <path d="M12 10v4.2" />
      <path d="m8.8 21 3.2-6.8L15.2 21" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2.2" />
      <path d="M10.2 3v4M13.8 3v4M10.2 17v4M13.8 17v4M3 10.2h4M3 13.8h4M17 10.2h4M17 13.8h4" />
    </>
  ),
  vision: (
    <>
      <path d="M2.6 12S6.4 5.8 12 5.8 21.4 12 21.4 12 17.6 18.2 12 18.2 2.6 12 2.6 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  map: (
    <>
      <path d="M12 21s6.8-6.1 6.8-10.8a6.8 6.8 0 1 0-13.6 0C5.2 14.9 12 21 12 21Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16.6 5.7a3.2 3.2 0 0 1 0 4.6" />
      <path d="M17.9 14.7A6 6 0 0 1 21 20" />
    </>
  ),
  wrench: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.2v2.6M12 19.2v2.6M2.2 12h2.6M19.2 12h2.6M5.1 5.1 6.9 7M17.1 17.1l1.8 1.8M18.9 5.1 17.1 7M6.9 17.1 5.1 18.9" />
    </>
  ),
  flask: (
    <>
      <path d="M9.4 3h5.2" />
      <path d="M10.2 3v6.4L5.4 17.6A2 2 0 0 0 7.1 20.7h9.8a2 2 0 0 0 1.7-3.1L13.8 9.4V3" />
      <path d="M7.6 15.4h8.8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 5.2 6.1v5.6c0 4 2.8 7.5 6.8 9 4-1.5 6.8-5 6.8-9V6.1L12 3.2Z" />
      <path d="m9.2 12.2 2 2 3.6-3.9" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4C10.4 4 4.4 8.8 4.4 15.6A4.2 4.2 0 0 0 8.6 20C15.4 20 20 13.6 20 4Z" />
      <path d="M4.6 20 14 10.4" />
    </>
  ),
  book: (
    <>
      <path d="M5 5.2A2.2 2.2 0 0 1 7.2 3H19v15.4H7.2A2.2 2.2 0 0 0 5 20.6V5.2Z" />
      <path d="M7.2 18.4H19V21H7.2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20.2h16" />
      <path d="M7.2 20.2v-5.6M12 20.2V8.4M16.8 20.2v-8.4" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.2 13.9 9 19.6 11l-5.7 2L12 18.8 10.1 13 4.4 11 10.1 9 12 3.2Z" />
      <path d="M18.4 16.6 19.2 19l2.4.8-2.4.8-.8 2.4" />
    </>
  ),
  code: (
    <>
      <path d="m8.8 7.6-4.6 4.6 4.6 4.6" />
      <path d="m15.2 7.6 4.6 4.6-4.6 4.6" />
    </>
  ),
  heart: (
    <path d="M12 20.4s-7.4-4.6-7.4-9.8A3.9 3.9 0 0 1 12 7.6a3.9 3.9 0 0 1 7.4 3C19.4 15.8 12 20.4 12 20.4Z" />
  ),
  signal: (
    <>
      <path d="M4.6 11.2a10.4 10.4 0 0 1 14.8 0" />
      <path d="M7.8 14.6a6 6 0 0 1 8.4 0" />
      <circle cx="12" cy="18.6" r="1.3" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 7.4 4.2v9.6L12 21l-7.4-4.2V7.2L12 3Z" />
      <path d="m4.6 7.2 7.4 4.2 7.4-4.2" />
      <path d="M12 11.4V21" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3.4v17M7.4 20.6h9.2M4.2 7.2h15.6" />
      <path d="M4.2 7.2 1.8 13h4.8L4.2 7.2Z" />
      <path d="M19.8 7.2 17.4 13h4.8l-2.4-5.8Z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10.2v3.6a1.2 1.2 0 0 0 1.2 1.2H7l8 4.2V4.8L7 9H5.2A1.2 1.2 0 0 0 4 10.2Z" />
      <path d="M18.4 9.6a3.6 3.6 0 0 1 0 4.8" />
      <path d="M7 15v4.4" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6.2" rx="7" ry="3.2" />
      <path d="M5 6.2v11.6c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2V6.2" />
      <path d="M5 12c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name] ?? PATHS.spark}
    </svg>
  );
}
