import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "PURPOSERA reads your mission, works out the capabilities it depends on, and shows the people and first steps that move it forward.",
};

const PHASES = [
  {
    number: "01",
    title: "You describe the mission",
    body: "A sentence is enough. Half-formed is fine.",
    aside: "No sign-up.",
  },
  {
    number: "02",
    title: "We read it as several problems",
    body: "Most missions are three problems wearing one coat. We pull them apart.",
    aside: "Six capabilities, ranked.",
  },
  {
    number: "03",
    title: "Every capability comes with a reason",
    body: "Why it matters for your mission, when it gets urgent, what breaks without it.",
    aside: "Including what to ignore for now.",
  },
  {
    number: "04",
    title: "People, roles, and a first move",
    body: "The people whose skills fit, and one move small enough for this week.",
    aside: "Ask them to join from the map.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <div>
        <p className="eyebrow text-muted">How it works</p>
        <h1 className="mt-6 font-display text-display text-balance text-ink">
          Four steps, about ninety seconds.
        </h1>
        <p className="mt-6 max-w-md text-lead text-muted">
          A mission in, a map out.
        </p>
      </div>

      <div className="mt-16 space-y-12">
        {PHASES.map((phase) => (
          <article
            key={phase.number}
            className="grid gap-4 border-t border-line pt-7 sm:grid-cols-[72px_1fr] sm:gap-8"
          >
              <span className="font-mono text-lead text-accent">{phase.number}</span>
              <div>
                <h2 className="text-h3 font-semibold text-ink">{phase.title}</h2>
                <p className="mt-2.5 text-body text-pretty text-muted">{phase.body}</p>
                <p className="mt-3 font-mono text-label text-faint">{phase.aside}</p>
              </div>
          </article>
        ))}
      </div>

      <div>
        <div className="mt-16 rounded-2xl border border-line bg-surface p-7 sm:p-9">
          <p className="eyebrow text-faint">Where the limits are</p>
          <h2 className="mt-4 font-display text-h2 text-balance text-ink">
            What it deliberately won&apos;t do
          </h2>
          <p className="mt-4 max-w-md text-body text-muted">
            No invented market sizes. No statistics it doesn&apos;t have. Nothing it
            can&apos;t actually know from a sentence about an idea.
          </p>
        </div>
      </div>

      <div>
        <div className="mt-14 text-center">
          <Link
            href="/#start"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-small font-medium text-paper transition-colors hover:bg-ink-soft"
          >
            Try it with your idea
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
