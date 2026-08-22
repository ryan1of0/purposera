import type { MissionAnalysis } from "./types";

const STORAGE_KEY = "purposera:mission";

let inMemory: MissionAnalysis | null = null;

function notify(): void {
  for (const listener of listeners) listener();
}

export function saveAnalysis(analysis: MissionAnalysis): void {
  inMemory = analysis;
  notify();
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(analysis));
  } catch {
    // Private browsing or storage disabled: the in-memory copy still works.
  }
}

export function loadAnalysis(): MissionAnalysis | null {
  if (inMemory) return inMemory;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MissionAnalysis;
    if (!parsed?.mission?.title || !Array.isArray(parsed.capabilities)) return null;
    inMemory = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function clearAnalysis(): void {
  inMemory = null;
  notify();
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up.
  }
}

const listeners = new Set<() => void>();

export function subscribeAnalysis(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAnalysisSnapshot(): MissionAnalysis | null {
  return loadAnalysis();
}

// undefined = not hydrated yet, so the page can hold a neutral frame
export function getServerAnalysisSnapshot(): undefined {
  return undefined;
}
