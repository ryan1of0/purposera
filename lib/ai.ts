import { RESPONSE_SCHEMA, SYSTEM_INSTRUCTION, buildUserPrompt } from "./prompt";

// generateContent was retired in June 2026; this is the Interactions API.
// https://ai.google.dev/gemini-api/docs/interactions/structured-output
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const API_REVISION = "2026-05-20";
// flash-lite runs the full schema in ~11s. Anything bigger drags the demo.
const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const DEFAULT_RETRY_MODEL = "gemini-3.1-flash-lite";
const TOTAL_BUDGET_MS = 26_000;
const RETRY_FLOOR_MS = 9_000;

export class GeminiUnavailableError extends Error {}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function geminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

function retryModel(): string {
  return process.env.GEMINI_FALLBACK_MODEL?.trim() || DEFAULT_RETRY_MODEL;
}

interface ContentBlock {
  type?: string;
  text?: string;
}

interface InteractionStep {
  type?: string;
  content?: ContentBlock[];
}

interface InteractionResponse {
  status?: string;
  steps?: InteractionStep[];
  output_text?: string;
}

function extractText(payload: InteractionResponse): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  const steps = Array.isArray(payload.steps) ? payload.steps : [];
  // "thought" steps interleave with the real output and would corrupt the JSON
  const outputSteps = steps.filter((step) => step.type === "model_output");
  const source =
    outputSteps.length > 0
      ? outputSteps
      : steps.filter((step) => step.type !== "user_input" && step.type !== "thought");

  const text = source
    .flatMap((step) => (Array.isArray(step.content) ? step.content : []))
    .filter((block) => block.type === "text" || typeof block.text === "string")
    .map((block) => block.text ?? "")
    .join("")
    .trim();

  return text;
}

// it still fences the JSON sometimes, despite the schema
function stripFences(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  return start !== -1 && end > start ? candidate.slice(start, end + 1) : candidate;
}

async function requestOnce(
  model: string,
  mission: string,
  apiKey: string,
  budgetMs: number,
): Promise<{ ok: true; text: string } | { ok: false; retryable: boolean; reason: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), budgetMs);

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
        "Api-Revision": API_REVISION,
      },
      body: JSON.stringify({
        model,
        system_instruction: SYSTEM_INSTRUCTION,
        input: buildUserPrompt(mission),
        generation_config: {
          temperature: 0.85,
          thinking_level: "low",
        },
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: RESPONSE_SCHEMA,
        },
      }),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return {
      ok: false,
      retryable: !aborted,
      reason: aborted ? `${model} timed out` : `${model} unreachable`,
    };
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    // status only: bodies can echo the request
    return {
      ok: false,
      retryable: response.status >= 500 || response.status === 429,
      reason: `${model} responded with ${response.status}`,
    };
  }

  let payload: InteractionResponse;
  try {
    payload = (await response.json()) as InteractionResponse;
  } catch {
    return { ok: false, retryable: true, reason: `${model} returned a malformed body` };
  }

  const text = extractText(payload);
  if (!text) return { ok: false, retryable: true, reason: `${model} returned an empty response` };

  return { ok: true, text };
}

// Retries once on a transient failure, then throws so the caller can fall back.
export async function analyzeWithGemini(mission: string): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new GeminiUnavailableError("Gemini is not configured");

  const startedAt = Date.now();
  const models = [geminiModel(), retryModel()];
  let lastReason = "Gemini unavailable";

  for (let attempt = 0; attempt < models.length; attempt += 1) {
    const remaining = TOTAL_BUDGET_MS - (Date.now() - startedAt);
    if (attempt > 0 && remaining < RETRY_FLOOR_MS) break;

    const result = await requestOnce(models[attempt], mission, apiKey, remaining);

    if (result.ok) {
      try {
        return JSON.parse(stripFences(result.text));
      } catch {
        lastReason = `${models[attempt]} returned invalid JSON`;
        continue;
      }
    }

    lastReason = result.reason;
    if (!result.retryable) break;
  }

  throw new GeminiUnavailableError(lastReason);
}
