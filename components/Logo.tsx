export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="7" className="fill-ink" />
      <g stroke="var(--color-paper)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M11 16h4.5M17 12.5l3.5-2M17 19.5l3.5 2" />
      </g>
      <g fill="var(--color-paper)">
        <circle cx="9.5" cy="16" r="2.6" />
        <circle cx="22" cy="10" r="1.9" />
        <circle cx="22" cy="22" r="1.9" />
      </g>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-body font-semibold tracking-[0.14em] text-ink ${className}`}
    >
      PURPOSERA
    </span>
  );
}
