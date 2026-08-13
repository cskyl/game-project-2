import type { EventCondition, LocalizedText, StatBlock } from "../game/types";

export type BreakAction = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  /** Every break lasts three turns; an action is a repeatable turn payload. */
  effects: StatBlock;
  tags: string[];
  addFlags?: string[];
  clearsSleepDebt?: boolean;
};

export type BreakTrack = {
  id: string;
  name: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  payoff: LocalizedText;
  cost: LocalizedText;
  /** Semesters whose close opens this three-turn chapter. */
  availableAfterSemesters: number[];
  duration: 3;
  eligibility?: EventCondition;
  requirements?: EventCondition;
  actions: [BreakAction, BreakAction, BreakAction];
  clearsSleepDebtOnCompletion?: boolean;
};

const action = (
  id: string,
  title: LocalizedText,
  description: LocalizedText,
  effects: StatBlock,
  tags: string[],
  addFlags?: string[],
): BreakAction => ({ id, title, description, effects, tags, addFlags });

/** The five break chapters from §3.3. Each has three distinct turn payloads. */
export const BREAK_TRACKS: BreakTrack[] = [
  {
    id: "summer_research",
    name: { en: "Summer Research", zh: "暑期科研" },
    title: { en: "Summer Research", zh: "暑期科研" },
    description: {
      en: "Spend the break in Dr. Reyes's lab, where the coffee is communal and the question is finally yours.",
      zh: "把假期交给 Reyes 博士的实验室：咖啡是大家的，问题终于是你的。",
    },
    payoff: { en: "Large research progress and a warmer lab connection.", zh: "大量科研进展，也和实验室建立更深的联系。" },
    cost: { en: "No income; mild stress.", zh: "没有收入；压力小幅上升。" },
    availableAfterSemesters: [2, 5, 8],
    duration: 3,
    eligibility: { minSemester: 2 },
    requirements: { minSemester: 2 },
    actions: [
      action("summer_research_protocol", { en: "Tighten the protocol", zh: "打磨研究方案" }, { en: "Turn a promising question into a study the team can actually run.", zh: "把一个有潜力的问题，变成团队真正能执行的研究。" }, { research: 6, knowledge: 2, stress: 2 }, ["research", "planning"]),
      action("summer_research_bench", { en: "Work the bench", zh: "守在实验台前" }, { en: "The unglamorous middle: samples, notes, and one more careful run.", zh: "不光鲜的中段：样本、记录，以及又一次仔细的实验。" }, { research: 8, knowledge: 1, stamina: -3, stress: 3 }, ["research", "lab"]),
      action("summer_research_mentor", { en: "Meet with Reyes", zh: "和 Reyes 博士聊聊" }, { en: "Ask the question before it becomes a problem. Reyes notices.", zh: "在问题变大前先问出来。Reyes 博士注意到了。" }, { research: 4, reputation: 2, confidence: 2, love: 1, stress: -1 }, ["research", "relationship"]),
    ],
  },
  {
    id: "externship",
    name: { en: "Community Externship", zh: "社区外派轮转" },
    title: { en: "Community Externship", zh: "社区外派轮转" },
    description: {
      en: "A few weeks away at a community clinic: fewer familiar tools, more reasons to listen closely.",
      zh: "去社区诊所待几周：熟悉的工具少一些，认真倾听的理由多一些。",
    },
    payoff: { en: "Clinical sense, public impact, and a richer clinic story to carry forward.", zh: "临床判断、公共影响力，以及可以带回学校的、更有分量的临床经历。" },
    cost: { en: "Stamina and travel money.", zh: "消耗体力和交通费用。" },
    availableAfterSemesters: [2, 5, 8],
    duration: 3,
    eligibility: { minSemester: 2 },
    requirements: { minSemester: 2 },
    actions: [
      action("externship_triage", { en: "Run the triage desk", zh: "做分诊" }, { en: "Find the safest next step when the waiting room is full.", zh: "候诊室坐满时，找出最安全的下一步。" }, { clinicalSense: 5, publicImpact: 4, stamina: -4, money: -3 }, ["clinic", "community"]),
      action("externship_chairside", { en: "Take a community chair", zh: "坐到社区诊疗椅旁" }, { en: "Good care is careful care, even when the schedule is not kind.", zh: "好的照护就是细致的照护，即使日程并不宽容。" }, { clinicalSense: 6, empathy: 3, publicImpact: 5, stamina: -5, money: -2 }, ["clinic", "community"]),
      action("externship_followup", { en: "Plan the follow-up", zh: "安排后续照护" }, { en: "A plan only counts if the patient can realistically return to it.", zh: "只有患者现实中能回来执行的计划，才算真正的计划。" }, { publicImpact: 7, empathy: 3, reputation: 2, stamina: -2, money: -2 }, ["clinic", "community", "access"]),
    ],
  },
  {
    id: "work_and_save",
    name: { en: "Work and Save", zh: "打工攒钱" },
    title: { en: "Work and Save", zh: "打工攒钱" },
    description: {
      en: "Pick up shifts as a dental assistant or barista. The future is expensive; so is the present.",
      zh: "去做牙科助理或咖啡师的班。未来很贵；现在也一样。",
    },
    payoff: { en: "Meaningful money and a little practical hand skill.", zh: "一笔有用的钱，以及一点实用的手部技能。" },
    cost: { en: "Knowledge drift and a mood risk.", zh: "知识会漂移，心情也有风险。" },
    availableAfterSemesters: [2, 5, 8],
    duration: 3,
    eligibility: { minSemester: 2 },
    requirements: { minSemester: 2 },
    actions: [
      action("work_assist_shift", { en: "Assist a full shift", zh: "做一整班牙科助理" }, { en: "Retractors, setups, sterilization: invisible work that keeps the room kind.", zh: "牵开器、备台、消毒：让诊室保持从容的隐形工作。" }, { money: 14, handSkill: 1, stamina: -5, mood: -1, knowledge: -2 }, ["work", "clinic"]),
      action("work_barista_shift", { en: "Take the café shift", zh: "去咖啡店上班" }, { en: "You learn the regulars' orders and give your wrists a different rhythm.", zh: "你记住了熟客的点单，也让手腕换一种节奏。" }, { money: 12, mood: -2, stamina: -4, stress: 2, knowledge: -2 }, ["work"]),
      action("work_budget_night", { en: "Budget the month", zh: "规划一个月的预算" }, { en: "Money feels less like a fog when you give every dollar a job.", zh: "当每一块钱都有去处，钱就不再像一团雾。" }, { money: 6, confidence: 2, stress: -2, mood: 1, knowledge: -2 }, ["work", "planning"]),
    ],
  },
  {
    id: "rest_and_reset",
    name: { en: "Rest and Reset", zh: "休息与重启" },
    title: { en: "Rest and Reset", zh: "休息与重启" },
    description: {
      en: "Take the break seriously. Recovery is not a reward for finishing the work; it is part of doing it.",
      zh: "认真对待这个假期。恢复不是完成工作后的奖励，而是完成工作的组成部分。",
    },
    payoff: { en: "Mood, stamina, love, and a clean stress slate.", zh: "心情、体力、爱，以及一张清爽的压力账单。" },
    cost: { en: "You give up the other break-track payoffs.", zh: "你会放弃其他假期路线的收益。" },
    availableAfterSemesters: [2, 5, 8],
    duration: 3,
    clearsSleepDebtOnCompletion: true,
    eligibility: { minSemester: 2 },
    requirements: { minSemester: 2 },
    actions: [
      action("rest_sleep_in", { en: "Sleep without an alarm", zh: "不设闹钟地睡一觉" }, { en: "Your body files a very persuasive request for eight hours.", zh: "你的身体递来一份很有说服力的八小时申请。" }, { stamina: 12, mood: 5, stress: -8 }, ["rest", "recovery"]),
      action("rest_be_with_partner", { en: "Be with {partner}", zh: "陪陪 {partner}" }, { en: "No productivity agenda. Just the person who knows your face without the loupes.", zh: "没有效率议程。只是那个不戴放大镜也认得你表情的人。" }, { love: 8, mood: 7, stress: -5 }, ["rest", "relationship"]),
      action("rest_walk_and_reset", { en: "Walk and reset", zh: "散步，重新呼吸" }, { en: "A slow route, a warm drink, and a nervous system allowed to unclench.", zh: "慢慢走一段路，喝一杯热饮，让神经系统松开一点。" }, { stamina: 8, mood: 6, stress: -10, focus: 5 }, ["rest", "recovery"]),
    ],
  },
  {
    id: "board_prep_camp",
    name: { en: "Board Prep Camp", zh: "执照考试集训" },
    title: { en: "Board Prep Camp", zh: "执照考试集训" },
    description: {
      en: "A focused INBDE study camp before the final clinical year. Serious work, with scheduled breathing room.",
      zh: "进入最后临床年之前，专注准备 INBDE。认真学习，也认真安排喘息。",
    },
    payoff: { en: "Knowledge and an INBDE-ready flag.", zh: "知识提升，并获得 INBDE 准备就绪标记。" },
    cost: { en: "Money and mood.", zh: "花钱，也会消耗心情。" },
    availableAfterSemesters: [8],
    duration: 3,
    eligibility: { minSemester: 8, maxSemester: 8 },
    requirements: { minSemester: 8, maxSemester: 8 },
    actions: [
      action("board_prep_question_bank", { en: "Work the question bank", zh: "刷题库" }, { en: "Patterns become less frightening when you meet them one careful question at a time.", zh: "一次认真做一道题，规律就没那么吓人了。" }, { knowledge: 7, focus: 3, mood: -3, money: -2 }, ["study", "boards"], ["inbde_ready"]),
      action("board_prep_review_group", { en: "Review with a group", zh: "小组复习" }, { en: "You explain the one you know and borrow courage on the one you do not.", zh: "你讲清自己会的，也从别人那里借一点面对不会的勇气。" }, { knowledge: 5, confidence: 3, empathy: 1, mood: 1, money: -1 }, ["study", "social", "boards"], ["inbde_ready"]),
      action("board_prep_recovery", { en: "Schedule a recovery block", zh: "安排恢复时间" }, { en: "The point is not to outlast your brain. The point is to bring it with you.", zh: "目标不是熬过大脑；目标是让大脑和你一起走到终点。" }, { knowledge: 3, stamina: 6, focus: 5, stress: -6, mood: 2, money: -1 }, ["study", "rest", "boards"], ["inbde_ready"]),
    ],
  },
];

export const BREAK_TRACKS_BY_ID: Record<string, BreakTrack> = Object.fromEntries(
  BREAK_TRACKS.map((track) => [track.id, track]),
);
