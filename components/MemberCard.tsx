"use client";

import type { Member } from "@/lib/members";
import type { MemberMatch } from "@/lib/types";
import { Badge } from "./Badge";
import { RichText } from "./RichText";

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
}

export function MemberCard({
  member,
  match,
  requested,
  onToggle,
}: {
  member: Member;
  match: MemberMatch;
  requested: boolean;
  onToggle: (id: string) => void;
}) {
  const post = member.posts[0];

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-surface p-5 transition-all duration-200 sm:p-6 ${
        requested ? "border-accent-line bg-accent-soft/40" : "border-line hover:shadow-[var(--shadow-soft)]"
      }`}
    >
      <header className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent-line bg-accent-soft text-small font-semibold text-accent"
        >
          {initials(member.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-h3 font-semibold text-ink">{member.name}</h3>
          <p className="mt-0.5 text-small leading-snug text-muted">{member.headline}</p>
          <p className="mt-1.5 text-small text-faint">
            {member.location} · {member.openTo}
          </p>
        </div>
      </header>

      <div className="mt-4 border-t border-line pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow text-faint">
            Why they fit
          </p>
          <Badge tone={match.fit === "strong" ? "accent" : "amber"}>
            {match.fit === "strong" ? "Strong fit" : "Possible fit"}
          </Badge>
        </div>
        <p className="mt-2 text-body text-ink-soft">
          <RichText>{match.why}</RichText>
        </p>
        <p className="mt-2 text-small text-muted">
          Covers <span className="font-medium text-ink">{match.capability}</span>
        </p>
      </div>

      <div className="mt-4">
        <p className="eyebrow text-faint">
          Skills
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {member.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-line bg-paper px-2.5 py-1 text-small text-ink-soft"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      {post ? (
        <div className="mt-4 rounded-xl border border-line bg-paper p-4">
          <div className="flex items-baseline justify-between gap-2">
            <p className="eyebrow text-faint">
              Latest post
            </p>
            <span className="font-mono text-label text-faint">{post.posted}</span>
          </div>
          <p className="mt-2 text-small font-medium text-ink">{post.title}</p>
          <p className="mt-1 text-small text-muted">{post.body}</p>
        </div>
      ) : null}

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => onToggle(member.id)}
        aria-pressed={requested}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
          requested
            ? "border-accent bg-accent text-on-accent hover:bg-accent-hover"
            : "border-line-strong bg-surface text-ink hover:bg-paper-deep"
        }`}
      >
        {requested ? (
          <>
            <CheckIcon />
            Request sent
          </>
        ) : (
          `Ask ${member.name.split(" ")[0]} to join`
        )}
      </button>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 8.5 3.2 3.2L13 5" />
    </svg>
  );
}
