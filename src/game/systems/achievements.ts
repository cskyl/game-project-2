import { careerReadiness } from "../balance";
import type { GameState } from "../types";

// Achievements are additive, idempotent, and deliberately outside the
// transition clock: unlocking one is a record of what already happened, not a
// game step, so it must not perturb deterministic ids or timestamps.

export function unlockAchievement(state: GameState, id: string): GameState {
  if (state.unlockedAchievements.includes(id)) return state;
  return { ...state, unlockedAchievements: [...state.unlockedAchievements, id] };
}

/** Re-checked after every effect application; safe to call as often as needed. */
export function checkAchievements(state: GameState): GameState {
  let next = state;
  const s = state.stats;
  if (s.empathy >= 80) next = unlockAchievement(next, "patient_trust");
  if (s.handSkill >= 80) next = unlockAchievement(next, "steady_hands");
  if (s.love >= 80) next = unlockAchievement(next, "well_supported");
  if (s.publicImpact >= 80) next = unlockAchievement(next, "community_heart");
  if (state.flags.includes("hit_critical_stress") && s.stress < 50) {
    next = unlockAchievement(next, "stress_survivor");
  }
  return next;
}

/** Graduation-only awards, which need the whole run rather than one step. */
export function checkEndingAchievements(state: GameState): GameState {
  let next = checkAchievements(state);
  const s = state.stats;
  if (s.mood > 60 && s.stamina > 60 && careerReadiness(s) > 60) {
    next = unlockAchievement(next, "balanced_life");
  }
  return next;
}
