import { ACTIONS } from "../src/data/actions";
import { BOSSES } from "../src/data/bosses";
import { BREAK_TRACKS } from "../src/data/breaks";
import { CARDS } from "../src/data/cards";
import {
  ELECTIVES,
  registerElectiveModifiers,
} from "../src/data/electives";
import { ENDINGS } from "../src/data/endings";
import { EVENTS } from "../src/data/events";
import {
  RESEARCH_EVENTS,
  RESEARCH_LABS,
  RESEARCH_PROJECT_TEMPLATES,
} from "../src/data/research";
import { SEMESTERS } from "../src/data/semesters";
import { careerReadiness, evaluateCondition, getStat } from "../src/game/balance";
import {
  ALL_STATS,
  BREAK_ACTIONS_PER_CHAPTER,
  BREAK_AFTER_SEMESTERS,
  MONEY_MAX,
  MONEY_MIN,
  WEEKS_PER_SEMESTER,
} from "../src/game/constants";
import {
  actionStatus,
  abandonResearchProject,
  advanceAfterBoss,
  beginSemester,
  chooseAction,
  chooseBreakTrack,
  chooseElective,
  closeResearchDashboard,
  continueAfterEvent,
  continueAfterWeeklySummary,
  finishWeek,
  joinResearchLab,
  newGame,
  openResearchDashboard,
  playCard,
  resolveBoss,
  resolveEventChoice,
  resubmitResearchProject,
  selectActiveResearchProject,
  startResearchProject,
  takeBreakAction,
} from "../src/game/engine";
import { getActions, getEnding, getPendingEvent } from "../src/game/selectors";
import { migrateSave } from "../src/game/migration";
import {
  applyActionHooks,
  applyAffinityGainHooks,
  applyExpenseHooks,
  applyIncomeHooks,
  applyWeeklyThresholdHooks,
  collectHooks,
  getSoftCapBandShift,
  registerModifier,
  resetModifierRegistryForTests,
} from "../src/game/modifiers";
import { nextRandom } from "../src/game/rng";
import {
  actionPointBreakdown,
  applySoftCaps,
  bossSemesterRamp,
  skillDriftEffects,
  softCapMultiplier,
  SOFT_CAPPED_STATS,
} from "../src/game/systems/progression";
import type {
  Action,
  Difficulty,
  GameState,
  Screen,
  StatBlock,
  StatKey,
} from "../src/game/types";

declare const process: { argv: string[] };

const GUARD_LIMIT = 20_000;
const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard"];
const CR_COMPONENT_STATS = [
  "knowledge",
  "handSkill",
  "clinicalSense",
  "empathy",
  "confidence",
] as const;

type BotMode = "ordered" | "chaos" | "minmax";
type ResearchStrategy = "focused" | "balanced" | "clinical-only" | "dabble";
type Bot = {
  id: string;
  actions: string[];
  choiceOffset: number;
  mode?: BotMode;
  researchStrategy: ResearchStrategy;
};

const BOTS: Bot[] = [
  {
    id: "balanced",
    actions: [
      "ask_help",
      "sleep",
      "review_lecture",
      "quick_drill",
      "patient_comm",
      "clinic_prep",
      "relationship_time",
      "community",
      "research",
      "work",
    ],
    choiceOffset: 0,
    researchStrategy: "balanced",
  },
  {
    id: "study-max",
    actions: [
      "deep_study",
      "review_lecture",
      "research",
      "ask_help",
      "sleep",
      "small_break",
    ],
    choiceOffset: 1,
    researchStrategy: "dabble",
  },
  {
    id: "hands-max",
    actions: [
      "sim_lab",
      "quick_drill",
      "clinic_prep",
      "ask_help",
      "sleep",
      "patient_comm",
    ],
    choiceOffset: 2,
    researchStrategy: "clinical-only",
  },
  {
    id: "research-max",
    actions: [
      "research",
      "deep_study",
      "review_lecture",
      "work",
      "sleep",
      "ask_help",
    ],
    choiceOffset: 0,
    researchStrategy: "focused",
  },
  {
    id: "clinic-max",
    actions: [
      "clinic_prep",
      "patient_comm",
      "sim_lab",
      "quick_drill",
      "community",
      "sleep",
    ],
    choiceOffset: 1,
    researchStrategy: "clinical-only",
  },
  {
    id: "social",
    actions: [
      "relationship_time",
      "patient_comm",
      "community",
      "ask_help",
      "small_break",
      "review_lecture",
    ],
    choiceOffset: 2,
    researchStrategy: "dabble",
  },
  {
    id: "wellness",
    actions: [
      "sleep",
      "small_break",
      "relationship_time",
      "eat_good",
      "ask_help",
      "review_lecture",
    ],
    choiceOffset: 0,
    researchStrategy: "dabble",
  },
  {
    id: "money",
    actions: [
      "work",
      "small_break",
      "sleep",
      "review_lecture",
      "quick_drill",
      "ask_help",
    ],
    choiceOffset: 1,
    researchStrategy: "dabble",
  },
  {
    id: "chaos",
    actions: ACTIONS.map((action) => action.id),
    choiceOffset: 2,
    mode: "chaos",
    researchStrategy: "dabble",
  },
  {
    id: "min-max-exploiter",
    actions: ACTIONS.map((action) => action.id),
    choiceOffset: 0,
    mode: "minmax",
    researchStrategy: "dabble",
  },
];

type PlayerInput =
  | { type: "chooseElective"; id: string }
  | { type: "beginSemester" }
  | { type: "action"; id: string }
  | { type: "card"; id: string }
  | { type: "finishWeek" }
  | { type: "eventChoice"; id: string }
  | { type: "continueEvent" }
  | { type: "continueSummary" }
  | { type: "resolveBoss" }
  | { type: "advanceBoss" }
  | { type: "chooseBreakTrack"; id: string }
  | { type: "breakAction"; id: string }
  | { type: "openResearch" }
  | { type: "closeResearch" }
  | { type: "joinResearchLab"; id: string }
  | { type: "startResearchProject"; id: string }
  | { type: "selectResearchProject"; id: string }
  | { type: "resubmitResearchProject"; id: string }
  | { type: "abandonResearchProject"; id: string };

type RunResult = {
  finalState: GameState;
  trace: PlayerInput[];
  eventsSeen: string[];
  actionCounts: Record<string, number>;
  electiveChoices: string[];
  breakActionCounts: Record<number, number>;
  weeksSeen: string[];
  semesterOpenCount: number;
  researchDashboardVisits: number;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`ASSERT FAILED: ${message}`);
}

const ACTIONS_BY_ID = new Map(ACTIONS.map((action) => [action.id, action]));

function usableActions(state: GameState): Action[] {
  return ACTIONS.filter((action) => actionStatus(action, state).usable);
}

function mix32(value: number): number {
  let mixed = value >>> 0;
  mixed ^= mixed >>> 16;
  mixed = Math.imul(mixed, 0x7feb352d);
  mixed ^= mixed >>> 15;
  mixed = Math.imul(mixed, 0x846ca68b);
  return (mixed ^ (mixed >>> 16)) >>> 0;
}

function effectUtility(effects: StatBlock): number {
  let utility = 0;
  for (const [key, delta] of Object.entries(effects)) {
    const value = delta ?? 0;
    utility += key === "stress" ? -value : value;
  }
  return utility;
}

function pickAction(state: GameState, bot: Bot, turn: number): string | undefined {
  const usable = usableActions(state);
  if (usable.length === 0) return undefined;

  if (bot.mode === "chaos") {
    const index =
      mix32(state.rngSeed ^ state.globalWeek ^ Math.imul(turn + 1, 0x9e3779b9)) %
      usable.length;
    return usable[index].id;
  }

  if (bot.mode === "minmax") {
    return [...usable]
      .sort((left, right) => {
        const leftScore =
          (effectUtility(left.effects) - (left.moneyCost ?? 0) * 0.15) /
          Math.max(1, left.cost);
        const rightScore =
          (effectUtility(right.effects) - (right.moneyCost ?? 0) * 0.15) /
          Math.max(1, right.cost);
        return rightScore - leftScore || left.id.localeCompare(right.id);
      })[0]
      ?.id;
  }

  const preferred = bot.actions
    .map((id) => ACTIONS_BY_ID.get(id))
    .filter((action): action is Action => Boolean(action))
    .filter((action) => actionStatus(action, state).usable);
  if (preferred.length === 0) return usable[0].id;
  const strategyWidth = Math.min(3, preferred.length);
  const index =
    (state.globalWeek + turn + bot.choiceOffset) % strategyWidth;
  return preferred[index].id;
}

