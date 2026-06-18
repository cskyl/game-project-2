import type { GameEvent } from "../game/types";
import { SEED_EVENTS } from "./events.seed";
import { GENERATED_EVENTS } from "./events.generated";

// All events: hand-tuned seeds + the generated bilingual library.
// Seeds win on id collisions (a couple of generated events share a seed theme).
// Add more by appending to events.seed.ts or by editing content-gen/*.json and
// re-running `node content-gen/merge.mjs`.
const seedIds = new Set(SEED_EVENTS.map((e) => e.id));
export const EVENTS: GameEvent[] = [
  ...SEED_EVENTS,
  ...GENERATED_EVENTS.filter((e) => !seedIds.has(e.id)),
];

export const EVENTS_BY_ID: Record<string, GameEvent> = Object.fromEntries(
  EVENTS.map((e) => [e.id, e]),
);
