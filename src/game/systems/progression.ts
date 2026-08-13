import { DIFFICULTY } from "../constants";
import {
  getSoftCapBandShift,
  sumHookAdds,
  type ModifierHook,
} from "../modifiers";
import type { Difficulty, Stage, StatBlock, StatKey } from "../types";

/** Stats whose positive gains diminish as the current value rises. */
export const SOFT_CAPPED_STATS: readonly StatKey[] = [
  "knowledge",
  "handSkill",
  "clinicalSense",
  "empathy",
  "confidence",
  "reputation",
  "research",
  "publicImpact",
  "standing",
];

/** Core skills that decay when they receive no actual positive gain in a week. */
export const DRIFT_STATS: readonly StatKey[] = [
  "knowledge",
  "handSkill",
  "clinicalSense",
];

const SOFT_CAPPED_SET = new Set<StatKey>(SOFT_CAPPED_STATS);
const DRIFT_FLOOR = 40;

/** Exact §4.2 multiplier for an effective current skill value. */
export function softCapMultiplier(current: number): number {
  if (current < 55) return 1;
  if (current < 70) return 0.75;
  if (current < 80) return 0.5;
  if (current < 90) return 0.3;
  return 0.15;
}

/**
 * Apply §4.2 after difficulty scaling. A positive softCapBand shift moves the
 * thresholds upward (equivalently, lowers the value used to select a band).
 */
export function applySoftCaps(
  stats: Record<StatKey, number>,
  effects: StatBlock,
  hooks: readonly ModifierHook[],
): StatBlock {
  const capped: StatBlock = {};
  for (const [rawKey, rawDelta] of Object.entries(effects)) {
    const stat = rawKey as StatKey;
    const delta = rawDelta ?? 0;
    if (delta <= 0 || !SOFT_CAPPED_SET.has(stat)) {
      capped[stat] = delta;
      continue;
    }
    const shiftedCurrent = stats[stat] - getSoftCapBandShift(hooks, stat);
    capped[stat] = Math.max(
      1,
      Math.floor(delta * softCapMultiplier(shiftedCurrent)),
    );
  }
  return capped;
}

/** Compute §4.3 drift without mutating state. */
export function skillDriftEffects(
  stage: Stage,
  stats: Record<StatKey, number>,
  weekGains: StatBlock,
): StatBlock {
  const loss = stage === "clinical" || stage === "advanced" ? 2 : 1;
  const effects: StatBlock = {};
  for (const stat of DRIFT_STATS) {
    if ((weekGains[stat] ?? 0) > 0 || stats[stat] <= DRIFT_FLOOR) continue;
    effects[stat] = -Math.min(loss, stats[stat] - DRIFT_FLOOR);
  }
  return effects;
}

export type ActionPointBreakdown = {
  base: number;
  semesterMilestones: number;
  lowStamina: number;
  modifiers: number;
  total: number;
};

/** Exact §4.4 AP curve, exposed so UI and tests can display the real math. */
export function actionPointBreakdown(
  difficulty: Difficulty,
  semesterId: number,
  stamina: number,
  hooks: readonly ModifierHook[],
): ActionPointBreakdown {
  const base = DIFFICULTY[difficulty].actionPoints;
  const semesterMilestones =
    (semesterId >= 4 ? 1 : 0) + (semesterId >= 8 ? 1 : 0);
  const lowStamina = stamina < 20 ? -1 : 0;
  const modifiers = sumHookAdds(hooks, "apPerWeek");
  return {
    base,
    semesterMilestones,
    lowStamina,
    modifiers,
    total: base + semesterMilestones + lowStamina + modifiers,
  };
}

/** Modest, deterministic late-semester difficulty ramp for boss breakdowns. */
export function bossSemesterRamp(semesterId: number): number {
  return -Math.min(8, Math.max(0, semesterId - 1) * 0.75);
}
