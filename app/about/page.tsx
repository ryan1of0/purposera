import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why PURPOSERA starts with the mission instead of the team, and how it thinks about being useful rather than impressive.",
};

const PRINCIPLES = [
  {
    title: "Honest over impressive",
    body: "When something is a guess, it says so and names the cheapest way to check.",
  },
  {
    title: "Specific over general",
    body: "“Research your market” helps nobody. Name the assumption. Test it Thursday.",
  },
  {
    title: "Useful over similar",
    body: "The best collaborator is rarely the person most like you.",
  },
  {
    title: "Small over complete",
    body: "Broad missions stall. Everything here pushes toward something you could finish.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <div>
        <p className="eyebrow text-muted">About</p>
        <h1 className="mt-6 font-display text-display text-balance text-ink">
          Start with the mission, not the team.
        </h1>
      </div>

      <div>
        <div className="mt-10 max-w-lg space-y-6 text-lead text-muted">
          <p>
            If money isn&apos;t the problem, what is? Usually it&apos;s that the person who
            could help you build the thing{" "}
            <span className="font-medium text-ink">doesn&apos;t know you exist</span>.
          </p>
          <p>
            Ideas stall in that gap. Not at the idea, not at the building — in the space
            between, where you can describe what you want and still can&apos;t see what it
            would take.
          </p>
        </div>
      </div>

      <div>
        <blockquote className="mt-14 border-l-2 border-accent pl-6 sm:pl-8">
          <p className="font-display text-h2 text-balance text-ink">
            The internet is very good at helping people find information. We want PURPOSERA
            to help people find each other.
          </p>
        </blockquote>
      </div>

      <div>
        <div className="mt-16">
          <p className="eyebrow text-faint">What we hold to</p>
          <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="bg-surface p-6 sm:p-7">
                <h2 className="text-h3 font-semibold text-ink">{principle.title}</h2>
                <p className="mt-2.5 text-body text-pretty text-muted">{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mt-14 text-center">
          <Link
            href="/#start"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-small font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            Map your mission
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
