import {
  ALL_STATS,
  DIFFICULTY,
  MONEY_MAX,
  MONEY_MIN,
  STAT_MAX,
  STAT_MIN,
} from "./constants";
import type {
  ConditionStatKey,
  Difficulty,
  EventCondition,
  LocalizedText,
  StatBlock,
  StatKey,
} from "./types";

// ---------------------------------------------------------------------------
// Stats: clamping, derived values, condition resolution
// ---------------------------------------------------------------------------

export function clampStats(
  stats: Record<StatKey, number>,
): Record<StatKey, number> {
  const out = { ...stats };
  for (const key of ALL_STATS) {
    if (key === "money") {
      out.money = Math.max(MONEY_MIN, Math.min(MONEY_MAX, Math.round(out.money)));
    } else {
      out[key] = Math.max(STAT_MIN, Math.min(STAT_MAX, Math.round(out[key])));
    }
  }
  return out;
}

export const wellness = (s: Record<StatKey, number>): number =>
  Math.round((s.mood + s.stamina + (100 - s.stress)) / 3);

export const careerReadiness = (s: Record<StatKey, number>): number =>
  Math.round(
    (s.knowledge + s.handSkill + s.clinicalSense + s.empathy + s.confidence) / 5,
  );

export const lifeBalance = (s: Record<StatKey, number>): number =>
  Math.round((s.mood + s.love + s.stamina + (100 - s.stress)) / 4);

/** Resolve a stat or derived value for conditions and boss checks. */
export function getStat(
  stats: Record<StatKey, number>,
  key: ConditionStatKey,
): number {
  switch (key) {
    case "wellness":
      return wellness(stats);
    case "careerReadiness":
      return careerReadiness(stats);
    case "lifeBalance":
      return lifeBalance(stats);
    case "researchOutput":
      return stats.research;
    case "clinicalRecord":
      return Math.round((stats.handSkill + stats.clinicalSense + stats.empathy) / 3);
    default:
      return stats[key];
  }
}

export function evaluateCondition(
  stats: Record<StatKey, number>,
  flags: string[],
  semesterId: number,
  cond?: EventCondition,
): boolean {
  if (!cond) return true;
  if (cond.minStats) {
    for (const [k, v] of Object.entries(cond.minStats)) {
      if (getStat(stats, k as ConditionStatKey) < (v as number)) return false;
    }
  }
  if (cond.maxStats) {
    for (const [k, v] of Object.entries(cond.maxStats)) {
      if (getStat(stats, k as ConditionStatKey) > (v as number)) return false;
    }
  }
  if (cond.requiredFlags && !cond.requiredFlags.every((f) => flags.includes(f))) {
    return false;
  }
  if (cond.forbiddenFlags && cond.forbiddenFlags.some((f) => flags.includes(f))) {
    return false;
  }
  if (cond.minSemester !== undefined && semesterId < cond.minSemester) return false;
  if (cond.maxSemester !== undefined && semesterId > cond.maxSemester) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Difficulty-scaled effects
// ---------------------------------------------------------------------------

/** A delta is "beneficial" if it moves a stat in the helpful direction. */
function isBeneficial(stat: StatKey, delta: number): boolean {
  if (stat === "stress") return delta < 0;
  return delta > 0;
}

/** Apply difficulty multipliers to a raw effect block, returning rounded deltas. */
export function scaleEffects(effects: StatBlock, difficulty: Difficulty): StatBlock {
  const cfg = DIFFICULTY[difficulty];
  const out: StatBlock = {};
  for (const [k, raw] of Object.entries(effects)) {
    const stat = k as StatKey;
    const delta = raw as number;
    if (!delta) continue;
    const mult = isBeneficial(stat, delta)
      ? cfg.positiveMultiplier
      : cfg.negativeMultiplier;
    out[stat] = Math.round(delta * mult);
  }
  return out;
}

export function addEffects(
  stats: Record<StatKey, number>,
  effects: StatBlock,
): Record<StatKey, number> {
  const out = { ...stats };
  for (const [k, v] of Object.entries(effects)) {
    out[k as StatKey] = out[k as StatKey] + (v as number);
  }
  return clampStats(out);
}

/** Net difference between two stat blocks (for summaries / logs). */
export function diffStats(
  before: Record<StatKey, number>,
  after: Record<StatKey, number>,
): StatBlock {
  const out: StatBlock = {};
  for (const key of ALL_STATS) {
    const d = after[key] - before[key];
    if (d !== 0) out[key] = d;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Weekly threshold effects
// ---------------------------------------------------------------------------

export const WARNING_MESSAGES: Record<string, LocalizedText> = {
  criticalStress: {
    en: "Critical stress. Your body is sending invoices. Please rest.",
    zh: "压力临界。身体开始给你发账单了。请休息。",
  },
  highStress: {
    en: "High stress this week. A break would not be a waste.",
    zh: "这周压力偏高。休息一下不算浪费。",
  },
  lowMood: {
    en: "Low mood. Studying is less effective when you feel like this.",
    zh: "心情低落。这种状态下学习效率会打折。",
  },
  burnout: {
    en: "Burnout risk. This is your signal to be gentle with yourself.",
    zh: "倦怠风险。这是在提醒你:对自己温柔一点。",
  },
  lowStamina: {
    en: "Running on empty. Lab and clinic work hits harder when you are this tired.",
    zh: "快空了。这么累的时候,实验和临床都会更吃力。",
  },
  negativeMoney: {
    en: "Budget in the red. Money stress is real stress.",
    zh: "预算赤字了。钱的压力也是真的压力。",
  },
  goodMood: {
    en: "Good headspace this week. Things feel a little lighter.",
    zh: "这周状态不错,一切都轻盈了一点。",
  },
};

export type ThresholdResult = {
  effects: StatBlock;
  warnings: string[];
  /** Seeded crisis roll probability; zero outside the critical-stress band. */
  crisisChance: number;
  hitCriticalStress: boolean;
};

/**
 * Compute the automatic weekly threshold effects from the post-action stats.
 * Threshold effects are applied RAW (not difficulty-scaled) since the bands
 * themselves already shift with difficulty (stressCritical).
 */
export function computeThresholds(
  stats: Record<StatKey, number>,
  difficulty: Difficulty,
): ThresholdResult {
  const effects: StatBlock = {};
  const warnings: string[] = [];
  let crisisChance = 0;
  let hitCriticalStress = false;
  const cfg = DIFFICULTY[difficulty];

  const add = (k: StatKey, v: number) => {
    effects[k] = (effects[k] ?? 0) + v;
  };

  // Stress band
  if (stats.stress >= cfg.stressCritical) {
    add("mood", -8);
    add("stamina", -5);
    warnings.push("criticalStress");
    hitCriticalStress = true;
    crisisChance = 0.35;
  } else if (stats.stress >= 70) {
    add("mood", -3);
    add("confidence", -1);
    warnings.push("highStress");
  }

  // Mood band
  if (stats.mood >= 70) {
    add("confidence", 1);
    warnings.push("goodMood");
  } else if (stats.mood < 20) {
    warnings.push("burnout");
  } else if (stats.mood < 40) {
    warnings.push("lowMood");
  }

  // Stamina band
  if (stats.stamina < 25) {
    add("stress", 3);
    warnings.push("lowStamina");
  }

  // Money
  if (stats.money < 0) {
    add("stress", 2);
    warnings.push("negativeMoney");
  }

  return { effects, warnings, crisisChance, hitCriticalStress };
}
