import { addEffects, scaleEffects } from "../balance";
import { collectHooks } from "../modifiers";
import { applySoftCaps } from "./progression";
import type {
  GameState,
  LocalizedText,
  LogEntry,
  StatBlock,
} from "../types";

const RUN_EPOCH_MS = Date.UTC(2020, 0, 1);

/**
 * Every run starts at the same deterministic epoch. Transition ticks, rather
 * than the seed or wall time, advance serialized gameplay metadata.
 */
export function initialRunTimestamp(): string {
  return new Date(RUN_EPOCH_MS).toISOString();
}

function transitionTimestamp(state: GameState, counter: number): string {
  const parsed = Date.parse(state.createdAt);
  const base = Number.isFinite(parsed) ? parsed : RUN_EPOCH_MS;
  return new Date(base + counter).toISOString();
}

/** Apply a state patch and advance the deterministic transition clock once. */
export function transitionState(
  state: GameState,
  patch: Partial<GameState>,
): GameState {
  const transitionCounter = state.transitionCounter + 1;
  return {
    ...state,
    ...patch,
    transitionCounter,
    updatedAt: transitionTimestamp(state, transitionCounter),
  };
}

export type ApplyEffectsOptions = {
  scale?: boolean;
  log?: boolean;
  kind?: LogEntry["kind"];
  text?: LocalizedText;
};

/** Shared effect pipeline for actions, cards, events, bosses, and systems. */
export function applyEffects(
  state: GameState,
  effects: StatBlock,
  opts: ApplyEffectsOptions = {},
): GameState {
  const { scale = true, log = true, kind = "system", text } = opts;
  const scaledEffects = scale
    ? scaleEffects(effects, state.difficulty)
    : effects;
  const { effects: finalEffects, carry: softCapCarry } = applySoftCaps(
    state.stats,
    scaledEffects,
    collectHooks(state),
    state.softCapCarry,
  );
  const stats = addEffects(state.stats, finalEffects);
  const weekGains = { ...state.weekGains };
  for (const [rawKey, after] of Object.entries(stats)) {
    const stat = rawKey as keyof typeof stats;
    const actualGain = after - state.stats[stat];
    if (actualGain > 0) {
      weekGains[stat] = (weekGains[stat] ?? 0) + actualGain;
    }
  }
  const transitionCounter = state.transitionCounter + 1;
  let logEntries = state.log;

  if (log && text && Object.keys(finalEffects).length > 0) {
    const entry: LogEntry = {
      id: `log_${state.rngSeed.toString(36)}_${transitionCounter.toString(36)}`,
      semesterId: state.semesterIndex + 1,
      weekInSemester: state.weekInSemester,
      text,
      effects: finalEffects,
      kind,
    };
    logEntries = [...state.log, entry].slice(-40);
  }

  return transitionState(state, {
    stats,
    weekGains,
    softCapCarry,
    log: logEntries,
  });
}
