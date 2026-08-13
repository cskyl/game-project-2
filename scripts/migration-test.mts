import { INITIAL_STATS } from "../src/game/initialState";
import { migrateSave, type V1GameState } from "../src/game/migration";
import { nextRandom } from "../src/game/rng";
import { chooseBreakTrack, takeBreakAction } from "../src/game/engine";
import { BREAK_TRACKS } from "../src/data/breaks";
import type { GameState, StatKey } from "../src/game/types";

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

console.log(
  "G12 PASS: V1 migration sanitized; complete V2 validated; future/malformed fixtures refused without throw; RNG recovered",
);
