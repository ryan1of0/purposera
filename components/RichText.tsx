import { parseRich } from "@/lib/rich";

export function RichText({
  children,
  emphasis = "ink",
}: {
  children: string;
  emphasis?: "ink" | "accent";
}) {
  const segments = parseRich(children);
  const strongClass =
    emphasis === "accent"
      ? "font-semibold text-accent"
      : "font-semibold text-ink";

  return (
    <>
      {segments.map((segment, index) =>
        segment.bold ? (
          <strong key={index} className={strongClass}>
            {segment.text}
          </strong>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
