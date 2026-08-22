const FINDINGS = [
  { percent: "61.7%", fraction: "29 / 47", claim: "couldn't find the skills they were missing" },
  { percent: "74.5%", fraction: "35 / 47", claim: "ask friends or classmates instead" },
  { percent: "44.7%", fraction: "21 / 47", claim: "track long-term progress nowhere" },
];

export function Survey() {
  return (
    <dl className="grid gap-10 sm:grid-cols-3 sm:gap-8">
      {FINDINGS.map((finding) => (
        <div key={finding.percent} className="border-t border-line-strong pt-6">
          <dt className="sr-only">{finding.claim}</dt>
          <dd>
            <p className="flex items-baseline gap-3">
              <span className="font-mono text-figure text-ink">{finding.percent}</span>
              <span className="eyebrow text-faint">{finding.fraction}</span>
            </p>
            <p className="mt-4 text-body text-pretty text-muted">{finding.claim}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
