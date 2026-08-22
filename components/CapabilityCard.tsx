import type { Capability } from "@/lib/types";
import { Icon } from "./Icon";
import { ImportanceBadge } from "./Badge";
import { RichText } from "./RichText";

export function CapabilityCard({ capability }: { capability: Capability }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-line bg-accent-soft text-accent">
          <Icon name={capability.icon} className="h-5 w-5" />
        </span>
        <ImportanceBadge importance={capability.importance} />
      </div>

      <h3 className="mt-4 text-h3 font-semibold text-ink">{capability.name}</h3>
      <p className="mt-2 text-body text-muted">
        <RichText>{capability.description}</RichText>
      </p>

      <div className="mt-5 border-t border-line pt-4">
        <p className="eyebrow text-faint">
          Why it matters
        </p>
        <p className="mt-2 text-body text-ink-soft">
          <RichText>{capability.why}</RichText>
        </p>
      </div>
    </article>
  );
}
