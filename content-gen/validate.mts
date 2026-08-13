import { ACHIEVEMENTS } from "../src/data/achievements";
import { ACTIONS } from "../src/data/actions";
import { BOSSES } from "../src/data/bosses";
import { CARDS } from "../src/data/cards";
import { ENDINGS } from "../src/data/endings";
import { GENERATED_EVENTS } from "../src/data/events.generated";
import { SEED_EVENTS } from "../src/data/events.seed";
import { EVENTS } from "../src/data/events";
import { BREAK_TRACKS } from "../src/data/breaks";
import { ELECTIVES } from "../src/data/electives";
import { SEMESTERS } from "../src/data/semesters";
import { SYSTEM_FLAGS } from "../src/data/systemFlags";
import { V2_UI_TEXT } from "../src/data/uiText";
import { ALL_STATS } from "../src/game/constants";
import type {
  ConditionStatKey,
  EventCondition,
  LocalizedText,
  Stage,
  StatKey,
} from "../src/game/types";
import type { ModifierHook } from "../src/game/modifiers";

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

  if (SEMESTERS.length !== 12) {
    issues.push({ path: "semesters", message: `expected 12 semesters, found ${SEMESTERS.length}` });
  }
  if (ELECTIVES.length !== 14) {
    issues.push({ path: "electives", message: `expected frozen roster of 14, found ${ELECTIVES.length}` });
  }
  if (BREAK_TRACKS.length !== 5) {
    issues.push({ path: "breakTracks", message: `expected frozen roster of 5, found ${BREAK_TRACKS.length}` });
  }
  issues.push(...duplicateIssues("electives", ELECTIVES));
  issues.push(...duplicateIssues("breakTracks", BREAK_TRACKS));

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
    ["breakTracks", BREAK_TRACKS],
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
      if ("add" in hook && !Number.isFinite(hook.add)) issues.push({ path, message: "hook add must be finite" });
      if ("mult" in hook && (!Number.isFinite(hook.mult) || hook.mult <= 0)) issues.push({ path, message: "hook multiplier must be positive and finite" });
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
  `Inventory: events=${EVENTS.length}, cards=${CARDS.length}, endings=${ENDINGS.length}, actions=${ACTIONS.length}, bosses=${BOSSES.length}, achievements=${ACHIEVEMENTS.length}, semesters=${SEMESTERS.length}, electives=${ELECTIVES.length}, breakTracks=${BREAK_TRACKS.length}`,
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
