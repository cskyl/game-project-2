import type { GameEvent } from "../game/types";

// Canonical, hand-tuned events from the design spec. They sit alongside the
// generated events in events.ts. The burnout warning has a very high weight and
// a tight condition, so it reliably surfaces when the player is in trouble.
export const SEED_EVENTS: GameEvent[] = [
  {
    id: "early_first_week_overload",
    title: { en: "First Week Overload", zh: "开学第一周超载" },
    stage: ["early"],
    tags: ["study", "stress"],
    maxSemester: 2,
    weight: 10,
    text: {
      en: "The first week feels like ten different classes opened at once. Everyone looks calm, which somehow makes it worse.",
      zh: "第一周就像十门课同时打开。每个人看上去都很淡定，这反而让你更慌。",
    },
    choices: [
      {
        id: "organize_notes",
        text: { en: "Organize notes and make a realistic plan.", zh: "整理笔记，做一个现实的计划。" },
        resultText: {
          en: "The workload is still huge, but it now has shape.",
          zh: "工作量还是很大，但现在它有了形状。",
        },
        effects: { knowledge: 4, confidence: 3, stress: -3 },
      },
      {
        id: "study_everything",
        text: { en: "Try to study everything tonight.", zh: "今晚想把所有东西都学完。" },
        resultText: {
          en: "You covered a lot, but your brain feels like a browser with 80 tabs open.",
          zh: "你学了很多，但脑子像开了 80 个标签页的浏览器。",
        },
        effects: { knowledge: 8, stress: 8, mood: -4, stamina: -5 },
      },
      {
        id: "ask_classmate",
        text: { en: "Ask a classmate how they are planning the week.", zh: "问问同学这周打算怎么安排。" },
        resultText: {
          en: "Turns out everyone is confused. That is weirdly comforting.",
          zh: "结果发现大家都一头雾水。这居然有点让人安心。",
        },
        effects: { reputation: 2, mood: 4, confidence: 2 },
      },
    ],
  },
  {
    id: "lab_half_mm_problem",
    title: { en: "The 0.5 mm Problem", zh: "0.5 毫米的问题" },
    stage: ["preclinical", "transition"],
    tags: ["lab", "handSkill"],
    minSemester: 2,
    maxSemester: 6,
    weight: 10,
    text: {
      en: "Your prep is almost right, except one tiny detail is off. Somehow that tiny detail is now your entire personality.",
      zh: "你的预备几乎完美，除了一个极小的细节没对上。不知怎的，那个小细节现在成了你的全部人格。",
    },
    choices: [
      {
        id: "keep_practicing",
        text: { en: "Stay and practice one more round.", zh: "留下来再练一轮。" },
        resultText: {
          en: "It is tiring, but your hands understand a little more than before.",
          zh: "挺累的，但你的手比之前更懂了一点。",
        },
        effects: { handSkill: 7, stress: 5, stamina: -6 },
      },
      {
        id: "ask_demo",
        text: { en: "Ask someone to show their technique.", zh: "请人示范一下他们的手法。" },
        resultText: {
          en: "One small angle change makes everything more reasonable.",
          zh: "一个小小的角度变化，让一切忽然合理了。",
        },
        effects: { handSkill: 4, reputation: 2, confidence: 2 },
      },
      {
        id: "take_break",
        text: { en: "Take a break before you destroy your mood.", zh: "在心情被毁掉之前先休息一下。" },
        resultText: {
          en: "The tooth can wait. Your nervous system cannot.",
          zh: "牙可以等。你的神经系统不能。",
        },
        effects: { mood: 7, stress: -6, stamina: 3 },
      },
      {
        id: "text_partner",
        text: { en: "Text {partner}: 'I am fighting a tiny tooth and losing.'", zh: "给 {partner} 发消息：「我在和一颗小牙战斗，而且快输了。」" },
        resultText: {
          en: "They send encouragement that is 60% useful and 40% ridiculous. It helps.",
          zh: "对方发来 60% 有用、40% 离谱的鼓励。但确实有用。",
        },
        effects: { love: 5, mood: 6, stress: -2 },
      },
    ],
  },
  {
    id: "clinic_nervous_patient",
    title: { en: "A Nervous Patient", zh: "一位紧张的患者" },
    stage: ["clinical", "advanced"],
    tags: ["clinic", "patient", "empathy"],
    minSemester: 7,
    weight: 10,
    text: {
      en: "Your patient says they are scared of dental treatment and keeps asking if it will hurt.",
      zh: "你的患者说他很怕看牙，一直在问会不会疼。",
    },
    choices: [
      {
        id: "explain_steps",
        text: { en: "Explain each step before starting.", zh: "开始前把每一步都解释清楚。" },
        resultText: {
          en: "The appointment takes longer, but the patient relaxes.",
          zh: "就诊时间变长了，但患者放松了下来。",
        },
        effects: { empathy: 7, reputation: 3, stress: 2 },
      },
      {
        id: "efficient_mode",
        text: { en: "Move efficiently and keep the appointment on schedule.", zh: "高效推进，按时完成就诊。" },
        resultText: {
          en: "You stay on time, but the patient still seems tense.",
          zh: "你没有拖时间，但患者看上去还是很紧绷。",
        },
        effects: { clinicalSense: 3, empathy: -2, stress: -1 },
      },
      {
        id: "pause_breathe",
        text: { en: "Pause, breathe, and reset your tone.", zh: "停一下，深呼吸，重新调整语气。" },
        resultText: {
          en: "You sound calmer, and that makes the whole room calmer.",
          zh: "你的声音平稳下来，整个诊室也跟着平静了。",
        },
        effects: { confidence: 5, empathy: 4, mood: 2 },
      },
    ],
  },
  {
    id: "support_late_night_call",
    title: { en: "Late Night Call", zh: "深夜的电话" },
    stage: ["any"],
    tags: ["relationship", "support"],
    weight: 7,
    condition: { maxStats: { mood: 55 } },
    text: {
      en: "You are tired and slightly dramatic tonight. A call comes in at exactly the right time.",
      zh: "今晚你又累又有点小戏精。一个电话在刚刚好的时间打了进来。",
    },
    choices: [
      {
        id: "answer_call",
        text: { en: "Answer and talk for a while.", zh: "接起来，聊一会儿。" },
        resultText: {
          en: "Nothing is solved, but somehow everything feels less impossible.",
          zh: "什么都没解决，但一切忽然没那么难了。",
        },
        effects: { love: 7, mood: 8, stress: -5, stamina: -1 },
      },
      {
        id: "voice_message",
        text: { en: "Send a short voice message and sleep.", zh: "发一条简短的语音，然后睡觉。" },
        resultText: {
          en: "You choose both connection and rest. Mature behavior, suspicious but effective.",
          zh: "你同时选择了联结和休息。成熟行为，可疑但有效。",
        },
        effects: { love: 4, mood: 4, stamina: 5, stress: -3 },
      },
      {
        id: "ignore_and_study",
        text: { en: "Ignore it and keep studying.", zh: "不接，继续学习。" },
        resultText: {
          en: "You get more done, but the night feels colder.",
          zh: "你多做了点事，但这个夜晚冷了一些。",
        },
        effects: { knowledge: 5, love: -2, mood: -3, stress: 3 },
      },
    ],
  },
  {
    id: "community_mobile_clinic_day",
    title: { en: "Community Clinic Day", zh: "社区诊所日" },
    stage: ["advanced"],
    tags: ["community", "clinic", "publicImpact"],
    minSemester: 10,
    weight: 10,
    text: {
      en: "Today you are working in a community setting. The schedule is busy, but the work feels meaningful.",
      zh: "今天你在社区环境里工作。日程很满，但这份工作让人觉得有意义。",
    },
    choices: [
      {
        id: "focus_access",
        text: { en: "Focus on making patients feel heard and respected.", zh: "把重点放在让患者感到被倾听、被尊重。" },
        resultText: {
          en: "The day is exhausting, but you remember why this work matters.",
          zh: "一天下来很累，但你想起来自己为什么在做这件事。",
        },
        effects: { publicImpact: 9, empathy: 6, stamina: -7, mood: 5 },
      },
      {
        id: "focus_efficiency",
        text: { en: "Focus on efficiency and keeping the schedule moving.", zh: "把重点放在效率，让日程顺畅推进。" },
        resultText: {
          en: "You help many patients and learn how different clinical settings operate.",
          zh: "你帮助了很多患者，也了解了不同临床环境是怎么运转的。",
        },
        effects: { clinicalSense: 6, publicImpact: 5, stress: 4 },
      },
      {
        id: "observe_system",
        text: { en: "Observe how the clinic manages resources and workflow.", zh: "观察诊所如何管理资源和工作流程。" },
        resultText: {
          en: "You start seeing dentistry not only as treatment, but as a system.",
          zh: "你开始把牙科看成不只是治疗，而是一整个系统。",
        },
        effects: { clinicalSense: 4, reputation: 3, publicImpact: 4, research: 2 },
      },
    ],
  },
  {
    id: "wellness_burnout_warning",
    title: { en: "Burnout Warning", zh: "倦怠预警" },
    stage: ["any"],
    tags: ["wellness", "crisis"],
    weight: 100,
    condition: { maxStats: { mood: 25 }, minStats: { stress: 85 } },
    text: {
      en: "You have been pushing too hard. Today, even simple tasks feel heavier than they should.",
      zh: "你一直逼得太紧了。今天，连最简单的事都比它本该有的分量更重。",
    },
    choices: [
      {
        id: "forced_recovery",
        text: { en: "Take a recovery day.", zh: "给自己放一天恢复假。" },
        resultText: {
          en: "You feel guilty for resting, then slowly remember that you are a person, not a productivity machine.",
          zh: "你因为休息而内疚，然后慢慢想起来:你是个人，不是生产力机器。",
        },
        effects: { mood: 12, stress: -15, stamina: 10, knowledge: -2 },
      },
      {
        id: "ask_for_help",
        text: { en: "Ask for help and make a smaller plan.", zh: "寻求帮助，做一个更小的计划。" },
        resultText: {
          en: "The work does not disappear, but it becomes survivable.",
          zh: "活儿没有消失，但它变得能扛过去了。",
        },
        effects: { mood: 8, stress: -10, reputation: 1, confidence: 3 },
      },
      {
        id: "push_through",
        text: { en: "Push through anyway.", zh: "还是硬扛过去。" },
        resultText: {
          en: "You get something done, but the cost is obvious.",
          zh: "你做完了一些事，但代价很明显。",
        },
        effects: { knowledge: 4, handSkill: 2, mood: -8, stress: 8, stamina: -8 },
      },
    ],
  },
];
