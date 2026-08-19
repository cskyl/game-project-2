import { ACHIEVEMENTS } from "../src/data/achievements";
import { ACTIONS } from "../src/data/actions";
import { BOSSES } from "../src/data/bosses";
import { CARDS } from "../src/data/cards";
import { ENDINGS } from "../src/data/endings";
import { GENERATED_EVENTS } from "../src/data/events.generated";
import { SEED_EVENTS } from "../src/data/events.seed";
import { EVENTS } from "../src/data/events";
import { BREAK_TRACKS } from "../src/data/breaks";
import { CASES } from "../src/data/cases";
import { ELECTIVES } from "../src/data/electives";
import { SIM_LAB_EXERCISES } from "../src/data/simlab";
import {
  RESEARCH_EVENTS,
  RESEARCH_LABS,
  RESEARCH_PROJECT_TEMPLATES,
} from "../src/data/research";
import { SEMESTERS } from "../src/data/semesters";
import { SYSTEM_FLAGS } from "../src/data/systemFlags";
import { V2_UI_TEXT } from "../src/data/uiText";
import { ALL_STATS } from "../src/game/constants";
import type {
  ConditionStatKey,
  EventCondition,
  LocalizedText,
  ProjectPhase,
  Stage,
  StatKey,
} from "../src/game/types";
import type { ModifierHook } from "../src/game/modifiers";

/** Node-only, and the tools deliberately avoid a @types/node dependency. */
declare const process: { exitCode?: number };

export type ValidationIssue = { path: string; message: string };

const STAGES = new Set<Stage | "any">([
  "early",
  "preclinical",
  "transition",
  "clinical",
  "advanced",
  "any",
]);
const STATS = new Set<StatKey>(ALL_STATS);
const CONDITION_STATS = new Set<ConditionStatKey>([
  ...STATS,
  "wellness",
  "careerReadiness",
  "lifeBalance",
  "researchOutput",
  "clinicalRecord",
]);
const RARITIES = new Set(["common", "rare", "epic"]);
const INTENTIONAL_EVENT_SHADOWS = new Set(["early_first_week_overload"]);
const PROJECT_PHASES: readonly ProjectPhase[] = [
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
];
const ACTIVE_PROJECT_PHASES = new Set<ProjectPhase>([
  "idea",
  "pilot",
  "irb",
  "collection",
  "analysis",
  "writing",
  "submitted",
  "revision",
]);
const FROZEN_NPC_IDS = new Set([
  "mika",
  "reyes",
  "jordan",
  "priya",
  "sam",
  "dr_okafor",
  "lena",
  "theo",
  "nadia",
  "chris",
  "partner",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Pure helper: finds malformed LocalizedText-shaped values recursively. */
export function validateLocalizedTexts(value: unknown, path = "root"): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const visit = (node: unknown, nodePath: string): void => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => visit(item, `${nodePath}[${index}]`));
      return;
    }
    if (!isRecord(node)) return;

    if (Object.hasOwn(node, "en") || Object.hasOwn(node, "zh")) {
      if (!isNonEmptyString(node.en)) issues.push({ path: `${nodePath}.en`, message: "must be a non-empty string" });
      if (!isNonEmptyString(node.zh)) issues.push({ path: `${nodePath}.zh`, message: "must be a non-empty string" });
    }
    for (const [key, child] of Object.entries(node)) visit(child, `${nodePath}.${key}`);
  };
  visit(value, path);
  return issues;
}

/** Pure helper: returns every duplicate id in first-repeat order. */
export function findDuplicateIds(items: ReadonlyArray<{ id: string }>): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) duplicates.add(item.id);
    seen.add(item.id);
  }
  return [...duplicates];
}

function statRange(stat: ConditionStatKey): readonly [number, number] {
  return stat === "money" ? [-50, 200] : [0, 100];
}

