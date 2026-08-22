import { NextResponse } from "next/server";
import { GeminiUnavailableError, analyzeWithGemini, geminiModel, isGeminiConfigured } from "@/lib/ai";
import { buildFallbackAnalysis } from "@/lib/fallback";
import { normalizeAnalysis } from "@/lib/normalize";
import { matchMembers, sanitizeMatches } from "@/lib/match";
import {
  MISSION_MAX_LENGTH,
  MISSION_MIN_LENGTH,
  type AnalyzeResponse,
  type MissionAnalysis,
} from "@/lib/types";

export const runtime = "nodejs";

const PEOPLE_SHOWN = 4;

function fail(error: string, status: number) {
  return NextResponse.json<AnalyzeResponse>({ success: false, error }, { status });
}

function succeed(data: MissionAnalysis) {
  return NextResponse.json<AnalyzeResponse>({ success: true, data });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("That request didn't come through properly. Try again.", 400);
  }

  const mission =
    body && typeof body === "object" && "mission" in body
      ? (body as { mission: unknown }).mission
      : undefined;

  if (typeof mission !== "string") {
    return fail("Give us a little something to work with first.", 400);
  }

  const trimmed = mission.trim().replace(/\s+/g, " ");

  if (trimmed.length === 0) {
    return fail("Give us a little something to work with first.", 400);
  }

  if (trimmed.length < MISSION_MIN_LENGTH) {
    return fail("A sentence or two would help. What are you trying to build?", 400);
  }

  if (trimmed.length > MISSION_MAX_LENGTH) {
    return fail(
      `That's a lot to take in at once. Try trimming it to the core idea, under ${MISSION_MAX_LENGTH} characters.`,
      400,
    );
  }

  if (!isGeminiConfigured()) {
    return succeed(buildFallbackAnalysis(trimmed, true));
  }

  try {
    const raw = await analyzeWithGemini(trimmed);
    const analysis = normalizeAnalysis(raw, trimmed, {
      source: "gemini",
      model: geminiModel(),
      generatedAt: new Date().toISOString(),
      degraded: false,
    });

    if (analysis) {
      // Never trust model-authored member ids; drop unknowns and top up if thin.
      // drop ids the model invented, then top up to a full 2x2
      analysis.matches = sanitizeMatches(analysis.matches, analysis.capabilities);
      if (analysis.matches.length < PEOPLE_SHOWN) {
        const taken = new Set(analysis.matches.map((match) => match.memberId));
        analysis.matches.push(
          ...matchMembers(
            trimmed,
            analysis.capabilities,
            PEOPLE_SHOWN - analysis.matches.length,
            taken,
          ),
        );
      }
      analysis.matches = analysis.matches.slice(0, PEOPLE_SHOWN);
      return succeed(analysis);
    }

    console.warn("[analyze] Gemini payload was too thin to render; using fallback map.");
  } catch (error) {
    const message = error instanceof GeminiUnavailableError ? error.message : "unexpected error";
    console.warn(`[analyze] ${message}; using fallback map.`);
  }

  return succeed(buildFallbackAnalysis(trimmed, true));
}
