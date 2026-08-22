import type { Importance, Priority } from "@/lib/types";

const TONES = {
  accent: "border-accent-line bg-accent-soft text-accent",
  amber: "border-amber-line bg-amber-soft text-amber",
  slate: "border-slate-line bg-slate-soft text-slate",
} as const;

export type BadgeTone = keyof typeof TONES;

export function Badge({
  tone = "slate",
  children,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-mono text-label whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

const IMPORTANCE: Record<Importance, { tone: BadgeTone; label: string }> = {
  high: { tone: "accent", label: "High importance" },
  medium: { tone: "amber", label: "Medium" },
  low: { tone: "slate", label: "Low" },
};

export function ImportanceBadge({ importance }: { importance: Importance }) {
  const { tone, label } = IMPORTANCE[importance];
  return <Badge tone={tone}>{label}</Badge>;
}

const PRIORITY: Record<Priority, { tone: BadgeTone; label: string }> = {
  needed: { tone: "accent", label: "Needed" },
  recommended: { tone: "amber", label: "Recommended" },
  "nice-to-have": { tone: "slate", label: "Nice to have" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { tone, label } = PRIORITY[priority];
  return <Badge tone={tone}>{label}</Badge>;
}
