import type { Ending } from "../game/types";

// Endings are not simply good/bad — they reflect the build the player grew.
// The engine picks the highest-priority ending whose condition matches.
export const ENDINGS: Ending[] = [
  {
    id: "high_achiever_burnout",
    priority: 90,
    title: { en: "Successful, But Tired", zh: "很成功，但很累" },
    subtitle: { en: "A warning, not a failure", zh: "一个提醒，不是失败" },
    condition: {
      minStats: { knowledge: 85, stress: 85 },
      maxStats: { mood: 35 },
    },
    text: {
      en: "You achieved a lot, but the cost was too high. The game does not call this failure; it calls it a warning. You deserve a life that has room for you too.",
      zh: "你成就了很多，但代价太大了。这个游戏不把它叫做失败，它把它叫做提醒。你值得拥有一种也给你自己留出空间的人生。",
    },
  },
  {
    id: "balanced_dentist",
    priority: 80,
    title: { en: "A Good Dentist, A Whole Person", zh: "一个好牙医，一个完整的人" },
    subtitle: { en: "Balanced, real, and trusted", zh: "平衡、真实、被信任" },
    condition: {
      minStats: {
        knowledge: 60,
        handSkill: 60,
        clinicalSense: 60,
        empathy: 60,
        mood: 50,
      },
      maxStats: { stress: 80 },
    },
    text: {
      en: "You did not max every stat. You did something harder: you learned, cared, adapted, rested, failed, recovered, and kept going. Patients trust you not because you are perfect, but because you are careful, warm, and real.",
      zh: "你没有把每一项都拉满。你做了更难的事:你学习、在意、调整、休息、失败、恢复，然后继续走下去。患者信任你，不是因为你完美，而是因为你认真、温暖、真实。",
    },
  },
  {
    id: "academic_research",
    priority: 72,
    title: { en: "The Curious Dentist", zh: "好奇的牙医" },
    subtitle: { en: "Always a better question", zh: "永远有更好的问题" },
    condition: {
      minStats: { research: 75, knowledge: 75, reputation: 55 },
    },
    text: {
      en: "You keep asking better questions. Clinic taught you what matters; research taught you how to chase the answer.",
      zh: "你一直在问更好的问题。临床教会你什么重要;科研教会你如何去追那个答案。",
    },
  },
  {
    id: "community_care",
    priority: 71,
    title: { en: "Community Care", zh: "社区里的照护" },
    subtitle: { en: "Showing up where care is needed", zh: "在最需要照护的地方现身" },
    condition: {
      minStats: { publicImpact: 75, empathy: 65, clinicalSense: 55 },
    },
    text: {
      en: "You learned that dentistry is not only about teeth. It is also about access, trust, systems, and showing up where care is needed.",
      zh: "你明白了牙科不只关乎牙齿。它也关乎可及性、信任、系统，以及在最需要照护的地方出现。",
    },
  },
  {
    id: "patient_centered",
    priority: 70,
    title: { en: "Patient Whisperer", zh: "患者的定心丸" },
    subtitle: { en: "Care they remember", zh: "被记住的照护" },
    condition: {
      minStats: { empathy: 80, clinicalSense: 65, reputation: 60 },
    },
    text: {
      en: "Your patients remember the way you explained things, the way you paused when they were nervous, and the way you made treatment feel less scary.",
      zh: "你的患者记得你解释事情的方式，记得他们紧张时你停下来的那一刻，也记得你让治疗变得没那么可怕的样子。",
    },
  },
  {
    id: "steady_hands",
    priority: 69,
    title: { en: "Steady Hands", zh: "稳稳的手" },
    subtitle: { en: "Precise, calm, quietly impressive", zh: "精准、从容、低调地厉害" },
    condition: {
      minStats: { handSkill: 85, confidence: 60 },
    },
    text: {
      en: "The tiny details that once haunted you became your strength. Your work is precise, calm, and quietly impressive.",
      zh: "那些曾经折磨你的小细节，如今成了你的强项。你的作品精准、从容，低调得让人佩服。",
    },
  },
  {
    id: "loved_and_grounded",
    priority: 60,
    title: { en: "Loved and Grounded", zh: "被爱着，也站得稳" },
    subtitle: { en: "You let yourself be supported", zh: "你允许自己被支持" },
    condition: {
      minStats: { love: 75, mood: 60, careerReadiness: 55 },
    },
    text: {
      en: "You became stronger not because someone saved you, but because you allowed yourself to be supported. Some weeks were hard. You did not have to carry them alone.",
      zh: "你变得更强，不是因为有人拯救了你，而是因为你允许自己被支持。有些周确实很难，但那些周，你不必一个人扛。",
    },
  },
  {
    id: "graduation_default",
    priority: 0,
    title: { en: "Graduation Day", zh: "毕业那天" },
    subtitle: { en: "Someone who can keep growing", zh: "一个能继续成长的人" },
    condition: {},
    text: {
      en: "The path was messy, funny, exhausting, and meaningful. You made it through dental school and became someone who can keep growing.",
      zh: "这条路又乱、又好笑、又累人，也很有意义。你读完了牙学院，成为了一个能继续成长的人。",
    },
  },
];
