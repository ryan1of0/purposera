import Link from "next/link";
import { MissionInput } from "@/components/MissionInput";
import { Survey } from "@/components/Survey";
import { TheShift } from "@/components/TheShift";

export default function LandingPage() {
  return (
    <>
      {/* input sits above the fold: nothing explains this faster than using it */}
      <section className="mx-auto w-full max-w-3xl px-5 pt-20 pb-20 sm:px-8 sm:pt-28 sm:pb-28">
        <h1 className="animate-rise font-display text-display text-balance text-ink">
          Turn your idea into something you can actually build.
        </h1>
        <p
          className="animate-rise mt-6 max-w-md text-lead text-muted"
          style={{ animationDelay: "70ms" }}
        >
          Describe a mission. See what it needs and who could build it.
        </p>

        <div className="animate-rise mt-12" style={{ animationDelay: "140ms" }}>
          <MissionInput />
        </div>
      </section>
      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="eyebrow text-faint">The research</p>
          <h2 className="mt-5 max-w-xl font-display text-h1 text-balance text-ink">
            We asked 47 people how they find collaborators.
          </h2>

          <div className="mt-14">
            <Survey />
          </div>
        </div>
      </section>
      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="eyebrow text-faint">The shift</p>
          <h2 className="mt-5 max-w-xl font-display text-h1 text-balance text-ink">
            So we didn&apos;t build another social network.
          </h2>

          <div className="mt-14">
            <TheShift />
          </div>

          <p className="mt-16 max-w-2xl font-display text-h2 text-balance text-ink">
            The question changes from &ldquo;who do I know?&rdquo; to &ldquo;who should exist
            around this mission?&rdquo;
          </p>
        </div>
      </section>
      <section className="border-t border-line">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-20 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-28">
          <h2 className="max-w-md font-display text-h1 text-balance text-ink">
            Start with an idea.
          </h2>
          <Link
            href="/#start"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-small font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            Explore a mission
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
