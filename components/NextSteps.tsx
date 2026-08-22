import type { NextStep } from "@/lib/types";
import { RichText } from "./RichText";

export function NextSteps({ steps }: { steps: NextStep[] }) {
  return (
    <ol className="mt-8 space-y-1">
      {steps.map((step, index) => (
        <li
          key={step.id}
          className="grid gap-2 border-t border-line py-6 sm:grid-cols-[56px_1fr] sm:gap-6"
        >
          <span
            aria-hidden="true"
            className="font-mono text-lead text-accent sm:pt-1"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-h3 font-semibold text-ink">
              <RichText>{step.title}</RichText>
            </h3>
            {step.detail ? (
              <p className="mt-2 text-body text-muted">
                <RichText>{step.detail}</RichText>
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
