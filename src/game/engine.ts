// ---------------------------------------------------------------------------
// Engine facade.
//
// This module owns run creation and the player verbs, and re-exports the rest
// of the public surface. All resolution logic lives in `./systems/*`, which own
// their own state transitions; the engine only wires verbs to systems so the
// week, boss, research, break, and calendar layers stay independently testable.
// ---------------------------------------------------------------------------

import { ACTIONS } from "../data/actions";
import { CARDS } from "../data/cards";
import { personalization } from "../data/personalization";
import { DIFFICULTY, MONEY_MIN, SAVE_VERSION } from "./constants";
import { INITIAL_STATS } from "./initialState";
import { evaluateCondition } from "./balance";
import { normalizeSeed } from "./rng";
import { checkAchievements } from "./systems/achievements";
import { contextualActionEffects } from "./systems/actions";
import {
  chooseBreakTrackState,
  takeBreakActionState,
} from "./systems/breaks";
import { currentSemesterId, openSemester } from "./systems/calendar";
import { canBeginSemester, chooseElectiveState } from "./systems/electives";
import {
  applySummerResearchBreakState,
  applyResearchActionState,
  isResearchActionAvailable,
} from "./systems/research";
import { applyEffects, initialRunTimestamp, transitionState } from "./systems/state";
import { startWeek } from "./systems/week";
import type { Action, Difficulty, GameState } from "./types";

// --- Public surface owned by the systems layer -----------------------------

export {
  currentSemester,
  currentSemesterId,
  isFinalSemester,
} from "./systems/calendar";
export {
  continueAfterEvent,
  continueAfterWeeklySummary,
  finishWeek,
  playCard,
  resolveEventChoice,
} from "./systems/week";
export {
  chooseCaseOptionState as chooseCaseOption,
  continueAfterCaseState as continueAfterCase,
} from "./systems/cases";
export {
  chooseSimLabApproachState as chooseSimLabApproach,
  continueAfterSimLabState as continueAfterSimLab,
} from "./systems/simlab";
export {
  advanceAfterBoss,
  bossBreakdown,
  bossReadiness,
  determineEnding,
  resolveBoss,
} from "./systems/boss";
export type { BossBreakdown } from "./systems/boss";
export {
  abandonResearchProjectState as abandonResearchProject,
  closeResearchDashboardState as closeResearchDashboard,
  joinResearchLabState as joinResearchLab,
  openResearchDashboardState as openResearchDashboard,
  resubmitResearchProjectState as resubmitResearchProject,
  selectActiveResearchProjectState as selectActiveResearchProject,
  startResearchProjectState as startResearchProject,
} from "./systems/research";

// --- Action availability ---------------------------------------------------

const ACTIONS_BY_ID: Record<string, Action> = Object.fromEntries(
  ACTIONS.map((a) => [a.id, a]),
);

/** Research verbs belong to the dashboard; everything else to planning. */
const isResearchActionId = (actionId: string): boolean =>
  actionId === "research_interest" || actionId === "lab_work";

export function isActionUnlocked(action: Action, state: GameState): boolean {
  if (!isResearchActionAvailable(state, action.id)) return false;
  if (!action.unlock) return true;
  return evaluateCondition(
    state.stats,
    state.flags,
    currentSemesterId(state),
    action.unlock,
  );
}

export type ActionStatus = {
  unlocked: boolean;
  enoughAp: boolean;
  enoughMoney: boolean;
  usable: boolean;
  unlockSemester?: number;
};

export function actionStatus(action: Action, state: GameState): ActionStatus {
  const correctScreen = isResearchActionId(action.id)
    ? state.screen === "researchDashboard"
    : state.screen === "planning";
  const unlocked = correctScreen && isActionUnlocked(action, state);
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

// --- Run creation ----------------------------------------------------------

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
      labOffers: [],
      activeProjectId: undefined,
      activity: [],
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
    electiveOffers: [],
    semesterModifiers: [],
    runDeck: CARDS.map((card) => card.id),
    leadershipRole: undefined,
    breakChoices: [],
    matchApplications: [],
    weekGains: {},
    weekActionTags: [],
    softCapCarry: {},
    pendingCaseId: undefined,
    caseProgress: undefined,
    pendingSimLabId: undefined,
    simLabProgress: undefined,
    pendingBreakId: undefined,
    breakTurn: 0,
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
  // The first player decision is the semester-open draft, not a hidden week.
  return openSemester(base, 0);
}

// --- Player verbs ----------------------------------------------------------

/** Select one of the three seeded elective offers for the current semester. */
export function chooseElective(state: GameState, electiveId: string): GameState {
  return chooseElectiveState(state, electiveId);
}

/** Commit the semester-open choice and begin week one. */
export function beginSemester(state: GameState): GameState {
  if (!canBeginSemester(state)) return state;
  return startWeek(state, {
    semesterIndex: state.semesterIndex,
    weekInSemester: 1,
  });
}

/** Pick the track for a break chapter; actions begin only after this choice. */
export function chooseBreakTrack(state: GameState, trackId: string): GameState {
  return chooseBreakTrackState(state, trackId);
}

/** Take one break action. The third action opens the following semester. */
export function takeBreakAction(state: GameState, actionId: string): GameState {
  const withResearch = applySummerResearchBreakState(state, actionId);
  return takeBreakActionState(withResearch, actionId);
}

export function chooseAction(state: GameState, actionId: string): GameState {
  const isResearchAction = isResearchActionId(actionId);
  if (
    (isResearchAction && state.screen !== "researchDashboard") ||
    (!isResearchAction && state.screen !== "planning")
  ) {
    return state;
  }
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
  next = applyResearchActionState(next, action.id);
  next = transitionState(next, {
    actionPointsRemaining: next.actionPointsRemaining - action.cost,
    weekActionTags: Array.from(
      new Set([...next.weekActionTags, ...(action.tags ?? [])]),
    ),
  });
  return checkAchievements(next);
}
