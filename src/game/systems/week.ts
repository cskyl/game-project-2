import { CARDS_BY_ID } from "../../data/cards";
import { EVENTS_BY_ID } from "../../data/events";
import { SEMESTERS } from "../../data/semesters";
import { computeThresholds, evaluateCondition } from "../balance";
import { MAX_CARDS_PLAYED_PER_WEEK, WEEKS_PER_SEMESTER } from "../constants";
import { applyWeeklyThresholdHooks, collectHooks } from "../modifiers";
import { chance } from "../rng";
import { checkAchievements } from "./achievements";
import { advanceAfterBoss, BOSS_BY_SEMESTER } from "./boss";
import { currentSemester, currentSemesterId } from "./calendar";
import { drawWeeklyCards } from "./deck";
import { selectCrisisEvent, selectWeeklyEvent } from "./events";
import { actionPointBreakdown, skillDriftEffects } from "./progression";
import { tickResearch } from "./research";
import { applyEffects, transitionState } from "./state";
import type { GameState, LocalizedText } from "../types";

const RECOVERY_EVENT_ID = "well_recovery_week";

const WEEKLY_LABEL: LocalizedText = {
  en: "Weekly adjustments",
  zh: "每周自动调整",
};

const SKILL_DRIFT_LABEL: LocalizedText = {
  en: "Skill drift: core skills you did not train faded this week.",
  zh: "技能回落：本周没有练到的核心能力有所生疏。",
};

/** Refresh the week's budget, snapshot, and draw. Never resolves anything. */
export function startWeek(
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
    actionPointsRemaining: actionPointBreakdown(
      randomState.difficulty,
      opts.semesterIndex + 1,
      randomState.stats.stamina,
      collectHooks(randomState),
    ).total,
    weekGains: {},
    weekStartStats: { ...randomState.stats },
    weeklyCards: cards,
    cardsPlayedThisWeek: 0,
    weekWarnings: [],
    screen: "planning",
    pendingEventId: undefined,
    pendingChoiceId: undefined,
  });
}

export function playCard(state: GameState, cardId: string): GameState {
  if (state.screen !== "planning") return state;
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

/**
 * Resolve the week in the authoritative §3.2 order: thresholds, skill drift,
 * then each weekly system, then exactly one event. Later phases insert their
 * systems between drift and event selection, never before drift.
 */
export function finishWeek(state: GameState): GameState {
  if (state.screen !== "planning") return state;
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

  const driftEffects = skillDriftEffects(
    currentSemester(next).stage,
    next.stats,
    next.weekGains,
  );
  if (Object.keys(driftEffects).length > 0) {
    next = applyEffects(next, driftEffects, {
      scale: false,
      log: true,
      kind: "drift",
      text: SKILL_DRIFT_LABEL,
    });
  }

  // §3.2 step 4.3: research resolves after drift and before all later weekly
  // systems (finance/wellness/cases arrive in their own phases).
  next = tickResearch(next);

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

  return transitionState(next, {
    pendingEventId: eventId,
    pendingChoiceId: undefined,
    screen: eventId ? "event" : "weeklySummary",
  });
}

export function resolveEventChoice(state: GameState, choiceId: string): GameState {
  const event = state.pendingEventId ? EVENTS_BY_ID[state.pendingEventId] : undefined;
  if (!event) return transitionState(state, { screen: "weeklySummary" });
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) return state;
  // Requirement gate (if any) — ignore unmet choices.
  if (
    choice.requirements &&
    !evaluateCondition(
      state.stats,
      state.flags,
      currentSemesterId(state),
      choice.requirements,
    )
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
