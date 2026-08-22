import {
  ICON_NAMES,
  type AnalysisMeta,
  type Capability,
  type IconName,
  type Importance,
  type MissionAnalysis,
  type NextStep,
  type Priority,
  type MemberMatch,
  type Relationship,
  type Role,
} from "./types";

const ICON_SET = new Set<string>(ICON_NAMES);

// most specific first: first hit wins
const ICON_KEYWORDS: [IconName, string[]][] = [
  ["accessibility", ["accessib", "assistive", "impair", "disab", "inclusive", "screen reader"]],
  ["vision", ["computer vision", "camera", "visual recogn", "image", "object detect", "perception", "ocr"]],
  ["chip", ["hardware", "embedded", "firmware", "sensor", "electronic", "circuit", "device design", "iot", "robot", "wearable"]],
  ["map", ["navigat", "position", "wayfind", "indoor loc", "geospatial", "mapping", "routing", "spatial"]],
  ["leaf", ["climate", "sustainab", "waste", "environment", "carbon", "emission", "compost", "recycl", "energy", "agricultur", "farm", "food"]],
  ["book", ["educat", "learn", "teach", "curricul", "tutor", "pedagog", "training", "content design", "literacy"]],
  ["heart", ["health", "medical", "clinic", "patient", "care", "therap", "wellbeing", "mental", "empathy"]],
  ["shield", ["safety", "secur", "privacy", "complian", "regulat", "trust", "risk", "legal", "ethic"]],
  ["coin", ["cost", "pricing", "funding", "financ", "revenue", "business model", "monetiz", "budget", "econom", "afford", "payment", "unit econ"]],
  ["megaphone", ["market", "growth", "outreach", "brand", "awareness", "adoption", "partnership", "distribution", "community build"]],
  ["scale", ["policy", "governance", "standard", "equity", "fairness", "advocacy", "accreditat"]],
  ["box", ["logistic", "supply", "delivery", "inventory", "distribut", "fulfil", "operations", "packag"]],
  ["database", ["database", "storage", "data pipeline", "indexing", "catalog", "infrastructure"]],
  ["chart", ["data", "analytic", "metric", "measur", "insight", "evaluat", "statistic", "research method"]],
  ["signal", ["network", "connectiv", "wireless", "bluetooth", "signal", "telemetry", "streaming", "real-time comm"]],
  ["code", ["software", "engineering", "app ", "web", "mobile", "frontend", "backend", "api", "platform", "programming", "developer"]],
  ["flask", ["test", "experiment", "prototyp", "validat", "pilot", "trial", "lab", "science", "chemi", "biolog"]],
  ["spark", ["ai", "machine learning", "model", "algorithm", "intelligence", "llm", "automation", "recommend"]],
  ["people", ["research", "user", "interview", "community", "human", "stakeholder", "ux", "participant", "support"]],
  ["wrench", ["build", "system", "integrat", "product", "manufactur", "tooling", "maintenance"]],
];

export function resolveIcon(raw: unknown, context: string): IconName {
  if (typeof raw === "string") {
    const candidate = raw.trim().toLowerCase();
    if (ICON_SET.has(candidate)) return candidate as IconName;
  }

  const haystack = `${context} ${typeof raw === "string" ? raw : ""}`.toLowerCase();
  for (const [icon, keywords] of ICON_KEYWORDS) {
    if (keywords.some((keyword) => haystack.includes(keyword))) return icon;
  }
  return "spark";
}

export function slugify(value: string, fallback = "item"): string {
  const slug = value
    .toLowerCase()
    .replace(/\*\*/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || fallback;
}

function uniqueId(base: string, taken: Set<string>): string {
  let id = base;
  let suffix = 2;
  while (taken.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  taken.add(id);
  return id;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asText(value: unknown, max = 600): string {
  if (typeof value === "string") return value.trim().slice(0, max);
  if (typeof value === "number") return String(value);
  return "";
}

function asTextList(value: unknown, max = 8): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (typeof entry === "string") return entry.trim();
      const record = asRecord(entry);
      return asText(record.name ?? record.title ?? record.text ?? record.constraint);
    })
    .filter((entry): entry is string => Boolean(entry))
    .slice(0, max);
}

function asImportance(value: unknown): Importance {
  const raw = asText(value).toLowerCase();
  if (raw.includes("high") || raw.includes("critical") || raw.includes("essential")) return "high";
  if (raw.includes("low") || raw.includes("nice")) return "low";
  return "medium";
}

function asPriority(value: unknown): Priority {
  const raw = asText(value).toLowerCase().replace(/[\s_]+/g, "-");
  if (raw.includes("need") || raw.includes("must") || raw.includes("critical") || raw.includes("core")) {
    return "needed";
  }
  if (raw.includes("nice") || raw.includes("optional") || raw.includes("later")) return "nice-to-have";
  return "recommended";
}

