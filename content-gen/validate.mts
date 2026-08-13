import { ACHIEVEMENTS } from "../src/data/achievements";
import { ACTIONS } from "../src/data/actions";
import { BOSSES } from "../src/data/bosses";
import { CARDS } from "../src/data/cards";
import { ENDINGS } from "../src/data/endings";
import { GENERATED_EVENTS } from "../src/data/events.generated";
import { SEED_EVENTS } from "../src/data/events.seed";
import { EVENTS } from "../src/data/events";
import { SEMESTERS } from "../src/data/semesters";
import { V2_UI_TEXT } from "../src/data/uiText";
import { ALL_STATS } from "../src/game/constants";
import type {
  ConditionStatKey,
  EventCondition,
  LocalizedText,
  Stage,
  StatKey,
} from "../src/game/types";

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

  for (const [label, items] of registries) issues.push(...duplicateIssues(label, items));
  const semesterIds = SEMESTERS.map((semester) => ({ id: String(semester.id) }));
  issues.push(...duplicateIssues("semesters", semesterIds));

  const localizedRoots: ReadonlyArray<readonly [string, unknown]> = [
    ["events", EVENTS],
    ["cards", CARDS],
    ["endings", ENDINGS],
    ["actions", ACTIONS],
    ["bosses", BOSSES],
    ["achievements", ACHIEVEMENTS],
    ["semesters", SEMESTERS],
    ["v2UiText", V2_UI_TEXT],
  ];
  let localizedCount = 0;
  for (const [label, root] of localizedRoots) {
    issues.push(...validateLocalizedTexts(root, label));
    const count = (node: unknown): number => {
      if (Array.isArray(node)) return node.reduce((sum, item) => sum + count(item), 0);
      if (!isRecord(node)) return 0;
      const here = Object.hasOwn(node, "en") || Object.hasOwn(node, "zh") ? 1 : 0;
      return here + Object.values(node).reduce((sum, item) => sum + count(item), 0);
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
  `Inventory: events=${EVENTS.length}, cards=${CARDS.length}, endings=${ENDINGS.length}, actions=${ACTIONS.length}, bosses=${BOSSES.length}, achievements=${ACHIEVEMENTS.length}, semesters=${SEMESTERS.length}`,
);
console.log(`Checks: ${result.localizedCount} LocalizedText values; ids, stages, stats, rarities, conditions, reachability, flags, boss coverage`);
for (const warning of result.warnings) console.warn(`WARNING: ${warning}`);
if (result.issues.length > 0) {
  for (const issue of result.issues) console.error(`ERROR: ${issue.path}: ${issue.message}`);
  console.error(`CONTENT VALIDATOR FAILED (${result.issues.length} errors, ${result.warnings.length} warnings)`);
  process.exitCode = 1;
} else {
  console.log(`CONTENT VALIDATOR CLEAN (0 errors, ${result.warnings.length} warnings)`);
}
