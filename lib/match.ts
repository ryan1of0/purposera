import { MEMBERS, MEMBERS_BY_ID, type Member } from "./members";
import type { Capability, MemberMatch } from "./types";

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "into", "your", "you",
  "are", "not", "but", "how", "who", "why", "what", "when", "where", "which",
  "them", "they", "their", "have", "has", "was", "were", "will", "would",
  "can", "could", "should", "need", "needs", "needed", "make", "makes", "made",
  "work", "works", "working", "people", "person", "someone", "thing", "things",
  "build", "building", "built", "help", "helps", "helping", "using", "used",
  "one", "two", "get", "gets", "its", "our", "out", "off", "own", "than",
  "then", "there", "these", "those", "very", "just", "also", "more", "most",
  "some", "any", "all", "each", "about", "before", "after", "over", "under",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3 && !STOP_WORDS.has(word)),
  );
}

function overlap(a: Set<string>, b: Set<string>): string[] {
  const shared: string[] = [];
  for (const word of a) if (b.has(word)) shared.push(word);
  return shared;
}

interface Scored {
  member: Member;
  capability: Capability;
  score: number;
  sharedSkills: string[];
}

function sharedSkillsFor(member: Member, capabilityTokens: Set<string>): string[] {
  return member.skills.filter((skill) => overlap(tokenize(skill), capabilityTokens).length > 0);
}

function scoreMember(
  member: Member,
  capabilities: Capability[],
  missionTokens: Set<string>,
): Scored | null {
  const memberTokens = tokenize(`${member.headline} ${member.skills.join(" ")}`);
  const domainTokens = new Set(member.domains);

  let best: Scored | null = null;

  for (const capability of capabilities) {
    const capabilityTokens = tokenize(`${capability.name} ${capability.description}`);
    const direct = overlap(capabilityTokens, memberTokens).length * 4;
    const contextual = overlap(missionTokens, memberTokens).length;
    const domainBonus = overlap(missionTokens, domainTokens).length * 2;
    const score = direct + contextual + domainBonus;

    if (score > 0 && (!best || score > best.score)) {
      best = {
        member,
        capability,
        score,
        sharedSkills: sharedSkillsFor(member, capabilityTokens),
      };
    }
  }

  return best;
}

function explain(scored: Scored): string {
  const first = scored.member.name.split(" ")[0];
  const skills = scored.sharedSkills.length > 0 ? scored.sharedSkills : scored.member.skills;
  const listed = skills.slice(0, 2).join(" and ").toLowerCase();
  return `${first} lists **${listed}**, which is close to what ${scored.capability.name} needs here. Worth a conversation before you commit to an approach.`;
}

export function matchMembers(
  missionText: string,
  capabilities: Capability[],
  limit = 4,
  exclude: Set<string> = new Set(),
): MemberMatch[] {
  if (capabilities.length === 0) return [];
  const missionTokens = tokenize(missionText);

  return MEMBERS.filter((member) => !exclude.has(member.id))
    .map((member) => scoreMember(member, capabilities, missionTokens))
    .filter((scored): scored is Scored => scored !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((scored) => ({
      memberId: scored.member.id,
      capability: scored.capability.name,
      fit: scored.score >= 10 ? "strong" : "possible",
      why: explain(scored),
    }));
}

export function sanitizeMatches(
  matches: MemberMatch[],
  capabilities: Capability[],
): MemberMatch[] {
  const capabilityNames = new Map(
    capabilities.map((capability) => [capability.name.toLowerCase(), capability.name]),
  );
  const seen = new Set<string>();

  return matches.filter((match) => {
    if (!MEMBERS_BY_ID.has(match.memberId)) return false;
    if (seen.has(match.memberId)) return false;
    seen.add(match.memberId);

    const resolved = capabilityNames.get(match.capability.toLowerCase());
    match.capability = resolved ?? capabilities[0].name;
    return true;
  });
}