function normalizeCapabilities(value: unknown): Capability[] {
  if (!Array.isArray(value)) return [];
  const taken = new Set<string>();

  return value
    .map((entry) => {
      const record = asRecord(entry);
      const name = asText(record.name ?? record.title ?? record.capability, 80);
      if (!name) return null;
      const description = asText(record.description ?? record.summary, 320);
      const why = asText(record.why ?? record.reason ?? record.whyItMatters, 480);

      const capability: Capability = {
        id: uniqueId(slugify(name, "capability"), taken),
        name,
        description: description || why,
        importance: asImportance(record.importance ?? record.priority),
        why: why || description,
        icon: resolveIcon(record.icon, `${name} ${description}`),
      };
      return capability;
    })
    .filter((entry): entry is Capability => entry !== null)
    .slice(0, 8);
}

function normalizeRoles(value: unknown): Role[] {
  if (!Array.isArray(value)) return [];
  const taken = new Set<string>();

  return value
    .map((entry) => {
      const record = asRecord(entry);
      const name = asText(record.name ?? record.role ?? record.title, 80);
      if (!name) return null;
      const description = asText(record.description ?? record.summary, 320);
      const why = asText(record.why ?? record.reason ?? record.whyTheyMatter, 480);

      const role: Role = {
        id: uniqueId(slugify(name, "role"), taken),
        name,
        description: description || why,
        why: why || description,
        priority: asPriority(record.priority ?? record.status ?? record.importance),
        covers: asTextList(record.covers ?? record.capabilities ?? record.related, 4),
      };
      return role;
    })
    .filter((entry): entry is Role => entry !== null)
    .slice(0, 6);
}

function normalizeNextSteps(value: unknown): NextStep[] {
  if (!Array.isArray(value)) return [];
  const taken = new Set<string>();

  return value
    .map((entry) => {
      if (typeof entry === "string") {
        const title = entry.trim().slice(0, 200);
        if (!title) return null;
        return { id: uniqueId(slugify(title, "step"), taken), title, detail: "" };
      }
      const record = asRecord(entry);
      const title = asText(record.title ?? record.step ?? record.name ?? record.text, 200);
      if (!title) return null;
      return {
        id: uniqueId(slugify(title, "step"), taken),
        title,
        detail: asText(record.detail ?? record.why ?? record.description, 360),
      };
    })
    .filter((entry): entry is NextStep => entry !== null)
    .slice(0, 5);
}

function normalizeMatches(value: unknown): MemberMatch[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      const record = asRecord(entry);
      const memberId = asText(record.memberId ?? record.id ?? record.member, 40);
      if (!memberId) return null;
      const fitRaw = asText(record.fit).toLowerCase();
      return {
        memberId,
        capability: asText(record.capability ?? record.covers, 80),
        fit: fitRaw.includes("strong") ? ("strong" as const) : ("possible" as const),
        why: asText(record.why ?? record.reason, 400),
      };
    })
    .filter((entry): entry is MemberMatch => entry !== null)
    .slice(0, 6);
}

function normalizeRelationships(value: unknown): Relationship[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      const record = asRecord(entry);
      const source = asText(record.source ?? record.from, 80);
      const target = asText(record.target ?? record.to, 80);
      if (!source || !target) return null;
      return {
        source,
        target,
        relationship: asText(record.relationship ?? record.label ?? record.type, 60),
      };
    })
    .filter((entry): entry is Relationship => entry !== null)
    .slice(0, 40);
}

// Returns null when the payload is too thin to render, so the caller falls back.
export function normalizeAnalysis(
  raw: unknown,
  input: string,
  meta: AnalysisMeta,
): MissionAnalysis | null {
  const root = asRecord(raw);
  const missionRecord = asRecord(root.mission);

  const title = asText(missionRecord.title ?? root.title, 140);
  const capabilities = normalizeCapabilities(root.capabilities);
  const roles = normalizeRoles(root.roles);
  const nextSteps = normalizeNextSteps(root.nextSteps ?? root.next_steps);

  if (!title || capabilities.length < 2 || nextSteps.length < 2) return null;

  return {
    input,
    mission: {
      title,
      summary: asText(missionRecord.summary ?? root.summary, 480),
      problem: asText(missionRecord.problem, 400),
      user: asText(missionRecord.user ?? missionRecord.audience, 300),
      outcome: asText(missionRecord.outcome, 400),
      constraints: asTextList(missionRecord.constraints, 6),
    },
    capabilities,
    roles,
    nextSteps,
    relationships: normalizeRelationships(root.relationships),
    matches: normalizeMatches(root.matches),
    meta,
  };
}
