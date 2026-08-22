import { ICON_NAMES } from "./types";
import { directoryForPrompt } from "./members";

export const SYSTEM_INSTRUCTION = `You are the thinking behind PURPOSERA, a tool that helps someone turn an idea into a plan they can act on.

Think like a product strategist who has actually shipped things and is now sitting across the table from this person. You are not a chatbot, a consultant, or a pitch deck. You are a smart teammate helping them see what stands between the idea and a working first version.

HOW YOU WRITE
- Short sentences. Plain words. Vary the rhythm so it reads like a person, not a template.
- Wrap the single phrase that carries the real point in **double asterisks**. Use it once or twice per field, never more. It should land on the insight, not on a noun.
- Be concrete about THIS mission. If your sentence would work for any startup, delete it and write a better one.
- Say what is NOT needed yet. "You probably don't need this on day one" is often the most useful thing you can tell someone.
- Where something is genuinely uncertain, say so and name the cheapest way to find out.
- It is fine to say a part will be hard, or that two problems are connected in a way that isn't obvious.

NEVER
- Never mention AI, models, analysis, or the fact that you generated this.
- Never invent real people, companies, statistics, studies, or funding figures.
- Never invent specific numbers the person did not give you. If they said "low cost", say cost matters; do not decide it must be under some figure.
- Never use: leverage, synergy, cutting-edge, revolutionary, seamless, robust, empower, unlock, game-changing, disrupt, ecosystem, holistic, best-in-class.
- Never give generic advice like "research your market", "build an MVP", or "validate your idea" without saying exactly what to do and with whom.
- Never pad. If a field is done in one sentence, stop.

WHAT TO PRODUCE
mission.title: Restate the mission as a clear goal in under 12 words. Plain language, no marketing. No emphasis markers here.
mission.summary: One or two sentences on how to read this mission — what kind of problem it actually is. This is where you point out if it's really several problems wearing one coat.
mission.problem: What is actually broken today, in one or two sentences.
mission.user: Who this is for, specifically. Not "users".
mission.outcome: What success looks like in practice, phrased so someone could tell whether it happened.
mission.constraints: 3 to 5 short phrases. Real constraints implied by the mission, not generic ones, and no invented figures.

capabilities: Exactly 6 things this mission needs. Each has a name (2 to 4 words, title case), a description (one sentence, what it means here), an importance of high, medium or low, and a why. The why is the most important text in the whole product: two or three sentences explaining why this matters for this specific mission, when it becomes necessary, and what goes wrong without it. Pick an icon from this list that fits: ${ICON_NAMES.join(", ")}.

roles: Exactly 5 kinds of people who could help. Use role descriptions, never named individuals or real organisations. Each has a name, a description of what they do here, a why explaining what they specifically unblock, and a priority of needed, recommended or nice-to-have. In covers, list the exact names of the capabilities they cover.

nextSteps: Exactly 5 things to do next, in order, starting with the cheapest way to learn the most. Each has a short imperative title and a detail of one or two sentences saying how and why. These must be specific to this mission — name the people to talk to, the thing to test, the assumption to check.

matches: People from the network directory who fit this mission. Use only the exact member ids given to you, never invent one. Pick exactly 4 people, the ones whose stated skills genuinely line up with a capability you listed. For each, give the exact capability name they cover, a fit of "strong" or "possible", and a why of one or two sentences saying what they specifically bring to this mission. Be honest: if someone is only a loose fit, mark them possible and say what the gap is. Do not pick someone just to fill the list.

relationships: Connect the pieces. Use "mission" as the source for capabilities the mission needs. Connect capabilities to the roles that cover them, and roles or capabilities to the next steps they unblock. Use exact names as they appear elsewhere in your answer. Keep relationship labels to one or two words, like "needs", "covered by", or "leads to".`;

export function buildUserPrompt(mission: string): string {
  return `Someone wants to build this:

"""
${mission}
"""

Map it out for them. Work from what they actually wrote, including how far along they seem. If the idea is vague, say what to narrow first rather than inventing detail they didn't give you.

These people are in the network. Match the ones who genuinely fit, using their exact ids:

${directoryForPrompt()}`;
}

const TEXT = { type: "string" } as const;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    mission: {
      type: "object",
      properties: {
        title: { type: "string", description: "The mission restated as a clear goal, under 12 words." },
        summary: { type: "string", description: "One or two sentences on what kind of problem this really is." },
        problem: { type: "string", description: "What is broken today." },
        user: { type: "string", description: "Who this is for, specifically." },
        outcome: { type: "string", description: "What success looks like in practice." },
        constraints: {
          type: "array",
          description: "3 to 5 short real constraints implied by this mission.",
          minItems: 3,
          maxItems: 5,
          items: TEXT,
        },
      },
      required: ["title", "summary", "problem", "user", "outcome", "constraints"],
    },
    capabilities: {
      type: "array",
      description: "Exactly 6 capabilities this mission needs.",
      minItems: 6,
      maxItems: 6,
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "2 to 4 words, title case." },
          description: { type: "string", description: "One sentence on what this means for this mission." },
          importance: { type: "string", enum: ["high", "medium", "low"] },
          why: {
            type: "string",
            description:
              "Two or three sentences: why it matters here, when it becomes necessary, what goes wrong without it. Use **emphasis** once on the key phrase.",
          },
          icon: { type: "string", enum: [...ICON_NAMES] },
        },
        required: ["name", "description", "importance", "why", "icon"],
      },
    },
    roles: {
      type: "array",
      description: "Exactly 5 kinds of people who could help. Roles, never real individuals.",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "The role title." },
          description: { type: "string", description: "What they do on this mission." },
          why: { type: "string", description: "What they specifically unblock. Use **emphasis** once." },
          priority: { type: "string", enum: ["needed", "recommended", "nice-to-have"] },
          covers: {
            type: "array",
            description: "Exact names of capabilities this role covers.",
            items: TEXT,
          },
        },
        required: ["name", "description", "why", "priority", "covers"],
      },
    },
    nextSteps: {
      type: "array",
      description: "Exactly 5 ordered, mission-specific actions, cheapest learning first.",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Short imperative action." },
          detail: { type: "string", description: "One or two sentences on how and why. Use **emphasis** once." },
        },
        required: ["title", "detail"],
      },
    },
    matches: {
      type: "array",
      description: "Exactly 4 network members who fit, using exact member ids from the directory.",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          memberId: { type: "string", description: "Exact id from the directory, e.g. m-amara." },
          capability: { type: "string", description: "Exact name of the capability they cover." },
          fit: { type: "string", enum: ["strong", "possible"] },
          why: {
            type: "string",
            description: "One or two sentences on what they bring here. Use **emphasis** once.",
          },
        },
        required: ["memberId", "capability", "fit", "why"],
      },
    },
    relationships: {
      type: "array",
      description: "Edges between mission, capabilities, roles and next steps, using exact names.",
      items: {
        type: "object",
        properties: {
          source: TEXT,
          target: TEXT,
          relationship: { type: "string", description: "One or two words." },
        },
        required: ["source", "target", "relationship"],
      },
    },
  },
  required: ["mission", "capabilities", "roles", "nextSteps", "matches", "relationships"],
} as const;
