import type { NodeDetail } from "@/lib/graph";
import { RichText } from "./RichText";
import { Badge } from "./Badge";

const KIND_LABEL: Record<NodeDetail["kind"], string> = {
  mission: "Mission",
  capability: "Capability",
  person: "In the network",
  step: "Next step",
};

export function NodeDetailPanel({ detail }: { detail: NodeDetail | null }) {
  if (!detail) {
    return (
      <aside
        aria-live="polite"
        className="flex h-full min-h-[200px] flex-col justify-center rounded-2xl border border-dashed border-line-strong bg-paper p-6 text-center lg:min-h-[600px]"
      >
        <p className="text-body font-medium text-ink">Select anything on the map</p>
        <p className="mx-auto mt-2 max-w-[26ch] text-sm leading-relaxed text-muted">
          Every piece has a reason for being there. Tap a node to see it.
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-live="polite"
      className="animate-fade h-full overflow-y-auto rounded-2xl border border-line bg-surface p-6 lg:max-h-[600px]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow text-faint">
          {KIND_LABEL[detail.kind]}
        </span>
        {detail.badge ? <Badge tone="slate">{detail.badge}</Badge> : null}
      </div>

      <h3 className="mt-3 font-display text-h2 text-ink">{detail.title}</h3>

      {detail.description ? (
        <p className="mt-3 text-body text-muted">
          <RichText>{detail.description}</RichText>
        </p>
      ) : null}

      {detail.why && detail.why !== detail.description ? (
        <div className="mt-5 border-t border-line pt-4">
          <p className="eyebrow text-faint">
            Why it matters
          </p>
          <p className="mt-2 text-body text-ink-soft">
            <RichText emphasis="accent">{detail.why}</RichText>
          </p>
        </div>
      ) : null}

      {detail.relatedRoles.length > 0 ? (
        <ChipList
          label={detail.kind === "person" ? "Skills" : "Related roles"}
          items={detail.relatedRoles}
        />
      ) : null}

      {detail.relatedCapabilities.length > 0 ? (
        <ChipList label="Related capabilities" items={detail.relatedCapabilities} />
      ) : null}

      {detail.suggestedStep ? (
        <div className="mt-5 rounded-xl border border-accent-line bg-accent-soft p-4">
          <p className="eyebrow text-accent">
            {detail.kind === "person" ? "From their profile" : "Possible next step"}
          </p>
          <p className="mt-1.5 text-small text-ink-soft">
            {detail.suggestedStep}
          </p>
        </div>
      ) : null}
    </aside>
  );
}

function ChipList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-5">
      <p className="eyebrow text-faint">
        {label}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-line bg-paper px-2.5 py-1 text-small text-ink-soft"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
