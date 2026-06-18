import { ACTIONS } from "../data/actions";
import { BOSSES } from "../data/bosses";
import { CARDS, CARDS_BY_ID } from "../data/cards";
import { ENDINGS } from "../data/endings";
import { EVENTS, EVENTS_BY_ID } from "../data/events";
import { personalization } from "../data/personalization";
import { SEMESTERS } from "../data/semesters";
import {
  CARDS_DRAWN_PER_WEEK,
  DIFFICULTY,
  EVENT_RECENCY_WINDOW,
  MAX_CARDS_PLAYED_PER_WEEK,
  MONEY_MIN,
  SAVE_VERSION,
  WEEKS_PER_SEMESTER,
} from "./constants";
import { INITIAL_STATS } from "./initialState";
import {
  addEffects,
  careerReadiness,
  computeThresholds,
  evaluateCondition,
  getStat,
  randInt,
  scaleEffects,
  weightedPick,
  wellness,
} from "./balance";
import type {
  Action,
  Boss,
  BossOutcomeKey,
  Difficulty,
  Ending,
  GameEvent,
  GameState,
  LifeCard,
  LocalizedText,
  LogEntry,
  Semester,
  StatBlock,
  StatKey,
} from "./types";

const RECOVERY_EVENT_ID = "well_recovery_week";

const WEEKLY_LABEL: LocalizedText = {
  en: "Weekly adjustments",
  zh: "每周自动调整",
};

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

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
// Effects + logging
// ---------------------------------------------------------------------------

type ApplyOpts = {
  scale?: boolean;
  log?: boolean;
  kind?: LogEntry["kind"];
  text?: LocalizedText;
};

function applyEffects(state: GameState, effects: StatBlock, opts: ApplyOpts = {}): GameState {
  const { scale = true, log = true, kind = "system", text } = opts;
  const finalEffects = scale ? scaleEffects(effects, state.difficulty) : effects;
  const stats = addEffects(state.stats, finalEffects);
  let logEntries = state.log;
  if (log && text && Object.keys(finalEffects).length > 0) {
    const entry: LogEntry = {
      id: uid(),
      semesterId: currentSemesterId(state),
      weekInSemester: state.weekInSemester,
      text,
      effects: finalEffects,
      kind,
    };
    logEntries = [...state.log, entry].slice(-40);
  }
  return { ...state, stats, log: logEntries };
}

/** Apply contextual (stamina/mood/stress) modifiers to an action's effects. */
function actionEffects(action: Action, stats: Record<StatKey, number>): StatBlock {
  const eff: StatBlock = { ...action.effects };

  if (action.dynamicWeakest) {
    const core: StatKey[] = ["knowledge", "handSkill", "clinicalSense"];
    let weakest = core[0];
    for (const k of core) if (stats[k] < stats[weakest]) weakest = k;
    eff[weakest] = (eff[weakest] ?? 0) + 4;
  }

  const tags = action.tags ?? [];
  const scaleKey = (k: StatKey, f: number) => {
    if (eff[k] !== undefined) eff[k] = Math.round((eff[k] as number) * f);
  };

  if (tags.includes("study")) {
    // Too relaxed: urgency is low, studying is slightly less sharp.
    if (stats.stress < 30 && eff.knowledge !== undefined) {
      eff.knowledge = (eff.knowledge as number) - 1;
    }
    // Low mood: study effectiveness -10%.
    if (stats.mood >= 20 && stats.mood < 40) scaleKey("knowledge", 0.9);
  }

  if (tags.includes("lab") || tags.includes("clinic")) {
    // Very low stamina: hands/clinic effects -20%.
    if (stats.stamina < 25) {
      scaleKey("handSkill", 0.8);
      scaleKey("clinicalSense", 0.8);
      scaleKey("empathy", 0.8);
      scaleKey("publicImpact", 0.8);
    }
  }

  if (tags.includes("support") || tags.includes("relationship")) {
    // Low mood: support/relationship effectiveness +20%.
    if (stats.mood >= 20 && stats.mood < 40) {
      scaleKey("love", 1.2);
      scaleKey("mood", 1.2);
    }
  }

  if (tags.includes("heavy") && stats.stamina > 75) {
    // High stamina: heavy actions cost less mood/stress.
    if (eff.mood !== undefined && (eff.mood as number) < 0) {
      eff.mood = Math.round((eff.mood as number) * 0.7);
    }
    if (eff.stress !== undefined && (eff.stress as number) > 0) {
      eff.stress = Math.round((eff.stress as number) * 0.7);
    }
  }

  return eff;
}

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

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

