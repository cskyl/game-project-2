import { CARDS } from "../data/cards";
import { SAVE_VERSION, SEMESTER_COUNT, WEEKS_PER_SEMESTER } from "./constants";
import { INITIAL_STATS } from "./initialState";
import { normalizeSeed } from "./rng";
import type {
  BossResult,
  CaseLogEntry,
  GameState,
  LocalizedText,
  LogEntry,
  MatchApplication,
  NpcState,
  Publication,
  ResearchActivity,
  ResearchProject,
  ResearchState,
  SimLabLogEntry,
  StatBlock,
  StatKey,
} from "./types";

export const MIGRATION_NOTICE: LocalizedText = {
  en: "Your V1 run was upgraded to V2. Every existing stat, choice, result, and log entry was preserved; new systems begin from safe defaults.",
  zh: "你的 V1 存档已升级到 V2。原有数值、选择、结果和日志全部保留；新系统会从安全的默认状态开始。",
};

export type SaveLoadResult =
  | { ok: true; state: GameState; migrated: boolean }
  | { ok: false; reason: "malformed" | "future"; message: LocalizedText };

export type V1GameState = Omit<
  GameState,
  | "rngSeed"
  | "rngCursor"
  | "transitionCounter"
  | "migrationNotice"
  | "archetypeId"
  | "npcs"
  | "research"
  | "caseLog"
  | "simLabLog"
  | "perks"
  | "perkPoints"
  | "equipment"
  | "debt"
  | "sleepDebt"
  | "injuryRisk"
  | "activeElective"
  | "electiveOffers"
  | "semesterModifiers"
  | "runDeck"
  | "leadershipRole"
  | "breakChoices"
  | "matchApplications"
  | "weekGains"
  | "pendingCaseId"
  | "pendingSimLabId"
  | "pendingBreakId"
  | "breakTurn"
> & {
  version: "1.0.0";
  stats: Omit<Record<StatKey, number>, "focus" | "standing">;
  weekStartStats: Omit<Record<StatKey, number>, "focus" | "standing">;
};

const MALFORMED_NOTICE: LocalizedText = {
  en: "This save could not be read. You can start a fresh run; the stored data was not overwritten.",
  zh: "这个存档无法读取。你可以开始新的一局；原存档数据没有被覆盖。",
};

const FUTURE_NOTICE: LocalizedText = {
  en: "This save comes from a newer game version. Update the game or start fresh; it was not overwritten.",
  zh: "这个存档来自更新的游戏版本。请更新游戏或开始新的一局；原存档没有被覆盖。",
};

type UnknownRecord = Record<string, unknown>;

const STAT_KEYS = Object.keys(INITIAL_STATS) as StatKey[];
const STAT_KEY_SET = new Set<string>(STAT_KEYS);
const SCREENS = new Set<GameState["screen"]>([
  "start",
  "semesterOpen",
  "planning",
  "event",
  "researchDashboard",
  "weeklySummary",
  "boss",
  "breakChapter",
  "ending",
]);
const BOSS_OUTCOMES = new Set(["great", "pass", "barely", "struggle"]);
const LOG_KINDS = new Set([
  "action",
  "card",
  "event",
  "boss",
  "system",
  "drift",
]);
const PROJECT_PHASES = new Set([
  "idea",
  "pilot",
  "irb",
  "collection",
  "analysis",
  "writing",
  "submitted",
  "revision",
  "accepted",
  "rejected",
  "abandoned",
]);
const RESEARCH_VENUES = new Set(["poster", "regional", "specialty", "top"]);
const RESEARCH_ACTIVITY_KINDS = new Set([
  "offer",
  "lab_joined",
  "project_started",
  "phase",
  "risk",
  "event",
  "review",
  "resubmitted",
  "poster",
  "accepted",
  "abandoned",
]);
const CASE_OUTCOMES = new Set(["excellent", "good", "rough", "bad"]);
const SIM_LAB_RESULTS = new Set(["commendation", "pass", "rough"]);
const MATCH_RESULTS = new Set(["accepted", "waitlisted", "rejected"]);

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value >= 0;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isLocalizedText(value: unknown): value is LocalizedText {
  return (
    isRecord(value) &&
    typeof value.en === "string" &&
    typeof value.zh === "string"
  );
}

function isCompleteStats(value: unknown): value is Record<StatKey, number> {
  return (
    isRecord(value) &&
    STAT_KEYS.every((key) => isFiniteNumber(value[key]))
  );
}