/** Pure helper: checks whether a condition has mutually compatible bounds. */
export function validateCondition(
  condition: EventCondition | undefined,
  path: string,
  lastSemester = SEMESTERS.length,
): ValidationIssue[] {
  if (!condition) return [];
  const issues: ValidationIssue[] = [];
  const minSemester = condition.minSemester ?? 1;
  const maxSemester = condition.maxSemester ?? lastSemester;
  if (!Number.isInteger(minSemester) || minSemester < 1 || minSemester > lastSemester) {
    issues.push({ path: `${path}.minSemester`, message: `must be an integer in 1..${lastSemester}` });
  }
  if (!Number.isInteger(maxSemester) || maxSemester < 1 || maxSemester > lastSemester) {
    issues.push({ path: `${path}.maxSemester`, message: `must be an integer in 1..${lastSemester}` });
  }
  if (minSemester > maxSemester) {
    issues.push({ path, message: `unsatisfiable semester bounds ${minSemester}..${maxSemester}` });
  }

  const keys = new Set([
    ...Object.keys(condition.minStats ?? {}),
    ...Object.keys(condition.maxStats ?? {}),
  ]);
  for (const key of keys) {
    if (!CONDITION_STATS.has(key as ConditionStatKey)) {
      issues.push({ path: `${path}.${key}`, message: "unknown condition stat" });
      continue;
    }
    const stat = key as ConditionStatKey;
    const min = condition.minStats?.[stat];
    const max = condition.maxStats?.[stat];
    const [legalMin, legalMax] = statRange(stat);
    if (min !== undefined && (!Number.isFinite(min) || min < legalMin || min > legalMax)) {
      issues.push({ path: `${path}.minStats.${stat}`, message: `must be in ${legalMin}..${legalMax}` });
    }
    if (max !== undefined && (!Number.isFinite(max) || max < legalMin || max > legalMax)) {
      issues.push({ path: `${path}.maxStats.${stat}`, message: `must be in ${legalMin}..${legalMax}` });
    }
    if (min !== undefined && max !== undefined && min > max) {
      issues.push({ path: `${path}.${stat}`, message: `unsatisfiable bounds ${min}..${max}` });
    }
  }

  const forbidden = new Set(condition.forbiddenFlags ?? []);
  for (const flag of condition.requiredFlags ?? []) {
    if (forbidden.has(flag)) issues.push({ path, message: `flag "${flag}" is both required and forbidden` });
  }
  return issues;
}

function duplicateIssues(label: string, items: ReadonlyArray<{ id: string }>): ValidationIssue[] {
  return findDuplicateIds(items).map((id) => ({ path: label, message: `duplicate id "${id}"` }));
}

function semestersReachable(
  stages: ReadonlyArray<Stage | "any">,
  minSemester: number,
  maxSemester: number,
): boolean {
  return SEMESTERS.some(
    (semester) =>
      semester.id >= minSemester &&
      semester.id <= maxSemester &&
      (stages.includes("any") || stages.includes(semester.stage)),
  );
}

