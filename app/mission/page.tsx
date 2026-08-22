"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { MissionOverview } from "@/components/MissionOverview";
import { MissionSummaryCard } from "@/components/MissionSummaryCard";
import { CapabilityCard } from "@/components/CapabilityCard";
import { RoleList } from "@/components/RoleList";
import { MemberCard } from "@/components/MemberCard";
import { MissionGraph } from "@/components/MissionGraph";
import { NextSteps } from "@/components/NextSteps";
import { SectionHeading } from "@/components/SectionHeading";
import {
  getAnalysisSnapshot,
  getServerAnalysisSnapshot,
  subscribeAnalysis,
} from "@/lib/store";
import { stripRich } from "@/lib/rich";
import { MEMBERS_BY_ID } from "@/lib/members";
import type { MissionAnalysis } from "@/lib/types";

export default function MissionPage() {
  // undefined while the client is still hydrating, then the stored mission or null.
  const analysis = useSyncExternalStore<MissionAnalysis | null | undefined>(
    subscribeAnalysis,
    getAnalysisSnapshot,
    getServerAnalysisSnapshot,
  );
  const [added, setAdded] = useState<string[]>([]);
  const [requested, setRequested] = useState<string[]>([]);

  const toggleRequest = (id: string) =>
    setRequested((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const toggleRole = (id: string) =>
    setAdded((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const firstStep = useMemo(
    () => (analysis?.nextSteps[0] ? stripRich(analysis.nextSteps[0].title) : ""),
    [analysis],
  );

  if (analysis === undefined) {
    return <div className="min-h-[60vh]" aria-hidden="true" />;
  }

  if (analysis === null) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-h1 text-ink">No mission mapped yet</h1>
        <p className="mt-3 text-body text-muted">
          Tell us what you&apos;re trying to build and we&apos;ll map what it needs.
        </p>
        <Link
          href="/#start"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-body font-medium text-paper transition-colors hover:bg-ink-soft"
        >
          Start a mission
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  const { mission, capabilities, roles, nextSteps, matches, meta } = analysis;

  // Only render matches whose member still exists in the directory.
  const matchedPeople = matches
    .map((match) => ({ match, member: MEMBERS_BY_ID.get(match.memberId) }))
    .filter((entry): entry is { match: typeof entry.match; member: NonNullable<typeof entry.member> } =>
      Boolean(entry.member),
    );

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <section className="border-b border-line py-12 sm:py-16">
        <MissionOverview mission={mission} />

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href="/#start"
            className="text-sm font-medium text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline"
          >
            Map another mission
          </Link>
          {meta.degraded ? (
            <p className="text-sm text-muted">
              We couldn&apos;t complete the full analysis, so here&apos;s a quick starting map.
            </p>
          ) : null}
        </div>
      </section>
      <section className="py-14 sm:py-20">
        <div>
          <SectionHeading
            index="01"
            eyebrow="The brief"
            title="What you're really solving"
          />
        </div>
        <div className="mt-8">
          <MissionSummaryCard mission={mission} />
        </div>
      </section>
      <section className="border-t border-line py-14 sm:py-20">
        <div>
          <SectionHeading
            index="02"
            eyebrow="Capabilities"
            title="What this mission needs"
          />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => (
            <CapabilityCard key={capability.id} capability={capability} />
          ))}
        </div>
      </section>
      <section className="border-t border-line py-14 sm:py-20">
        <div>
          <SectionHeading
            index="03"
            eyebrow="Roles"
            title="Who could help you build this?"
            aside={
              added.length > 0 ? (
                <span className="inline-flex items-center rounded-full border border-accent-line bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent">
                  {added.length} added to mission
                </span>
              ) : null
            }
          />
        </div>
        <div className="mt-8">
          <RoleList roles={roles} added={added} onToggle={toggleRole} />
        </div>
      </section>
      {matchedPeople.length > 0 ? (
        <section className="border-t border-line py-14 sm:py-20">
          <div>
            <SectionHeading
              index="04"
              eyebrow="The network"
              title="People already here"
              aside={
                requested.length > 0 ? (
                  <span className="inline-flex items-center rounded-full border border-accent-line bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent">
                    {requested.length} request{requested.length === 1 ? "" : "s"} sent
                  </span>
                ) : null
              }
            />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {matchedPeople.map(({ match, member }) => (
              <MemberCard
                key={member.id}
                member={member}
                match={match}
                requested={requested.includes(member.id)}
                onToggle={toggleRequest}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Graph. Breaks out of the reading column so the map stays legible. */}
      <section className="mx-[calc(50%-50vw)] w-screen border-t border-line px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto w-full max-w-[1400px]">
          <div>
            <SectionHeading
              index="05"
              eyebrow="The map"
              title="How it all connects"
            />
          </div>
          <div className="animate-fade mt-8">
            <MissionGraph analysis={analysis} />
          </div>
        </div>
      </section>
      <section id="next-steps" className="scroll-mt-24 border-t border-line py-14 sm:py-20">
        <div>
          <SectionHeading
            index="06"
            eyebrow="First moves"
            title="Where I'd start"
          />
        </div>
        <div>
          <NextSteps steps={nextSteps} />
        </div>
      </section>
      <section className="border-t border-line py-14 sm:py-20">
        <div className="rounded-[20px] border border-line bg-surface p-8 text-center sm:p-12">
          <h2 className="font-display text-h1 text-balance text-ink">
            Ready to make the first move?
          </h2>
          {firstStep ? (
            <p className="mx-auto mt-4 max-w-xl text-lead text-pretty text-ink-soft">
              {firstStep}
            </p>
          ) : null}
          <a
            href="#next-steps"
            className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-body font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            Start here
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
