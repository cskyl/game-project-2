import type { Difficulty, StatKey } from "./types";

export const SAVE_VERSION = "2.0.0";
export const SAVE_KEY = "dsls.save.v2";
export const LEGACY_SAVE_KEY = "dsls.save.v1";
export const LANG_KEY = "dsls.lang";
export const ACHIEVEMENTS_KEY = "dsls.achievements.v1";

/** V2 has five planning weeks in each of its twelve semesters. */
export const WEEKS_PER_SEMESTER = 5;
export const SEMESTER_COUNT = 12;
export const BREAK_AFTER_SEMESTERS = [2, 5, 8] as const;
export const BREAK_ACTIONS_PER_CHAPTER = 3;
export const CARDS_DRAWN_PER_WEEK = 3;
export const MAX_CARDS_PLAYED_PER_WEEK = 2;
/** How many weeks must pass before a non-crisis event can repeat. */
export const EVENT_RECENCY_WINDOW = 5;

// --- Weekly mini-games (§5.2, §5.3) ----------------------------------------
// At most one fires per week and it replaces that week's random event, so the
// clinic never competes with life for the same slot.

/** Chance a patient case walks in during a clinical week. */
export const CASE_CHANCE = 0.55;
/** Chance a sim-lab practical is scheduled during a preclinical week. */
export const SIM_LAB_CHANCE = 0.5;
/** Spending action points on clinic work guarantees a case that week. */
export const CLINIC_ACTION_TAG = "clinic";
/** How many recent cases/exercises are excluded from the next draw. */
export const CASE_RECENCY_WINDOW = 6;
export const SIM_LAB_RECENCY_WINDOW = 4;

export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const MONEY_MIN = -50;
export const MONEY_MAX = 200;

export const ALL_STATS: StatKey[] = [
  "knowledge",
  "handSkill",
  "clinicalSense",
  "empathy",
  "stamina",
  "confidence",
  "reputation",
  "mood",
  "stress",
  "love",
  "research",
  "publicImpact",
  "focus",
  "standing",
  "money",
];

export type DifficultyConfig = {
  actionPoints: number;
  /** Multiplier applied to beneficial stat deltas. */
  positiveMultiplier: number;
  /** Multiplier applied to harmful stat deltas. */
  negativeMultiplier: number;
  /** Stress value at/above which the "critical" band begins. */
  stressCritical: number;
  /** Inclusive [min, max] range for the boss random roll. */
  bossRoll: [number, number];
};

export const DIFFICULTY: Record<Difficulty, DifficultyConfig> = {
  easy: {
    actionPoints: 7,
    positiveMultiplier: 1.1,
    negativeMultiplier: 0.85,
    stressCritical: 95,
    bossRoll: [-8, 8],
  },
  normal: {
    actionPoints: 6,
    positiveMultiplier: 1.0,
    negativeMultiplier: 1.0,
    stressCritical: 90,
    bossRoll: [-8, 8],
  },
  hard: {
    actionPoints: 5,
    positiveMultiplier: 1.0,
    negativeMultiplier: 1.15,
    stressCritical: 85,
    bossRoll: [-12, 8],
  },
};
