import type { Edge, Node } from "@xyflow/react";
import type { IconName, MissionAnalysis } from "./types";
import { MEMBERS_BY_ID } from "./members";
import { stripRich } from "./rich";

export type GraphNodeKind = "mission" | "capability" | "person" | "step";

export interface GraphNodeData extends Record<string, unknown> {
  kind: GraphNodeKind;
  label: string;
  meta: string;
  badge: string;
  icon: IconName | null;
}

export type MissionNode = Node<GraphNodeData>;
export type MissionEdge = Edge;

export interface NodeDetail {
  id: string;
  kind: GraphNodeKind;
  title: string;
  badge: string;
  description: string;
  why: string;
  relatedCapabilities: string[];
  relatedRoles: string[];
  suggestedStep: string;
}

const MISSION_NODE_ID = "mission";

const COLUMN_X: Record<GraphNodeKind, number> = {
  mission: 0,
  capability: 300,
  person: 600,
  step: 900,
};

const TIER: Record<GraphNodeKind, number> = {
  mission: 0,
  capability: 1,
  person: 2,
  step: 3,
};

const ROW_HEIGHT = 112;

function stackColumn(count: number, index: number): number {
  return (index - (count - 1) / 2) * ROW_HEIGHT;
}

function lookupKey(value: string): string {
  return stripRich(value).trim().toLowerCase();
}

