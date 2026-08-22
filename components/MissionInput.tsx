"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EXAMPLE_MISSIONS } from "@/lib/examples";
import { saveAnalysis } from "@/lib/store";
import { MISSION_MAX_LENGTH, MISSION_MIN_LENGTH, type AnalyzeResponse } from "@/lib/types";
import { LoadingState } from "./LoadingState";

/** Long enough that the thinking sequence reads as intentional. */
const MIN_THINKING_MS = 1900;

export function MissionInput() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);

  const applyExample = (text: string) => {
    setValue(text);
    setError(null);
    textareaRef.current?.focus();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (thinking) return;

    const mission = value.trim();

    if (mission.length === 0) {
      setError("Give us a little something to work with first.");
      textareaRef.current?.focus();
      return;
    }
    if (mission.length < MISSION_MIN_LENGTH) {
      setError("A sentence or two would help. What are you trying to build?");
      textareaRef.current?.focus();
      return;
    }

    setError(null);
    setThinking(true);
    const startedAt = Date.now();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission }),
      });

      const payload = (await response.json()) as AnalyzeResponse;

      if (!payload.success) {
        setError(payload.error);
        setThinking(false);
        return;
      }

      // Let the thinking sequence finish its thought before we move on.
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_THINKING_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_THINKING_MS - elapsed));
      }

      saveAnalysis(payload.data);
      router.push("/mission");
    } catch {
      setError("Looks like the connection dropped. Give it another shot.");
      setThinking(false);
    }
  };

  const remaining = MISSION_MAX_LENGTH - value.length;

  return (
    <div
      id="start"
      className="scroll-mt-24 overflow-hidden rounded-[20px] border border-line bg-surface shadow-[var(--shadow-soft)]"
    >
      {thinking ? (
        <LoadingState />
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <h2
            id="mission-input-label"
            className="font-display text-h2 text-ink"
          >
            What are you trying to build?
          </h2>
          <p className="mt-2 text-sm text-muted">
            You don&apos;t need to have it figured out yet.
          </p>

          <textarea
            ref={textareaRef}
            id="mission"
            name="mission"
            aria-labelledby="mission-input-label"
            aria-describedby={error ? "mission-error" : undefined}
            aria-invalid={error ? true : undefined}
            value={value}
            onChange={(event) => {
              setValue(event.target.value.slice(0, MISSION_MAX_LENGTH));
              if (error) setError(null);
            }}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                void handleSubmit(event);
              }
            }}
            rows={4}
            maxLength={MISSION_MAX_LENGTH}
            placeholder="Describe it however it sits in your head right now."
            className="mt-5 w-full resize-none rounded-2xl border border-line bg-paper px-4 py-3.5 text-body text-ink transition-colors placeholder:text-faint focus:border-accent-line focus:bg-surface focus:outline-none focus-visible:outline-none sm:text-base"
          />

          {error ? (
            <p
              id="mission-error"
              role="alert"
              className="mt-3 text-sm font-medium text-amber"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="order-2 font-mono text-label text-faint sm:order-1">
              {remaining < 200 ? `${remaining} left` : "⌘ + Enter"}
            </p>
            <button
              type="submit"
              className="group order-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-body font-medium text-on-accent transition-colors hover:bg-accent-hover sm:order-2"
            >
              Explore mission
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-line pt-5">
            <p className="eyebrow mr-1 text-faint">Try</p>
            {EXAMPLE_MISSIONS.map((example) => (
              <button
                key={example.category}
                type="button"
                onClick={() => applyExample(example.text)}
                className="rounded-full border border-line bg-paper px-3.5 py-2 text-small text-ink-soft transition-colors hover:border-accent-line hover:bg-accent-soft hover:text-accent"
              >
                {example.category}
              </button>
            ))}
          </div>
        </form>
      )}
    </div>
  );
}