function isStatBlock(value: unknown): value is StatBlock {
  return (
    isRecord(value) &&
    Object.entries(value).every(
      ([key, amount]) => STAT_KEY_SET.has(key) && isFiniteNumber(amount),
    )
  );
}

function isBossResult(value: unknown): value is BossResult {
  return (
    isRecord(value) &&
    typeof value.bossId === "string" &&
    isFiniteNumber(value.semesterId) &&
    isFiniteNumber(value.score) &&
    typeof value.outcome === "string" &&
    BOSS_OUTCOMES.has(value.outcome)
  );
}

function isLogEntry(value: unknown): value is LogEntry {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    isFiniteNumber(value.semesterId) &&
    isFiniteNumber(value.weekInSemester) &&
    isLocalizedText(value.text) &&
    (value.effects === undefined || isStatBlock(value.effects)) &&
    typeof value.kind === "string" &&
    LOG_KINDS.has(value.kind)
  );
}

function isResearchProject(value: unknown): value is ResearchProject {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.templateId === "string" &&
    isLocalizedText(value.title) &&
    typeof value.phase === "string" &&
    PROJECT_PHASES.has(value.phase) &&
    isFiniteNumber(value.progress) &&
    isFiniteNumber(value.quality) &&
    isFiniteNumber(value.weeksInPhase) &&
    isFiniteNumber(value.risk) &&
    (value.venue === undefined ||
      (typeof value.venue === "string" && RESEARCH_VENUES.has(value.venue))) &&
    (value.reviewRoundsLeft === undefined || isFiniteNumber(value.reviewRoundsLeft)) &&
    isNonNegativeInteger(value.stallWeeksRemaining) &&
    isNonNegativeInteger(value.submissionCount) &&
    isNonNegativeInteger(value.resubmissions) &&
    typeof value.posterPresented === "boolean" &&
    (value.lastReviewOutcome === undefined ||
      value.lastReviewOutcome === "accepted" ||
      value.lastReviewOutcome === "minor_revision" ||
      value.lastReviewOutcome === "major_revision" ||
      value.lastReviewOutcome === "rejected")
  );
}

function isPublication(value: unknown): value is Publication {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.projectId === "string" &&
    isLocalizedText(value.title) &&
    typeof value.venue === "string" &&
    RESEARCH_VENUES.has(value.venue) &&
    typeof value.firstAuthor === "boolean" &&
    isFiniteNumber(value.quality)
  );
}

function isResearchActivityEffect(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const numericKeys = new Set([
    ...STAT_KEYS,
    "progress",
    "quality",
    "researchPoints",
    "reputationInLab",
    "stallWeeks",
    "posters",
  ]);
  return Object.entries(value).every(
    ([key, amount]) => numericKeys.has(key) && isFiniteNumber(amount),
  );
}

function isResearchRoll(value: unknown): boolean {
  return (
    isRecord(value) &&
    (value.kind === "quality" || value.kind === "risk" || value.kind === "review") &&
    isFiniteNumber(value.base) &&
    isFiniteNumber(value.random) &&
    isFiniteNumber(value.modifiers) &&
    isFiniteNumber(value.total) &&
    typeof value.outcome === "string"
  );
}

function isResearchActivity(value: unknown): value is ResearchActivity {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.kind === "string" &&
    RESEARCH_ACTIVITY_KINDS.has(value.kind) &&
    isOptionalString(value.projectId) &&
    isOptionalString(value.eventId) &&
    isLocalizedText(value.title) &&
    isLocalizedText(value.text) &&
    (value.effects === undefined || isResearchActivityEffect(value.effects)) &&
    isFiniteNumber(value.semesterId) &&
    isFiniteNumber(value.weekInSemester) &&
    (value.roll === undefined || isResearchRoll(value.roll))
  );
}

function isResearchState(value: unknown): value is ResearchState {
  return (
    isRecord(value) &&
    isOptionalString(value.labId) &&
    isFiniteNumber(value.researchPoints) &&
    Array.isArray(value.projects) &&
    value.projects.every(isResearchProject) &&
    Array.isArray(value.publications) &&
    value.publications.every(isPublication) &&
    isFiniteNumber(value.posters) &&
    isStringArray(value.grantsWon) &&
    isFiniteNumber(value.reputationInLab) &&
    isStringArray(value.labOffers) &&
    isOptionalString(value.activeProjectId) &&
    Array.isArray(value.activity) &&
    value.activity.every(isResearchActivity)
  );
}

