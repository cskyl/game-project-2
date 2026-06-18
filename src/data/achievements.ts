import type { Achievement } from "../game/types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_boss_great",
    title: { en: "Strong Start", zh: "开门红" },
    description: {
      en: "Get a Great result in any semester check.",
      zh: "在任意学期考核中拿到「优秀」。",
    },
  },
  {
    id: "stress_survivor",
    title: { en: "Recovered", zh: "缓过来了" },
    description: {
      en: "Recover from critical stress.",
      zh: "从临界压力中恢复过来。",
    },
  },
  {
    id: "patient_trust",
    title: { en: "Patient Trust", zh: "患者的信任" },
    description: { en: "Reach Empathy 80.", zh: "同理心达到 80。" },
  },
  {
    id: "steady_hands",
    title: { en: "Steady Hands", zh: "稳稳的手" },
    description: { en: "Reach Hand Skill 80.", zh: "手上功夫达到 80。" },
  },
  {
    id: "balanced_life",
    title: { en: "A Whole Person", zh: "一个完整的人" },
    description: {
      en: "Finish with Mood, Stamina, and Career Readiness all above 60.",
      zh: "结束时心情、体力、职业准备度都高于 60。",
    },
  },
  {
    id: "well_supported",
    title: { en: "Not Alone", zh: "不是一个人" },
    description: { en: "Reach Support 80.", zh: "情感支持达到 80。" },
  },
  {
    id: "community_heart",
    title: { en: "Community Heart", zh: "社区的心" },
    description: { en: "Reach Community 80.", zh: "社区影响达到 80。" },
  },
];
