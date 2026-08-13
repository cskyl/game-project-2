import type { Action } from "../game/types";

// Weekly actions. `tags` drive contextual modifiers in the engine:
//   study   – weaker when mood is low / over-relaxed
//   lab/clinic – weaker when stamina is very low
//   heavy   – mood/stress costs softened when stamina is high
//   support/relationship – stronger when mood is low
export const ACTIONS: Action[] = [
  {
    id: "review_lecture",
    title: { en: "Review Lecture", zh: "复习 Lecture" },
    description: {
      en: "A focused study block. Knowledge up, with a little stress.",
      zh: "留出一整段时间扎实复习。知识增加，压力略升。",
    },
    flavor: {
      en: "You review the lecture properly. Your brain is a little full, but the pieces finally start connecting.",
      zh: "你认真复习了 lecture。脑子有点满，但知识点终于开始连起来了。",
    },
    cost: 3,
    effects: { knowledge: 3, stress: 3, mood: -1 },
    tags: ["study"],
  },
  {
    id: "deep_study",
    title: { en: "Deep Study Session", zh: "深度学习" },
    description: {
      en: "A long, focused push. Big knowledge gain, real stress and fatigue.",
      zh: "长时间专注硬啃。知识涨得多，压力和疲惫也是真的。",
    },
    flavor: {
      en: "You cover a lot, but your brain feels like a browser with 80 tabs open.",
      zh: "你学了很多，但脑子像开了 80 个标签页的浏览器。",
    },
    cost: 3,
    effects: { knowledge: 6, stress: 8, stamina: -4, mood: -3 },
    tags: ["study", "heavy"],
  },
  {
    id: "sim_lab",
    title: { en: "Sim Lab Practice", zh: "Sim Lab 练习" },
    description: {
      en: "Bench practice. Hand skill up, draining but worth it.",
      zh: "实验台练习。手上功夫提升，挺累但值得。",
    },
    flavor: {
      en: "Your hands are tired, but they understand a little more than before.",
      zh: "手挺累的，但它们比之前更懂一点了。",
    },
    cost: 3,
    effects: { handSkill: 5, stress: 5, stamina: -5, confidence: 1 },
    tags: ["lab", "heavy"],
  },
  {
    id: "quick_drill",
    title: { en: "Quick Hand Skill Drill", zh: "快速手部训练" },
    description: {
      en: "A focused drill. A small hand-skill gain without the full lab drain.",
      zh: "集中练一轮。手感小幅提升，但没有完整实验课那么累。",
    },
    cost: 3,
    effects: { handSkill: 2, stress: 2, stamina: -2 },
    tags: ["lab"],
  },
  {
    id: "clinic_prep",
    title: { en: "Clinic Prep / Shadowing", zh: "临床预备 / 跟诊" },
    description: {
      en: "Shadow and prepare for clinic. Clinical sense and confidence up.",
      zh: "跟诊、为临床做准备。临床思维和自信提升。",
    },
    cost: 3,
    effects: { clinicalSense: 4, confidence: 2, stress: 5, empathy: 1 },
    tags: ["clinic", "heavy"],
    unlock: { minSemester: 4 },
  },
  {
    id: "patient_comm",
    title: { en: "Patient Communication Practice", zh: "医患沟通练习" },
    description: {
      en: "Practice difficult conversations. Empathy grows; the focus takes energy.",
      zh: "练习那些并不轻松的沟通。同理心会增长，专注也会消耗精力。",
    },
    cost: 3,
    effects: { empathy: 3, confidence: 1, reputation: 1, stress: 2, mood: -1 },
    tags: ["clinic", "social"],
    unlock: { minSemester: 4 },
  },
  {
    id: "sleep",
    title: { en: "Sleep / Recovery", zh: "睡觉 / 恢复" },
    description: {
      en: "Real rest. Stamina and mood up, stress way down.",
      zh: "好好休息。体力、心情上升，压力大降。",
    },
    flavor: {
      en: "You choose rest. Suspiciously mature, surprisingly effective.",
      zh: "你选择了休息。可疑地成熟，意外地有效。",
    },
    cost: 2,
    effects: { stamina: 12, mood: 5, stress: -10 },
    tags: ["rest"],
  },
  {
    id: "small_break",
    title: { en: "Small Break", zh: "小憩一下" },
    description: {
      en: "A quick breather. Mood up, stress down, cheap.",
      zh: "短暂喘口气。心情上升，压力下降，便宜。",
    },
    cost: 1,
    effects: { mood: 5, stress: -4 },
    tags: ["rest"],
  },
  {
    id: "relationship_time",
    title: { en: "Call / Relationship Time", zh: "通话 / 陪伴时间" },
    description: {
      en: "Time with {partner}. Support and mood up, stress down.",
      zh: "和 {partner} 待一会儿。情感支持和心情上升，压力下降。",
    },
    flavor: {
      en: "Nothing is solved, but somehow everything feels less impossible.",
      zh: "什么都没解决，但一切忽然没那么难了。",
    },
    cost: 1,
    effects: { love: 6, mood: 6, stress: -3 },
    tags: ["support", "relationship"],
  },
  {
    id: "community",
    title: { en: "Community / Outreach", zh: "社区 / 公益" },
    description: {
      en: "Serve the community. Public impact, empathy and reputation up.",
      zh: "服务社区。社区影响、同理心和口碑提升。",
    },
    flavor: {
      en: "The day is exhausting, but you remember why this work matters.",
      zh: "一天下来很累，但你想起来自己为什么在做这件事。",
    },
    cost: 2,
    effects: { publicImpact: 6, empathy: 4, reputation: 2, stamina: -4 },
    tags: ["clinic", "community", "heavy"],
    unlock: { minSemester: 7 },
  },
  {
    id: "research",
    title: { en: "Research / CV Building", zh: "科研 / 履历建设" },
    description: {
      en: "Build the academic side. Research and reputation up, some stress.",
      zh: "建设学术那一面。科研和口碑提升，略有压力。",
    },
    cost: 3,
    effects: { research: 4, knowledge: 1, reputation: 2, stress: 4, mood: -2 },
    tags: ["study", "heavy"],
  },
  {
    id: "work",
    title: { en: "Work / Budget Control", zh: "打工 / 控制预算" },
    description: {
      en: "Earn a bit. Money up, costs some stamina and a little stress.",
      zh: "赚一点钱。预算增加，消耗体力，略增压力。",
    },
    cost: 1,
    effects: { money: 10, stamina: -3, stress: 2 },
    tags: ["work"],
  },
  {
    id: "eat_good",
    title: { en: "Eat Something Good", zh: "吃顿好的" },
    description: {
      en: "Treat yourself. Big mood boost — costs $8.",
      zh: "对自己好一点。心情大涨——花 $8。",
    },
    flavor: {
      en: "A good meal fixes more than it should.",
      zh: "一顿好饭能修好的东西，比它应该能修的多。",
    },
    cost: 1,
    moneyCost: 8,
    effects: { mood: 9, stamina: 3, stress: -3, money: -8 },
    tags: ["rest"],
  },
  {
    id: "ask_help",
    title: { en: "Ask for Help", zh: "寻求帮助" },
    description: {
      en: "Get help on one untrained core skill this week, plus a little reputation.",
      zh: "请人补一项本周尚未练过的核心能力，口碑也会略有提升。",
    },
    flavor: {
      en: "Asking turns out to be a skill too.",
      zh: "开口求助，原来也是一种能力。",
    },
    cost: 2,
    effects: { reputation: 1, mood: 2 },
    tags: ["social"],
    dynamicWeakest: true,
  },
];
