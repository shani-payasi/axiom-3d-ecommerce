import { useEffect, useState } from "react";

/**
 * Global WebGL slot scheduler.
 *
 * Browsers allow only ~16 live WebGL contexts per page, and every context costs
 * real GPU memory. A page like the shop grid can otherwise try to create dozens
 * of canvases at once, which makes every one of them go blank (or kills the
 * whole page). This registry hands out a bounded number of "live" slots and
 * gives priority to whatever the user is actually looking at or hovering.
 */
type Entry = { id: number; priority: number; since: number };

const MAX_DEFAULT = 12;
const MAX_COMPACT = 6;

let seq = 0;
const live = new Map<number, Entry>();
const listeners = new Set<() => void>();
let compact = false;

export function setCanvasCompact(v: boolean) {
  compact = v;
  release();
}

export const maxLiveCanvases = () => (compact ? MAX_COMPACT : MAX_DEFAULT);

function emit() {
  listeners.forEach((l) => l());
}

/** Re-evaluates who owns a slot and notifies the losers. */
export function release() {
  const entries = [...live.values()];
  const max = maxLiveCanvases();
  // Highest priority (lowest number) wins; ties resolved by recency.
  entries.sort((a, b) => a.priority - b.priority || a.since - b.since);
  let changed = false;
  entries.forEach((e, i) => {
    const shouldLive = i < max;
    const key = live.get(e.id);
    if (key && key.priority !== e.priority) changed = true;
    if (shouldLive && !active.has(e.id)) {
      active.add(e.id);
      changed = true;
    } else if (!shouldLive && active.has(e.id)) {
      active.delete(e.id);
      changed = true;
    }
  });
  if (changed) emit();
}

const active = new Set<number>();

export function useCanvasSlot(priority: number, enabled = true) {
  const [id] = useState(() => ++seq);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!enabled) {
      live.delete(id);
      active.delete(id);
      release();
      return;
    }
    live.set(id, { id, priority, since: Date.now() });
    release();
    const sync = () => setIsLive(active.has(id));
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
      live.delete(id);
      active.delete(id);
      release();
    };
  }, [id, priority, enabled]);

  // Hovering (priority 0) should immediately claim a slot.
  useEffect(() => {
    if (!enabled || priority > 0) return;
    const entry = live.get(id);
    if (entry && entry.priority !== priority) {
      entry.priority = priority;
      release();
    }
  }, [id, priority, enabled]);

  return isLive;
}

/** Lets a scene raise its priority while hovered / active. */
export function boostCanvas(id: number) {
  const e = live.get(id);
  if (!e) return;
  e.priority = 0;
  e.since = Date.now();
  release();
}