const IMPORTANCE_LABEL = { high: "High", medium: "Medium", low: "Low" } as const;
export function buildGraph(analysis: MissionAnalysis): {
  nodes: MissionNode[];
  edges: MissionEdge[];
  details: Record<string, NodeDetail>;
} {
  const nodes: MissionNode[] = [];
  const edges: MissionEdge[] = [];
  const details: Record<string, NodeDetail> = {};

  // name -> node id, for resolving the relationships the model wrote
  const byName = new Map<string, string>();
  const kindById = new Map<string, GraphNodeKind>();

  const register = (id: string, kind: GraphNodeKind, ...names: string[]) => {
    kindById.set(id, kind);
    for (const name of names) {
      const key = lookupKey(name);
      if (key && !byName.has(key)) byName.set(key, id);
    }
  };

  nodes.push({
    id: MISSION_NODE_ID,
    type: "mission",
    position: { x: COLUMN_X.mission, y: 0 },
    data: {
      kind: "mission",
      label: stripRich(analysis.mission.title),
      meta: "Your mission",
      badge: "Mission",
      icon: null,
    },
  });
  register(MISSION_NODE_ID, "mission", "mission", analysis.mission.title);

  analysis.capabilities.forEach((capability, index) => {
    const id = `capability-${capability.id}`;
    nodes.push({
      id,
      type: "mission",
      position: {
        x: COLUMN_X.capability,
        y: stackColumn(analysis.capabilities.length, index),
      },
      data: {
        kind: "capability",
        label: capability.name,
        meta: "Capability",
        badge: IMPORTANCE_LABEL[capability.importance],
        icon: capability.icon,
      },
    });
    register(id, "capability", capability.name);
  });

  // People in the network
  const matched = analysis.matches
    .map((match) => ({ match, member: MEMBERS_BY_ID.get(match.memberId) }))
    .filter(
      (entry): entry is { match: (typeof analysis.matches)[number]; member: NonNullable<typeof entry.member> } =>
        Boolean(entry.member),
    );

  matched.forEach(({ match, member }, index) => {
    const id = `person-${member.id}`;
    nodes.push({
      id,
      type: "mission",
      position: { x: COLUMN_X.person, y: stackColumn(matched.length, index) },
      data: {
        kind: "person",
        label: member.name,
        meta: "In the network",
        badge: match.fit === "strong" ? "Strong fit" : "Possible fit",
        icon: "spark",
      },
    });
    register(id, "person", member.name, member.id);
  });

  analysis.nextSteps.forEach((step, index) => {
    const id = `step-${step.id}`;
    nodes.push({
      id,
      type: "mission",
      position: { x: COLUMN_X.step, y: stackColumn(analysis.nextSteps.length, index) },
      data: {
        kind: "step",
        label: stripRich(step.title),
        meta: "Next step",
        badge: `Step ${index + 1}`,
        icon: "spark",
      },
    });
    register(id, "step", step.title);
  });

  const addEdge = (source: string, target: string, label: string) => {
    if (source === target) return;
    let from = source;
    let to = target;
    const fromKind = kindById.get(from);
    const toKind = kindById.get(to);
    if (!fromKind || !toKind) return;
    // Keep the flow reading left to right regardless of how it was described.
    if (TIER[fromKind] > TIER[toKind]) {
      [from, to] = [to, from];
    }
    const id = `edge-${from}-${to}`;
    if (edges.some((edge) => edge.id === id)) return;
    edges.push({
      id,
      source: from,
      target: to,
      data: { label },
    });
  };

  for (const relationship of analysis.relationships) {
    const source = byName.get(lookupKey(relationship.source));
    const target = byName.get(lookupKey(relationship.target));
    if (source && target) addEdge(source, target, relationship.relationship || "connects to");
  }

  for (const { match, member } of matched) {
    const capabilityId = byName.get(lookupKey(match.capability));
    if (capabilityId?.startsWith("capability-")) {
      addEdge(capabilityId, `person-${member.id}`, "could cover");
    }
  }

  const hasIncoming = (id: string) => edges.some((edge) => edge.target === id);

  for (const capability of analysis.capabilities) {
    addEdge(MISSION_NODE_ID, `capability-${capability.id}`, "needs");
  }

  // nothing should float
  const highestCapability = [...analysis.capabilities].sort(
    (a, b) =>
      (b.importance === "high" ? 2 : b.importance === "medium" ? 1 : 0) -
      (a.importance === "high" ? 2 : a.importance === "medium" ? 1 : 0),
  )[0];

  for (const { member } of matched) {
    const id = `person-${member.id}`;
    if (!hasIncoming(id)) {
      const parent = highestCapability ? `capability-${highestCapability.id}` : MISSION_NODE_ID;
      addEdge(parent, id, "could cover");
    }
  }

  analysis.nextSteps.forEach((step, index) => {
    const id = `step-${step.id}`;
    if (!hasIncoming(id)) {
      const person = matched[index % Math.max(matched.length, 1)];
      const parent = person
        ? `person-${person.member.id}`
        : highestCapability
          ? `capability-${highestCapability.id}`
          : MISSION_NODE_ID;
      addEdge(parent, id, "leads to");
    }
  });

  const relatedRolesFor = (capabilityName: string) =>
    analysis.roles
      .filter((role) => role.covers.some((name) => lookupKey(name) === lookupKey(capabilityName)))
      .map((role) => role.name);

  const stepFor = (nodeId: string) => {
    const edge = edges.find((item) => item.source === nodeId && item.target.startsWith("step-"));
    if (!edge) return "";
    const step = analysis.nextSteps.find((item) => `step-${item.id}` === edge.target);
    return step ? stripRich(step.title) : "";
  };

  details[MISSION_NODE_ID] = {
    id: MISSION_NODE_ID,
    kind: "mission",
    title: analysis.mission.title,
    badge: "Mission",
    description: analysis.mission.problem || analysis.mission.summary,
    why: analysis.mission.summary,
    relatedCapabilities: analysis.capabilities.map((capability) => capability.name),
    relatedRoles: [],
    suggestedStep: analysis.nextSteps[0] ? stripRich(analysis.nextSteps[0].title) : "",
  };

  for (const capability of analysis.capabilities) {
    const id = `capability-${capability.id}`;
    details[id] = {
      id,
      kind: "capability",
      title: capability.name,
      badge: `${IMPORTANCE_LABEL[capability.importance]} importance`,
      description: capability.description,
      why: capability.why,
      relatedCapabilities: [],
      relatedRoles: relatedRolesFor(capability.name),
      suggestedStep: stepFor(id),
    };
  }

  for (const { match, member } of matched) {
    const id = `person-${member.id}`;
    details[id] = {
      id,
      kind: "person",
      title: member.name,
      badge: match.fit === "strong" ? "Strong fit" : "Possible fit",
      description: member.headline,
      why: match.why,
      relatedCapabilities: [match.capability],
      relatedRoles: member.skills.slice(0, 4),
      suggestedStep: member.posts[0] ? `Recent post: ${member.posts[0].title}` : "",
    };
  }

  analysis.nextSteps.forEach((step, index) => {
    const id = `step-${step.id}`;
    details[id] = {
      id,
      kind: "step",
      title: stripRich(step.title),
      badge: `Step ${index + 1}`,
      description: step.detail,
      why: step.detail,
      relatedCapabilities: [],
      relatedRoles: [],
      suggestedStep: "",
    };
  });

  return { nodes, edges, details };
}
