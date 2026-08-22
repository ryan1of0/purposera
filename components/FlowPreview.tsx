import { Icon } from "./Icon";
import type { IconName } from "@/lib/types";

interface Stage {
  label: string;
  caption: string;
  items: { name: string; icon: IconName }[];
}

const STAGES: Stage[] = [
  {
    label: "Mission",
    caption: "What you wrote",
    items: [{ name: "Your idea, in one sentence", icon: "spark" }],
  },
  {
    label: "Capabilities",
    caption: "What it needs",
    items: [
      { name: "Accessibility Design", icon: "accessibility" },
      { name: "Embedded Hardware", icon: "chip" },
      { name: "Indoor Positioning", icon: "map" },
    ],
  },
  {
    label: "People",
    caption: "Who could help",
    items: [
      { name: "Accessibility Researcher", icon: "people" },
      { name: "Embedded Engineer", icon: "wrench" },
    ],
  },
  {
    label: "Action",
    caption: "Where to start",
    items: [{ name: "Talk to three users this week", icon: "flask" }],
  },
];

export function FlowPreview() {
  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-4">
      {STAGES.map((stage, index) => (
        <div key={stage.label} className="relative">
          {index < STAGES.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute top-1/2 -right-2.5 hidden h-px w-5 bg-line-strong lg:block"
            />
          ) : null}

          <div className="h-full rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-baseline justify-between gap-2">
              <span className="eyebrow text-ink">
                {stage.label}
              </span>
              <span className="text-xs text-faint">{stage.caption}</span>
            </div>

            <ul className="mt-3 space-y-2">
              {stage.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-paper px-3 py-2.5"
                >
                  <Icon name={item.icon} className="h-4 w-4 shrink-0 text-accent" />
                  <span className="text-small leading-snug text-ink-soft">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