function pickCard(state: GameState, bot: Bot): string | undefined {
  if (state.weeklyCards.length === 0) return undefined;
  const index = bot.choiceOffset % state.weeklyCards.length;
  return state.weeklyCards[index];
}

function pickEventChoice(state: GameState, bot: Bot): string {
  const event = getPendingEvent(state);
  assert(event, `${bot.id}: event screen has no pending event`);
  const eligible = event.choices.filter((choice) =>
    evaluateCondition(
      state.stats,
      state.flags,
      state.semesterIndex + 1,
      choice.requirements,
    ),
  );
  assert(eligible.length > 0, `${bot.id}: event ${event.id} has no eligible choice`);
  const index =
    bot.mode === "chaos"
      ? mix32(state.rngSeed ^ state.globalWeek ^ event.id.length) % eligible.length
      : bot.choiceOffset % eligible.length;
  return eligible[index].id;
}

function pickElective(state: GameState, bot: Bot): string {
  assert(
    state.electiveOffers.length > 0,
    `${bot.id}: semester ${state.semesterIndex + 1} has no elective offers`,
  );
  const index =
    bot.mode === "chaos"
      ? mix32(state.rngSeed ^ Math.imul(state.semesterIndex + 1, 0x9e37_79b9)) %
        state.electiveOffers.length
      : (state.semesterIndex + bot.choiceOffset) % state.electiveOffers.length;
  return state.electiveOffers[index];
}

function eligibleBreakTracks(state: GameState) {
  const semesterId = state.semesterIndex + 1;
  return BREAK_TRACKS.filter(
    (track) =>
      track.availableAfterSemesters.includes(semesterId) &&
      evaluateCondition(
        state.stats,
        state.flags,
        semesterId,
        track.eligibility,
      ),
  );
}

function pickBreakTrack(state: GameState, bot: Bot): string {
  const eligible = eligibleBreakTracks(state);
  assert(
    eligible.length > 0,
    `${bot.id}: break after semester ${state.semesterIndex + 1} has no eligible track`,
  );
  const index =
    bot.mode === "chaos"
      ? mix32(state.rngSeed ^ Math.imul(state.semesterIndex + 1, 0x85eb_ca6b)) %
        eligible.length
      : (state.semesterIndex + bot.choiceOffset) % eligible.length;
  return eligible[index].id;
}

function pickBreakAction(state: GameState, bot: Bot): string {
  const track = BREAK_TRACKS.find((entry) => entry.id === state.pendingBreakId);
  assert(track, `${bot.id}: selected break track ${state.pendingBreakId ?? "missing"} does not exist`);
  const index = (state.breakTurn + bot.choiceOffset) % track.actions.length;
  return track.actions[index].id;
}

function shouldVisitResearch(state: GameState, bot: Bot): boolean {
  if (state.semesterIndex + 1 < 2 || bot.researchStrategy === "clinical-only") {
    return false;
  }
  if (bot.researchStrategy === "focused") return true;
  if (bot.researchStrategy === "balanced") {
    return state.globalWeek % 5 === 1;
  }
  return false;
}

function nextProjectTemplate(state: GameState): string | undefined {
  if (!state.research.labId) return undefined;
  const used = new Set(state.research.projects.map((project) => project.templateId));
  return RESEARCH_PROJECT_TEMPLATES.find(
    (template) => template.labId === state.research.labId && !used.has(template.id),
  )?.id;
}

function applyInput(state: GameState, input: PlayerInput): GameState {
  switch (input.type) {
    case "chooseElective":
      return chooseElective(state, input.id);
    case "beginSemester":
      return beginSemester(state);
    case "action":
      return chooseAction(state, input.id);
    case "card":
      return playCard(state, input.id);
    case "finishWeek":
      return finishWeek(state);
    case "eventChoice":
      return resolveEventChoice(state, input.id);
    case "continueEvent":
      return continueAfterEvent(state);
    case "continueSummary":
      return continueAfterWeeklySummary(state);
    case "resolveBoss":
      return resolveBoss(state);
    case "advanceBoss":
      return advanceAfterBoss(state);
    case "chooseBreakTrack":
      return chooseBreakTrack(state, input.id);
    case "breakAction":
      return takeBreakAction(state, input.id);
    case "openResearch":
      return openResearchDashboard(state);
    case "closeResearch":
      return closeResearchDashboard(state);
    case "joinResearchLab":
      return joinResearchLab(state, input.id);
    case "startResearchProject":
      return startResearchProject(state, input.id);
    case "selectResearchProject":
      return selectActiveResearchProject(state, input.id);
    case "resubmitResearchProject":
      return resubmitResearchProject(state, input.id);
    case "abandonResearchProject":
      return abandonResearchProject(state, input.id);
  }
}

function checkState(state: GameState, label: string): void {
  for (const [key, value] of Object.entries(state.stats)) {
    assert(Number.isFinite(value), `${label}: ${key} is not finite (${value})`);
    if (key === "money") {
      assert(
        value >= MONEY_MIN && value <= MONEY_MAX,
        `${label}: money out of range (${value})`,
      );
    } else {
      assert(value >= 0 && value <= 100, `${label}: ${key} out of range (${value})`);
    }
  }
  assert(Number.isInteger(state.rngCursor), `${label}: invalid RNG cursor`);
  assert(state.rngCursor >= 0, `${label}: negative RNG cursor`);
}

function checkElectiveDraft(state: GameState, label: string): void {
  const semesterId = state.semesterIndex + 1;
  const semester = SEMESTERS[state.semesterIndex];
  assert(semester, `${label}: missing semester ${semesterId}`);
  assert(
    state.electiveOffers.length === 3,
    `${label}: semester ${semesterId} expected 3 elective offers, got ${state.electiveOffers.length}`,
  );
  assert(
    new Set(state.electiveOffers).size === state.electiveOffers.length,
    `${label}: semester ${semesterId} elective draft contains duplicates`,
  );
  for (const electiveId of state.electiveOffers) {
    const elective = ELECTIVES.find((entry) => entry.id === electiveId);
    assert(elective, `${label}: unknown elective offer ${electiveId}`);
    assert(
      elective.stage.includes("any") || elective.stage.includes(semester.stage),
      `${label}: elective ${electiveId} is invalid for stage ${semester.stage}`,
    );
    assert(
      semesterId >= elective.minSemester && semesterId <= elective.maxSemester,
      `${label}: elective ${electiveId} is invalid for semester ${semesterId}`,
    );
    assert(
      evaluateCondition(
        state.stats,
        state.flags,
        semesterId,
        elective.prerequisites,
      ),
      `${label}: elective ${electiveId} has unmet prerequisites`,
    );
  }
}

