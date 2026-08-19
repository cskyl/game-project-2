import { SIM_LAB_EXERCISES, SIM_LAB_BY_ID } from "../../data/simlab";
import { SIM_LAB_RECENCY_WINDOW } from "../constants";
import { collectHooks, sumHookAdds } from "../modifiers";
import { randomInt, weightedPickState } from "../rng";
import { checkAchievements } from "./achievements";
import { currentSemester, currentSemesterId } from "./calendar";
import { applyEffects, transitionState } from "./state";
import type {
  GameState,
  SimLabApproach,
  SimLabExercise,
  SimLabResult,
  SimLabStageOutcome,
} from "../types";

/**
 * Error is signed, which is the whole point: rushing over-prepares and timidity
 * under-prepares, so neither extreme is safe and skill narrows the band rather
 * than pushing one direction.
 */
const APPROACH_BIAS: Record<SimLabApproach, number> = {
  fast: 5,
  careful: 0,
  textbook: -3,
};

/** Each approach has an honest cost, so "textbook always" is not free. */
const APPROACH_COST: Record<SimLabApproach, { stamina: number; stress: number }> = {
  fast: { stamina: -1, stress: -1 },
  careful: { stamina: -3, stress: 1 },
  textbook: { stamina: -4, stress: 3 },
};

/** Within this many points of zero is an ideal preparation. */
const IDEAL_BAND = 4;

export function isSimLabEligible(
  exercise: SimLabExercise,
  state: GameState,
): boolean {
  const stage = currentSemester(state).stage;
  const semesterId = currentSemesterId(state);
  if (!(exercise.stage.includes("any") || exercise.stage.includes(stage))) {
    return false;
  }
  if (exercise.minSemester !== undefined && semesterId < exercise.minSemester) {
    return false;
  }
  if (exercise.maxSemester !== undefined && semesterId > exercise.maxSemester) {
    return false;
  }
  return true;
}

export function selectSimLabExercise(
  state: GameState,
): [string | undefined, GameState] {
  const eligible = SIM_LAB_EXERCISES.filter((entry) => isSimLabEligible(entry, state));
  if (eligible.length === 0) return [undefined, state];
  const recent = new Set(
    state.simLabLog.slice(-SIM_LAB_RECENCY_WINDOW).map((entry) => entry.exerciseId),
  );
  const pool = eligible.filter((entry) => !recent.has(entry.id));
  const draw = pool.length > 0 ? pool : eligible;
  const [picked, next] = weightedPickState(state, draw, () => 1);
  return [picked?.id, next];
}

export function openSimLab(state: GameState, exerciseId: string): GameState {
  if (!SIM_LAB_BY_ID[exerciseId]) return state;
  return transitionState(state, {
    screen: "simLab",
    pendingSimLabId: exerciseId,
    simLabProgress: {
      exerciseId,
      stageIndex: 0,
      approaches: [],
      results: [],
      errors: [],
    },
    pendingEventId: undefined,
    pendingChoiceId: undefined,
  });
}

/** Skill term: steadier hands, sharper focus and a rested body all narrow the error. */
export function simLabSkill(state: GameState): number {
  const s = state.stats;
  return s.handSkill * 0.5 + s.focus * 0.25 + s.stamina * 0.25;
}

/** Mean authored demand, subtracted so a fussy stage does not bias one way. */
const DEMAND_CENTRE = 2;

/** How much of the directional bias and of the tremor skill removes. */
const BIAS_CONTROL = 0.5;
const TREMOR_CONTROL = 0.35;

/** Half-width of the random tremor before skill damps it. */
export function simLabRollRange(exercise: SimLabExercise): number {
  return Math.round(6 + exercise.difficulty / 3);
}

/**
 * Skill *narrows* the error rather than pushing it one way — control is the
 * thing being tested. The approach and the stage's fussiness supply the
 * direction; both are damped by how steady the student is, and so is the
 * random tremor. A rushed novice is wide and biased toward over-preparation;
 * a steady student lands near zero whatever they chose.
 */
export function simLabStageError(
  exercise: SimLabExercise,
  state: GameState,
  stageIndex: number,
  approach: SimLabApproach,
  roll: number,
): number {
  const stage = exercise.stages[stageIndex];
  const modifier = sumHookAdds(collectHooks(state), "simLabRoll");
  const precision = Math.max(
    0,
    Math.min(1, (simLabSkill(state) + modifier) / 100),
  );
  const bias = APPROACH_BIAS[approach] + ((stage?.demand ?? DEMAND_CENTRE) - DEMAND_CENTRE);
  return bias * (1 - BIAS_CONTROL * precision) + roll * (1 - TREMOR_CONTROL * precision);
}

export function errorToOutcome(error: number): SimLabStageOutcome {
  if (error > IDEAL_BAND) return "over";
  if (error < -IDEAL_BAND) return "under";
  return "ideal";
}

function idealsToResult(ideals: number): SimLabResult {
  if (ideals >= 3) return "commendation";
  if (ideals >= 2) return "pass";
  return "rough";
}

/** Resolve one stage. The final stage also grades the whole exercise. */
export function chooseSimLabApproachState(
  state: GameState,
  approach: SimLabApproach,
): GameState {
  if (state.screen !== "simLab") return state;
  const progress = state.simLabProgress;
  if (!progress || progress.result !== undefined) return state;
  const exercise = SIM_LAB_BY_ID[progress.exerciseId];
  if (!exercise) return state;
  if (progress.stageIndex >= exercise.stages.length) return state;
  if (!(approach in APPROACH_BIAS)) return state;

  const range = simLabRollRange(exercise);
  const [roll, randomState] = randomInt(state, -range, range);
  const error = simLabStageError(
    exercise,
    randomState,
    progress.stageIndex,
    approach,
    roll,
  );
  const outcome = errorToOutcome(error);

  const cost = APPROACH_COST[approach];
  let next = applyEffects(randomState, { stamina: cost.stamina, stress: cost.stress }, {
    scale: true,
    log: false,
    kind: "simLab",
  });

  const results = [...progress.results, outcome];
  const stageIndex = progress.stageIndex + 1;
  next = transitionState(next, {
    simLabProgress: {
      ...progress,
      stageIndex,
      approaches: [...progress.approaches, approach],
      results,
      errors: [...progress.errors, Math.round(error * 10) / 10],
    },
  });

  if (stageIndex >= exercise.stages.length) {
    const ideals = results.filter((entry) => entry === "ideal").length;
    const result = idealsToResult(ideals);
    next = applyEffects(next, exercise.outcomes[result].effects, {
      scale: true,
      log: true,
      kind: "simLab",
      text: exercise.title,
    });
    next = transitionState(next, {
      simLabProgress: { ...next.simLabProgress!, result },
      simLabLog: [
        ...next.simLabLog,
        { exerciseId: exercise.id, result, idealStages: ideals },
      ],
      // A commendation is the preclinical route to a perk point.
      perkPoints: next.perkPoints + (result === "commendation" ? 1 : 0),
    });
  }
  return checkAchievements(next);
}

export function continueAfterSimLabState(state: GameState): GameState {
  if (state.screen !== "simLab") return state;
  if (!state.simLabProgress || state.simLabProgress.result === undefined) return state;
  return transitionState(state, {
    screen: "weeklySummary",
    pendingSimLabId: undefined,
    simLabProgress: undefined,
  });
}
