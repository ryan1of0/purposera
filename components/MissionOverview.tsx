import type { MissionBrief } from "@/lib/types";
import { RichText } from "./RichText";

export function MissionOverview({ mission }: { mission: MissionBrief }) {
  return (
    <div>
      <p className="eyebrow text-muted">
        Your mission
      </p>
      <h1 className="animate-rise mt-4 font-display text-h1 text-balance text-ink">
        {mission.title}
      </h1>
      {mission.summary ? (
        <p
          className="animate-rise mt-5 max-w-2xl text-lead text-pretty text-muted"
          style={{ animationDelay: "80ms" }}
        >
          <RichText>{mission.summary}</RichText>
        </p>
      ) : null}
    </div>
  );
}