function playPrimary(bot: Bot, difficulty: Difficulty, seed: number): RunResult {
  let state = newGame(difficulty, "Harness", { seed });
  const trace: PlayerInput[] = [];
  const eventsSeen = new Set<string>();
  const actionCounts: Record<string, number> = {};
  const electiveChoices: string[] = [];
  const breakActionCounts: Record<number, number> = {};
  const weeksSeen = new Set<string>();
  let semesterOpenCount = 0;
  let researchDashboardVisits = 0;
  let lastResearchWeekVisited = -1;

  const apply = (input: PlayerInput) => {
    assert(trace.length < GUARD_LIMIT, `${bot.id}/${difficulty}/${seed}: guard hit`);
    trace.push(input);
    state = applyInput(state, input);
  };
  /**
   * Reads the live screen. The loop below switches on `state.screen`, which
   * narrows `state` for the rest of that case, but `apply` reassigns it — a
   * change TypeScript cannot see through the closure. Post-apply screen checks
   * must read through here, or they compile as impossible comparisons.
   */
  const screenNow = (): Screen => state.screen;

  while (state.screen !== "ending") {
    checkState(state, `${bot.id}/${difficulty}/${seed}`);
    switch (state.screen) {
      case "semesterOpen": {
        const label = `${bot.id}/${difficulty}/${seed}`;
        checkElectiveDraft(state, label);
        semesterOpenCount += 1;
        const electiveId = pickElective(state, bot);
        apply({ type: "chooseElective", id: electiveId });
        assert(
          state.activeElective === electiveId,
          `${label}: elective ${electiveId} could not be selected`,
        );
        electiveChoices.push(electiveId);
        apply({ type: "beginSemester" });
        assert(
          screenNow() === "planning",
          `${label}: selected elective did not begin semester ${state.semesterIndex + 1}`,
        );
        break;
      }
      case "planning": {
        weeksSeen.add(`${state.semesterIndex + 1}:${state.weekInSemester}`);
        if (
          state.globalWeek !== lastResearchWeekVisited &&
          shouldVisitResearch(state, bot)
        ) {
          lastResearchWeekVisited = state.globalWeek;
          apply({ type: "openResearch" });
          break;
        }
        let actionTurn = 0;
        while (state.actionPointsRemaining > 0) {
          const actionId = pickAction(state, bot, actionTurn);
          if (!actionId) break;
          const before = state.actionPointsRemaining;
          apply({ type: "action", id: actionId });
          if (state.actionPointsRemaining >= before) break;
          actionCounts[actionId] = (actionCounts[actionId] ?? 0) + 1;
          actionTurn += 1;
        }
        while (state.weeklyCards.length > 0 && state.cardsPlayedThisWeek < 2) {
          const cardId = pickCard(state, bot);
          if (!cardId) break;
          const before = state.cardsPlayedThisWeek;
          apply({ type: "card", id: cardId });
          if (state.cardsPlayedThisWeek <= before) break;
        }
        apply({ type: "finishWeek" });
        break;
      }
      case "researchDashboard": {
        researchDashboardVisits += 1;
        const label = `${bot.id}/${difficulty}/${seed}:research`;
        if (!state.research.labId) {
          const offeredLab = state.research.labOffers[0];
          if (offeredLab) {
            apply({ type: "joinResearchLab", id: offeredLab });
            assert(state.research.labId === offeredLab, `${label}: offered lab did not join`);
          } else {
            const before = state.research.reputationInLab;
            const apBefore = state.actionPointsRemaining;
            apply({ type: "action", id: "research_interest" });
            if (state.actionPointsRemaining < apBefore) {
              actionCounts.research_interest =
                (actionCounts.research_interest ?? 0) + 1;
            }
            assert(
              state.research.reputationInLab > before || state.actionPointsRemaining < 1,
              `${label}: usable research interest did not build PI trust`,
            );
          }
          apply({ type: "closeResearch" });
          break;
        }

        const rejected = state.research.projects.find(
          (project) => project.phase === "rejected",
        );
        if (rejected) {
          apply({ type: "resubmitResearchProject", id: rejected.id });
        }

        let active = state.research.projects.find(
          (project) => project.id === state.research.activeProjectId,
        );
        if (!active || active.phase === "accepted" || active.phase === "abandoned") {
          const existing = state.research.projects.find(
            (project) =>
              project.phase !== "accepted" &&
              project.phase !== "abandoned" &&
              project.phase !== "rejected",
          );
          if (existing) {
            apply({ type: "selectResearchProject", id: existing.id });
          } else {
            const templateId = nextProjectTemplate(state);
            if (templateId) apply({ type: "startResearchProject", id: templateId });
          }
          active = state.research.projects.find(
            (project) => project.id === state.research.activeProjectId,
          );
        }

        if (
          active &&
          active.phase !== "submitted" &&
          active.phase !== "rejected" &&
          state.actionPointsRemaining >= 2
        ) {
          const before = state.actionPointsRemaining;
          apply({ type: "action", id: "lab_work" });
          if (state.actionPointsRemaining < before) {
            assert(
              state.actionPointsRemaining === before - 2,
              `${label}: lab work spent ${before - state.actionPointsRemaining} AP instead of 2`,
            );
            actionCounts.lab_work = (actionCounts.lab_work ?? 0) + 1;
          }
        }
        apply({ type: "closeResearch" });
        break;
      }
      case "event": {
        if (state.pendingChoiceId) {
          apply({ type: "continueEvent" });
        } else {
          const event = getPendingEvent(state);
          assert(event, `${bot.id}/${difficulty}/${seed}: missing pending event`);
          eventsSeen.add(event.id);
          apply({ type: "eventChoice", id: pickEventChoice(state, bot) });
        }
        break;
      }
      case "weeklySummary":
        apply({ type: "continueSummary" });
        break;
      case "boss":
        apply(state.lastBossResult ? { type: "advanceBoss" } : { type: "resolveBoss" });
        break;
      case "breakChapter": {
        const afterSemester = state.semesterIndex + 1;
        if (!state.pendingBreakId) {
          const choicesBefore = state.breakChoices.length;
          const trackId = pickBreakTrack(state, bot);
          apply({ type: "chooseBreakTrack", id: trackId });
          assert(
            state.pendingBreakId === trackId &&
              state.breakChoices.length === choicesBefore + 1,
            `${bot.id}/${difficulty}/${seed}: break track ${trackId} was not recorded`,
          );
        } else {
          const turnBefore = state.breakTurn;
          const actionId = pickBreakAction(state, bot);
          apply({ type: "breakAction", id: actionId });
          breakActionCounts[afterSemester] =
            (breakActionCounts[afterSemester] ?? 0) + 1;
          if (turnBefore + 1 < BREAK_ACTIONS_PER_CHAPTER) {
            assert(
              screenNow() === "breakChapter" && state.breakTurn === turnBefore + 1,
              `${bot.id}/${difficulty}/${seed}: break turn ${turnBefore + 1} did not advance exactly once`,
            );
          } else {
            assert(
              screenNow() === "semesterOpen" &&
                state.semesterIndex + 1 === afterSemester + 1,
              `${bot.id}/${difficulty}/${seed}: third break action did not open semester ${afterSemester + 1}`,
            );
          }
        }
        break;
      }
      default:
        throw new Error(
          `${bot.id}/${difficulty}/${seed}: unsupported screen ${state.screen}`,
        );
    }
  }

  checkState(state, `${bot.id}/${difficulty}/${seed}:final`);
  assert(
    state.semesterIndex === SEMESTERS.length - 1,
    `${bot.id}/${difficulty}/${seed}: ended in semester index ${state.semesterIndex}`,
  );
  assert(
    state.bossHistory.length === BOSSES.length,
    `${bot.id}/${difficulty}/${seed}: expected ${BOSSES.length} bosses, got ${state.bossHistory.length}`,
  );
  assert(
    state.globalWeek === SEMESTERS.length * WEEKS_PER_SEMESTER,
    `${bot.id}/${difficulty}/${seed}: expected ${SEMESTERS.length * WEEKS_PER_SEMESTER} weeks, got ${state.globalWeek}`,
  );
  assert(
    weeksSeen.size === SEMESTERS.length * WEEKS_PER_SEMESTER,
    `${bot.id}/${difficulty}/${seed}: expected ${SEMESTERS.length * WEEKS_PER_SEMESTER} unique planning weeks, got ${weeksSeen.size}`,
  );
  for (const semester of SEMESTERS) {
    for (let week = 1; week <= WEEKS_PER_SEMESTER; week += 1) {
      assert(
        weeksSeen.has(`${semester.id}:${week}`),
        `${bot.id}/${difficulty}/${seed}: missing semester ${semester.id} week ${week}`,
      );
    }
  }
  assert(
    semesterOpenCount === SEMESTERS.length &&
      electiveChoices.length === SEMESTERS.length,
    `${bot.id}/${difficulty}/${seed}: expected ${SEMESTERS.length} semester opens/electives, got ${semesterOpenCount}/${electiveChoices.length}`,
  );
  assert(
    state.breakChoices.length === BREAK_AFTER_SEMESTERS.length,
    `${bot.id}/${difficulty}/${seed}: expected ${BREAK_AFTER_SEMESTERS.length} break tracks, got ${state.breakChoices.length}`,
  );
  for (const afterSemester of BREAK_AFTER_SEMESTERS) {
    assert(
      state.breakChoices.filter(
        (choice) => choice.afterSemester === afterSemester,
      ).length === 1,
      `${bot.id}/${difficulty}/${seed}: expected one break track after semester ${afterSemester}`,
    );
    assert(
      breakActionCounts[afterSemester] === BREAK_ACTIONS_PER_CHAPTER,
      `${bot.id}/${difficulty}/${seed}: break after semester ${afterSemester} expected ${BREAK_ACTIONS_PER_CHAPTER} actions, got ${breakActionCounts[afterSemester] ?? 0}`,
    );
  }
  if (bot.researchStrategy === "focused") {
    assert(
      researchDashboardVisits > 0 && Boolean(state.research.labId),
      `${bot.id}/${difficulty}/${seed}: focused strategy never joined a lab`,
    );
    assert(
      state.research.projects.length > 0 && state.research.activity.length > 0,
      `${bot.id}/${difficulty}/${seed}: focused strategy produced no visible project/activity history`,
    );
    assert(
      state.research.activity.some((activity) => Boolean(activity.roll)),
      `${bot.id}/${difficulty}/${seed}: focused strategy exposed no research roll breakdown`,
    );
  }
  assert(getEnding(state)?.id, `${bot.id}/${difficulty}/${seed}: missing ending`);
  return {
    finalState: state,
    trace,
    eventsSeen: [...eventsSeen],
    actionCounts,
    electiveChoices,
    breakActionCounts,
    weeksSeen: [...weeksSeen],
    semesterOpenCount,
    researchDashboardVisits,
  };
}

