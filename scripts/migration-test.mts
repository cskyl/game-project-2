import { INITIAL_STATS } from "../src/game/initialState";
import { migrateSave, type V1GameState } from "../src/game/migration";
import { nextRandom } from "../src/game/rng";
import {
  chooseAction,
  chooseBreakTrack,
  joinResearchLab,
  startResearchProject,
  finishWeek,
  playCard,
  selectActiveResearchProject,
  abandonResearchProject,
  takeBreakAction,
} from "../src/game/engine";
import { BREAK_TRACKS } from "../src/data/breaks";
import {
  RESEARCH_EVENTS_BY_ID,
  RESEARCH_PROJECT_TEMPLATES,
} from "../src/data/research";
import {
  isResearchActionAvailable,
  tickResearch,
} from "../src/game/systems/research";
import type { GameState, ResearchProject, StatKey } from "../src/game/types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`G12 ASSERT FAILED: ${message}`);
}

const { focus: _focus, standing: _standing, ...v1Stats } = INITIAL_STATS;
const fixture: V1GameState = {
  version: "1.0.0",
  playerName: "Migration Tester",
  difficulty: "hard",
  semesterIndex: 6,
  weekInSemester: 3,
  globalWeek: 27,
  actionPointsRemaining: 2,
  stats: { ...v1Stats, knowledge: 73, money: -12 },
  weekStartStats: { ...v1Stats, knowledge: 70, money: -10 },
  flags: ["kept_flag", "hit_critical_stress"],
  eventHistory: ["event_a", "event_b"],
  bossHistory: [
    { bossId: "boss_a", semesterId: 1, score: 66, outcome: "pass" },
  ],
  log: [
    {
      id: "old_log",
      semesterId: 7,
      weekInSemester: 3,
      text: { en: "Preserve me", zh: "请保留我" },
      effects: { knowledge: 3 },
      kind: "action",
    },
  ],
  weeklyCards: ["card_coffee"],
  cardsPlayedThisWeek: 1,
  lowMoodStreak: 2,
  weekWarnings: ["lowMood"],
  unlockedAchievements: ["first_boss_great"],
  screen: "event",
  pendingEventId: "event_b",
  pendingChoiceId: "choice_a",
  pendingBossId: undefined,
  lastBossResult: undefined,
  endingId: undefined,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

const migrated = migrateSave(fixture);
assert(migrated.ok, "representative V1 fixture must load");
assert(migrated.migrated, "fixture must be marked migrated");
assert(migrated.state.version === "2.0.0", "version not upgraded");
for (const key of Object.keys(fixture.stats) as Array<keyof typeof fixture.stats>) {
  assert(migrated.state.stats[key as StatKey] === fixture.stats[key], `lost stat ${key}`);
}
assert(JSON.stringify(migrated.state.flags) === JSON.stringify(fixture.flags), "flags changed");
assert(
  JSON.stringify(migrated.state.eventHistory) === JSON.stringify(fixture.eventHistory),
  "event history changed",
);
assert(
  JSON.stringify(migrated.state.bossHistory) === JSON.stringify(fixture.bossHistory),
  "boss history changed",
);
assert(JSON.stringify(migrated.state.log) === JSON.stringify(fixture.log), "log changed");
assert(migrated.state.stats.focus === INITIAL_STATS.focus, "focus default missing");
assert(migrated.state.stats.standing === INITIAL_STATS.standing, "standing default missing");
assert(migrated.state.debt === 0, "debt default missing");
assert(migrated.state.research.projects.length === 0, "research default missing");
assert(migrated.state.migrationNotice?.en && migrated.state.migrationNotice.zh, "notice missing");

const future = migrateSave({ version: "99.0.0", stats: {} });
assert(!future.ok && future.reason === "future", "future version was not refused");
const malformed = migrateSave({ version: "1.0.0" });
assert(!malformed.ok && malformed.reason === "malformed", "malformed save was accepted");

function assertRefusedWithoutThrow(
  value: unknown,
  reason: "malformed" | "future",
  label: string,
): void {
  let result: ReturnType<typeof migrateSave> | undefined;
  try {
    result = migrateSave(value);
  } catch (error) {
    throw new Error(`G12 ASSERT FAILED: ${label} threw ${String(error)}`);
  }
  assert(!result.ok && result.reason === reason, `${label} was not refused as ${reason}`);
}

assertRefusedWithoutThrow({ stats: fixture.stats }, "malformed", "missing version");
assertRefusedWithoutThrow(
  { version: 1, stats: fixture.stats },
  "malformed",
  "numeric version",
);
assertRefusedWithoutThrow(
  { version: "0.9.0", stats: fixture.stats },
  "malformed",
  "unsupported old version",
);
assertRefusedWithoutThrow(
  { version: "2.0.0", stats: {} },
  "malformed",
  "truncated V2",
);
assertRefusedWithoutThrow(
  { ...migrated.state, rngCursor: Number.NaN },
  "malformed",
  "V2 with invalid RNG cursor",
);

const badWeekStart = migrateSave({
  ...fixture,
  weekStartStats: {
    ...fixture.weekStartStats,
    knowledge: "not-a-number",
    handSkill: Number.POSITIVE_INFINITY,
    money: Number.NaN,
  },
  unknownLegacyField: { preserved: true },
});
assert(badWeekStart.ok, "bad legacy weekStartStats should be sanitized, not throw");
for (const key of Object.keys(INITIAL_STATS) as StatKey[]) {
  assert(Number.isFinite(badWeekStart.state.weekStartStats[key]), `bad weekStart ${key}`);
}
assert(
  badWeekStart.state.weekStartStats.knowledge === badWeekStart.state.stats.knowledge,
  "invalid weekStart knowledge did not fall back to current stats",
);
assert(
  (badWeekStart.state as GameState & Record<string, unknown>).unknownLegacyField !== undefined,
  "safe unknown legacy field was dropped",
);

const current = migrateSave(migrated.state);
assert(current.ok && !current.migrated, "complete V2 state was not accepted");

// P1 V2 saves predate the calendar fields. They remain loadable through the
// narrow, explicit default hydration path, while malformed values are still
// rejected by the strict validator.
const { electiveOffers: _oldOffers, breakTurn: _oldBreakTurn, ...p1Save } = migrated.state;
const p1Loaded = migrateSave(p1Save);
assert(p1Loaded.ok && p1Loaded.migrated, "P1 V2 save was not hydrated");
assert(p1Loaded.state.electiveOffers.length === 0, "P1 elective defaults wrong");
assert(p1Loaded.state.breakTurn === 0, "P1 break default wrong");
assertRefusedWithoutThrow(
  { ...p1Save, electiveOffers: "not-an-array" },
  "malformed",
  "P1 save with malformed elective offers",
);

// P2 V2 saves contain the original research skeleton but predate the P3
// dashboard/activity fields. They must hydrate without discarding any existing
// research counters or arrays.
const {
  labOffers: _oldLabOffers,
  activeProjectId: _oldActiveProjectId,
  activity: _oldResearchActivity,
  ...p2Research
} = migrated.state.research;
const p2Save = { ...migrated.state, research: p2Research };
const p2Loaded = migrateSave(p2Save);
assert(p2Loaded.ok && p2Loaded.migrated, "P2 V2 research state was not hydrated");
assert(p2Loaded.state.research.labOffers.length === 0, "P2 lab offer defaults wrong");
assert(p2Loaded.state.research.activity.length === 0, "P2 activity defaults wrong");
assert(
  p2Loaded.state.research.reputationInLab === migrated.state.research.reputationInLab,
  "P2 lab reputation changed",
);
assertRefusedWithoutThrow(
  { ...p2Save, research: { ...p2Research, activity: "not-an-array" } },
  "malformed",
  "P2 save with malformed research activity",
);

const invalidRngState = {
  ...migrated.state,
  rngSeed: Number.NaN,
  rngCursor: Number.NaN,
} as GameState;
const [firstRandom, firstRngState] = nextRandom(invalidRngState);
const [secondRandom, secondRngState] = nextRandom(firstRngState);
assert(Number.isFinite(firstRandom) && firstRandom >= 0 && firstRandom < 1, "bad RNG value");
assert(Number.isFinite(firstRngState.rngSeed), "invalid RNG seed was not normalized");
assert(firstRngState.rngCursor === 1, "invalid RNG cursor was not normalized");
assert(secondRngState.rngCursor === 2, "normalized RNG cursor did not advance");
assert(firstRandom !== secondRandom, "invalid RNG state produced a dead constant stream");

// Calendar completion contracts: every selected track is exactly three turns;
// Rest clears sleep debt, while the board camp flag is earned regardless of
// which of its three authored actions is repeated.
const fresh = migrated.state;
const rest = BREAK_TRACKS.find((track) => track.id === "rest_and_reset");
assert(rest, "rest track missing");
let breakState: GameState = {
  ...fresh,
  semesterIndex: 1,
  screen: "breakChapter",
  pendingBreakId: undefined,
  breakTurn: 0,
  sleepDebt: 18,
};
breakState = chooseBreakTrack(breakState, rest.id);
assert(breakState.pendingBreakId === rest.id, "rest track did not select");
for (let turn = 0; turn < 3; turn += 1) {
  breakState = takeBreakAction(breakState, rest.actions[turn].id);
}
assert(breakState.breakTurn === 0, "break did not close after three turns");
assert(breakState.screen === "semesterOpen", "break did not open next semester");
assert(breakState.sleepDebt === 0, "rest break did not clear sleep debt");

const board = BREAK_TRACKS.find((track) => track.id === "board_prep_camp");
assert(board, "board prep track missing");
let boardState: GameState = {
  ...fresh,
  semesterIndex: 7,
  screen: "breakChapter",
  pendingBreakId: undefined,
  breakTurn: 0,
  flags: [],
};
boardState = chooseBreakTrack(boardState, board.id);
for (let turn = 0; turn < 3; turn += 1) {
  boardState = takeBreakAction(boardState, board.actions[turn].id);
}
assert(boardState.flags.includes("inbde_ready"), "board prep did not grant inbde_ready");

// P3 research core contracts: recruitment is visible and AP-bound, project
// templates cannot be farmed twice, stalls block exactly their advertised
// future weeks, and seeded review clocks last exactly 2–4 ticks.
let recruitment: GameState = {
  ...fresh,
  semesterIndex: 1,
  screen: "researchDashboard",
  actionPointsRemaining: 10,
  stats: { ...fresh.stats, knowledge: 45 },
};
for (let attempt = 0; attempt < 4; attempt += 1) {
  const apBefore = recruitment.actionPointsRemaining;
  recruitment = chooseAction(recruitment, "research_interest");
  assert(
    recruitment.actionPointsRemaining === apBefore - 1,
    "research interest did not cost exactly 1 AP",
  );
}
assert(recruitment.research.reputationInLab === 32, "research interest trust gain changed");
assert(recruitment.research.labOffers.length > 0, "eligible lab offer was not visible");
const offeredLab = recruitment.research.labOffers[0];
recruitment = joinResearchLab(recruitment, offeredLab);
assert(recruitment.research.labId === offeredLab, "visible lab offer could not be joined");
const projectTemplate = RESEARCH_PROJECT_TEMPLATES.find(
  (template) => template.labId === offeredLab,
);
assert(projectTemplate, "joined lab has no project template");
recruitment = startResearchProject(recruitment, projectTemplate.id);
assert(recruitment.research.projects.length === 1, "research project did not start");
const onceStarted = recruitment;
recruitment = startResearchProject(recruitment, projectTemplate.id);
assert(
  recruitment.research.projects.length === onceStarted.research.projects.length,
  "duplicate project template could be farmed",
);
const labApBefore = recruitment.actionPointsRemaining;
recruitment = chooseAction(recruitment, "lab_work");
assert(
  recruitment.actionPointsRemaining === labApBefore - 2 &&
    recruitment.research.researchPoints > 0,
  "lab work did not cost 2 AP and queue visible progress",
);
const queued = recruitment;
assert(
  selectActiveResearchProject(queued, "not_the_queued_project") === queued,
  "queued effort allowed a project switch",
);
assert(
  abandonResearchProject(queued, queued.research.activeProjectId ?? "") === queued,
  "queued effort allowed its project to be abandoned",
);
assert(
  startResearchProject(queued, projectTemplate.id) === queued,
  "queued effort allowed a new project to start",
);

// Screen FSM: planning verbs and research-dashboard verbs cannot leak into one
// another. These identity checks also catch accidental transition timestamps.
const dashboardProbe = { ...queued, research: { ...queued.research, researchPoints: 0 } };
assert(
  chooseAction(dashboardProbe, "sleep") === dashboardProbe,
  "ordinary action resolved from research dashboard",
);
assert(
  playCard(dashboardProbe, dashboardProbe.weeklyCards[0] ?? "missing") === dashboardProbe,
  "card resolved from research dashboard",
);
assert(finishWeek(dashboardProbe) === dashboardProbe, "week finished from research dashboard");
const planningProbe: GameState = { ...dashboardProbe, screen: "planning" };
assert(
  chooseAction(planningProbe, "research_interest") === planningProbe,
  "research interest resolved from planning screen",
);
assert(
  chooseAction(planningProbe, "lab_work") === planningProbe,
  "lab work resolved from planning screen",
);

const baseProject: ResearchProject = {
  id: "clock_probe",
  templateId: projectTemplate.id,
  title: projectTemplate.title,
  phase: "collection",
  progress: 0,
  quality: 60,
  weeksInPhase: 0,
  risk: 0,
  stallWeeksRemaining: 2,
  submissionCount: 0,
  resubmissions: 0,
  posterPresented: false,
};
let stalled: GameState = {
  ...recruitment,
  research: {
    ...recruitment.research,
    activeProjectId: baseProject.id,
    researchPoints: 0,
    projects: [baseProject],
  },
};
assert(!isResearchActionAvailable(stalled, "lab_work"), "stall did not gate lab work");
stalled = tickResearch(stalled);
assert(
  stalled.research.projects[0].stallWeeksRemaining === 1 &&
    !isResearchActionAvailable(stalled, "lab_work"),
  "two-week stall did not block its first future week",
);
stalled = tickResearch(stalled);
assert(
  stalled.research.projects[0].stallWeeksRemaining === 0 &&
    isResearchActionAvailable(stalled, "lab_work"),
  "two-week stall did not reopen after exactly two future weeks",
);

// IRB clarification is a real phase repeat: both the phase progress and its
// elapsed-week counter reset, while the authored activity remains visible.
const irbRepeat = RESEARCH_EVENTS_BY_ID.research_irb_clarification;
assert(irbRepeat?.effects.repeatPhase, "IRB clarification repeat producer missing");
let irbSeed: GameState | undefined;
for (let candidate = 1; candidate <= 5000 && !irbSeed; candidate += 1) {
  const probe: GameState = {
    ...recruitment,
    rngSeed: candidate,
    rngCursor: 0,
    research: {
      ...recruitment.research,
      researchPoints: 0,
      activeProjectId: "irb_repeat_probe",
      projects: [{
        ...baseProject,
        id: "irb_repeat_probe",
        phase: "irb",
        progress: 73,
        weeksInPhase: 4,
        risk: 1,
        stallWeeksRemaining: 0,
      }],
    },
  };
  const resolved = tickResearch(probe);
  if (resolved.research.activity.some((entry) => entry.eventId === irbRepeat.id)) {
    irbSeed = resolved;
  }
}
assert(irbSeed, "could not deterministically exercise IRB repeat event");
const repeatedIrb = irbSeed.research.projects[0];
assert(
  repeatedIrb.phase === "irb" && repeatedIrb.progress === 0 && repeatedIrb.weeksInPhase === 0,
  "IRB repeat did not reset progress and weeksInPhase",
);

for (const reviewWeeks of [2, 4]) {
  const submitted: ResearchProject = {
    ...baseProject,
    id: `review_${reviewWeeks}`,
    phase: "submitted",
    venue: "specialty",
    reviewRoundsLeft: reviewWeeks,
    stallWeeksRemaining: 0,
    submissionCount: 1,
  };
  let reviewState: GameState = {
    ...recruitment,
    research: {
      ...recruitment.research,
      activeProjectId: undefined,
      researchPoints: 0,
      projects: [submitted],
      publications: [],
      posters: 0,
    },
  };
  const identical = tickResearch(reviewState);
  assert(
    JSON.stringify(identical) === JSON.stringify(tickResearch(reviewState)),
    `research tick lost determinism for ${reviewWeeks}-week review`,
  );
  for (let week = 1; week < reviewWeeks; week += 1) {
    reviewState = tickResearch(reviewState);
    assert(
      reviewState.research.projects[0].phase === "submitted",
      `${reviewWeeks}-week review resolved after only ${week} ticks`,
    );
  }
  reviewState = tickResearch(reviewState);
  assert(
    reviewState.research.projects[0].phase !== "submitted",
    `${reviewWeeks}-week review did not resolve on tick ${reviewWeeks}`,
  );
}

// A selected submission keeps its authored submitted-phase risk producers
// while parked submissions do not manufacture parallel lotteries.
let submittedRiskSeed: GameState | undefined;
for (let candidate = 1; candidate <= 5000 && !submittedRiskSeed; candidate += 1) {
  const activeSubmission: ResearchProject = {
    ...baseProject,
    id: "active_submission_risk",
    phase: "submitted",
    venue: "specialty",
    reviewRoundsLeft: 4,
    risk: 1,
    stallWeeksRemaining: 0,
    submissionCount: 1,
  };
  const parkedSubmission: ResearchProject = {
    ...activeSubmission,
    id: "parked_submission_risk",
  };
  const probe: GameState = {
    ...recruitment,
    rngSeed: candidate,
    rngCursor: 0,
    research: {
      ...recruitment.research,
      activeProjectId: activeSubmission.id,
      researchPoints: 0,
      projects: [activeSubmission, parkedSubmission],
      activity: [],
    },
  };
  const resolved = tickResearch(probe);
  if (resolved.research.activity.some((entry) => entry.eventId)) {
    submittedRiskSeed = resolved;
  }
}
assert(submittedRiskSeed, "selected submitted project never produced an authored event");
assert(
  submittedRiskSeed.research.activity
    .filter((entry) => entry.eventId)
    .every((entry) => entry.projectId === "active_submission_risk"),
  "parked submitted project rolled authored risk",
);

// Once both visible symposium slots have been used, a later poster-only
// acceptance closes honestly as an internal talk: no fabricated poster,
// publication, or Reyes letter, and no poster effect in its activity record.
const cappedPosterProject: ResearchProject = {
  ...baseProject,
  id: "poster_cap_probe",
  phase: "submitted",
  venue: "poster",
  quality: 100,
  reviewRoundsLeft: 1,
  risk: 0,
  stallWeeksRemaining: 0,
  submissionCount: 1,
  posterPresented: false,
};
const cappedPosterStart: GameState = {
  ...recruitment,
  flags: recruitment.flags.filter((flag) => flag !== "reyes_letter"),
  research: {
    ...recruitment.research,
    activeProjectId: undefined,
    researchPoints: 0,
    projects: [cappedPosterProject],
    publications: [],
    posters: 2,
    activity: [],
  },
};
const cappedPosterResult = tickResearch(cappedPosterStart);
const cappedPosterActivity = cappedPosterResult.research.activity.find(
  (entry) => entry.projectId === cappedPosterProject.id && entry.kind === "accepted",
);
assert(
  cappedPosterResult.research.posters === 2 &&
    cappedPosterResult.research.publications.length === 0 &&
    !cappedPosterResult.flags.includes("reyes_letter"),
  "poster cap fabricated an output or first-author letter",
);
assert(
  cappedPosterActivity?.title.en === "Internal lab presentation" &&
    cappedPosterActivity.title.zh === "内部组会汇报" &&
    cappedPosterActivity.effects?.posters === undefined,
  "capped poster outcome was not truthfully bilingual and effect-free",
);

// Summer Research is not a generic stat-only break: each authored turn moves
// the selected real project through the shared phase/quality pipeline.
let summer: GameState = {
  ...recruitment,
  semesterIndex: 1,
  screen: "breakChapter",
  pendingBreakId: "summer_research",
  breakTurn: 0,
  research: {
    ...recruitment.research,
    researchPoints: 0,
    projects: [{
      ...baseProject,
      id: "summer_probe",
      progress: 70,
      stallWeeksRemaining: 0,
    }],
    activeProjectId: "summer_probe",
  },
};
const fakeSummer = takeBreakAction(summer, "summer_research_fake");
assert(fakeSummer === summer, "fake prefixed summer action mutated the research project");
const completedSummerProbe: GameState = { ...summer, breakTurn: 3 };
assert(
  takeBreakAction(completedSummerProbe, "summer_research_protocol") === completedSummerProbe,
  "completed summer chapter accepted a fourth research action",
);
const summerBefore = summer.research.activity.length;
const summerTrustBefore = summer.research.reputationInLab;
const summerTrack = BREAK_TRACKS.find((track) => track.id === "summer_research");
assert(summerTrack, "summer research break missing");
for (let turn = 0; turn < 3; turn += 1) {
  summer = takeBreakAction(summer, summerTrack.actions[turn].id);
}
const summerProject = summer.research.projects.find((entry) => entry.id === "summer_probe");
assert(
  summerProject?.phase === "analysis" && summerProject.progress === 76,
  `three summer research turns did not share the phase FSM exactly (${summerProject?.phase}/${summerProject?.progress})`,
);
assert(
  summer.research.activity.length >= summerBefore + 4,
  "summer research project movement was not visibly attributed",
);
assert(
  summer.research.reputationInLab === summerTrustBefore + 12,
  "three summer research turns did not grant exactly 12 lab trust",
);

let summerRecruit: GameState = {
  ...fresh,
  semesterIndex: 1,
  screen: "breakChapter",
  pendingBreakId: "summer_research",
  breakTurn: 0,
  stats: { ...fresh.stats, knowledge: 45 },
  research: {
    ...fresh.research,
    reputationInLab: 28,
    labOffers: [],
    activity: [],
  },
};
summerRecruit = takeBreakAction(summerRecruit, summerTrack.actions[0].id);
assert(
  summerRecruit.research.reputationInLab === 32 &&
    summerRecruit.research.labOffers.length > 0 &&
    summerRecruit.research.activity.some((entry) => entry.kind === "offer"),
  "summer research without a lab did not visibly build trust and produce an eligible offer",
);

console.log(
  "G12 PASS: V1/P1/P2 migration sanitized; complete V2 validated; future/malformed refused; P3 research clocks deterministic",
);
