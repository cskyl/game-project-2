import type { GameState } from "./types";

const DEFAULT_SEED = 0x6d2b79f5;
const UINT32_RANGE = 0x1_0000_0000;

/** FNV-1a gives human-entered seed strings a stable unsigned 32-bit value. */
function hashSeed(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Normalize number or text input without consulting clocks or ambient entropy. */
export function normalizeSeed(seed?: number | string): number {
  if (typeof seed === "number" && Number.isFinite(seed)) return seed >>> 0;
  if (typeof seed === "string") {
    const trimmed = seed.trim();
    if (trimmed.length > 0) {
      const numeric = Number(trimmed);
      return Number.isFinite(numeric) ? numeric >>> 0 : hashSeed(trimmed);
    }
  }
  return DEFAULT_SEED;
}

function normalizeCursor(cursor: unknown): number {
  if (typeof cursor !== "number" || !Number.isFinite(cursor) || cursor < 0) return 0;
  return Math.floor(cursor) % UINT32_RANGE;
}

/** Pure/state-threaded mulberry32 stream. The cursor is the only advanced field. */
export function nextRandom(state: GameState): [number, GameState] {
  const seed = normalizeSeed(state.rngSeed);
  const cursor = (normalizeCursor(state.rngCursor) + 1) % UINT32_RANGE;
  let value = (seed + Math.imul(cursor, 0x6d2b79f5)) >>> 0;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  const random = ((value ^ (value >>> 14)) >>> 0) / UINT32_RANGE;
  return [random, { ...state, rngSeed: seed, rngCursor: cursor }];
}

export function chance(state: GameState, probability: number): [boolean, GameState] {
  const [value, next] = nextRandom(state);
  return [value < Math.max(0, Math.min(1, probability)), next];
}

export function randomInt(
  state: GameState,
  min: number,
  max: number,
): [number, GameState] {
  const low = Math.ceil(Math.min(min, max));
  const high = Math.floor(Math.max(min, max));
  const [value, next] = nextRandom(state);
  return [low + Math.floor(value * (high - low + 1)), next];
}

export function weightedPickState<T>(
  state: GameState,
  items: readonly T[],
  weight: (item: T) => number,
): [T | undefined, GameState] {
  if (items.length === 0) return [undefined, state];
  const weights = items.map((item) => Math.max(0, weight(item)));
  const total = weights.reduce((sum, itemWeight) => sum + itemWeight, 0);
  const [value, next] = nextRandom(state);
  if (total <= 0) {
    return [items[Math.min(items.length - 1, Math.floor(value * items.length))], next];
  }
  let roll = value * total;
  for (let index = 0; index < items.length; index += 1) {
    roll -= weights[index];
    if (roll < 0) return [items[index], next];
  }
  return [items[items.length - 1], next];
}
