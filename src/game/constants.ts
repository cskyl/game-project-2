import type { Difficulty, StatKey } from "./types";

export const SAVE_VERSION = "1.0.0";
export const SAVE_KEY = "dsls.save.v1";
export const LANG_KEY = "dsls.lang";
export const ACHIEVEMENTS_KEY = "dsls.achievements.v1";

export const WEEKS_PER_SEMESTER = 4;
export const CARDS_DRAWN_PER_WEEK = 3;
export const MAX_CARDS_PLAYED_PER_WEEK = 2;
/** How many weeks must pass before a non-crisis event can repeat. */
export const EVENT_RECENCY_WINDOW = 5;

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