function runValidation(): { issues: ValidationIssue[]; warnings: string[]; localizedCount: number } {
  const issues: ValidationIssue[] = [];
  const warnings: string[] = [];
  const registries = [
    ["events", EVENTS],
    ["cards", CARDS],
    ["endings", ENDINGS],
    ["actions", ACTIONS],
    ["bosses", BOSSES],
    ["achievements", ACHIEVEMENTS],
  ] as const;

  if (SEMESTERS.length !== 12) {
    issues.push({ path: "semesters", message: `expected 12 semesters, found ${SEMESTERS.length}` });
  }
  if (ELECTIVES.length !== 14) {
    issues.push({ path: "electives", message: `expected frozen roster of 14, found ${ELECTIVES.length}` });
  }
  // Patient cases and sim-lab practicals: shape, reachability, and the one
  // invariant that would silently break a run — a step whose every option is
  // gated, which would soft-lock the case for a player who cannot meet any of
  // them.
  issues.push(...duplicateIssues("cases", CASES));
  issues.push(...duplicateIssues("simLab", SIM_LAB_EXERCISES));
  for (const entry of CASES) {
    const path = `cases.${entry.id}`;
    for (const stage of entry.stage) {
      if (!STAGES.has(stage)) issues.push({ path, message: `unknown stage "${stage}"` });
    }
    if (!semestersReachable(entry.stage, entry.minSemester ?? 1, SEMESTERS.length)) {
      issues.push({ path, message: "no semester matches this case's stage and minSemester" });
    }
    if (entry.steps.length !== 3) {
      issues.push({ path, message: `expected 3 steps (history, diagnosis, plan), found ${entry.steps.length}` });
    }
    const kinds = entry.steps.map((step) => step.kind).join(",");
    if (kinds !== "history,diagnosis,plan") {
      issues.push({ path, message: `steps must run history,diagnosis,plan — found ${kinds}` });
    }
    const weightSum = entry.execution.reduce((sum, term) => sum + term.weight, 0);
    if (Math.abs(weightSum - 1) > 1e-6) {
      issues.push({ path: `${path}.execution`, message: `weights must sum to 1, found ${weightSum}` });
    }
    for (const term of entry.execution) {
      if (!CONDITION_STATS.has(term.stat)) {
        issues.push({ path: `${path}.execution`, message: `unknown stat "${term.stat}"` });
      }
    }
    for (const step of entry.steps) {
      issues.push(...duplicateIssues(`${path}.${step.id}`, step.options));
      if (step.options.length < 2) {
        issues.push({ path: `${path}.${step.id}`, message: "a decision needs at least two options" });
      }
      if (!step.options.some((option) => option.requires === undefined)) {
        issues.push({
          path: `${path}.${step.id}`,
          message: "every option is gated — this step can soft-lock the case",
        });
      }
      if (!step.options.some((option) => option.quality === "best")) {
        issues.push({ path: `${path}.${step.id}`, message: "no option is marked best" });
      }
      for (const option of step.options) {
        issues.push(...validateCondition(option.requires, `${path}.${step.id}.${option.id}`));
      }
    }
  }
  for (const entry of SIM_LAB_EXERCISES) {
    const path = `simLab.${entry.id}`;
    for (const stage of entry.stage) {
      if (!STAGES.has(stage)) issues.push({ path, message: `unknown stage "${stage}"` });
    }
    if (!semestersReachable(entry.stage, entry.minSemester ?? 1, entry.maxSemester ?? SEMESTERS.length)) {
      issues.push({ path, message: "no semester matches this exercise's stage and semester bounds" });
    }
    if (entry.stages.length !== 3) {
      issues.push({ path, message: `expected 3 stages, found ${entry.stages.length}` });
    }
    for (const stage of entry.stages) {
      for (const outcome of ["over", "ideal", "under"] as const) {
        if (!isNonEmptyString(stage.feedback[outcome]?.en)) {
          issues.push({ path: `${path}.${stage.id}`, message: `missing ${outcome} feedback` });
        }
      }
    }
  }

  if (BREAK_TRACKS.length !== 5) {
    issues.push({ path: "breakTracks", message: `expected frozen roster of 5, found ${BREAK_TRACKS.length}` });
  }
  if (RESEARCH_LABS.length !== 4) {
    issues.push({ path: "research.labs", message: `expected exactly 4 labs, found ${RESEARCH_LABS.length}` });
  }
  if (RESEARCH_PROJECT_TEMPLATES.length !== 10) {
    issues.push({ path: "research.projects", message: `expected exactly 10 project templates, found ${RESEARCH_PROJECT_TEMPLATES.length}` });
  }
  if (RESEARCH_EVENTS.length !== 24) {
    issues.push({ path: "research.events", message: `expected exactly 24 authored research events, found ${RESEARCH_EVENTS.length}` });
  }
  issues.push(...duplicateIssues("electives", ELECTIVES));
  issues.push(...duplicateIssues("breakTracks", BREAK_TRACKS));
  issues.push(...duplicateIssues("research.labs", RESEARCH_LABS));
  issues.push(...duplicateIssues("research.projects", RESEARCH_PROJECT_TEMPLATES));
  issues.push(...duplicateIssues("research.events", RESEARCH_EVENTS));

  for (const [label, items] of registries) issues.push(...duplicateIssues(label, items));
  if (ENDINGS.length !== 24) {
    issues.push({ path: "endings", message: `expected frozen roster of 24, found ${ENDINGS.length}` });
  }
  for (const [label, count, matches] of [
    ["state override", 2, (priority: number) => priority === 95],
    ["career track", 12, (priority: number) => priority >= 88 && priority <= 92],
    ["specialist build", 6, (priority: number) => priority >= 78 && priority <= 86],
    ["relationship / finance", 2, (priority: number) => priority >= 60 && priority <= 70],
    ["balanced fallback", 1, (priority: number) => priority === 50],
    ["default fallback", 1, (priority: number) => priority === 0],
  ] as const) {
    const observed = ENDINGS.filter((ending) => matches(ending.priority)).length;
    if (observed !== count) {
      issues.push({ path: "endings", message: `expected ${count} ${label} endings, found ${observed}` });
    }
  }
  const semesterIds = SEMESTERS.map((semester) => ({ id: String(semester.id) }));
  issues.push(...duplicateIssues("semesters", semesterIds));

  const localizedRoots: ReadonlyArray<readonly [string, unknown]> = [
    ["events", EVENTS],
    ["cards", CARDS],
    ["endings", ENDINGS],
    ["actions", ACTIONS],
    ["bosses", BOSSES],
    ["achievements", ACHIEVEMENTS],
    ["electives", ELECTIVES],
    ["cases", CASES],
    ["simLab", SIM_LAB_EXERCISES],
    ["breakTracks", BREAK_TRACKS],
    ["researchLabs", RESEARCH_LABS],
    ["researchProjects", RESEARCH_PROJECT_TEMPLATES],
    ["researchEvents", RESEARCH_EVENTS],
    ["semesters", SEMESTERS],
    ["v2UiText", V2_UI_TEXT],
  ];
  let localizedCount = 0;
  for (const [label, root] of localizedRoots) {
    issues.push(...validateLocalizedTexts(root, label));
    const count = (node: unknown): number => {
      if (Array.isArray(node)) {
        return (node as unknown[]).reduce<number>((sum, item) => sum + count(item), 0);
      }
      if (!isRecord(node)) return 0;
      const here = Object.hasOwn(node, "en") || Object.hasOwn(node, "zh") ? 1 : 0;
      return (
        here +
        Object.values(node).reduce<number>((sum, item) => sum + count(item), 0)
      );
    };
    localizedCount += count(root);
  }

  for (const event of EVENTS) {
    const path = `events.${event.id}`;
    for (const stage of event.stage) {
      if (!STAGES.has(stage)) issues.push({ path: `${path}.stage`, message: `unknown stage "${stage}"` });
    }
    const effectiveMin = Math.max(event.minSemester ?? 1, event.condition?.minSemester ?? 1);
    const effectiveMax = Math.min(event.maxSemester ?? SEMESTERS.length, event.condition?.maxSemester ?? SEMESTERS.length);
    issues.push(...validateCondition(event.condition, `${path}.condition`));
    if (!semestersReachable(event.stage, effectiveMin, effectiveMax)) {
      issues.push({ path, message: `unreachable for stages [${event.stage.join(", ")}] in semesters ${effectiveMin}..${effectiveMax}` });
    }
    issues.push(...duplicateIssues(`${path}.choices`, event.choices));
    for (const choice of event.choices) {
      issues.push(...validateCondition(choice.requirements, `${path}.choices.${choice.id}.requirements`));
    }
  }

  const grantedFlags = new Set<string>(["hit_critical_stress"]);
  const declaredSystemFlags = new Map(
    SYSTEM_FLAGS.map((definition) => [definition.id, definition]),
  );
  for (const definition of SYSTEM_FLAGS) grantedFlags.add(definition.id);
  for (const duplicate of findDuplicateIds(SYSTEM_FLAGS)) {
    issues.push({ path: "systemFlags", message: `duplicate id \"${duplicate}\"` });
  }
  const requiredFlags = new Set<string>();
  const collectConditionFlags = (condition?: EventCondition): void => {
    for (const flag of condition?.requiredFlags ?? []) requiredFlags.add(flag);
    for (const flag of condition?.forbiddenFlags ?? []) requiredFlags.add(flag);
  };
  for (const event of EVENTS) {
    collectConditionFlags(event.condition);
    for (const choice of event.choices) {
      collectConditionFlags(choice.requirements);
      for (const flag of choice.addFlags ?? []) grantedFlags.add(flag);
    }
  }
  for (const card of CARDS) collectConditionFlags(card.requirements);
  for (const action of ACTIONS) collectConditionFlags(action.unlock);
  for (const ending of ENDINGS) collectConditionFlags(ending.condition);
  for (const flag of requiredFlags) {
    if (!grantedFlags.has(flag)) {
      issues.push({ path: "flags", message: `orphaned condition flag \"${flag}\" is never granted` });
    }
    const deferred = declaredSystemFlags.get(flag);
    if (deferred) {
      warnings.push(
        `flag \"${flag}\" is declared for ${deferred.producer} in ${deferred.phase}`,
      );
    }
  }

  for (const card of CARDS) {
    const path = `cards.${card.id}`;
    if (!RARITIES.has(card.rarity)) issues.push({ path: `${path}.rarity`, message: `unknown rarity "${card.rarity}"` });
    for (const stage of card.stage) {
      if (!STAGES.has(stage)) issues.push({ path: `${path}.stage`, message: `unknown stage "${stage}"` });
    }
    issues.push(...validateCondition(card.requirements, `${path}.requirements`));
    const min = card.requirements?.minSemester ?? 1;
    const max = card.requirements?.maxSemester ?? SEMESTERS.length;
    if (!semestersReachable(card.stage, min, max)) issues.push({ path, message: "unreachable stage/semester combination" });
  }

  for (const action of ACTIONS) issues.push(...validateCondition(action.unlock, `actions.${action.id}.unlock`));
  for (const ending of ENDINGS) issues.push(...validateCondition(ending.condition, `endings.${ending.id}.condition`));

  const validHookOns = new Set([
    "actionEffects", "apPerWeek", "softCapBand", "caseRoll", "bossRoll",
    "simLabRoll", "projectQuality", "weeklyThreshold", "affinityGain",
    "income", "expense",
  ]);
  const validateHooks = (hooks: readonly ModifierHook[], path: string): void => {
    for (const hook of hooks) {
      if (!validHookOns.has(hook.on)) {
        issues.push({ path, message: `unknown modifier hook "${String(hook.on)}"` });
      }
      if (hook.on === "actionEffects" && hook.stat && !STATS.has(hook.stat)) {
        issues.push({ path, message: `unknown action hook stat "${hook.stat}"` });
      }
      if (hook.on === "softCapBand" && !STATS.has(hook.stat)) {
        issues.push({ path, message: `unknown soft-cap hook stat "${hook.stat}"` });
      }
      // `"add" in hook` is true for an optional property explicitly set to
      // undefined, so read the value and test that instead of the key.
      const add = "add" in hook ? hook.add : undefined;
      const mult = "mult" in hook ? hook.mult : undefined;
      if (add !== undefined && !Number.isFinite(add)) {
        issues.push({ path, message: "hook add must be finite" });
      }
      if (mult !== undefined && (!Number.isFinite(mult) || mult <= 0)) {
        issues.push({ path, message: "hook multiplier must be positive and finite" });
      }
    }
  };
  const hasCurrentActionEffect = (hooks: readonly ModifierHook[]): boolean => hooks.some((hook) => {
    if (hook.on !== "actionEffects") return false;
    return ACTIONS.some((action) => {
      const tags = action.tags ?? [];
      if (hook.tag && !tags.includes(hook.tag)) return false;
      if (!hook.stat) return Object.values(action.effects).some((value) => (value ?? 0) > 0);
      return (action.effects[hook.stat] ?? 0) > 0;
    });
  });
  for (const elective of ELECTIVES) {
    const path = `electives.${elective.id}`;
    issues.push(...validateCondition(elective.prerequisites ?? elective.requirements, `${path}.requirements`));
    const min = Math.max(elective.minSemester, elective.prerequisites?.minSemester ?? elective.requirements?.minSemester ?? 1);
    const max = Math.min(elective.maxSemester, elective.prerequisites?.maxSemester ?? elective.requirements?.maxSemester ?? SEMESTERS.length);
    if (!semestersReachable(elective.stage, min, max)) issues.push({ path, message: "unreachable stage/semester combination" });
    validateHooks(elective.hooks, `${path}.hooks`);
    if (!hasCurrentActionEffect(elective.hooks)) {
      issues.push({ path: `${path}.hooks`, message: "must measurably affect at least one current action" });
    }
    if (elective.tags.length === 0) issues.push({ path: `${path}.tags`, message: "must have at least one tag" });
  }
  for (const track of BREAK_TRACKS) {
    const path = `breakTracks.${track.id}`;
    const requirements = track.requirements ?? track.eligibility;
    issues.push(...validateCondition(requirements, `${path}.requirements`));
    if (track.actions.length !== 3) issues.push({ path: `${path}.actions`, message: `expected exactly 3 actions, found ${track.actions.length}` });
    issues.push(...duplicateIssues(`${path}.actions`, track.actions));
    for (const breakAction of track.actions) {
      issues.push(...validateLocalizedTexts(breakAction, `${path}.actions.${breakAction.id}`));
      if (breakAction.tags.length === 0) issues.push({ path: `${path}.actions.${breakAction.id}.tags`, message: "must have at least one tag" });
    }
  }
  for (let semesterId = 1; semesterId <= SEMESTERS.length; semesterId += 1) {
    const stage = SEMESTERS[semesterId - 1].stage;
    const eligible = ELECTIVES.filter((elective) =>
      semesterId >= elective.minSemester && semesterId <= elective.maxSemester &&
      (elective.stage.includes("any") || elective.stage.includes(stage)) &&
      (!elective.prerequisites?.minSemester || semesterId >= elective.prerequisites.minSemester) &&
      (!elective.prerequisites?.maxSemester || semesterId <= elective.prerequisites.maxSemester),
    );
    if (eligible.length < 3) issues.push({ path: `electives.semester${semesterId}`, message: `needs at least 3 eligible offers, found ${eligible.length}` });
  }

  const labIds = new Set(RESEARCH_LABS.map((lab) => lab.id));
  const projectIdsByLab = new Map<string, number>();
  for (const lab of RESEARCH_LABS) {
    const path = `research.labs.${lab.id}`;
    issues.push(...validateCondition(lab.requirements, `${path}.requirements`));
    if (!Number.isInteger(lab.intensity) || lab.intensity < 1 || lab.intensity > 3) {
      issues.push({ path: `${path}.intensity`, message: "must be an integer in 1..3" });
    }
    if (!Number.isFinite(lab.prestige) || lab.prestige < 0 || lab.prestige > 100) {
      issues.push({ path: `${path}.prestige`, message: "must be in 0..100" });
    }
    if (!FROZEN_NPC_IDS.has(lab.piNpcId)) {
      issues.push({ path: `${path}.piNpcId`, message: `unknown frozen-roster NPC "${lab.piNpcId}"` });
    }
    if (lab.perks.length === 0 || lab.perks.some((perk) => !isNonEmptyString(perk))) {
      issues.push({ path: `${path}.perks`, message: "must grant at least one non-empty lab flag" });
    }
  }

  const researchEventById = new Map(RESEARCH_EVENTS.map((event) => [event.id, event]));
  const referencedResearchEvents = new Set<string>();
  for (const project of RESEARCH_PROJECT_TEMPLATES) {
    const path = `research.projects.${project.id}`;
    if (!labIds.has(project.labId)) {
      issues.push({ path: `${path}.labId`, message: `unknown lab "${project.labId}"` });
    } else {
      projectIdsByLab.set(project.labId, (projectIdsByLab.get(project.labId) ?? 0) + 1);
    }
    if (!Number.isFinite(project.baseRisk) || project.baseRisk <= 0 || project.baseRisk >= 1) {
      issues.push({ path: `${path}.baseRisk`, message: "must be a probability strictly between 0 and 1" });
    }
    const definedPhases = Object.keys(project.phaseWeeks) as ProjectPhase[];
    for (const phase of PROJECT_PHASES) {
      const weeks = project.phaseWeeks[phase];
      if (!Number.isInteger(weeks) || weeks < 0) {
        issues.push({ path: `${path}.phaseWeeks.${phase}`, message: "must be a non-negative integer" });
      } else if (ACTIVE_PROJECT_PHASES.has(phase) && weeks === 0) {
        issues.push({ path: `${path}.phaseWeeks.${phase}`, message: "active phases must take at least one week" });
      } else if (!ACTIVE_PROJECT_PHASES.has(phase) && weeks !== 0) {
        issues.push({ path: `${path}.phaseWeeks.${phase}`, message: "terminal phases must take zero weeks" });
      }
    }
    for (const phase of definedPhases) {
      if (!PROJECT_PHASES.includes(phase)) {
        issues.push({ path: `${path}.phaseWeeks`, message: `unknown phase "${phase}"` });
      }
    }
    const driverStats = project.qualityDrivers.map((driver) => driver.stat);
    if (new Set(driverStats).size !== driverStats.length) {
      issues.push({ path: `${path}.qualityDrivers`, message: "driver stats must be unique" });
    }
    let driverWeight = 0;
    for (const driver of project.qualityDrivers) {
      if (!CONDITION_STATS.has(driver.stat)) {
        issues.push({ path: `${path}.qualityDrivers`, message: `unknown stat "${driver.stat}"` });
      }
      if (!Number.isFinite(driver.weight) || driver.weight <= 0) {
        issues.push({ path: `${path}.qualityDrivers`, message: "weights must be positive and finite" });
      }
      driverWeight += driver.weight;
    }
    if (project.qualityDrivers.length === 0 || Math.abs(driverWeight - 1) > 0.000001) {
      issues.push({ path: `${path}.qualityDrivers`, message: `weights must sum to 1, found ${driverWeight}` });
    }
    if (project.setbackEvents.length === 0) {
      issues.push({ path: `${path}.setbackEvents`, message: "must reference authored research events" });
    }
    if (new Set(project.setbackEvents).size !== project.setbackEvents.length) {
      issues.push({ path: `${path}.setbackEvents`, message: "must not contain duplicate event references" });
    }
    const kinds = new Set<"setback" | "lucky">();
    for (const eventId of project.setbackEvents) {
      referencedResearchEvents.add(eventId);
      const event = researchEventById.get(eventId);
      if (!event) {
        issues.push({ path: `${path}.setbackEvents`, message: `unknown research event "${eventId}"` });
        continue;
      }
      kinds.add(event.kind);
      if (!event.phases.some((phase) => ACTIVE_PROJECT_PHASES.has(phase))) {
        issues.push({ path: `${path}.setbackEvents`, message: `event "${eventId}" has no reachable active phase` });
      }
    }
    if (!kinds.has("setback") || !kinds.has("lucky")) {
      issues.push({ path: `${path}.setbackEvents`, message: "each template must expose both setback and lucky outcomes" });
    }
    for (const phase of ACTIVE_PROJECT_PHASES) {
      const hasProducer = project.setbackEvents.some((eventId) =>
        researchEventById.get(eventId)?.phases.includes(phase),
      );
      if (!hasProducer) {
        issues.push({ path: `${path}.setbackEvents`, message: `no authored event can fire during ${phase}` });
      }
    }
    for (const [key, value] of Object.entries(project.payoff)) {
      if (!Number.isFinite(value)) {
        issues.push({ path: `${path}.payoff.${key}`, message: "must be finite" });
      }
    }
  }
  for (const lab of RESEARCH_LABS) {
    if ((projectIdsByLab.get(lab.id) ?? 0) === 0) {
      issues.push({ path: `research.labs.${lab.id}`, message: "has no reachable project template" });
    }
  }

  const projectPhaseSet = new Set<ProjectPhase>(PROJECT_PHASES);
  let repeatPhaseProducerCount = 0;
  for (const event of RESEARCH_EVENTS) {
    const path = `research.events.${event.id}`;
    if (!referencedResearchEvents.has(event.id)) {
      issues.push({ path, message: "orphaned event is not produced by any project template" });
    }
    if (event.phases.length === 0) {
      issues.push({ path: `${path}.phases`, message: "must have at least one reachable phase" });
    }
    if (new Set(event.phases).size !== event.phases.length) {
      issues.push({ path: `${path}.phases`, message: "must not repeat phases" });
    }
    for (const phase of event.phases) {
      if (!projectPhaseSet.has(phase) || !ACTIVE_PROJECT_PHASES.has(phase)) {
        issues.push({ path: `${path}.phases`, message: `invalid event-producing phase "${phase}"` });
      }
    }
    const scalarEffects = [
      event.effects.progress,
      event.effects.quality,
      event.effects.researchPoints,
      event.effects.reputationInLab,
      event.effects.stallWeeks,
      ...Object.values(event.effects.stats ?? {}),
    ].filter((value): value is number => value !== undefined);
    if (scalarEffects.length === 0 && !event.effects.repeatPhase) {
      issues.push({ path: `${path}.effects`, message: "must have at least one mechanical effect" });
    }
    if (scalarEffects.some((value) => !Number.isFinite(value))) {
      issues.push({ path: `${path}.effects`, message: "all effects must be finite" });
    }
    for (const stat of Object.keys(event.effects.stats ?? {})) {
      if (!STATS.has(stat as StatKey)) {
        issues.push({ path: `${path}.effects.stats`, message: `unknown effect stat "${stat}"` });
      }
    }
    if (event.effects.stallWeeks !== undefined &&
        (!Number.isInteger(event.effects.stallWeeks) || event.effects.stallWeeks < 1 || event.effects.stallWeeks > 2)) {
      issues.push({ path: `${path}.effects.stallWeeks`, message: "must be an integer in 1..2" });
    }
    if (event.effects.repeatPhase) {
      repeatPhaseProducerCount += 1;
      if (event.kind !== "setback") {
        issues.push({ path: `${path}.effects.repeatPhase`, message: "phase repeats must be authored as setbacks" });
      }
      if (event.phases.length !== 1 || event.phases[0] !== "irb") {
        issues.push({ path: `${path}.phases`, message: "phase-repeat events are only valid during the IRB phase" });
      }
    }
    const hasNegative = scalarEffects.some((value) => value < 0) || Boolean(event.effects.repeatPhase) || Boolean(event.effects.stallWeeks);
    const hasPositive = scalarEffects.some((value) => value > 0);
    if (event.kind === "setback" && !hasNegative) {
      issues.push({ path: `${path}.effects`, message: "setback must have a visible cost or delay" });
    }
    if (event.kind === "lucky" && !hasPositive) {
      issues.push({ path: `${path}.effects`, message: "lucky event must have a visible benefit" });
    }
  }
  if (repeatPhaseProducerCount === 0) {
    issues.push({ path: "research.events", message: "must include at least one authored phase-repeat producer" });
  }
  const irbRevision = researchEventById.get("research_irb_clarification");
  if (
    !irbRevision ||
    !irbRevision.effects.repeatPhase ||
    irbRevision.phases.length !== 1 ||
    irbRevision.phases[0] !== "irb"
  ) {
    issues.push({
      path: "research.events.research_irb_clarification",
      message: "must repeat exactly the IRB phase",
    });
  }

  const bossesBySemester = new Map<number, number>();
  for (const boss of BOSSES) {
    bossesBySemester.set(boss.semesterId, (bossesBySemester.get(boss.semesterId) ?? 0) + 1);
    if (!SEMESTERS.some((semester) => semester.id === boss.semesterId)) {
      issues.push({ path: `bosses.${boss.id}.semesterId`, message: `unknown semester ${boss.semesterId}` });
    }
    for (const driver of boss.requiredStats) {
      if (!CONDITION_STATS.has(driver.stat)) issues.push({ path: `bosses.${boss.id}.requiredStats`, message: `unknown stat "${driver.stat}"` });
      if (!Number.isFinite(driver.weight) || driver.weight <= 0) issues.push({ path: `bosses.${boss.id}.requiredStats`, message: "weights must be positive and finite" });
    }
  }
  for (const semester of SEMESTERS) {
    const count = bossesBySemester.get(semester.id) ?? 0;
    if (count !== 1) issues.push({ path: `semesters.${semester.id}`, message: `expected exactly one boss, found ${count}` });
    for (const stat of semester.focus) {
      if (!CONDITION_STATS.has(stat)) issues.push({ path: `semesters.${semester.id}.focus`, message: `unknown stat "${stat}"` });
    }
  }

  const seedIds = new Set(SEED_EVENTS.map((event) => event.id));
  const generatedIds = new Set(GENERATED_EVENTS.map((event) => event.id));
  for (const id of seedIds) {
    if (!generatedIds.has(id)) continue;
    if (INTENTIONAL_EVENT_SHADOWS.has(id)) warnings.push(`generated event "${id}" is intentionally shadowed by its seed event`);
    else issues.push({ path: "events", message: `unapproved seed/generated collision "${id}"` });
  }
  for (const id of INTENTIONAL_EVENT_SHADOWS) {
    if (!seedIds.has(id) || !generatedIds.has(id)) warnings.push(`shadow allowlist entry "${id}" is no longer a collision`);
  }

  return { issues, warnings, localizedCount };
}

