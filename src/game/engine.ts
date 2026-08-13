import { ACTIONS } from "../data/actions";
import { BOSSES } from "../data/bosses";
import { CARDS, CARDS_BY_ID } from "../data/cards";
import { ENDINGS } from "../data/endings";
import { EVENTS_BY_ID } from "../data/events";
import { personalization } from "../data/personalization";
import { SEMESTERS } from "../data/semesters";
import {
  DIFFICULTY,
  MAX_CARDS_PLAYED_PER_WEEK,
  MONEY_MIN,
  SAVE_VERSION,
  WEEKS_PER_SEMESTER,
} from "./constants";
import { INITIAL_STATS } from "./initialState";
import {
  careerReadiness,
  computeThresholds,
  evaluateCondition,
  getStat,
  wellness,
} from "./balance";
import { chance, normalizeSeed, randomInt } from "./rng";
import {
  applyWeeklyThresholdHooks,
  collectHooks,
  sumHookAdds,
} from "./modifiers";
import { contextualActionEffects } from "./systems/actions";
import { drawWeeklyCards } from "./systems/deck";
import {
  selectCrisisEvent,
  selectWeeklyEvent,
} from "./systems/events";
import {
  applyEffects,
  initialRunTimestamp,
  transitionState,
} from "./systems/state";
import type {
  Action,
  Boss,
  BossOutcomeKey,
  Difficulty,
  Ending,
  GameState,
  LocalizedText,
  Semester,
} from "./types";

const RECOVERY_EVENT_ID = "well_recovery_week";

const WEEKLY_LABEL: LocalizedText = {
  en: "Weekly adjustments",
  zh: "每周自动调整",
};

const ACTIONS_BY_ID: Record<string, Action> = Object.fromEntries(
  ACTIONS.map((a) => [a.id, a]),
);
const BOSS_BY_ID: Record<string, Boss> = Object.fromEntries(
  BOSSES.map((b) => [b.id, b]),
);
const BOSS_BY_SEMESTER: Record<number, Boss> = Object.fromEntries(
  BOSSES.map((b) => [b.semesterId, b]),
);

export const currentSemester = (s: GameState): Semester => SEMESTERS[s.semesterIndex];
export const currentSemesterId = (s: GameState): number => s.semesterIndex + 1;
export const isFinalSemester = (s: GameState): boolean =>
  s.semesterIndex >= SEMESTERS.length - 1;

// ---------------------------------------------------------------------------
// Action availability
// ---------------------------------------------------------------------------

export function isActionUnlocked(action: Action, state: GameState): boolean {
  if (!action.unlock) return true;
  return evaluateCondition(state.stats, state.flags, currentSemesterId(state), action.unlock);
}

export type ActionStatus = {
  unlocked: boolean;
  enoughAp: boolean;
  enoughMoney: boolean;
  usable: boolean;
  unlockSemester?: number;
};

export function actionStatus(action: Action, state: GameState): ActionStatus {
  const unlocked = isActionUnlocked(action, state);
  const enoughAp = state.actionPointsRemaining >= action.cost;
  const enoughMoney =
    !action.moneyCost || state.stats.money - action.moneyCost >= MONEY_MIN;
  return {
    unlocked,
    enoughAp,
    enoughMoney,
    usable: unlocked && enoughAp && enoughMoney,
    unlockSemester: action.unlock?.minSemester,
  };
}

export function playCard(state: GameState, cardId: string): GameState {
  if (state.cardsPlayedThisWeek >= MAX_CARDS_PLAYED_PER_WEEK) return state;
  if (!state.weeklyCards.includes(cardId)) return state;
  const card = CARDS_BY_ID[cardId];
  if (!card) return state;
  let next = applyEffects(state, card.effects, {
    scale: true,
    log: true,
    kind: "card",
    text: card.title,
  });
  next = transitionState(next, {
    weeklyCards: next.weeklyCards.filter((id) => id !== cardId),
    cardsPlayedThisWeek: next.cardsPlayedThisWeek + 1,
  });
  return checkAchievements(next);
}

// ---------------------------------------------------------------------------
// Week lifecycle
// ---------------------------------------------------------------------------

