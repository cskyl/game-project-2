// ---------------------------------------------------------------------------
// Core type contracts for Dental School Life Sim.
// Content is bilingual: every player-facing string is a LocalizedText.
// ---------------------------------------------------------------------------

export type Lang = "en" | "zh";

/** A piece of player-facing text in both supported languages. */
export type LocalizedText = { en: string; zh: string };

export type Difficulty = "easy" | "normal" | "hard";

export type Stage =
  | "early"
  | "preclinical"
  | "transition"
  | "clinical"
  | "advanced";

export type StatKey =
  | "knowledge"
  | "handSkill"
  | "clinicalSense"
  | "empathy"
  | "stamina"
  | "confidence"
  | "reputation"
  | "mood"
  | "stress"
  | "love"
  | "research"
  | "publicImpact"
  | "focus"
  | "standing"
  | "money";

/** Derived (read-only) stats usable in conditions and boss checks. */
export type DerivedKey =
  | "wellness"
  | "careerReadiness"
  | "lifeBalance"
  | "researchOutput"
  | "clinicalRecord";

export type ConditionStatKey = StatKey | DerivedKey;

export type StatBlock = Partial<Record<StatKey, number>>;

export type Screen =
  | "start"
  | "planning"
  | "event"
  | "weeklySummary"
  | "boss"
  | "ending";

export type EventCondition = {
  minStats?: Partial<Record<ConditionStatKey, number>>;
  maxStats?: Partial<Record<ConditionStatKey, number>>;
  requiredFlags?: string[];
  forbiddenFlags?: string[];
  minSemester?: number;
  maxSemester?: number;
};

export type Action = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  /** Short narrative flavor shown after the action resolves. */
  flavor?: LocalizedText;
  cost: number;
  /** Optional extra money requirement (e.g. eating out). */
  moneyCost?: number;
  effects: StatBlock;
  tags?: string[];
  /** Effects depend on the player's weakest core skill (Ask for Help). */
  dynamicWeakest?: boolean;
  unlock?: EventCondition;
};

export type EventChoice = {
  id: string;
  text: LocalizedText;
  resultText: LocalizedText;
  effects: StatBlock;
  addFlags?: string[];
  removeFlags?: string[];
  requirements?: EventCondition;
};

export type GameEvent = {
  id: string;
  title: LocalizedText;
  stage: Array<Stage | "any">;
  tags: string[];
  minSemester?: number;
  maxSemester?: number;
  condition?: EventCondition;
  weight: number;
  text: LocalizedText;
  choices: EventChoice[];
};

export type BossOutcomeKey = "great" | "pass" | "barely" | "struggle";

export type Boss = {
  id: string;
  semesterId: number;
  title: LocalizedText;
  description: LocalizedText;
  requiredStats: Array<{ stat: ConditionStatKey; weight: number }>;
  outcomes: Record<BossOutcomeKey, { text: LocalizedText; effects: StatBlock }>;
};

export type BossResult = {
  bossId: string;
  semesterId: number;
  score: number;
  outcome: BossOutcomeKey;
};

export type Ending = {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  priority: number;
  condition: EventCondition;
  text: LocalizedText;
};

export type Rarity = "common" | "rare" | "epic";

export type LifeCard = {
  id: string;
  title: LocalizedText;
  rarity: Rarity;
  stage: Array<Stage | "any">;
  text: LocalizedText;
  effects: StatBlock;
  requirements?: EventCondition;
};

export type Semester = {
  id: number;
  name: LocalizedText;
  theme: LocalizedText;
  stage: Stage;
  focus: ConditionStatKey[];
  boss: LocalizedText;
};

export type LogEntry = {
  id: string;
  semesterId: number;
  weekInSemester: number;
  text: LocalizedText;
  effects?: StatBlock;
  kind: "action" | "card" | "event" | "boss" | "system";
};