const result = runValidation();
console.log("Dental School Life Sim content validator");
console.log(
  `Inventory: events=${EVENTS.length}, cards=${CARDS.length}, endings=${ENDINGS.length}, actions=${ACTIONS.length}, bosses=${BOSSES.length}, achievements=${ACHIEVEMENTS.length}, semesters=${SEMESTERS.length}, electives=${ELECTIVES.length}, breakTracks=${BREAK_TRACKS.length}, researchLabs=${RESEARCH_LABS.length}, researchProjects=${RESEARCH_PROJECT_TEMPLATES.length}, researchEvents=${RESEARCH_EVENTS.length}, cases=${CASES.length}, simLab=${SIM_LAB_EXERCISES.length}`,
);
console.log(`Checks: ${result.localizedCount} LocalizedText values; ids, stages, stats, rarities, conditions, reachability, flags, boss coverage, research producers and phase completeness`);
for (const warning of result.warnings) console.warn(`WARNING: ${warning}`);
if (result.issues.length > 0) {
  for (const issue of result.issues) console.error(`ERROR: ${issue.path}: ${issue.message}`);
  console.error(`CONTENT VALIDATOR FAILED (${result.issues.length} errors, ${result.warnings.length} warnings)`);
  process.exitCode = 1;
} else {
  console.log(`CONTENT VALIDATOR CLEAN (0 errors, ${result.warnings.length} warnings)`);
}
