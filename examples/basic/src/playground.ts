import { useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Knobs {
  src: string;
  aspectRatio: string;
  initialCoverage: number;
  background: boolean;
  rotatable: boolean;
  scalable: boolean;
  skewable: boolean;
  translatable: boolean;
  movable: boolean;
  resizable: boolean;
  zoomable: boolean;
  multiple: boolean;
  outlined: boolean;
  grid: boolean;
}

export interface LogEntry {
  id: number;
  ts: string;
  type: string;
  payload: unknown;
}

export interface PlaygroundState {
  knobs: Knobs;
  setKnob: (k: Partial<Knobs>) => void;
  events: LogEntry[];
  log: (type: string, payload: unknown) => void;
  clearEvents: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const DEFAULT_KNOBS: Knobs = {
  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  aspectRatio: 'free',
  initialCoverage: 0.8,
  background: true,
  rotatable: true,
  scalable: true,
  skewable: false,
  translatable: true,
  movable: true,
  resizable: true,
  zoomable: true,
  multiple: false,
  outlined: true,
  grid: true,
};

export const ASPECT_RATIOS: Record<string, number | undefined> = {
  free: undefined,
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
  '3:2': 3 / 2,
  '9:16': 9 / 16,
};

export const EVENT_COLOR: Record<string, string> = {
  ready: '#22c55e',
  change: '#3b82f6',
  cropstart: '#f59e0b',
  cropmove: '#8b5cf6',
  cropend: '#ef4444',
  transform: '#ec4899',
  action: '#64748b',
};

// ─── Utilities ────────────────────────────────────────────────────────────────

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

function timestamp(): string {
  const d = new Date();
  return (
    [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map((n) => String(n).padStart(2, '0'))
      .join(':') +
    '.' +
    String(d.getMilliseconds()).padStart(3, '0')
  );
}

let _id = 0;
export function mkEntry(type: string, payload: unknown): LogEntry {
  return { id: ++_id, ts: timestamp(), type, payload };
}

// ─── usePlayground ────────────────────────────────────────────────────────────

export function usePlayground(): PlaygroundState {
  const [knobs, setKnobs] = useState<Knobs>(DEFAULT_KNOBS);
  const [events, setEvents] = useState<LogEntry[]>([]);

  const setKnob = useCallback((k: Partial<Knobs>) => setKnobs((p) => ({ ...p, ...k })), []);
  const log = useCallback((type: string, payload: unknown) => {
    setEvents((p) => [...p.slice(-99), mkEntry(type, payload)]);
  }, []);
  const clearEvents = useCallback(() => setEvents([]), []);

  return { knobs, setKnob, events, log, clearEvents };
}
