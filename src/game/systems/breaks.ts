import { BREAK_TRACKS } from "../../data/breaks";
import { evaluateCondition } from "../balance";
import { BREAK_ACTIONS_PER_CHAPTER } from "../constants";
import { applyEffects, transitionState } from "./state";
import { openSemester } from "./calendar";
import type { GameState, LocalizedText } from "../types";
type DataBreakTrack = (typeof BREAK_TRACKS)[number] & {
  clearsSleepDebtOnCompletion?: boolean;
};

const BREAK_LABEL: LocalizedText = {
  en: "Break chapter",
  zh: "假期章节",
};

function trackFor(state: GameState): DataBreakTrack | undefined {
  return BREAK_TRACKS.find((track) => track.id === state.pendingBreakId) as DataBreakTrack | undefined;
}

/** Enter a break-track selector after a boss closes semester 2, 5, or 8. */
export function openBreakChapter(state: GameState): GameState {
  return transitionState(state, {
    screen: "breakChapter",
    pendingBreakId: undefined,
    breakTurn: 0,
  });
}

export function chooseBreakTrackState(state: GameState, trackId: string): GameState {
  if (state.screen !== "breakChapter" || state.pendingBreakId !== undefined) return state;
  const track = BREAK_TRACKS.find((entry) => entry.id === trackId) as DataBreakTrack | undefined;
  if (!track) return state;
  const semesterId = state.semesterIndex + 1;
  if (!track.availableAfterSemesters.includes(semesterId) ||
      !evaluateCondition(state.stats, state.flags, semesterId, track.eligibility ?? track.requirements)) {
    return state;
  }
  return transitionState(state, {
    pendingBreakId: track.id,
    breakTurn: 0,
    breakChoices: [...state.breakChoices, {
      afterSemester: state.semesterIndex + 1,
      trackId: track.id,
    }],
  });
}

/** Resolve exactly one turn of the selected break chapter. */
export function takeBreakActionState(state: GameState, actionId: string): GameState {
  if (state.screen !== "breakChapter" || state.breakTurn >= BREAK_ACTIONS_PER_CHAPTER) {
    return state;
  }
  const track = trackFor(state);
  if (!track) return state;
  const action = track.actions.find((entry) => entry.id === actionId);
  if (!action) return state;

  const afterEffects = applyEffects(state, action.effects, {
    scale: true,
    log: true,
    kind: "system",
    text: action.title ?? BREAK_LABEL,
  });
  const flags = action.addFlags
    ? Array.from(new Set([...afterEffects.flags, ...action.addFlags]))
    : afterEffects.flags;
  const nextTurn = afterEffects.breakTurn + 1;
  if (nextTurn < BREAK_ACTIONS_PER_CHAPTER) {
    return transitionState(afterEffects, { breakTurn: nextTurn, flags });
  }

  // Completing a break never silently starts a week: the next semester opens
  // with a fresh seeded elective draft and an explicit player decision.
  let completed = transitionState(afterEffects, { flags });
  completed = transitionState(completed, {
    sleepDebt: track.clearsSleepDebtOnCompletion ? 0 : completed.sleepDebt,
  });
  return openSemester(completed, state.semesterIndex + 1);
}