function isNpcState(value: unknown): value is NpcState {
  return (
    isRecord(value) &&
    isFiniteNumber(value.affinity) &&
    isFiniteNumber(value.arcStage) &&
    isStringArray(value.flags)
  );
}

function isNpcRecord(value: unknown): value is Record<string, NpcState> {
  return isRecord(value) && Object.values(value).every(isNpcState);
}

function isCaseLogEntry(value: unknown): value is CaseLogEntry {
  return (
    isRecord(value) &&
    typeof value.caseId === "string" &&
    typeof value.outcome === "string" &&
    CASE_OUTCOMES.has(value.outcome) &&
    isStringArray(value.tags)
  );
}

function isSimLabLogEntry(value: unknown): value is SimLabLogEntry {
  return (
    isRecord(value) &&
    typeof value.exerciseId === "string" &&
    typeof value.result === "string" &&
    SIM_LAB_RESULTS.has(value.result) &&
    isFiniteNumber(value.idealStages)
  );
}

function isBreakChoice(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.afterSemester) &&
    typeof value.trackId === "string"
  );
}

function isBreakTurn(value: unknown): value is number {
  return isNonNegativeInteger(value) && value <= 3;
}

/** Soft-cap remainders are banked fractions; anything outside [0, 1) is corrupt. */
function isSoftCapCarry(value: unknown): value is StatBlock {
  return (
    isStatBlock(value) &&
    Object.values(value).every(
      (amount) => amount !== undefined && amount >= 0 && amount < 1,
    )
  );
}

/**
 * The calendar is indexed directly (`SEMESTERS[semesterIndex]`), so a save that
 * merely holds a finite number here would pass validation and then throw the
 * first time a screen reads the semester. Both cursors are range-checked.
 */
function isSemesterIndex(value: unknown): value is number {
  return isNonNegativeInteger(value) && value < SEMESTER_COUNT;
}

function isWeekInSemester(value: unknown): value is number {
  return (
    isNonNegativeInteger(value) && value >= 1 && value <= WEEKS_PER_SEMESTER
  );
}

function isMatchApplication(value: unknown): value is MatchApplication {
  return (
    isRecord(value) &&
    typeof value.trackId === "string" &&
    isFiniteNumber(value.rank) &&
    (value.score === undefined || isFiniteNumber(value.score)) &&
    (value.result === undefined ||
      (typeof value.result === "string" && MATCH_RESULTS.has(value.result)))
  );
}

function isDifficulty(value: unknown): value is GameState["difficulty"] {
  return value === "easy" || value === "normal" || value === "hard";
}

function isScreen(value: unknown): value is GameState["screen"] {
  return typeof value === "string" && SCREENS.has(value as GameState["screen"]);
}