function drawCards(
  stats: Record<StatKey, number>,
  flags: string[],
  semesterId: number,
  stage: Semester["stage"],
): string[] {
  const eligible = CARDS.filter(
    (c) =>
      (c.stage.includes("any") || c.stage.includes(stage)) &&
      evaluateCondition(stats, flags, semesterId, c.requirements),
  );
  const rarityWeight = (c: LifeCard) =>
    c.rarity === "common" ? 6 : c.rarity === "rare" ? 3 : 1;
  const pool = [...eligible];
  const picked: string[] = [];
  for (let i = 0; i < CARDS_DRAWN_PER_WEEK && pool.length > 0; i++) {
    const c = weightedPick(pool, rarityWeight);
    if (!c) break;
    picked.push(c.id);
    pool.splice(pool.indexOf(c), 1);
  }
  return picked;
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
  next = {
    ...next,
    weeklyCards: next.weeklyCards.filter((id) => id !== cardId),
    cardsPlayedThisWeek: next.cardsPlayedThisWeek + 1,
    updatedAt: now(),
  };
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
  const cards = drawCards(state.stats, state.flags, opts.semesterIndex + 1, sem.stage);
  return {
    ...state,
    semesterIndex: opts.semesterIndex,
    weekInSemester: opts.weekInSemester,
    globalWeek: state.globalWeek + 1,
    actionPointsRemaining: DIFFICULTY[state.difficulty].actionPoints,
    weekStartStats: { ...state.stats },
    weeklyCards: cards,
    cardsPlayedThisWeek: 0,
    weekWarnings: [],
    screen: "planning",
    pendingEventId: undefined,
    pendingChoiceId: undefined,
    updatedAt: now(),
  };
}

export function newGame(difficulty: Difficulty, playerName: string): GameState {
  const name = playerName.trim() || personalization.playerDefaultName;
  const base: GameState = {
    version: SAVE_VERSION,
    playerName: name,
    difficulty,
    semesterIndex: 0,
    weekInSemester: 1,
    globalWeek: 0,
    actionPointsRemaining: DIFFICULTY[difficulty].actionPoints,
    stats: { ...INITIAL_STATS },
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
    createdAt: now(),
    updatedAt: now(),
  };
  return startWeek(base, { semesterIndex: 0, weekInSemester: 1 });
}

export function chooseAction(state: GameState, actionId: string): GameState {
  const action = ACTIONS_BY_ID[actionId];
  if (!action) return state;
  const status = actionStatus(action, state);
  if (!status.usable) return state;
  const eff = actionEffects(action, state.stats);
  let next = applyEffects(state, eff, {
    scale: true,
    log: true,
    kind: "action",
    text: action.title,
  });
  next = {
    ...next,
    actionPointsRemaining: next.actionPointsRemaining - action.cost,
    updatedAt: now(),
  };
  return checkAchievements(next);
}

// ---------------------------------------------------------------------------
// Event selection + resolution
// ---------------------------------------------------------------------------

function eventEligible(e: GameEvent, state: GameState): boolean {
  const sem = currentSemester(state);
  const semId = currentSemesterId(state);
  if (!(e.stage.includes("any") || e.stage.includes(sem.stage))) return false;
  if (e.minSemester !== undefined && semId < e.minSemester) return false;
  if (e.maxSemester !== undefined && semId > e.maxSemester) return false;
  if (!evaluateCondition(state.stats, state.flags, semId, e.condition)) return false;
  return true;
}

function selectEvent(state: GameState): string | undefined {
  const eligible = EVENTS.filter((e) => eventEligible(e, state));
  if (eligible.length === 0) return undefined;
  const recent = state.eventHistory.slice(-EVENT_RECENCY_WINDOW);
  const nonRecent = eligible.filter(
    (e) => !recent.includes(e.id) || e.tags.includes("crisis"),
  );
  const pool = nonRecent.length > 0 ? nonRecent : eligible;
  const weightFn = (e: GameEvent) => {
    let w = e.weight;
    if (
      state.stats.mood >= 70 &&
      (e.tags.includes("relationship") || e.tags.includes("support"))
    ) {
      w *= 1.5;
    }
    return w;
  };
  return weightedPick(pool, weightFn)?.id;
}

