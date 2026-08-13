import type { GameState, StatBlock, StatKey } from "./types";

export type ModifierSource = {
  id: string;
  kind: "perk" | "equipment" | "npc" | "semester" | "elective" | "archetype";
};

export type ModifierHook =
  | { on: "actionEffects"; tag?: string; stat?: StatKey; mult?: number; add?: number }
  | { on: "apPerWeek"; add: number }
  | { on: "softCapBand"; stat: StatKey; shift: number }
  | { on: "caseRoll" | "bossRoll" | "simLabRoll" | "projectQuality"; add: number }
  | { on: "weeklyThreshold"; stat: StatKey; add: number }
  | { on: "affinityGain"; mult: number }
  | { on: "income" | "expense"; mult: number };

export type RegisteredModifier = {
  source: ModifierSource;
  hooks: ModifierHook[];
};

/** Content registries populate this in their own phases; P0 intentionally has none. */
const REGISTRY: Record<string, readonly ModifierHook[]> = {};

/** Data modules register definitions once at module load; active state selects them. */
export function registerModifier(
  source: ModifierSource,
  hooks: readonly ModifierHook[],
): void {
  const key = `${source.kind}:${source.id}`;
  const existing = REGISTRY[key];
  if (existing) {
    // Vite can evaluate a data module again during HMR. An identical definition
    // is idempotent; a conflicting definition remains a content error.
    if (JSON.stringify(existing) === JSON.stringify(hooks)) return;
    throw new Error(`Conflicting modifier source: ${key}`);
  }
  REGISTRY[key] = [...hooks];
}

/** Test-only registry reset. Runtime code should only register at module load. */
export function resetModifierRegistryForTests(): void {
  for (const key of Object.keys(REGISTRY)) delete REGISTRY[key];
}

function activeSources(state: GameState): ModifierSource[] {
  const sources: ModifierSource[] = [
    ...state.perks.map((id) => ({ id, kind: "perk" as const })),
    ...state.equipment.map((id) => ({ id, kind: "equipment" as const })),
    ...state.semesterModifiers.map((id) => ({ id, kind: "semester" as const })),
  ];
  if (state.activeElective) {
    sources.push({ id: state.activeElective, kind: "elective" });
  }
  if (state.archetypeId) {
    sources.push({ id: state.archetypeId, kind: "archetype" });
  }
  const npcFlags = new Set(
    Object.values(state.npcs).flatMap((npc) => npc.flags),
  );
  for (const flag of npcFlags) {
    sources.push({ id: flag, kind: "npc" });
  }
  return sources;
}

export function collectModifiers(state: GameState): RegisteredModifier[] {
  return activeSources(state).flatMap((source) => {
    const hooks = REGISTRY[`${source.kind}:${source.id}`];
    return hooks ? [{ source, hooks: [...hooks] }] : [];
  });
}

export function collectHooks(state: GameState): ModifierHook[] {
  return collectModifiers(state).flatMap((entry) => entry.hooks);
}

export function applyActionHooks(
  effects: StatBlock,
  tags: readonly string[],
  hooks: readonly ModifierHook[],
): StatBlock {
  const next: StatBlock = {};
  for (const [rawKey, rawBase] of Object.entries(effects)) {
    const stat = rawKey as StatKey;
    const base = rawBase ?? 0;
    let multiplier = 1;
    let addition = 0;
    for (const hook of hooks) {
      if (hook.on !== "actionEffects") continue;
      if (hook.tag && !tags.includes(hook.tag)) continue;
      // Broad hooks represent bonuses to gains; explicit stat hooks may also
      // intentionally alter costs or penalties.
      if (hook.stat ? hook.stat !== stat : base <= 0) continue;
      multiplier *= hook.mult ?? 1;
      addition += hook.add ?? 0;
    }
    next[stat] = Math.round(base * multiplier + addition);
  }
  return next;
}

export function sumHookAdds(
  hooks: readonly ModifierHook[],
  on: "apPerWeek" | "caseRoll" | "bossRoll" | "simLabRoll" | "projectQuality",
): number {
  return hooks.reduce((sum, hook) => (hook.on === on ? sum + hook.add : sum), 0);
}

/** Add all weekly passive adjustments to their target stats. */
export function applyWeeklyThresholdHooks(
  effects: StatBlock,
  hooks: readonly ModifierHook[],
): StatBlock {
  const next = { ...effects };
  for (const hook of hooks) {
    if (hook.on !== "weeklyThreshold") continue;
    next[hook.stat] = (next[hook.stat] ?? 0) + hook.add;
  }
  return next;
}

/** Net shift to the soft-cap bands for one stat. */
export function getSoftCapBandShift(
  hooks: readonly ModifierHook[],
  stat: StatKey,
): number {
  return hooks.reduce(
    (sum, hook) =>
      hook.on === "softCapBand" && hook.stat === stat
        ? sum + hook.shift
        : sum,
    0,
  );
}

function multiplyHooks(
  base: number,
  hooks: readonly ModifierHook[],
  on: "affinityGain" | "income" | "expense",
): number {
  const multiplier = hooks.reduce(
    (product, hook) => hook.on === on ? product * hook.mult : product,
    1,
  );
  return Math.round(base * multiplier);
}

export function applyAffinityGainHooks(
  base: number,
  hooks: readonly ModifierHook[],
): number {
  return multiplyHooks(base, hooks, "affinityGain");
}

export function applyIncomeHooks(
  base: number,
  hooks: readonly ModifierHook[],
): number {
  return multiplyHooks(base, hooks, "income");
}

export function applyExpenseHooks(
  base: number,
  hooks: readonly ModifierHook[],
): number {
  return multiplyHooks(base, hooks, "expense");
}
