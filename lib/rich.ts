export interface RichSegment {
  text: string;
  bold: boolean;
}

const BOLD_PATTERN = /\*\*([^*]+)\*\*/g;

export function parseRich(input: string): RichSegment[] {
  const text = input ?? "";
  const segments: RichSegment[] = [];
  let cursor = 0;

  BOLD_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = BOLD_PATTERN.exec(text)) !== null) {
    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index), bold: false });
    }
    segments.push({ text: match[1], bold: true });
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), bold: false });
  }

  return segments.length > 0 ? segments : [{ text, bold: false }];
}

export function stripRich(input: string): string {
  return (input ?? "").replace(/\*\*/g, "");
}
