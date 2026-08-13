import { ACTIONS } from "../data/actions";
import { CARDS_BY_ID } from "../data/cards";
import { ENDINGS } from "../data/endings";
import { EVENTS_BY_ID } from "../data/events";
import { SEMESTERS } from "../data/semesters";
import {
  careerReadiness as careerReadinessFn,
  lifeBalance as lifeBalanceFn,
  wellness as wellnessFn,
} from "./balance";
import { currentSemester, determineEnding } from "./engine";
import type {
  Action,
  Ending,
  GameEvent,
  GameState,
  LifeCard,
  StatKey,
} from "./types";

export const wellness = (s: GameState) => wellnessFn(s.stats);
export const careerReadiness = (s: GameState) => careerReadinessFn(s.stats);
export const lifeBalance = (s: GameState) => lifeBalanceFn(s.stats);

const RESEARCH_DASHBOARD_ACTIONS = new Set(["research_interest", "lab_work"]);

/** Screen-specific verbs stay out of the ordinary weekly action grid. */
export const getActions = (state?: GameState): Action[] =>
  state?.screen === "researchDashboard"
    ? ACTIONS.filter((action) => RESEARCH_DASHBOARD_ACTIONS.has(action.id))
    : ACTIONS.filter((action) => !RESEARCH_DASHBOARD_ACTIONS.has(action.id));

export function getPendingEvent(state: GameState): GameEvent | undefined {
  return state.pendingEventId ? EVENTS_BY_ID[state.pendingEventId] : undefined;
}

export function getDrawnCards(state: GameState): LifeCard[] {
  return state.weeklyCards.map((id) => CARDS_BY_ID[id]).filter(Boolean) as LifeCard[];
}

export function getEnding(state: GameState): Ending {
  if (state.endingId) {
    const found = ENDINGS.find((e) => e.id === state.endingId);
    if (found) return found;
  }
  return determineEnding(state);
}

export { currentSemester };

/** Stats sorted by value, for "strongest stats" in the summary. */
export function strongestStats(state: GameState, n = 3): StatKey[] {
  const ranked: StatKey[] = [
    "knowledge",
    "handSkill",
    "clinicalSense",
    "empathy",
    "confidence",
    "reputation",
    "love",
    "research",
    "publicImpact",
  ];
  return ranked
    .slice()
    .sort((a, b) => state.stats[b] - state.stats[a])
    .slice(0, n);
}

/** Semester whose boss check scored lowest (the hardest one). */
export function hardestSemester(state: GameState): string | undefined {
  if (state.bossHistory.length === 0) return undefined;
  const worst = state.bossHistory.reduce((a, b) => (b.score < a.score ? b : a));
  const sem = SEMESTERS.find((s) => s.id === worst.semesterId);
  return sem?.name.en;
}