function replay(
  difficulty: Difficulty,
  seed: number,
  trace: readonly PlayerInput[],
): GameState {
  let state = newGame(difficulty, "Harness", { seed });
  assert(trace.length < GUARD_LIMIT, `replay/${difficulty}/${seed}: oversized trace`);
  for (const input of trace) state = applyInput(state, input);
  assert(state.screen === "ending", `replay/${difficulty}/${seed}: did not terminate`);
  return state;
}

function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: readonly number[]): number {
  const average = mean(values);
  return Math.sqrt(mean(values.map((value) => (value - average) ** 2)));
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function seedFor(botIndex: number, difficultyIndex: number, runIndex: number): number {
  return mix32(
    0xd35a_2000 ^
      Math.imul(botIndex + 1, 0x9e37_79b9) ^
      Math.imul(difficultyIndex + 1, 0x85eb_ca6b) ^
      Math.imul(runIndex + 1, 0xc2b2_ae35),
  );
}

function contentChecks(): void {
  assert(EVENTS.length >= 90, "expected at least 90 events");
  for (const [label, ids] of [
    ["event", EVENTS.map((item) => item.id)],
    ["card", CARDS.map((item) => item.id)],
    ["ending", ENDINGS.map((item) => item.id)],
    ["action", ACTIONS.map((item) => item.id)],
    ["elective", ELECTIVES.map((item) => item.id)],
    ["break track", BREAK_TRACKS.map((item) => item.id)],
    ["research lab", RESEARCH_LABS.map((item) => item.id)],
    ["research project", RESEARCH_PROJECT_TEMPLATES.map((item) => item.id)],
    ["research event", RESEARCH_EVENTS.map((item) => item.id)],
  ] as const) {
    assert(new Set(ids).size === ids.length, `duplicate ${label} id`);
  }
  assert(ELECTIVES.length === 14, `expected 14 electives, got ${ELECTIVES.length}`);
  assert(BREAK_TRACKS.length === 5, `expected 5 break tracks, got ${BREAK_TRACKS.length}`);
  assert(RESEARCH_LABS.length === 4, `expected 4 research labs, got ${RESEARCH_LABS.length}`);
  assert(
    RESEARCH_PROJECT_TEMPLATES.length === 10,
    `expected 10 research projects, got ${RESEARCH_PROJECT_TEMPLATES.length}`,
  );
  assert(
    RESEARCH_EVENTS.length === 24,
    `expected 24 authored research events, got ${RESEARCH_EVENTS.length}`,
  );
  assert(
    BREAK_TRACKS.every(
      (track) => track.actions.length === BREAK_ACTIONS_PER_CHAPTER,
    ),
    `every break track must expose exactly ${BREAK_ACTIONS_PER_CHAPTER} actions`,
  );
}

function foundationChecks(): void {
  const hooks = [
    { on: "actionEffects", mult: 1.5 },
    { on: "actionEffects", add: 2 },
    { on: "actionEffects", stat: "knowledge", mult: 2, add: 3 },
    { on: "actionEffects", stat: "stress", mult: 0.5, add: 1 },
  ] as const;
  const forward = applyActionHooks(
    { knowledge: 10, stress: -10 },
    ["study"],
    hooks,
  );
  const reverse = applyActionHooks(
    { knowledge: 10, stress: -10 },
    ["study"],
    [...hooks].reverse(),
  );
  assert(JSON.stringify(forward) === JSON.stringify(reverse), "modifier order changed result");
  assert(forward.knowledge === 35, "action modifier product/sum formula changed");
  assert(forward.stress === -4, "broad hooks affected a signed penalty");
  assert(
    applyWeeklyThresholdHooks({}, [{ on: "weeklyThreshold", stat: "stress", add: -2 }]).stress === -2,
    "weeklyThreshold hook funnel failed",
  );
  assert(
    getSoftCapBandShift([{ on: "softCapBand", stat: "knowledge", shift: 5 }], "knowledge") === 5,
    "softCapBand hook funnel failed",
  );
  assert(applyAffinityGainHooks(10, [{ on: "affinityGain", mult: 1.3 }]) === 13, "affinity hook funnel failed");
  assert(applyIncomeHooks(10, [{ on: "income", mult: 1.4 }]) === 14, "income hook funnel failed");
  assert(applyExpenseHooks(10, [{ on: "expense", mult: 0.8 }]) === 8, "expense hook funnel failed");

  resetModifierRegistryForTests();
  const source = { kind: "npc", id: "jordan_ally" } as const;
  const definition = [{ on: "apPerWeek", add: 1 }] as const;
  registerModifier(source, definition);
  registerModifier(source, definition);
  const npcState = newGame("normal", "Registry Probe", { seed: 41 });
  const activeNpcState: GameState = {
    ...npcState,
    npcs: { jordan: { affinity: 80, arcStage: 3, flags: ["jordan_ally"] } },
  };
  assert(
    collectHooks(activeNpcState).some((hook) => hook.on === "apPerWeek"),
    "NPC flag did not activate its registry source",
  );
  let conflictCaught = false;
  try {
    registerModifier(source, [{ on: "apPerWeek", add: 2 }]);
  } catch {
    conflictCaught = true;
  }
  assert(conflictCaught, "conflicting modifier redefinition was accepted");
  resetModifierRegistryForTests();
  registerElectiveModifiers();
  const electiveProbeState: GameState = {
    ...newGame("normal", "Elective Registry Probe", { seed: 43 }),
    activeElective: "dental_materials_seminar",
  };
  const electiveHooks = collectHooks(electiveProbeState);
  assert(
    electiveHooks.length > 0,
    "P2 selected elective did not activate its registered hooks after test reset",
  );
  assert(
    applyActionHooks({ knowledge: 10 }, ["study"], electiveHooks).knowledge === 11,
    "P2 selected elective hook did not change its tagged action effect",
  );

  const randomSequence = (seed: number): number[] => {
    let state = newGame("normal", "RNG Probe", { seed });
    const values: number[] = [];
    for (let index = 0; index < 8; index += 1) {
      const [value, next] = nextRandom(state);
      values.push(value);
      state = next;
    }
    return values;
  };
  const sequenceA = randomSequence(0x1234_5678);
  const sequenceAReplay = randomSequence(0x1234_5678);
  const sequenceB = randomSequence(0x1234_5679);
  assert(JSON.stringify(sequenceA) === JSON.stringify(sequenceAReplay), "direct RNG replay diverged");
  assert(JSON.stringify(sequenceA) !== JSON.stringify(sequenceB), "distinct RNG seeds produced the same sequence");

  const softCapBands = [
    [0, 1],
    [54, 1],
    [55, 0.75],
    [69, 0.75],
    [70, 0.5],
    [79, 0.5],
    [80, 0.3],
    [89, 0.3],
    [90, 0.15],
    [100, 0.15],
  ] as const;
  for (const [current, expected] of softCapBands) {
    assert(
      softCapMultiplier(current) === expected,
      `P1 soft-cap multiplier at ${current}: expected ${expected}, observed ${softCapMultiplier(current)}`,
    );
  }
  const capProbeState = newGame("normal", "Soft-cap Probe", { seed: 42 });
  const capProbeStats = { ...capProbeState.stats, knowledge: 90, mood: 90 };
  const capped = applySoftCaps(
    capProbeStats,
    { knowledge: 6, handSkill: -7, mood: 6 },
    [],
    {},
  );
  // 6 * 0.15 = 0.9: nothing is delivered yet, and the fraction is banked.
  assert(capped.effects.knowledge === undefined, "P1 soft cap delivered an unbanked fraction");
  assert(
    Math.abs((capped.carry.knowledge ?? 0) - 0.9) < 1e-9,
    `P1 soft cap failed to bank its remainder (observed ${capped.carry.knowledge})`,
  );
  assert(capped.effects.handSkill === -7, "P1 soft cap changed a negative skill delta");
  assert(capped.effects.mood === 6, "P1 soft cap changed an uncapped resource delta");
  assert(capped.carry.mood === undefined, "P1 soft cap banked an uncapped resource");

  // The banked remainder must pay out, so a diminished stat never fully stalls.
  const secondTouch = applySoftCaps(capProbeStats, { knowledge: 6 }, [], capped.carry);
  assert(secondTouch.effects.knowledge === 1, "P1 soft-cap carry failed to pay out");
  assert(
    Math.abs((secondTouch.carry.knowledge ?? 0) - 0.8) < 1e-9,
    `P1 soft-cap carry payout left a wrong remainder (observed ${secondTouch.carry.knowledge})`,
  );

  // The defect this ledger fixes: with a flat +1 floor, a delta of 3 gained the
  // same point at 75, 85 and 95, so the bands were not an actual reduction.
  // Ten repeated touches must now be strictly ordered by band.
  const bandYield = (current: number): number => {
    let carry: StatBlock = {};
    let delivered = 0;
    for (let touch = 0; touch < 10; touch += 1) {
      const step = applySoftCaps(
        { ...capProbeState.stats, knowledge: current },
        { knowledge: 3 },
        [],
        carry,
      );
      delivered += step.effects.knowledge ?? 0;
      carry = step.carry;
    }
    return delivered;
  };
  const yields = [50, 65, 75, 85, 95].map(bandYield);
  for (let index = 1; index < yields.length; index += 1) {
    assert(
      yields[index] < yields[index - 1],
      `P1 soft-cap bands are not strictly diminishing over repeated touches: ${yields.join(" > ")}`,
    );
  }
  assert(yields[yields.length - 1] > 0, "P1 soft cap stalled a stat completely");

  const driftStats = {
    ...capProbeState.stats,
    knowledge: 55,
    handSkill: 41,
    clinicalSense: 40,
  };
  const earlyDrift = skillDriftEffects("preclinical", driftStats, {
    knowledge: 1,
  });
  assert(earlyDrift.knowledge === undefined, "P1 drift ignored a positive weekly gain");
  assert(earlyDrift.handSkill === -1, "P1 preclinical drift must be -1");
  assert(earlyDrift.clinicalSense === undefined, "P1 drift crossed its floor of 40");
  const clinicalDrift = skillDriftEffects("clinical", driftStats, {});
  assert(clinicalDrift.knowledge === -2, "P1 clinical drift must be -2");
  assert(clinicalDrift.handSkill === -1, "P1 drift must stop exactly at floor 40");
  const advancedDrift = skillDriftEffects("advanced", driftStats, {});
  assert(advancedDrift.knowledge === -2, "P1 advanced drift must be -2");

  for (const [difficulty, expected] of [
    ["easy", 7],
    ["normal", 6],
    ["hard", 5],
  ] as const) {
    assert(
      actionPointBreakdown(difficulty, 1, 50, []).total === expected,
      `P1 ${difficulty} AP base must be ${expected}`,
    );
  }
  assert(actionPointBreakdown("normal", 3, 50, []).total === 6, "P1 AP rose before semester 4");
  assert(actionPointBreakdown("normal", 4, 50, []).total === 7, "P1 semester-4 AP milestone failed");
  assert(actionPointBreakdown("normal", 7, 50, []).total === 7, "P1 AP rose before semester 8");
  assert(actionPointBreakdown("normal", 8, 50, []).total === 8, "P1 semester-8 AP milestone failed");
  assert(actionPointBreakdown("normal", 8, 19, []).total === 7, "P1 low-stamina AP penalty failed");
  assert(actionPointBreakdown("normal", 8, 20, []).total === 8, "P1 low-stamina penalty included stamina 20");

  const ramps = Array.from({ length: 20 }, (_, index) => bossSemesterRamp(index + 1));
  assert(ramps[0] === 0, "P1 boss ramp must start at zero");
  assert(ramps.every((value) => value <= 0 && value >= -8), "P1 boss ramp escaped [-8, 0]");
  assert(
    ramps.every((value, index) => index === 0 || value <= ramps[index - 1]),
    "P1 boss ramp is not monotonic non-increasing",
  );
  assert(ramps[ramps.length - 1] === -8, "P1 boss ramp did not reach its documented -8 cap");

  const unopened = newGame("normal", "P2 Transition Probe", { seed: 44 });
  assert(unopened.screen === "semesterOpen", "P2 new game skipped semester-open screen");
  const invalidElective = chooseElective(unopened, "not_an_elective");
  assert(
    invalidElective === unopened,
    "P2 invalid elective changed state instead of a strict no-op",
  );
  const unofferedElective = ELECTIVES.find(
    (entry) => !unopened.electiveOffers.includes(entry.id),
  );
  assert(unofferedElective, "P2 transition probe could not find an unoffered elective");
  assert(
    chooseElective(unopened, unofferedElective.id) === unopened,
    "P2 unoffered elective changed state instead of a strict no-op",
  );
  assert(
    beginSemester(unopened) === unopened,
    "P2 semester began without an elective selection",
  );
  const invalidBreakState: GameState = {
    ...unopened,
    screen: "breakChapter",
    semesterIndex: 1,
    pendingBreakId: undefined,
    breakTurn: 0,
  };
  assert(
    chooseBreakTrack(invalidBreakState, "not_a_break_track") === invalidBreakState,
    "P2 invalid break track changed state instead of a strict no-op",
  );
  assert(
    chooseBreakTrack(invalidBreakState, "board_prep_camp") === invalidBreakState,
    "P2 unavailable board-prep track changed state before semester 8",
  );
  assert(
    takeBreakAction(invalidBreakState, "not_a_break_action") === invalidBreakState,
    "P2 break action changed state before selecting a track",
  );

  const planningProbe = beginSemester(
    chooseElective(unopened, unopened.electiveOffers[0]),
  );
  assert(planningProbe.screen === "planning", "P3 screen-contract probe did not reach planning");
  const interestAction = ACTIONS_BY_ID.get("research_interest");
  const labWorkAction = ACTIONS_BY_ID.get("lab_work");
  const ordinaryAction = ACTIONS_BY_ID.get("small_break");
  assert(interestAction && labWorkAction && ordinaryAction, "P3 action-contract probe missing actions");
  assert(
    !getActions(planningProbe).some(
      (action) => action.id === "research_interest" || action.id === "lab_work",
    ),
    "P3 planning action grid exposed dashboard-only research verbs",
  );
  assert(
    chooseAction(planningProbe, "research_interest") === planningProbe &&
      chooseAction(planningProbe, "lab_work") === planningProbe,
    "P3 planning accepted a dashboard-only research action",
  );
  assert(
    !actionStatus(interestAction, planningProbe).usable &&
      !actionStatus(labWorkAction, planningProbe).usable,
    "P3 planning actionStatus marked a research action usable",
  );
  const dashboardProbe = openResearchDashboard(planningProbe);
  assert(dashboardProbe.screen === "researchDashboard", "P3 dashboard did not open from planning");
  assert(
    getActions(dashboardProbe).every(
      (action) => action.id === "research_interest" || action.id === "lab_work",
    ),
    "P3 dashboard action selector exposed an ordinary planning verb",
  );
  assert(
    chooseAction(dashboardProbe, ordinaryAction.id) === dashboardProbe &&
      playCard(dashboardProbe, dashboardProbe.weeklyCards[0]) === dashboardProbe &&
      finishWeek(dashboardProbe) === dashboardProbe,
    "P3 dashboard allowed an ordinary action, card, or week resolution",
  );
  assert(
    !actionStatus(ordinaryAction, dashboardProbe).usable,
    "P3 dashboard actionStatus marked an ordinary action usable",
  );

  const summerBase: GameState = {
    ...dashboardProbe,
    screen: "breakChapter",
    semesterIndex: 1,
    pendingBreakId: "summer_research",
    breakTurn: 0,
    research: {
      ...dashboardProbe.research,
      labId: "reyes_biomaterials",
      activeProjectId: "summer_probe",
      reputationInLab: 40,
      projects: [
        {
          id: "summer_probe",
          templateId: "bond_aging_cycles",
          title: { en: "Summer probe", zh: "暑期探针" },
          phase: "idea",
          progress: 0,
          quality: 50,
          weeksInPhase: 0,
          risk: 0.12,
          stallWeeksRemaining: 0,
          submissionCount: 0,
          resubmissions: 0,
          posterPresented: false,
        },
      ],
    },
  };
  assert(
    takeBreakAction(summerBase, "summer_research_hack") === summerBase,
    "P3 invalid prefixed summer-research action changed pipeline state",
  );
  const summerProgressed = takeBreakAction(
    summerBase,
    "summer_research_protocol",
  );
  assert(
    summerProgressed.research.projects[0].progress > 0 &&
      summerProgressed.research.reputationInLab >
        summerBase.research.reputationInLab &&
      summerProgressed.research.activity.some(
        (activity) => activity.projectId === "summer_probe",
      ),
    "P3 Summer Research break did not visibly advance active project and lab trust",
  );
  const summerOutputBase: GameState = {
    ...summerBase,
    research: {
      ...summerBase.research,
      projects: [
        {
          ...summerBase.research.projects[0],
          phase: "writing",
          progress: 80,
          quality: 58,
        },
      ],
    },
  };
  const summerOutput = takeBreakAction(
    summerOutputBase,
    "summer_research_bench",
  );
  assert(
    summerOutput.research.projects[0].phase === "submitted" &&
      summerOutput.research.posters === summerOutputBase.research.posters + 1 &&
      summerOutput.research.activity.some(
        (activity) => activity.kind === "poster",
      ),
    "P3 Summer Research crossing writing did not use submission/poster pipeline",
  );

  const queuedParked = {
    ...summerBase.research.projects[0],
    id: "queued_parked",
    templateId: "bioactive_liner_pilot",
    title: { en: "Queued parked", zh: "待切换项目" },
  };
  const queuedRejected = {
    ...summerBase.research.projects[0],
    id: "queued_rejected",
    templateId: "printed_denture_accuracy",
    title: { en: "Queued rejected", zh: "待转投项目" },
    phase: "rejected" as const,
    venue: "regional" as const,
  };
  const queuedBase: GameState = {
    ...summerBase,
    screen: "researchDashboard",
    research: {
      ...summerBase.research,
      researchPoints: 20,
      projects: [
        ...summerBase.research.projects,
        queuedParked,
        queuedRejected,
      ],
    },
  };
  assert(
    startResearchProject(queuedBase, "printed_denture_accuracy") === queuedBase &&
      selectActiveResearchProject(queuedBase, queuedParked.id) === queuedBase &&
      resubmitResearchProject(queuedBase, queuedRejected.id) === queuedBase &&
      abandonResearchProject(queuedBase, "summer_probe") === queuedBase,
    "P3 queued effort could be redirected by starting, switching, resubmitting, or abandoning",
  );

  const parkedProject: GameState["research"]["projects"][number] = {
    ...summerBase.research.projects[0],
    id: "parked_probe",
    templateId: "bioactive_liner_pilot",
    title: { en: "Parked probe", zh: "暂停项目探针" },
    progress: 27,
  };
  const parkedBase: GameState = {
    ...summerBase,
    screen: "planning",
    research: {
      ...summerBase.research,
      projects: [...summerBase.research.projects, parkedProject],
    },
  };
  const parkedAfterWeek = finishWeek(parkedBase);
  const parkedAfter = parkedAfterWeek.research.projects.find(
    (project) => project.id === parkedProject.id,
  );
  assert(
    parkedAfter?.progress === parkedProject.progress &&
      !parkedAfterWeek.research.activity.some(
        (activity) =>
          activity.projectId === parkedProject.id &&
          (activity.kind === "risk" || activity.kind === "event"),
      ),
    "P3 parked project progressed or rolled risk despite not being active",
  );
}

const quick = process.argv.includes("--quick");
const seedsPerBotDifficulty = quick ? 1 : 40;
const expectedPrimaryRuns = BOTS.length * DIFFICULTIES.length * seedsPerBotDifficulty;
const endings = new Map<string, number>();
const endingsByBot = new Map<string, Map<string, number>>();
const eventsSeen = new Set<string>();
const readiness: number[] = [];
const readinessByBot = new Map<string, number[]>();
const finalStats: GameState["stats"][] = [];
const finalStatsByBot = new Map<string, GameState["stats"][]>();
const decisions: number[] = [];
const botActionCounts = new Map<string, Record<string, number>>();
const publicationCountsByBot = new Map<string, number[]>();
const posterCountsByBot = new Map<string, number[]>();
const clinicalRecordsByBot = new Map<string, number[]>();
const researchActivitiesSeen = new Set<string>();
const researchEventIdsSeen = new Set<string>();
const threePublicationRuns: Array<{
  botId: string;
  seed: number;
  publications: number;
  clinicalRecord: number;
}> = [];
let completed = 0;
let deterministicReplays = 0;
let maxDecisions = 0;
let maxReadinessRun:
  | {
      value: number;
      botId: string;
      difficulty: Difficulty;
      seed: number;
      endingId: string;
      stats: GameState["stats"];
      electiveChoices: string[];
      breakChoices: GameState["breakChoices"];
    }
  | undefined;

contentChecks();
foundationChecks();
const migrationProbe = migrateSave({
  version: "1.0.0",
  stats: { knowledge: 73 },
  playerName: "Harness Migration",
  flags: ["preserve_me"],
  eventHistory: ["preserve_event"],
  bossHistory: [],
  log: [],
});
assert(migrationProbe.ok && migrationProbe.migrated, "G12 V1 migration failed");
assert(migrationProbe.state.stats.knowledge === 73, "G12 legacy stat lost");
assert(migrationProbe.state.flags.includes("preserve_me"), "G12 legacy flag lost");
const futureProbe = migrateSave({ version: "99.0.0", stats: {} });
assert(!futureProbe.ok && futureProbe.reason === "future", "G12 future save accepted");
const startedAt = performance.now();
for (let botIndex = 0; botIndex < BOTS.length; botIndex += 1) {
  const bot = BOTS[botIndex];
  const aggregateActions: Record<string, number> = {};
  const botReadiness: number[] = [];
  const botEndings = new Map<string, number>();
  const botFinalStats: GameState["stats"][] = [];
  const botPublications: number[] = [];
  const botPosters: number[] = [];
  const botClinicalRecords: number[] = [];
  for (
    let difficultyIndex = 0;
    difficultyIndex < DIFFICULTIES.length;
    difficultyIndex += 1
  ) {
    const difficulty = DIFFICULTIES[difficultyIndex];
    for (let runIndex = 0; runIndex < seedsPerBotDifficulty; runIndex += 1) {
      const seed = seedFor(botIndex, difficultyIndex, runIndex);
      const primary = playPrimary(bot, difficulty, seed);
      const replayed = replay(difficulty, seed, primary.trace);
      assert(
        JSON.stringify(primary.finalState) === JSON.stringify(replayed),
        `G10 mismatch: ${bot.id}/${difficulty}/${seed}`,
      );

      completed += 1;
      deterministicReplays += 1;
      maxDecisions = Math.max(maxDecisions, primary.trace.length);
      decisions.push(primary.trace.length);
      const finalReadiness = careerReadiness(primary.finalState.stats);
      readiness.push(finalReadiness);
      botReadiness.push(finalReadiness);
      finalStats.push(primary.finalState.stats);
      botFinalStats.push(primary.finalState.stats);
      const publicationCount = primary.finalState.research.publications.length;
      const clinicalRecord = getStat(primary.finalState.stats, "clinicalRecord");
      botPublications.push(publicationCount);
      botPosters.push(primary.finalState.research.posters);
      botClinicalRecords.push(clinicalRecord);
      for (const activity of primary.finalState.research.activity) {
        researchActivitiesSeen.add(activity.eventId ?? activity.kind);
        if (activity.eventId) researchEventIdsSeen.add(activity.eventId);
      }
      if (publicationCount >= 3) {
        threePublicationRuns.push({
          botId: bot.id,
          seed,
          publications: publicationCount,
          clinicalRecord,
        });
      }
      const endingId = primary.finalState.endingId ?? "missing";
      if (!maxReadinessRun || finalReadiness > maxReadinessRun.value) {
        maxReadinessRun = {
          value: finalReadiness,
          botId: bot.id,
          difficulty,
          seed,
          endingId,
          stats: primary.finalState.stats,
          electiveChoices: primary.electiveChoices,
          breakChoices: primary.finalState.breakChoices,
        };
      }
      endings.set(endingId, (endings.get(endingId) ?? 0) + 1);
      botEndings.set(endingId, (botEndings.get(endingId) ?? 0) + 1);
      for (const eventId of primary.eventsSeen) eventsSeen.add(eventId);
      for (const [actionId, count] of Object.entries(primary.actionCounts)) {
        aggregateActions[actionId] = (aggregateActions[actionId] ?? 0) + count;
      }
    }
  }
  botActionCounts.set(bot.id, aggregateActions);
  readinessByBot.set(bot.id, botReadiness);
  endingsByBot.set(bot.id, botEndings);
  finalStatsByBot.set(bot.id, botFinalStats);
  publicationCountsByBot.set(bot.id, botPublications);
  posterCountsByBot.set(bot.id, botPosters);
  clinicalRecordsByBot.set(bot.id, botClinicalRecords);
}

assert(completed === expectedPrimaryRuns, `G3 expected ${expectedPrimaryRuns} runs`);
assert(deterministicReplays === expectedPrimaryRuns, "G10 replay count mismatch");

let highestActionShare = 0;
let highestActionLabel = "none";
for (const [botId, counts] of botActionCounts) {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  for (const [actionId, count] of Object.entries(counts)) {
    const share = total > 0 ? count / total : 0;
    if (share > highestActionShare) {
      highestActionShare = share;
      highestActionLabel = `${botId}:${actionId}`;
    }
  }
}

const endingReport = [...endings]
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  .map(
    ([id, count]) =>
      `${id}=${count} (${((count / completed) * 100).toFixed(1)}%)`,
  )
  .join(", ");
const [mostCommonEndingId, mostCommonEndingCount] = [...endings].sort(
  (left, right) => right[1] - left[1] || left[0].localeCompare(right[0]),
)[0];
const maxEndingShare = mostCommonEndingCount / completed;
const readinessMean = mean(readiness);
const readinessPopulationSd = standardDeviation(readiness);
const readinessMax = Math.max(...readiness);
const readinessByBotReport = BOTS.map((bot) => {
  const values = readinessByBot.get(bot.id) ?? [];
  return `${bot.id}=${mean(values).toFixed(2)}`;
}).join(", ");
const graduationStatsReport = ALL_STATS.map((stat) => {
  const values = finalStats.map((stats) => stats[stat]);
  return `${stat}=${mean(values).toFixed(2)}±${standardDeviation(values).toFixed(2)}`;
}).join(", ");
const crComponentsByBotReport = BOTS.map((bot) => {
  const stats = finalStatsByBot.get(bot.id) ?? [];
  const components = CR_COMPONENT_STATS.map((stat) =>
    mean(stats.map((runStats) => runStats[stat])).toFixed(2),
  );
  return `${bot.id}[${components.join(",")}]`;
}).join(" | ");
const endingsByBotReport = BOTS.map((bot) => {
  const counts = endingsByBot.get(bot.id) ?? new Map<string, number>();
  const distribution = [...counts]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([id, count]) => `${id}=${count}`)
    .join(",");
  return `${bot.id}[${distribution}]`;
}).join(" | ");
assert(maxReadinessRun, "G2 missing max-readiness run diagnostics");
const maxReadinessStatsReport = CR_COMPONENT_STATS
  .map((stat) => `${stat}=${maxReadinessRun.stats[stat]}`)
  .join(", ");