/** Prove that a current-version payload has every field the engine dereferences. */
function isV2State(value: unknown): value is GameState {
  if (!isRecord(value) || value.version !== SAVE_VERSION) return false;
  return (
    isFiniteNumber(value.rngSeed) &&
    isNonNegativeInteger(value.rngCursor) &&
    isNonNegativeInteger(value.transitionCounter) &&
    (value.migrationNotice === undefined || isLocalizedText(value.migrationNotice)) &&
    typeof value.playerName === "string" &&
    isDifficulty(value.difficulty) &&
    isSemesterIndex(value.semesterIndex) &&
    isWeekInSemester(value.weekInSemester) &&
    isFiniteNumber(value.globalWeek) &&
    isFiniteNumber(value.actionPointsRemaining) &&
    isCompleteStats(value.stats) &&
    isOptionalString(value.archetypeId) &&
    isNpcRecord(value.npcs) &&
    isResearchState(value.research) &&
    Array.isArray(value.caseLog) &&
    value.caseLog.every(isCaseLogEntry) &&
    Array.isArray(value.simLabLog) &&
    value.simLabLog.every(isSimLabLogEntry) &&
    isStringArray(value.perks) &&
    isFiniteNumber(value.perkPoints) &&
    isStringArray(value.equipment) &&
    isFiniteNumber(value.debt) &&
    isFiniteNumber(value.sleepDebt) &&
    isFiniteNumber(value.injuryRisk) &&
    isOptionalString(value.activeElective) &&
    isStringArray(value.electiveOffers) &&
    isStringArray(value.semesterModifiers) &&
    isStringArray(value.runDeck) &&
    isOptionalString(value.leadershipRole) &&
    Array.isArray(value.breakChoices) &&
    value.breakChoices.every(isBreakChoice) &&
    Array.isArray(value.matchApplications) &&
    value.matchApplications.every(isMatchApplication) &&
    isStatBlock(value.weekGains) &&
    isSoftCapCarry(value.softCapCarry) &&
    isCompleteStats(value.weekStartStats) &&
    isStringArray(value.flags) &&
    isStringArray(value.eventHistory) &&
    Array.isArray(value.bossHistory) &&
    value.bossHistory.every(isBossResult) &&
    Array.isArray(value.log) &&
    value.log.every(isLogEntry) &&
    isStringArray(value.weeklyCards) &&
    isFiniteNumber(value.cardsPlayedThisWeek) &&
    isFiniteNumber(value.lowMoodStreak) &&
    isStringArray(value.weekWarnings) &&
    isStringArray(value.unlockedAchievements) &&
    isScreen(value.screen) &&
    isOptionalString(value.pendingEventId) &&
    isOptionalString(value.pendingChoiceId) &&
    isOptionalString(value.pendingBossId) &&
    isOptionalString(value.pendingCaseId) &&
    isOptionalString(value.pendingSimLabId) &&
    isOptionalString(value.pendingBreakId) &&
    isBreakTurn(value.breakTurn) &&
    (value.lastBossResult === undefined || isBossResult(value.lastBossResult)) &&
    isOptionalString(value.endingId) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function semanticVersion(version: string): [number, number, number] | undefined {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) return undefined;
  const parts = match.slice(1).map(Number);
  if (!parts.every(Number.isSafeInteger)) return undefined;
  return [parts[0], parts[1], parts[2]];
}

function isFutureVersion(version: string): boolean {
  const candidate = semanticVersion(version);
  const current = semanticVersion(SAVE_VERSION);
  if (!candidate || !current) return false;
  for (let index = 0; index < current.length; index += 1) {
    if (candidate[index] !== current[index]) {
      return candidate[index] > current[index];
    }
  }
  return false;
}

function finiteOr(value: unknown, fallback: number): number {
  return isFiniteNumber(value) ? value : fallback;
}

function clampInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  if (!isFiniteNumber(value)) return fallback;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function stringsFrom(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function sanitizeStats(
  value: UnknownRecord,
  fallback: Record<StatKey, number>,
): Record<StatKey, number> {
  const stats = { ...fallback };
  for (const key of STAT_KEYS) {
    if (isFiniteNumber(value[key])) stats[key] = value[key];
  }
  return stats;
}

/** Upgrade an exact V1 payload without mutating it or dropping safe raw keys. */
function migrateV1(value: UnknownRecord): SaveLoadResult {
  if (!isRecord(value.stats)) {
    return { ok: false, reason: "malformed", message: MALFORMED_NOTICE };
  }

  const stats = sanitizeStats(value.stats, INITIAL_STATS);
  const weekStartStats = isRecord(value.weekStartStats)
    ? sanitizeStats(value.weekStartStats, stats)
    : { ...stats };
  const seed = normalizeSeed(
    `${String(value.createdAt ?? "v1")}:${String(value.playerName ?? "Player")}`,
  );
  const state: GameState = {
    ...value,
    version: SAVE_VERSION,
    rngSeed: seed,
    rngCursor: 0,
    transitionCounter: 0,
    migrationNotice: MIGRATION_NOTICE,
    playerName: typeof value.playerName === "string" ? value.playerName : "Player",
    difficulty: isDifficulty(value.difficulty) ? value.difficulty : "normal",
    // Clamped, not merely coerced: migrateV1 returns without passing through
    // the strict V2 shape check, so an out-of-range legacy cursor would reach
    // the calendar and throw on the first screen.
    semesterIndex: clampInteger(value.semesterIndex, 0, SEMESTER_COUNT - 1, 0),
    weekInSemester: clampInteger(value.weekInSemester, 1, WEEKS_PER_SEMESTER, 1),
    globalWeek: finiteOr(value.globalWeek, 0),
    actionPointsRemaining: finiteOr(value.actionPointsRemaining, 6),
    stats,
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
    softCapCarry: {},
    weekStartStats,
    flags: stringsFrom(value.flags),
    eventHistory: stringsFrom(value.eventHistory),
    bossHistory: Array.isArray(value.bossHistory)
      ? value.bossHistory.filter(isBossResult)
      : [],
    log: Array.isArray(value.log) ? value.log.filter(isLogEntry) : [],
    weeklyCards: stringsFrom(value.weeklyCards),
    cardsPlayedThisWeek: finiteOr(value.cardsPlayedThisWeek, 0),
    lowMoodStreak: finiteOr(value.lowMoodStreak, 0),
    weekWarnings: stringsFrom(value.weekWarnings),
    unlockedAchievements: stringsFrom(value.unlockedAchievements),
    screen: isScreen(value.screen) ? value.screen : "planning",
    pendingEventId:
      typeof value.pendingEventId === "string" ? value.pendingEventId : undefined,
    pendingChoiceId:
      typeof value.pendingChoiceId === "string" ? value.pendingChoiceId : undefined,
    pendingBossId:
      typeof value.pendingBossId === "string" ? value.pendingBossId : undefined,
    pendingCaseId: undefined,
    pendingSimLabId: undefined,
    pendingBreakId: undefined,
    breakTurn: 0,
    lastBossResult: isBossResult(value.lastBossResult)
      ? value.lastBossResult
      : undefined,
    endingId: typeof value.endingId === "string" ? value.endingId : undefined,
    createdAt:
      typeof value.createdAt === "string"
        ? value.createdAt
        : "2020-01-01T00:00:00.000Z",
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : "2020-01-01T00:00:00.000Z",
  };
  return { ok: true, state, migrated: true };
}

export function migrateSave(value: unknown): SaveLoadResult {
  if (!isRecord(value) || typeof value.version !== "string") {
    return { ok: false, reason: "malformed", message: MALFORMED_NOTICE };
  }
  if (value.version === SAVE_VERSION) {
    // P0/P1 saves predate the calendar fields.  Hydrate only fields that were
    // absent (an explicitly malformed field still fails strict validation).
    const hydrated: UnknownRecord = { ...value };
    let hydratedDefaults = false;
    if (hydrated.electiveOffers === undefined) {
      hydrated.electiveOffers = [];
      hydratedDefaults = true;
    }
    if (hydrated.breakTurn === undefined) {
      hydrated.breakTurn = 0;
      hydratedDefaults = true;
    }
    // Saves written before the soft-cap carry ledger have no banked fractions,
    // which is exactly an empty ledger — a zero default, not a guess.
    if (hydrated.softCapCarry === undefined) {
      hydrated.softCapCarry = {};
      hydratedDefaults = true;
    }
    // P0-P2 V2 saves have the research skeleton but predate P3's dashboard,
    // activity attribution, and project-clock fields. Hydrate only absent
    // values; malformed values remain visible to the strict validator below.
    if (isRecord(hydrated.research)) {
      const research: UnknownRecord = { ...hydrated.research };
      if (research.labOffers === undefined) {
        research.labOffers = [];
        hydratedDefaults = true;
      }
      if (research.activity === undefined) {
        research.activity = [];
        hydratedDefaults = true;
      }
      if (Array.isArray(research.projects)) {
        research.projects = research.projects.map((candidate) => {
          if (!isRecord(candidate)) return candidate;
          const project: UnknownRecord = { ...candidate };
          if (project.stallWeeksRemaining === undefined) {
            project.stallWeeksRemaining = 0;
            hydratedDefaults = true;
          }
          if (project.submissionCount === undefined) {
            project.submissionCount = 0;
            hydratedDefaults = true;
          }
          if (project.resubmissions === undefined) {
            project.resubmissions = 0;
            hydratedDefaults = true;
          }
          if (project.posterPresented === undefined) {
            project.posterPresented = false;
            hydratedDefaults = true;
          }
          return project;
        });
      }
      hydrated.research = research;
    }
    return isV2State(hydrated)
      ? { ok: true, state: hydrated, migrated: hydratedDefaults }
      : { ok: false, reason: "malformed", message: MALFORMED_NOTICE };
  }
  if (value.version === "1.0.0") return migrateV1(value);
  if (isFutureVersion(value.version)) {
    return { ok: false, reason: "future", message: FUTURE_NOTICE };
  }
  return { ok: false, reason: "malformed", message: MALFORMED_NOTICE };
}

export function parseAndMigrateSave(raw: string): SaveLoadResult {
  try {
    return migrateSave(JSON.parse(raw) as unknown);
  } catch {
    return { ok: false, reason: "malformed", message: MALFORMED_NOTICE };
  }
}
