const TRADITIONAL = ["Person", "Profile", "Connection"];
const PURPOSERA = ["Mission", "Capabilities", "People", "Collaboration"];

function Chain({ steps, tone }: { steps: string[]; tone: "muted" | "accent" }) {
  return (
    <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-3">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1.5 text-small ${
              tone === "accent"
                ? "border-accent-line bg-accent-soft text-accent"
                : "border-line bg-paper text-muted"
            }`}
          >
            {step}
          </span>
          {index < steps.length - 1 ? (
            <span aria-hidden="true" className="text-faint">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function TheShift() {
  return (
    <div className="grid gap-10 sm:gap-8 lg:grid-cols-2">
      <div className="border-t border-line-strong pt-6">
        <p className="eyebrow text-faint">Everyone else</p>
        <Chain steps={TRADITIONAL} tone="muted" />
      </div>
      <div className="border-t border-accent pt-6">
        <p className="eyebrow text-accent">PURPOSERA</p>
        <Chain steps={PURPOSERA} tone="accent" />
      </div>
    </div>
  );
}
