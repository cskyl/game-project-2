import { BOSSES } from "../../data/bosses";
import { ENDINGS } from "../../data/endings";
import { evaluateCondition, getStat, wellness } from "../balance";
import { DIFFICULTY } from "../constants";
import { collectHooks, sumHookAdds } from "../modifiers";
import { randomInt } from "../rng";
import { checkAchievements, checkEndingAchievements, unlockAchievement } from "./achievements";
import { openBreakChapter } from "./breaks";
import {
  currentSemesterId,
  isBreakSemester,
  isFinalSemester,
  openSemester,
} from "./calendar";
import { bossSemesterRamp } from "./progression";
import { applyEffects, transitionState } from "./state";
import type { Boss, BossOutcomeKey, Ending, GameState } from "../types";

const BOSS_BY_ID: Record<string, Boss> = Object.fromEntries(
  BOSSES.map((b) => [b.id, b]),
);
export const BOSS_BY_SEMESTER: Record<number, Boss> = Object.fromEntries(
  BOSSES.map((b) => [b.semesterId, b]),
);

export type BossBreakdown = {
  weighted: number;
  wellnessMod: number;
  stressMod: number;
  staminaBonus: number;
  semesterRamp: number;
  base: number;
};

/** Every term of the check, kept separate so the UI can show the real math. */
export function bossBreakdown(boss: Boss, state: GameState): BossBreakdown {
  const s = state.stats;
  let weighted = 0;
  for (const r of boss.requiredStats) weighted += getStat(s, r.stat) * r.weight;
  const wellnessMod = (wellness(s) - 50) * 0.2;
  const stressMod = s.stress >= 30 && s.stress <= 70 ? 5 : s.stress > 85 ? -8 : 0;
  const staminaBonus = s.stamina > 75 ? 5 : 0;
  const semesterRamp = bossSemesterRamp(boss.semesterId);
  const base = weighted + wellnessMod + stressMod + staminaBonus + semesterRamp;
  return { weighted, wellnessMod, stressMod, staminaBonus, semesterRamp, base };
}

/** Deterministic 0–100 readiness preview (no random roll). */
export function bossReadiness(boss: Boss, state: GameState): number {
  return Math.max(0, Math.min(100, Math.round(bossBreakdown(boss, state).base)));
}

function scoreToOutcome(score: number): BossOutcomeKey {
  if (score >= 75) return "great";
  if (score >= 55) return "pass";
  if (score >= 40) return "barely";
  return "struggle";
}

export function resolveBoss(state: GameState): GameState {
  const boss =
    (state.pendingBossId && BOSS_BY_ID[state.pendingBossId]) ||
    BOSS_BY_SEMESTER[currentSemesterId(state)];
  if (!boss) return state;
  const cfg = DIFFICULTY[state.difficulty];
  const base = bossBreakdown(boss, state).base;
  const [roll, randomState] = randomInt(state, cfg.bossRoll[0], cfg.bossRoll[1]);
  const modifier = sumHookAdds(collectHooks(state), "bossRoll");
  const score = Math.max(0, Math.min(100, Math.round(base + roll + modifier)));
  const outcome = scoreToOutcome(score);
  const out = boss.outcomes[outcome];

  let next = applyEffects(randomState, out.effects, {
    scale: true,
    log: true,
    kind: "boss",
    text: boss.title,
  });
  const result = { bossId: boss.id, semesterId: boss.semesterId, score, outcome };
  next = transitionState(next, {
    bossHistory: [...next.bossHistory, result],
    lastBossResult: result,
    pendingBossId: boss.id,
  });
  if (outcome === "great") next = unlockAchievement(next, "first_boss_great");
  return checkAchievements(next);
}

export function advanceAfterBoss(state: GameState): GameState {
  if (isFinalSemester(state)) {
    const ending = determineEnding(state);
    const next: GameState = transitionState(state, {
      endingId: ending.id,
      screen: "ending",
      pendingBossId: undefined,
      lastBossResult: undefined,
    });
    return checkEndingAchievements(next);
  }
  const next = transitionState(state, {
    pendingBossId: undefined,
    lastBossResult: undefined,
  });
  const completedSemester = state.semesterIndex + 1;
  if (isBreakSemester(completedSemester)) return openBreakChapter(next);
  return openSemester(next, state.semesterIndex + 1);
}

/**
 * The highest-priority ending whose condition matches. Priority order is the
 * design's specific-beats-generic rule, so the generic graduation ending is the
 * fallback of last resort rather than the winner.
 */
export function determineEnding(state: GameState): Ending {
  const semId = currentSemesterId(state);
  const matches = ENDINGS.filter((e) =>
    evaluateCondition(state.stats, state.flags, semId, e.condition),
  ).sort((a, b) => b.priority - a.priority);
  return matches[0] ?? ENDINGS[ENDINGS.length - 1];
}
