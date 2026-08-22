export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  aside,
  id,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  aside?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="eyebrow flex items-center gap-3 text-faint">
            {index ? <span className="text-accent">{index}</span> : null}
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            {eyebrow}
          </p>
        ) : null}
        <h2 id={id} className={`font-display text-h2 text-balance text-ink ${eyebrow ? "mt-4" : ""}`}>
          {title}
        </h2>
        {intro ? <p className="mt-3 max-w-xl text-body text-pretty text-muted">{intro}</p> : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
