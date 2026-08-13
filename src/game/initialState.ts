import type { StatKey } from "./types";

// Starting stats: capable but not expert. Mood/stamina decent, stress moderate,
// love already an existing support path (not zero).
export const INITIAL_STATS: Record<StatKey, number> = {
  knowledge: 35,
  handSkill: 25,
  clinicalSense: 20,
  empathy: 45,
  stamina: 65,
  confidence: 35,
  reputation: 30,
  mood: 65,
  stress: 35,
  love: 45,
  research: 10,
  publicImpact: 10,
  focus: 65,
  standing: 30,
  money: 50,
};