function pickCrisisEvent(state: GameState): string | undefined {
  const pool = EVENTS.filter(
    (e) =>
      eventEligible(e, state) &&
      (e.tags.includes("crisis") || e.tags.includes("wellness")),
  );
  if (pool.length === 0) return undefined;
  return weightedPick(pool, (e) => e.weight)?.id;
}

export function finishWeek(state: GameState): GameState {
  const thr = computeThresholds(state.stats, state.difficulty);
  const lowMood = state.stats.mood < 20;
  const lowMoodStreak = lowMood ? state.lowMoodStreak + 1 : 0;

  let next = state;
  if (Object.keys(thr.effects).length > 0) {
    next = applyEffects(next, thr.effects, {
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
  next = { ...next, flags, lowMoodStreak, weekWarnings: thr.warnings };
  next = checkAchievements(next);

  // Choose this week's event.
  let eventId: string | undefined;
  if (lowMoodStreak >= 3 && EVENTS_BY_ID[RECOVERY_EVENT_ID]) {
    eventId = RECOVERY_EVENT_ID;
  }
  if (!eventId && thr.triggerCrisis) {
    eventId = pickCrisisEvent(next);
  }
  if (!eventId) {
    eventId = selectEvent(next);
  }

  if (eventId) {
    next = { ...next, pendingEventId: eventId, pendingChoiceId: undefined, screen: "event", updatedAt: now() };
  } else {
    next = { ...next, pendingEventId: undefined, pendingChoiceId: undefined, screen: "weeklySummary", updatedAt: now() };
  }
  return next;
}

export function resolveEventChoice(state: GameState, choiceId: string): GameState {
  const event = state.pendingEventId ? EVENTS_BY_ID[state.pendingEventId] : undefined;
  if (!event) return { ...state, screen: "weeklySummary" };
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
  next = {
    ...next,
    flags,
    eventHistory,
    pendingChoiceId: choiceId,
    updatedAt: now(),
  };
  return checkAchievements(next);
}

export function continueAfterEvent(state: GameState): GameState {
  return { ...state, screen: "weeklySummary", updatedAt: now() };
}

export function continueAfterWeeklySummary(state: GameState): GameState {
  if (state.weekInSemester >= WEEKS_PER_SEMESTER) {
    const boss = BOSS_BY_SEMESTER[currentSemesterId(state)];
    // Defensive: if a semester has no configured boss, skip the check entirely
    // (advance to next semester or the ending) rather than entering a dead screen.
    if (!boss) return advanceAfterBoss(state);
    return {
      ...state,
      screen: "boss",
      pendingBossId: boss.id,
      lastBossResult: undefined,
      pendingEventId: undefined,
      pendingChoiceId: undefined,
      weekWarnings: [],
      updatedAt: now(),
    };
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
  const roll = randInt(cfg.bossRoll[0], cfg.bossRoll[1]);
  const score = Math.max(0, Math.min(100, Math.round(base + roll)));
  const outcome = scoreToOutcome(score);
  const out = boss.outcomes[outcome];

  let next = applyEffects(state, out.effects, {
    scale: true,
    log: true,
    kind: "boss",
    text: boss.title,
  });
  const result = { bossId: boss.id, semesterId: boss.semesterId, score, outcome };
  next = {
    ...next,
    bossHistory: [...next.bossHistory, result],
    lastBossResult: result,
    pendingBossId: boss.id,
    updatedAt: now(),
  };
  if (outcome === "great") next = unlockAchievement(next, "first_boss_great");
  return checkAchievements(next);
}

export function advanceAfterBoss(state: GameState): GameState {
  if (isFinalSemester(state)) {
    const ending = determineEnding(state);
    let next: GameState = {
      ...state,
      endingId: ending.id,
      screen: "ending",
      pendingBossId: undefined,
      lastBossResult: undefined,
      updatedAt: now(),
    };
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