const deadEvents = EVENTS.filter((event) => !eventsSeen.has(event.id)).map(
  (event) => event.id,
);
const elapsedSeconds = (performance.now() - startedAt) / 1_000;
const medianDecisions = median(decisions);
const publicationRate = (botId: string): number => {
  const values = publicationCountsByBot.get(botId) ?? [];
  return values.length > 0
    ? values.filter((count) => count >= 1).length / values.length
    : 0;
};
const researchFocusedRate = publicationRate("research-max");
const balancedPublicationRate = publicationRate("balanced");
const clinicalPublicationValues = BOTS.filter(
  (bot) => bot.researchStrategy === "clinical-only",
).flatMap((bot) => publicationCountsByBot.get(bot.id) ?? []);
const clinicalOnlyPublicationRate = clinicalPublicationValues.length > 0
  ? clinicalPublicationValues.filter((count) => count >= 1).length /
    clinicalPublicationValues.length
  : 0;
const clinicalOnlyRecords = BOTS.filter(
  (bot) => bot.researchStrategy === "clinical-only",
).flatMap((bot) => clinicalRecordsByBot.get(bot.id) ?? []);
const clinicalOnlyRecordMean = mean(clinicalOnlyRecords);
const focusedPublicationCounts = publicationCountsByBot.get("research-max") ?? [];
const focusedPosterCounts = posterCountsByBot.get("research-max") ?? [];
const focusedPosterMean = mean(focusedPosterCounts);
const publicationReport = BOTS.map((bot) => {
  const publications = publicationCountsByBot.get(bot.id) ?? [];
  const posters = posterCountsByBot.get(bot.id) ?? [];
  const clinical = clinicalRecordsByBot.get(bot.id) ?? [];
  const distribution = [...new Set(publications)]
    .sort((left, right) => left - right)
    .map(
      (count) =>
        `${count}:${publications.filter((value) => value === count).length}`,
    )
    .join("/");
  const posterDistribution = [...new Set(posters)]
    .sort((left, right) => left - right)
    .map(
      (count) => `${count}:${posters.filter((value) => value === count).length}`,
    )
    .join("/");
  return `${bot.id}[pub>=1=${(publicationRate(bot.id) * 100).toFixed(1)}%,pub-dist=${distribution || "none"},poster-dist=${posterDistribution || "none"},poster-mean=${mean(posters).toFixed(2)},clinical=${mean(clinical).toFixed(2)}]`;
}).join(" | ");
const deadResearchEvents = RESEARCH_EVENTS.filter(
  (event) => !researchEventIdsSeen.has(event.id),
).map((event) => event.id);

