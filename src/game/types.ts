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
  | "semesterOpen"
  | "planning"
  | "event"
  | "researchDashboard"
  | "case"
  | "simLab"
  | "weeklySummary"
  | "boss"
  | "breakChapter"
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

/** A semester-long elective or rotation offered during the open screen. */
export type Elective = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  stage: Array<Stage | "any">;
  minSemester: number;
  maxSemester: number;
  prerequisites?: EventCondition;
  tags: string[];
  caseTags?: string[];
  matchTrackBonus?: Partial<Record<string, number>>;
  effects?: StatBlock;
};

/** One of the three actions available after selecting a break track. */
export type BreakAction = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  effects: StatBlock;
  tags?: string[];
  addFlags?: string[];
};

export type BreakTrack = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  payoff?: LocalizedText;
  cost?: LocalizedText;
  availableAfterSemesters?: number[];
  duration?: number;
  eligibility?: EventCondition;
  requirements?: EventCondition;
  clearsSleepDebtOnCompletion?: boolean;
  actions: BreakAction[];
};

export type LogEntry = {
  id: string;
  semesterId: number;
  weekInSemester: number;
  text: LocalizedText;
  effects?: StatBlock;
  kind: "action" | "card" | "event" | "boss" | "system" | "drift" | "case" | "simLab";
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

export type ResearchReviewOutcome =
  | "accepted"
  | "minor_revision"
  | "major_revision"
  | "rejected";

export type ResearchActivityKind =
  | "offer"
  | "lab_joined"
  | "project_started"
  | "phase"
  | "risk"
  | "event"
  | "review"
  | "resubmitted"
  | "poster"
  | "accepted"
  | "abandoned";

/** The exact, player-visible arithmetic behind a research-system roll. */
export type ResearchRollBreakdown = {
  kind: "quality" | "risk" | "review";
  base: number;
  random: number;
  modifiers: number;
  total: number;
  outcome: string;
};

/** Dashboard history makes authored setbacks and review luck non-silent. */
export type ResearchActivity = {
  id: string;
  kind: ResearchActivityKind;
  projectId?: string;
  eventId?: string;
  title: LocalizedText;
  text: LocalizedText;
  effects?: StatBlock & {
    progress?: number;
    quality?: number;
    researchPoints?: number;
    reputationInLab?: number;
    stallWeeks?: number;
    posters?: number;
  };
  semesterId: number;
  weekInSemester: number;
  roll?: ResearchRollBreakdown;
};

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
  stallWeeksRemaining: number;
  submissionCount: number;
  resubmissions: number;
  /** One poster maximum per project, regardless of later resubmission venue. */
  posterPresented: boolean;
  lastReviewOutcome?: ResearchReviewOutcome;
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
  /** Labs made visible by the recruitment threshold, before commitment. */
  labOffers: string[];
  /** The one project that receives queued `lab_work` effort. */
  activeProjectId?: string;
  /** Attributed, bilingual research history shown by the dashboard. */
  activity: ResearchActivity[];
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

// ---------------------------------------------------------------------------
// Patient cases (§5.2). Three decisions, then one execution roll. Wrong answers
// are positions a real student could hold, never strawmen, and the feedback is
// where the case teaches.
// ---------------------------------------------------------------------------

export type CaseOptionQuality = "best" | "ok" | "poor";

export type CaseOption = {
  id: string;
  text: LocalizedText;
  quality: CaseOptionQuality;
  /** Gated options render locked, with the requirement shown. */
  requires?: EventCondition;
  feedback: LocalizedText;
  effects?: StatBlock;
};

export type CaseStepKind = "history" | "diagnosis" | "plan";

export type CaseStep = {
  id: string;
  kind: CaseStepKind;
  prompt: LocalizedText;
  options: CaseOption[];
};

export type PatientCase = {
  id: string;
  patient: { name: LocalizedText; age: number; chiefComplaint: LocalizedText };
  stage: Array<Stage | "any">;
  minSemester?: number;
  /** 0–20, subtracted from the execution roll. */
  difficulty: number;
  steps: CaseStep[];
  execution: Array<{ stat: ConditionStatKey; weight: number }>;
  outcomes: Record<CaseOutcome, { text: LocalizedText; effects: StatBlock }>;
  tags: string[];
};

/** Every term of the execution roll, so the UI can show the real arithmetic. */
export type CaseRoll = {
  weighted: number;
  stepBonus: number;
  difficulty: number;
  modifier: number;
  roll: number;
  total: number;
};

export type CaseProgress = {
  caseId: string;
  /** 0-based index into the case's steps; equals steps.length once resolved. */
  stepIndex: number;
  /** Accumulated step score: best +2, ok +1, poor −1. */
  score: number;
  /** Chosen option id per resolved step, for the recap. */
  choices: string[];
  outcome?: CaseOutcome;
  roll?: CaseRoll;
};

// ---------------------------------------------------------------------------
// Sim-lab practicals (§5.3). The preclinical counterpart to patient cases:
// a three-stage precision exercise scored on signed error, so rushing
// over-prepares and timidity under-prepares.
// ---------------------------------------------------------------------------

export type SimLabResult = "commendation" | "pass" | "rough";

export type SimLabLogEntry = {
  exerciseId: string;
  result: SimLabResult;
  idealStages: number;
};

export type SimLabApproach = "fast" | "careful" | "textbook";

export type SimLabStageOutcome = "over" | "ideal" | "under";

export type SimLabStage = {
  id: string;
  prompt: LocalizedText;
  /** Added to the signed error; a fussier stage is easier to get wrong. */
  demand: number;
  feedback: Record<SimLabStageOutcome, LocalizedText>;
};

export type SimLabExercise = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  stage: Array<Stage | "any">;
  minSemester?: number;
  maxSemester?: number;
  difficulty: number;
  stages: SimLabStage[];
  outcomes: Record<SimLabResult, { text: LocalizedText; effects: StatBlock }>;
};

export type SimLabProgress = {
  exerciseId: string;
  stageIndex: number;
  approaches: SimLabApproach[];
  results: SimLabStageOutcome[];
  /** Signed error per resolved stage, kept so the UI can explain the call. */
  errors: number[];
  result?: SimLabResult;
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
  /** 1..5 within the current semester. */
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
  /** Seeded draft shown on the semester-open screen. */
  electiveOffers: string[];
  semesterModifiers: string[];
  runDeck: string[];
  leadershipRole?: string;
  breakChoices: BreakChoice[];
  matchApplications: MatchApplication[];
  weekGains: StatBlock;
  /** Tags of the actions bought this week; drives the guaranteed clinic case. */
  weekActionTags: string[];
  /**
   * Fractional soft-cap remainder per stat, always in [0, 1). Diminished gains
   * accumulate here so a band multiplier is applied exactly over repeated
   * touches instead of every touch rounding up to a flat point.
   */
  softCapCarry: StatBlock;
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
  caseProgress: CaseProgress | undefined;
  pendingSimLabId: string | undefined;
  simLabProgress: SimLabProgress | undefined;
  pendingBreakId: string | undefined;
  /** 0..3 actions taken in the currently selected break chapter. */
  breakTurn: number;
  lastBossResult?: BossResult;
  endingId?: string;
  createdAt: string;
  updatedAt: string;
};
