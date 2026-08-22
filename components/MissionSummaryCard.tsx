import type { MissionBrief } from "@/lib/types";
import { RichText } from "./RichText";

export function MissionSummaryCard({ mission }: { mission: MissionBrief }) {
  const rows = [
    { label: "Problem", value: mission.problem },
    { label: "User", value: mission.user },
    { label: "Outcome", value: mission.outcome },
  ].filter((row) => row.value);

  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-surface">
      <dl className="divide-y divide-line">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 px-6 py-5 sm:grid-cols-[128px_1fr] sm:gap-6 sm:px-8"
          >
            <dt className="eyebrow text-faint sm:pt-1">
              {row.label}
            </dt>
            <dd className="text-body text-ink-soft">
              <RichText>{row.value}</RichText>
            </dd>
          </div>
        ))}

        {mission.constraints.length > 0 ? (
          <div className="grid gap-2 px-6 py-5 sm:grid-cols-[128px_1fr] sm:gap-6 sm:px-8">
            <dt className="eyebrow text-faint sm:pt-1">
              Constraints
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {mission.constraints.map((constraint) => (
                  <li
                    key={constraint}
                    className="rounded-full border border-line bg-paper px-3 py-1.5 text-small text-ink-soft"
                  >
                    {constraint}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
