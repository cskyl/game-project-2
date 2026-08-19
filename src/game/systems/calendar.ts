import { ELECTIVES } from "../../data/electives";
import { SEMESTERS } from "../../data/semesters";
import { evaluateCondition } from "../balance";
import { BREAK_AFTER_SEMESTERS, SEMESTER_COUNT } from "../constants";
import { nextRandom } from "../rng";
import { transitionState } from "./state";
import type { GameState } from "../types";

/** Number of offers the player sees at each semester open. */
export const ELECTIVE_OFFER_COUNT = 3;

// The calendar owns where a run sits in time. These read-only cursors live here
// so the week, boss, and UI layers share one definition.

export const currentSemester = (state: GameState) => SEMESTERS[state.semesterIndex];

export const currentSemesterId = (state: GameState): number =>
  state.semesterIndex + 1;

export const isFinalSemester = (state: GameState): boolean =>
  state.semesterIndex >= SEMESTER_COUNT - 1;

/**
 * Draw a seeded, stage/prerequisite-filtered elective draft.  The draft is
 * stored in state before the player sees it, so loading a save never rerolls
 * the semester screen.
 */
export function drawElectiveOffers(
  state: GameState,
  semesterId: number,
): [string[], GameState] {
  const eligible = ELECTIVES.filter((elective) =>
    (elective.stage.includes("any") || elective.stage.includes(SEMESTERS[semesterId - 1]?.stage ?? "early")) &&
    semesterId >= elective.minSemester &&
    semesterId <= elective.maxSemester &&
    evaluateCondition(state.stats, state.flags, semesterId, elective.prerequisites),
  );
  const pool = [...eligible];
  const offers: string[] = [];
  let next = state;
  while (pool.length > 0 && offers.length < ELECTIVE_OFFER_COUNT) {
    const [random, randomState] = nextRandom(next);
    next = randomState;
    const index = Math.min(pool.length - 1, Math.floor(random * pool.length));
    offers.push(pool[index].id);
    pool.splice(index, 1);
  }
  return [offers, next];
}

/** Put a run at a semester-open decision point (never starts a week). */
export function openSemester(
  state: GameState,
  semesterIndex: number,
  options: { drawOffers?: boolean } = {},
): GameState {
  const safeIndex = Math.max(0, Math.min(SEMESTER_COUNT - 1, semesterIndex));
  let next = transitionState(state, {
    semesterIndex: safeIndex,
    weekInSemester: 1,
    activeElective: undefined,
    pendingBreakId: undefined,
    breakTurn: 0,
    screen: "semesterOpen",
  });
  if (options.drawOffers === false) return next;
  const [offers, drawn] = drawElectiveOffers(next, safeIndex + 1);
  return transitionState(drawn, { electiveOffers: offers });
}

export function isBreakSemester(semesterId: number): boolean {
  return (BREAK_AFTER_SEMESTERS as readonly number[]).includes(semesterId);
}

export function hasAnotherSemester(semesterIndex: number): boolean {
  return semesterIndex + 1 < SEMESTER_COUNT;
}