function startWeek(
  state: GameState,
  opts: { semesterIndex: number; weekInSemester: number },
): GameState {
  const sem = SEMESTERS[opts.semesterIndex];
  const [cards, randomState] = drawWeeklyCards(
    state,
    opts.semesterIndex + 1,
    sem.stage,
  );
  return transitionState(randomState, {
    semesterIndex: opts.semesterIndex,
    weekInSemester: opts.weekInSemester,
    globalWeek: randomState.globalWeek + 1,
    actionPointsRemaining:
      DIFFICULTY[randomState.difficulty].actionPoints +
      sumHookAdds(collectHooks(randomState), "apPerWeek"),
    weekStartStats: { ...randomState.stats },
    weeklyCards: cards,
    cardsPlayedThisWeek: 0,
    weekWarnings: [],
    screen: "planning",
    pendingEventId: undefined,
    pendingChoiceId: undefined,
  });
}

export type NewGameOptions = { seed?: number | string };

export function newGame(
  difficulty: Difficulty,
  playerName: string,
  options: NewGameOptions = {},
): GameState {
  const name = playerName.trim() || personalization.playerDefaultName;
  const seed = normalizeSeed(options.seed);
  const createdAt = initialRunTimestamp();
  const base: GameState = {
    version: SAVE_VERSION,
    playerName: name,
    difficulty,
    semesterIndex: 0,
    weekInSemester: 1,
    globalWeek: 0,
    actionPointsRemaining: DIFFICULTY[difficulty].actionPoints,
    stats: { ...INITIAL_STATS },
    archetypeId: undefined,
    npcs: {},
    research: {
      researchPoints: 0,
      projects: [],
      publications: [],
      posters: 0,
      grantsWon: [],
      reputationInLab: 0,
    },
    caseLog: [],
    simLabLog: [],
    perks: [],
    perkPoints: 0,
    equipment: [],
    debt: 0,
    sleepDebt: 0,
    injuryRisk: 0,
    activeElective: undefined,
    semesterModifiers: [],
    runDeck: CARDS.map((card) => card.id),
    leadershipRole: undefined,
    breakChoices: [],
    matchApplications: [],
    weekGains: {},
    pendingCaseId: undefined,
    pendingSimLabId: undefined,
    pendingBreakId: undefined,
    weekStartStats: { ...INITIAL_STATS },
    flags: [],
    eventHistory: [],
    bossHistory: [],
    log: [],
    weeklyCards: [],
    cardsPlayedThisWeek: 0,
    lowMoodStreak: 0,
    weekWarnings: [],
    unlockedAchievements: [],
    screen: "planning",
    rngSeed: seed,
    rngCursor: 0,
    transitionCounter: 0,
    createdAt,
    updatedAt: createdAt,
  };
  return startWeek(base, { semesterIndex: 0, weekInSemester: 1 });
}

export function chooseAction(state: GameState, actionId: string): GameState {
  const action = ACTIONS_BY_ID[actionId];
  if (!action) return state;
  const status = actionStatus(action, state);
  if (!status.usable) return state;
  const eff = contextualActionEffects(action, state);
  let next = applyEffects(state, eff, {
    scale: true,
    log: true,
    kind: "action",
    text: action.title,
  });
  next = transitionState(next, {
    actionPointsRemaining: next.actionPointsRemaining - action.cost,
  });
  return checkAchievements(next);
}

export function finishWeek(state: GameState): GameState {
  const thr = computeThresholds(state.stats, state.difficulty);
  const thresholdEffects = applyWeeklyThresholdHooks(
    thr.effects,
    collectHooks(state),
  );
  const lowMood = state.stats.mood < 20;
  const lowMoodStreak = lowMood ? state.lowMoodStreak + 1 : 0;

  let next = state;
  if (Object.keys(thresholdEffects).length > 0) {
    next = applyEffects(next, thresholdEffects, {
      scale: false,
      log: true,
      kind: "system",
      text: WEEKLY_LABEL,
    });
  }

  let flags = next.flags;
  if (thr.hitCriticalStress && !flags.includes("hit_critical_stress")) {
    flags = [...flags, "hit_critical_stress"];
  }
  next = transitionState(next, {
    flags,
    lowMoodStreak,
    weekWarnings: thr.warnings,
  });
  next = checkAchievements(next);

  // Choose this week's event.
  let eventId: string | undefined;
  if (lowMoodStreak >= 3 && EVENTS_BY_ID[RECOVERY_EVENT_ID]) {
    eventId = RECOVERY_EVENT_ID;
  }
  if (!eventId && thr.crisisChance > 0) {
    const [triggerCrisis, randomState] = chance(next, thr.crisisChance);
    next = randomState;
    if (triggerCrisis) {
      [eventId, next] = selectCrisisEvent(next);
    }
  }
  if (!eventId) {
    [eventId, next] = selectWeeklyEvent(next);
  }

  if (eventId) {
    next = transitionState(next, {
      pendingEventId: eventId,
      pendingChoiceId: undefined,
      screen: "event",
    });
  } else {
    next = transitionState(next, {
      pendingEventId: undefined,
      pendingChoiceId: undefined,
      screen: "weeklySummary",
    });
  }
  return next;
}