console.log(
  `P3 ${quick ? "SMOKE" : "BALANCE"}: ${completed} primary + ${deterministicReplays} exact replays in ${elapsedSeconds.toFixed(2)}s`,
);
console.log(
  `Content: events=${EVENTS.length}, cards=${CARDS.length}, endings=${ENDINGS.length}, actions=${ACTIONS.length}, electives=${ELECTIVES.length}, break tracks=${BREAK_TRACKS.length}, research=${RESEARCH_LABS.length} labs/${RESEARCH_PROJECT_TEMPLATES.length} projects/${RESEARCH_EVENTS.length} authored events, bots=${BOTS.length}`,
);
console.log(
  "P0/P1 foundation PASS: modifier registry, soft-cap bands/floor/sign, drift, AP curve, boss ramp",
);
console.log(
  `P2 calendar PASS: ${SEMESTERS.length} semesters × ${WEEKS_PER_SEMESTER} weeks; breaks after ${BREAK_AFTER_SEMESTERS.join("/")} × ${BREAK_ACTIONS_PER_CHAPTER} turns; seeded three-offer drafts`,
);
console.log(`Endings (${endings.size}): ${endingReport}`);
console.log(
  `Observed: CR mean=${readinessMean.toFixed(3)} population-sd=${readinessPopulationSd.toFixed(3)} max=${readinessMax.toFixed(3)}; decisions median=${medianDecisions} max=${maxDecisions}`,
);
console.log(`CR mean by bot: ${readinessByBotReport}`);
console.log(`Graduation stats mean±population-SD: ${graduationStatsReport}`);
console.log(
  `CR component means by bot [knowledge,handSkill,clinicalSense,empathy,confidence]: ${crComponentsByBotReport}`,
);
console.log(`Endings by bot: ${endingsByBotReport}`);
console.log(`Research outcomes: ${publicationReport}`);
console.log(
  `G5 rates: focused=${(researchFocusedRate * 100).toFixed(1)}%; balanced=${(balancedPublicationRate * 100).toFixed(1)}%; clinical-only=${(clinicalOnlyPublicationRate * 100).toFixed(1)}%; authored activity sources=${researchActivitiesSeen.size}; 3+ publication runs=${threePublicationRuns.length}; clinical-only record mean=${clinicalOnlyRecordMean.toFixed(2)}`,
);
console.log(
  `Research event coverage: ${researchEventIdsSeen.size}/${RESEARCH_EVENTS.length}; dead=${deadResearchEvents.length > 0 ? deadResearchEvents.join(",") : "none"}; focused poster mean=${focusedPosterMean.toFixed(3)}`,
);
console.log(
  `Max CR run: value=${maxReadinessRun.value} bot=${maxReadinessRun.botId} difficulty=${maxReadinessRun.difficulty} seed=${maxReadinessRun.seed} ending=${maxReadinessRun.endingId}; ${maxReadinessStatsReport}; electives=${maxReadinessRun.electiveChoices.join(",")}; breaks=${maxReadinessRun.breakChoices.map((choice) => `${choice.afterSemester}:${choice.trackId}`).join(",")}`,
);
console.log(
  `Coverage: events=${eventsSeen.size}/${EVENTS.length} (${((eventsSeen.size / EVENTS.length) * 100).toFixed(1)}%); dead=${deadEvents.length}; max ending=${(maxEndingShare * 100).toFixed(1)}%; max action=${(highestActionShare * 100).toFixed(1)}% (${highestActionLabel})`,
);
// ---------------------------------------------------------------------------
// G13 — soft-cap saturation.  A stat that every run pins at its ceiling carries
// no decision: it is a constant wearing a progress bar, and it silently drops a
// dimension out of careerReadiness.  The carry ledger makes the §4.2 bands
// exact, but a stat with enough incidental authored sources still saturates, so
// the sweep measures the outcome rather than trusting the formula.
// ---------------------------------------------------------------------------
const SATURATION_MEAN_CEILING = 92;
const SATURATION_PINNED_SHARE = 0.25;
const SATURATION_PINNED_VALUE = 99;
/**
 * Stats already saturating when this gate landed, each with the phase that owns
 * the fix.  The gate ratchets in both directions: a NEW saturating stat fails,
 * and a listed stat that stops saturating also fails, so the entry must be
 * deleted rather than left to rot.  The list may only shrink.
 */
