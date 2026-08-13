import { ELECTIVES } from "../../data/electives";
import { evaluateCondition } from "../balance";
import { transitionState } from "./state";
import type { GameState } from "../types";

/** Select one of the already-drawn offers without consuming a week or AP. */
export function chooseElectiveState(state: GameState, electiveId: string): GameState {
  if (state.screen !== "semesterOpen") return state;
  if (!state.electiveOffers.includes(electiveId)) return state;
  const elective = ELECTIVES.find((entry) => entry.id === electiveId);
  if (!elective) return state;
  if (!evaluateCondition(state.stats, state.flags, state.semesterIndex + 1, elective.prerequisites)) {
    return state;
  }
  // Effects and hooks belong to the data-backed modifier registry. This state
  // pointer is the sole activation mechanism; no elective math is scattered
  // through the calendar or weekly engine.
  return transitionState(state, { activeElective: electiveId });
}

export function canBeginSemester(state: GameState): boolean {
  return state.screen === "semesterOpen" &&
    !!state.activeElective &&
    state.electiveOffers.includes(state.activeElective);
}