export function resolveEventChoice(state: GameState, choiceId: string): GameState {
  const event = state.pendingEventId ? EVENTS_BY_ID[state.pendingEventId] : undefined;
  if (!event) return transitionState(state, { screen: "weeklySummary" });
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) return state;
  // Requirement gate (if any) — ignore unmet choices.
  if (
    choice.requirements &&
    !evaluateCondition(state.stats, state.flags, currentSemesterId(state), choice.requirements)
  ) {
    return state;
  }
  let next = applyEffects(state, choice.effects, {
    scale: true,
    log: true,
    kind: "event",
    text: event.title,
  });
  let flags = next.flags;
  if (choice.addFlags) flags = Array.from(new Set([...flags, ...choice.addFlags]));
  if (choice.removeFlags) flags = flags.filter((f) => !choice.removeFlags!.includes(f));
  const eventHistory = [...next.eventHistory, event.id].slice(-50);
  next = transitionState(next, {
    flags,
    eventHistory,
    pendingChoiceId: choiceId,
  });
  return checkAchievements(next);
}

export function continueAfterEvent(state: GameState): GameState {
  return transitionState(state, { screen: "weeklySummary" });
}

export function continueAfterWeeklySummary(state: GameState): GameState {
  if (state.weekInSemester >= WEEKS_PER_SEMESTER) {
    const boss = BOSS_BY_SEMESTER[currentSemesterId(state)];
    // Defensive: if a semester has no configured boss, skip the check entirely
    // (advance to next semester or the ending) rather than entering a dead screen.
    if (!boss) return advanceAfterBoss(state);
    return transitionState(state, {
      screen: "boss",
      pendingBossId: boss.id,
      lastBossResult: undefined,
      pendingEventId: undefined,
      pendingChoiceId: undefined,
      weekWarnings: [],
    });
  }
  return startWeek(state, {
    semesterIndex: state.semesterIndex,
    weekInSemester: state.weekInSemester + 1,
  });
}

// ---------------------------------------------------------------------------
// Boss checks
// ---------------------------------------------------------------------------

export type BossBreakdown = {
  weighted: number;
  wellnessMod: number;
  stressMod: number;
  staminaBonus: number;
  base: number;
};

export function bossBreakdown(boss: Boss, state: GameState): BossBreakdown {
  const s = state.stats;
  let weighted = 0;
  for (const r of boss.requiredStats) weighted += getStat(s, r.stat) * r.weight;
  const wellnessMod = (wellness(s) - 50) * 0.2;
  const stressMod = s.stress >= 30 && s.stress <= 70 ? 5 : s.stress > 85 ? -8 : 0;
  const staminaBonus = s.stamina > 75 ? 5 : 0;
  const base = weighted + wellnessMod + stressMod + staminaBonus;
  return { weighted, wellnessMod, stressMod, staminaBonus, base };
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
  const [roll, randomState] = randomInt(
    state,
    cfg.bossRoll[0],
    cfg.bossRoll[1],
  );
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
    let next: GameState = transitionState(state, {
      endingId: ending.id,
      screen: "ending",
      pendingBossId: undefined,
      lastBossResult: undefined,
    });
    return checkEndingAchievements(next);
  }
  return startWeek(
    { ...state, pendingBossId: undefined, lastBossResult: undefined },
    { semesterIndex: state.semesterIndex + 1, weekInSemester: 1 },
  );
}

// ---------------------------------------------------------------------------
// Endings
// ---------------------------------------------------------------------------

export function determineEnding(state: GameState): Ending {
  const semId = currentSemesterId(state);
  const matches = ENDINGS.filter((e) =>
    evaluateCondition(state.stats, state.flags, semId, e.condition),
  ).sort((a, b) => b.priority - a.priority);
  return matches[0] ?? ENDINGS[ENDINGS.length - 1];
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

function unlockAchievement(state: GameState, id: string): GameState {
  if (state.unlockedAchievements.includes(id)) return state;
  return { ...state, unlockedAchievements: [...state.unlockedAchievements, id] };
}

function checkAchievements(state: GameState): GameState {
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

function checkEndingAchievements(state: GameState): GameState {
  let next = checkAchievements(state);
  const s = state.stats;
  if (s.mood > 60 && s.stamina > 60 && careerReadiness(s) > 60) {
    next = unlockAchievement(next, "balanced_life");
  }
  return next;
}