const SATURATION_DEBT = new Map<StatKey, string>([
  [
    "confidence",
    "P9 content tuning: ~33 incidental grants per run from cards/events/bosses, none of them a player choice",
  ],
]);

type SaturationRow = { stat: StatKey; mean: number; pinnedShare: number; saturated: boolean };
const saturationRows: SaturationRow[] = SOFT_CAPPED_STATS.map((stat) => {
  const values = finalStats.map((stats) => stats[stat]);
  const statMean = mean(values);
  const pinnedShare =
    values.length === 0
      ? 0
      : values.filter((value) => value >= SATURATION_PINNED_VALUE).length / values.length;
  return {
    stat,
    mean: statMean,
    pinnedShare,
    saturated:
      statMean >= SATURATION_MEAN_CEILING || pinnedShare > SATURATION_PINNED_SHARE,
  };
});
console.log(
  `G13 soft-cap saturation (mean, share pinned >=${SATURATION_PINNED_VALUE}): ${saturationRows
    .map(
      (row) =>
        `${row.stat}=${row.mean.toFixed(1)}/${(row.pinnedShare * 100).toFixed(0)}%${row.saturated ? "*" : ""}`,
    )
    .join(" ")}`,
);
for (const [stat, owner] of SATURATION_DEBT) {
  console.log(`G13 known saturation debt: ${stat} — ${owner}`);
}

