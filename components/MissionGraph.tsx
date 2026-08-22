"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
  useReactFlow,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { buildGraph, type GraphNodeData, type MissionNode } from "@/lib/graph";
import type { MissionAnalysis } from "@/lib/types";
import { Icon } from "./Icon";
import { NodeDetailPanel } from "./NodeDetailPanel";

const SelectionContext = createContext<{
  selectedId: string | null;
  select: (id: string) => void;
}>({ selectedId: null, select: () => {} });

const KIND_STYLES: Record<GraphNodeData["kind"], string> = {
  mission: "border-ink bg-ink text-paper",
  capability: "border-accent-line bg-surface text-ink",
  person: "border-accent-line bg-surface text-ink",
  step: "border-accent-line bg-accent-soft text-ink",
};

const KIND_ICON_STYLES: Record<GraphNodeData["kind"], string> = {
  mission: "text-paper/70",
  capability: "text-accent",
  person: "text-accent",
  step: "text-accent",
};

function MissionNodeView({ id, data }: NodeProps<MissionNode>) {
  const { selectedId, select } = useContext(SelectionContext);
  const isSelected = selectedId === id;
  const isDimmed = selectedId !== null && !isSelected;

  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          select(id);
        }}
        aria-pressed={isSelected}
        className={`w-[196px] rounded-2xl border px-3 py-2.5 text-left transition-all duration-200 ${
          KIND_STYLES[data.kind]
        } ${isSelected ? "shadow-[var(--shadow-lift)] ring-2 ring-accent ring-offset-2 ring-offset-paper" : "shadow-[var(--shadow-soft)]"} ${
          isDimmed ? "opacity-55" : "opacity-100"
        }`}
      >
        <span className="flex items-center gap-2">
          {data.icon ? (
            <Icon name={data.icon} className={`h-4 w-4 shrink-0 ${KIND_ICON_STYLES[data.kind]}`} />
          ) : null}
          <span
            className={`font-mono text-[10px] tracking-[0.1em] uppercase ${
              data.kind === "mission" ? "text-paper/70" : "text-faint"
            }`}
          >
            {data.meta}
          </span>
        </span>

        <span className="mt-1.5 block text-small leading-snug font-medium">{data.label}</span>

        {data.badge && data.kind !== "mission" ? (
          <span className="mt-2 inline-block rounded-full border border-line bg-paper px-2 py-0.5 text-[10px] font-medium text-muted">
            {data.badge}
          </span>
        ) : null}
      </button>
      <Handle type="source" position={Position.Right} isConnectable={false} />
    </>
  );
}

const nodeTypes = { mission: MissionNodeView };

// fitView only fires on init, so the graph ends up mis-framed if the container
// was a different size when it first measured.
function FitOnResize({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      // Wait a frame so the new size has settled before measuring.
      frame = requestAnimationFrame(() => void fitView({ padding: 0.08, duration: 0 }));
    });

    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [containerRef, fitView]);

  return null;
}

export function MissionGraph({ analysis }: { analysis: MissionAnalysis }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const { nodes, edges, details } = useMemo(() => buildGraph(analysis), [analysis]);

  const select = useCallback((id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => {
        if (!selectedId) return { ...edge, className: "" };
        const connected = edge.source === selectedId || edge.target === selectedId;
        return { ...edge, className: connected ? "is-connected" : "is-dimmed", animated: connected };
      }),
    [edges, selectedId],
  );

  const selection = useMemo(() => ({ selectedId, select }), [selectedId, select]);

  const detail = selectedId ? (details[selectedId] ?? null) : null;

  return (
    <SelectionContext.Provider value={selection}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_min(330px,28%)]">
          <div
          ref={canvasRef}
          className="hidden h-[560px] overflow-hidden rounded-2xl border border-line bg-paper md:block lg:h-[600px]"
        >
          <ReactFlow
            nodes={nodes}
            edges={styledEdges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.08 }}
            minZoom={0.35}
            maxZoom={1.6}
            nodesDraggable={false}
            nodesConnectable={false}
            nodesFocusable={false}
            edgesFocusable={false}
            elementsSelectable={false}
            onNodeClick={(_, node) => select(node.id)}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
            onPaneClick={() => setSelectedId(null)}
            aria-label="Mission map"
          >
            <FitOnResize containerRef={canvasRef} />
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
            <Controls showInteractive={false} position="bottom-right" />
          </ReactFlow>
        </div>

        {/* small screens get a tappable list instead */}
        <div className="md:hidden">
          <SimplifiedGraph nodes={nodes} selectedId={selectedId} onSelect={select} />
        </div>

        <NodeDetailPanel detail={detail} />
      </div>
    </SelectionContext.Provider>
  );
}

const TIER_ORDER: GraphNodeData["kind"][] = ["mission", "capability", "person", "step"];
const TIER_TITLE: Record<GraphNodeData["kind"], string> = {
  mission: "Mission",
  capability: "What it needs",
  person: "In the network",
  step: "Where to start",
};

function SimplifiedGraph({
  nodes,
  selectedId,
  onSelect,
}: {
  nodes: MissionNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-line bg-paper p-4">
      {TIER_ORDER.map((kind) => {
        const tierNodes = nodes.filter((node) => node.data.kind === kind);
        if (tierNodes.length === 0) return null;

        return (
          <div key={kind}>
            <p className="eyebrow text-faint">
              {TIER_TITLE[kind]}
            </p>
            <ul className="mt-2 space-y-2">
              {tierNodes.map((node) => {
                const isSelected = selectedId === node.id;
                return (
                  <li key={node.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(node.id)}
                      aria-pressed={isSelected}
                      className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                        isSelected
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-surface"
                      }`}
                    >
                      {node.data.icon ? (
                        <Icon
                          name={node.data.icon}
                          className={`h-4 w-4 shrink-0 ${KIND_ICON_STYLES[node.data.kind]}`}
                        />
                      ) : (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-ink" />
                      )}
                      <span className="text-small leading-snug font-medium text-ink">
                        {node.data.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
