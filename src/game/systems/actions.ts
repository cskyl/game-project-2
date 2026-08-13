import type { Action, GameState, StatBlock, StatKey } from "../types";
import { applyActionHooks, collectHooks } from "../modifiers";

/** Apply contextual stamina, mood, stress, and weakest-skill action rules. */
export function contextualActionEffects(
  action: Action,
  state: GameState,
): StatBlock {
  const stats = state.stats;
  const effects: StatBlock = { ...action.effects };

  if (action.dynamicWeakest) {
    const core: StatKey[] = [
      "knowledge",
      "handSkill",
      "clinicalSense",
    ];
    const untrainedCore = core.filter(
      (key) => (state.weekGains[key] ?? 0) <= 0,
    );
    const weakest = untrainedCore.reduce<StatKey | undefined>(
      (current, key) =>
        current === undefined || stats[key] < stats[current] ? key : current,
      undefined,
    );
    if (weakest) {
      effects[weakest] = (effects[weakest] ?? 0) + 3;
    }
  }

  const tags = action.tags ?? [];
  const scale = (key: StatKey, factor: number) => {
    const value = effects[key];
    if (value !== undefined) effects[key] = Math.round(value * factor);
  };

  if (tags.includes("study")) {
    if (stats.stress < 30 && effects.knowledge !== undefined) {
      effects.knowledge -= 1;
    }
    if (stats.mood >= 20 && stats.mood < 40) scale("knowledge", 0.9);
  }

  if (
    stats.stamina < 25 &&
    (tags.includes("lab") || tags.includes("clinic"))
  ) {
    scale("handSkill", 0.8);
    scale("clinicalSense", 0.8);
    scale("empathy", 0.8);
    scale("publicImpact", 0.8);
  }

  if (
    stats.mood >= 20 &&
    stats.mood < 40 &&
    (tags.includes("support") || tags.includes("relationship"))
  ) {
    scale("love", 1.2);
    scale("mood", 1.2);
  }

  if (tags.includes("heavy") && stats.stamina > 75) {
    if ((effects.mood ?? 0) < 0) scale("mood", 0.7);
    if ((effects.stress ?? 0) > 0) scale("stress", 0.7);
  }

  return applyActionHooks(effects, tags, collectHooks(state));
}