// ---------------------------------------------------------------------------
// G14 — per-playstyle ending variety.  G1 bounds the ending distribution across
// all bots pooled, which passes even when each individual playstyle lands on one
// fixed ending every single run.  That aggregate cannot see the replayability
// question, so the concentration is measured per bot.  P8 (archetypes, semester
// modifiers, boss variants, deck-building) owns making this pass.
// ---------------------------------------------------------------------------
const G14_PER_BOT_CEILING = 0.6;
const botEndingConcentration = BOTS.map((bot) => {
  const counts = endingsByBot.get(bot.id) ?? new Map<string, number>();
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  let topId = "none";
  let topCount = 0;
  for (const [id, count] of counts) {
    if (count > topCount || (count === topCount && id < topId)) {
      topId = id;
      topCount = count;
    }
  }
  return {
    botId: bot.id,
    topId,
    share: total === 0 ? 0 : topCount / total,
    distinct: counts.size,
  };
}).sort((left, right) => right.share - left.share);
console.log(
  `G14 per-bot ending concentration (worst first): ${botEndingConcentration
    .map(
      (row) =>
        `${row.botId}=${row.topId}@${(row.share * 100).toFixed(0)}%/${row.distinct}distinct`,
    )
    .join(" ")}`,
);

if (!quick) {
  const g13Failures: string[] = [];
  for (const row of saturationRows) {
    const debtOwner = SATURATION_DEBT.get(row.stat);
    if (row.saturated && debtOwner === undefined) {
      g13Failures.push(
        `${row.stat} saturated (mean ${row.mean.toFixed(2)}, ${(row.pinnedShare * 100).toFixed(1)}% pinned) and is not recorded debt`,
      );
    }
    if (!row.saturated && debtOwner !== undefined) {
      g13Failures.push(
        `${row.stat} no longer saturates (mean ${row.mean.toFixed(2)}, ${(row.pinnedShare * 100).toFixed(1)}% pinned) — delete its SATURATION_DEBT entry`,
      );
    }
  }
  assert(
    g13Failures.length === 0,
    `G13 ${g13Failures.join("; ")}; required mean <${SATURATION_MEAN_CEILING} and pinned share <=${(SATURATION_PINNED_SHARE * 100).toFixed(0)}%`,
  );

  const p1GateFailures: string[] = [];
  if (endings.size < 10) {
    p1GateFailures.push(
      `G1 distinct endings: required >=10, observed ${endings.size}`,
    );
  }
  if (maxEndingShare > 0.25) {
    p1GateFailures.push(
      `G1 max share: required <=25%, observed ${mostCommonEndingId} at ${(maxEndingShare * 100).toFixed(3)}% (${mostCommonEndingCount}/${completed})`,
    );
  }
  if (readinessMean < 62 || readinessMean > 78) {
    p1GateFailures.push(
      `G2 CR mean: required [62, 78], observed ${readinessMean.toFixed(3)}`,
    );
  }
  if (readinessPopulationSd < 8) {
    p1GateFailures.push(
      `G2 CR population SD: required >=8, observed ${readinessPopulationSd.toFixed(3)}`,
    );
  }
  if (readinessMax >= 95) {
    p1GateFailures.push(
      `G2 CR max: required <95, observed ${readinessMax.toFixed(3)}`,
    );
  }
  assert(
    p1GateFailures.length === 0,
    `${p1GateFailures.join("; ")}; endings: ${endingReport}; CR by bot: ${readinessByBotReport}`,
  );
  assert(
    medianDecisions >= 250,
    `G9 P2 interim requires median run length >=250 decisions, observed ${medianDecisions}`,
  );
  const g5Failures: string[] = [];
  if (researchFocusedRate < 0.6) {
    g5Failures.push(
      `focused publication rate required >=60%, observed ${(researchFocusedRate * 100).toFixed(3)}%`,
    );
  }
  if (balancedPublicationRate > 0.2) {
    g5Failures.push(
      `balanced publication rate required <=20%, observed ${(balancedPublicationRate * 100).toFixed(3)}%`,
    );
  }
  if (clinicalOnlyPublicationRate > 0.05) {
    g5Failures.push(
      `clinical-only publication rate required <=5%, observed ${(clinicalOnlyPublicationRate * 100).toFixed(3)}%`,
    );
  }
  if (focusedPublicationCounts.some((count) => count < 1 || count > 2)) {
    g5Failures.push(
      `focused publication tuning requires every run in [1,2], observed range ${Math.min(...focusedPublicationCounts)}-${Math.max(...focusedPublicationCounts)}`,
    );
  }
  if (focusedPosterMean < 1 || focusedPosterMean > 2) {
    g5Failures.push(
      `focused poster tuning requires mean [1,2], observed ${focusedPosterMean.toFixed(3)}`,
    );
  }
  const hiddenCostRuns = threePublicationRuns.filter(
    (run) => run.clinicalRecord > clinicalOnlyRecordMean - 5,
  );
  if (hiddenCostRuns.length > 0) {
    g5Failures.push(
      `3+ publication runs without >=5-point visible clinicalRecord cost: ${hiddenCostRuns
        .map(
          (run) =>
            `${run.botId}/${run.seed}=pub${run.publications},clinical${run.clinicalRecord}`,
        )
        .join(",")}; clinical-only mean=${clinicalOnlyRecordMean.toFixed(3)}`,
    );
  }
  assert(g5Failures.length === 0, `G5 ${g5Failures.join("; ")}; ${publicationReport}`);
}
console.log(
  quick
    ? "G1/G2 DIAGNOSTIC ONLY: full-sweep P1 distribution assertions skipped"
    : "G1 PASS: >=10 endings and max share <=25% | G2 PASS: CR mean [62,78], population SD >=8, max <95",
);
console.log("G3 PASS: all bots terminate, guard <20000");
console.log(
  quick
    ? "G4 DEFERRED P9 | G5 DIAGNOSTIC ONLY: full-sweep rate assertions skipped | G6 DEFERRED P7 | G7 DEFERRED P6"
    : "G4 DEFERRED P9 | G5 PASS: focused >=60%, balanced <=20%, clinical-only <=5%, 3+ papers show clinicalRecord cost | G6 DEFERRED P7 | G7 DEFERRED P6",
);
console.log(
  quick
    ? "G13 DIAGNOSTIC ONLY: full-sweep saturation assertion skipped"
    : `G13 PASS: no unrecorded soft-cap saturation (${SATURATION_DEBT.size} known debt entr${SATURATION_DEBT.size === 1 ? "y" : "ies"})`,
);
console.log(
  `G14 DEFERRED P8: per-bot ending concentration ceiling ${(G14_PER_BOT_CEILING * 100).toFixed(0)}%; worst now ${botEndingConcentration[0]?.botId ?? "n/a"} at ${((botEndingConcentration[0]?.share ?? 0) * 100).toFixed(1)}%`,
);
console.log(
  quick
    ? "G8 DEFERRED P6 | G9 DIAGNOSTIC ONLY: full-sweep median assertion skipped | G10 PASS: byte-identical final states"
    : `G8 DEFERRED P6 | G9 P2 PASS: median ${medianDecisions} >=250 | G10 PASS: byte-identical final states`,
);
console.log("G11 EXTERNAL: build + validator | G12 PASS: V1 migration + future refusal");
console.log(quick ? "SMOKE P3 OK" : "BALANCE P3 OK");
