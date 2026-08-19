import { CASES, CASES_BY_ID } from "../../data/cases";
import { ELECTIVES_BY_ID } from "../../data/electives";
import { evaluateCondition, getStat } from "../balance";
import { CASE_RECENCY_WINDOW } from "../constants";
import { collectHooks, sumHookAdds } from "../modifiers";
import { randomInt, weightedPickState } from "../rng";
import { checkAchievements } from "./achievements";
import { currentSemester, currentSemesterId } from "./calendar";
import { applyEffects, transitionState } from "./state";
import type {
  CaseOption,
  CaseOutcome,
  CaseRoll,
  GameState,
  PatientCase,
} from "../types";

/** Step score contributed by each option quality. */
const QUALITY_SCORE = { best: 2, ok: 1, poor: -1 } as const;

const OUTCOME_BANDS: Array<[CaseOutcome, number]> = [
  ["excellent", 78],
  ["good", 58],
  ["rough", 40],
];

/** A case whose tags match the term's elective is more likely to walk in. */
const ELECTIVE_TAG_WEIGHT = 2.5;

export function isCaseEligible(patientCase: PatientCase, state: GameState): boolean {
  const stage = currentSemester(state).stage;
  const semesterId = currentSemesterId(state);
  if (!(patientCase.stage.includes("any") || patientCase.stage.includes(stage))) {
    return false;
  }
  if (patientCase.minSemester !== undefined && semesterId < patientCase.minSemester) {
    return false;
  }
  return true;
}

/**
 * Draw the week's case. Recent cases are excluded so the clinic does not repeat
 * itself, and the active elective biases which kind of patient turns up.
 */
export function selectPatientCase(
  state: GameState,
): [string | undefined, GameState] {
  const eligible = CASES.filter((entry) => isCaseEligible(entry, state));
  if (eligible.length === 0) return [undefined, state];
  const recent = new Set(
    state.caseLog.slice(-CASE_RECENCY_WINDOW).map((entry) => entry.caseId),
  );
  const pool = eligible.filter((entry) => !recent.has(entry.id));
  const draw = pool.length > 0 ? pool : eligible;
  const electiveTags = new Set(
    (state.activeElective ? ELECTIVES_BY_ID[state.activeElective]?.caseTags : undefined) ?? [],
  );
  const [picked, next] = weightedPickState(state, draw, (entry) =>
    entry.tags.some((tag) => electiveTags.has(tag)) ? ELECTIVE_TAG_WEIGHT : 1,
  );
  return [picked?.id, next];
}

/** Put the run at the first decision of a case. Resolves nothing. */
export function openCase(state: GameState, caseId: string): GameState {
  if (!CASES_BY_ID[caseId]) return state;
  return transitionState(state, {
    screen: "case",
    pendingCaseId: caseId,
    caseProgress: { caseId, stepIndex: 0, score: 0, choices: [] },
    pendingEventId: undefined,
    pendingChoiceId: undefined,
  });
}

export function isCaseOptionAvailable(
  option: CaseOption,
  state: GameState,
): boolean {
  if (!option.requires) return true;
  return evaluateCondition(
    state.stats,
    state.flags,
    currentSemesterId(state),
    option.requires,
  );
}

/** Every term of the execution roll, so the UI can show the arithmetic. */
export function caseRollBreakdown(
  patientCase: PatientCase,
  state: GameState,
  stepScore: number,
  roll: number,
): CaseRoll {
  let weighted = 0;
  for (const term of patientCase.execution) {
    weighted += getStat(state.stats, term.stat) * term.weight;
  }
  const stepBonus = stepScore * 5;
  const modifier = sumHookAdds(collectHooks(state), "caseRoll");
  const total =
    weighted + stepBonus - patientCase.difficulty + modifier + roll;
  return {
    weighted,
    stepBonus,
    difficulty: patientCase.difficulty,
    modifier,
    roll,
    total: Math.round(total),
  };
}

function scoreToOutcome(total: number): CaseOutcome {
  for (const [outcome, threshold] of OUTCOME_BANDS) {
    if (total >= threshold) return outcome;
  }
  return "bad";
}

function resolveCaseExecution(state: GameState, patientCase: PatientCase): GameState {
  const progress = state.caseProgress;
  if (!progress) return state;
  const [roll, randomState] = randomInt(state, -8, 8);
  const breakdown = caseRollBreakdown(patientCase, randomState, progress.score, roll);
  const outcome = scoreToOutcome(breakdown.total);
  const resolution = patientCase.outcomes[outcome];

  let next = applyEffects(randomState, resolution.effects, {
    scale: true,
    log: true,
    kind: "case",
    text: patientCase.patient.chiefComplaint,
  });
  return transitionState(next, {
    caseProgress: { ...progress, outcome, roll: breakdown },
    caseLog: [
      ...next.caseLog,
      { caseId: patientCase.id, outcome, tags: patientCase.tags },
    ],
  });
}

/** Resolve one case step. The final step also runs the execution roll. */
export function chooseCaseOptionState(
  state: GameState,
  optionId: string,
): GameState {
  if (state.screen !== "case") return state;
  const progress = state.caseProgress;
  if (!progress || progress.outcome !== undefined) return state;
  const patientCase = CASES_BY_ID[progress.caseId];
  if (!patientCase) return state;
  const step = patientCase.steps[progress.stepIndex];
  if (!step) return state;
  const option = step.options.find((entry) => entry.id === optionId);
  if (!option) return state;
  if (!isCaseOptionAvailable(option, state)) return state;

  let next = option.effects
    ? applyEffects(state, option.effects, {
        scale: true,
        log: true,
        kind: "case",
        text: step.prompt,
      })
    : state;
  next = transitionState(next, {
    caseProgress: {
      ...progress,
      stepIndex: progress.stepIndex + 1,
      score: progress.score + QUALITY_SCORE[option.quality],
      choices: [...progress.choices, option.id],
    },
  });
  if (next.caseProgress && next.caseProgress.stepIndex >= patientCase.steps.length) {
    next = resolveCaseExecution(next, patientCase);
  }
  return checkAchievements(next);
}

/** Leave a resolved case. A case replaces the week's random event. */
export function continueAfterCaseState(state: GameState): GameState {
  if (state.screen !== "case") return state;
  if (!state.caseProgress || state.caseProgress.outcome === undefined) return state;
  return transitionState(state, {
    screen: "weeklySummary",
    pendingCaseId: undefined,
    caseProgress: undefined,
  });
}