export type Achievement = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type ProjectPhase =
  | "idea"
  | "pilot"
  | "irb"
  | "collection"
  | "analysis"
  | "writing"
  | "submitted"
  | "revision"
  | "accepted"
  | "rejected"
  | "abandoned";

export type ResearchVenue = "poster" | "regional" | "specialty" | "top";

export type ResearchProject = {
  id: string;
  templateId: string;
  title: LocalizedText;
  phase: ProjectPhase;
  progress: number;
  quality: number;
  weeksInPhase: number;
  risk: number;
  venue?: ResearchVenue;
  reviewRoundsLeft?: number;
};

export type Publication = {
  id: string;
  projectId: string;
  title: LocalizedText;
  venue: ResearchVenue;
  firstAuthor: boolean;
  quality: number;
};

export type ResearchState = {
  labId?: string;
  researchPoints: number;
  projects: ResearchProject[];
  publications: Publication[];
  posters: number;
  grantsWon: string[];
  reputationInLab: number;
};

export type NpcState = {
  affinity: number;
  arcStage: number;
  flags: string[];
};

export type CaseOutcome = "excellent" | "good" | "rough" | "bad";

export type CaseLogEntry = {
  caseId: string;
  outcome: CaseOutcome;
  tags: string[];
};

export type SimLabResult = "commendation" | "pass" | "rough";

export type SimLabLogEntry = {
  exerciseId: string;
  result: SimLabResult;
  idealStages: number;
};

export type BreakChoice = {
  afterSemester: number;
  trackId: string;
};

export type MatchResult = "accepted" | "waitlisted" | "rejected";

export type MatchApplication = {
  trackId: string;
  rank: number;
  score?: number;
  result?: MatchResult;
};

export type GameState = {
  version: string;
  /** Normalized unsigned 32-bit seed for this reproducible run. */
  rngSeed: number;
  /** Number of random values consumed from the run's seeded stream. */
  rngCursor: number;
  /** Monotonic counter used for deterministic ids and timestamps. */
  transitionCounter: number;
  /** One-time bilingual notice populated when a V1 save is upgraded. */
  migrationNotice?: LocalizedText;
  playerName: string;
  difficulty: Difficulty;
  /** 0-based index into the SEMESTERS array. */
  semesterIndex: number;
  /** 1..4 within the current semester. */
  weekInSemester: number;
  /** Total weeks elapsed since game start; used for event recency. */
  globalWeek: number;
  actionPointsRemaining: number;
  stats: Record<StatKey, number>;
  archetypeId?: string;
  npcs: Record<string, NpcState>;
  research: ResearchState;
  caseLog: CaseLogEntry[];
  simLabLog: SimLabLogEntry[];
  perks: string[];
  perkPoints: number;
  equipment: string[];
  debt: number;
  sleepDebt: number;
  injuryRisk: number;
  activeElective?: string;
  semesterModifiers: string[];
  runDeck: string[];
  leadershipRole?: string;
  breakChoices: BreakChoice[];
  matchApplications: MatchApplication[];
  weekGains: StatBlock;
  /** Snapshot of stats at the start of the current week (for the summary). */
  weekStartStats: Record<StatKey, number>;
  flags: string[];
  eventHistory: string[];
  bossHistory: BossResult[];
  log: LogEntry[];
  weeklyCards: string[];
  cardsPlayedThisWeek: number;
  lowMoodStreak: number;
  /** Threshold-warning keys raised during the most recent finished week. */
  weekWarnings: string[];
  unlockedAchievements: string[];
  screen: Screen;
  pendingEventId?: string;
  /** Set once the player has picked a choice, to show its result before continuing. */
  pendingChoiceId?: string;
  pendingBossId?: string;
  pendingCaseId: string | undefined;
  pendingSimLabId: string | undefined;
  pendingBreakId: string | undefined;
  lastBossResult?: BossResult;
  endingId?: string;
  createdAt: string;
  updatedAt: string;
};
