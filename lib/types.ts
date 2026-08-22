export type Importance = "high" | "medium" | "low";
export type Priority = "needed" | "recommended" | "nice-to-have";

// the model picks from this list; anything else falls back
export const ICON_NAMES = [
  "accessibility",
  "chip",
  "vision",
  "map",
  "people",
  "wrench",
  "flask",
  "shield",
  "leaf",
  "book",
  "chart",
  "spark",
  "code",
  "heart",
  "signal",
  "box",
  "coin",
  "scale",
  "megaphone",
  "database",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export interface MissionBrief {
  title: string;
  summary: string;
  problem: string;
  user: string;
  outcome: string;
  constraints: string[];
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  importance: Importance;
  why: string;
  icon: IconName;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  why: string;
  priority: Priority;
  covers: string[];
}

export interface NextStep {
  id: string;
  title: string;
  detail: string;
}

export interface Relationship {
  source: string;
  target: string;
  relationship: string;
}

export type Fit = "strong" | "possible";

export interface MemberMatch {
  memberId: string;
  capability: string;
  fit: Fit;
  why: string;
}

export type AnalysisSource = "gemini" | "fallback";

export interface AnalysisMeta {
  source: AnalysisSource;
  model?: string;
  generatedAt: string;
  degraded: boolean;
}

export interface MissionAnalysis {
  input: string;
  mission: MissionBrief;
  capabilities: Capability[];
  roles: Role[];
  nextSteps: NextStep[];
  relationships: Relationship[];
  matches: MemberMatch[];
  meta: AnalysisMeta;
}

export interface AnalyzeSuccess {
  success: true;
  data: MissionAnalysis;
}

export interface AnalyzeFailure {
  success: false;
  error: string;
}

export type AnalyzeResponse = AnalyzeSuccess | AnalyzeFailure;

export const MISSION_MIN_LENGTH = 12;
export const MISSION_MAX_LENGTH = 1200;
