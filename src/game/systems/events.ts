import { EVENTS } from "../../data/events";
import { SEMESTERS } from "../../data/semesters";
import { EVENT_RECENCY_WINDOW } from "../constants";
import { evaluateCondition } from "../balance";
import { weightedPickState } from "../rng";
import type { GameEvent, GameState } from "../types";

export function eventEligible(event: GameEvent, state: GameState): boolean {
  const semester = SEMESTERS[state.semesterIndex];
  const semesterId = state.semesterIndex + 1;
  if (
    !(event.stage.includes("any") || event.stage.includes(semester.stage))
  ) {
    return false;
  }
  if (event.minSemester !== undefined && semesterId < event.minSemester) {
    return false;
  }
  if (event.maxSemester !== undefined && semesterId > event.maxSemester) {
    return false;
  }
  return evaluateCondition(
    state.stats,
    state.flags,
    semesterId,
    event.condition,
  );
}

export function selectWeeklyEvent(
  state: GameState,
): [string | undefined, GameState] {
  const eligible = EVENTS.filter((event) => eventEligible(event, state));
  if (eligible.length === 0) return [undefined, state];
  const recent = state.eventHistory.slice(-EVENT_RECENCY_WINDOW);
  const nonRecent = eligible.filter(
    (event) =>
      !recent.includes(event.id) || event.tags.includes("crisis"),
  );
  const pool = nonRecent.length > 0 ? nonRecent : eligible;
  const weight = (event: GameEvent) => {
    if (
      state.stats.mood >= 70 &&
      (event.tags.includes("relationship") || event.tags.includes("support"))
    ) {
      return event.weight * 1.5;
    }
    return event.weight;
  };
  const [event, next] = weightedPickState(state, pool, weight);
  return [event?.id, next];
}

export function selectCrisisEvent(
  state: GameState,
): [string | undefined, GameState] {
  const pool = EVENTS.filter(
    (event) =>
      eventEligible(event, state) &&
      (event.tags.includes("crisis") || event.tags.includes("wellness")),
  );
  if (pool.length === 0) return [undefined, state];
  const [event, next] = weightedPickState(
    state,
    pool,
    (candidate) => candidate.weight,
  );
  return [event?.id, next];
}
