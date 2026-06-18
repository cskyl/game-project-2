import { createContext, useContext } from "react";
import type {
  ConditionStatKey,
  Lang,
  LocalizedText,
  StatKey,
} from "../game/types";
import { personalization } from "../data/personalization";

export type { Lang } from "../game/types";

/** Resolve a localized string. */
export function tr(text: LocalizedText | undefined, lang: Lang): string {
  if (!text) return "";
  return text[lang] ?? text.en ?? "";
}

/** Replace the {partner} token with the configured partner name. */
export function withPartner(text: string): string {
  return text.split("{partner}").join(personalization.partnerName);
}

// ---------------------------------------------------------------------------
// Stat labels + one-line meanings (used for bars and tooltips).
// ---------------------------------------------------------------------------

export const STAT_LABELS: Record<ConditionStatKey, LocalizedText> = {
  knowledge: { en: "Knowledge", zh: "知识" },
  handSkill: { en: "Hand Skill", zh: "手上功夫" },
  clinicalSense: { en: "Clinical Sense", zh: "临床思维" },
  empathy: { en: "Empathy", zh: "同理心" },
  stamina: { en: "Stamina", zh: "体力" },
  confidence: { en: "Confidence", zh: "自信" },
  reputation: { en: "Reputation", zh: "口碑" },
  mood: { en: "Mood", zh: "心情" },
  stress: { en: "Stress", zh: "压力" },
  love: { en: "Support", zh: "情感支持" },
  research: { en: "Research", zh: "科研" },
  publicImpact: { en: "Community", zh: "社区影响" },
  money: { en: "Budget", zh: "钱包" },
  wellness: { en: "Wellness", zh: "身心状态" },
  careerReadiness: { en: "Career Readiness", zh: "职业准备度" },
  lifeBalance: { en: "Life Balance", zh: "生活平衡" },
};

export const STAT_HINTS: Partial<Record<ConditionStatKey, LocalizedText>> = {
  knowledge: { en: "Science & dental knowledge.", zh: "基础与牙科知识。" },
  handSkill: { en: "Manual dexterity & lab skill.", zh: "动手能力与实验技巧。" },
  clinicalSense: { en: "Clinical decision-making.", zh: "临床判断力。" },
  empathy: { en: "Patient communication.", zh: "与患者的沟通。" },
  stamina: { en: "Long-term energy reserve.", zh: "长期精力储备。" },
  confidence: { en: "Calm under pressure.", zh: "压力下的从容。" },
  reputation: { en: "How others perceive you.", zh: "别人对你的印象。" },
  mood: { en: "Happiness & wellbeing.", zh: "幸福感与状态。" },
  stress: { en: "Pressure. Medium is fine; too high hurts.", zh: "压力。适中有益，过高有害。" },
  love: { en: "Relationship & support.", zh: "感情与支持。" },
  research: { en: "Academic & research interest.", zh: "学术与科研兴趣。" },
  publicImpact: { en: "Community & access to care.", zh: "社区服务与公益。" },
  money: { en: "Life budget.", zh: "生活预算。" },
};

export const CAREER_STATS: StatKey[] = [
  "knowledge",
  "handSkill",
  "clinicalSense",
  "empathy",
  "confidence",
];
export const LIFE_STATS: StatKey[] = ["mood", "stress", "stamina", "money"];
export const LONGTERM_STATS: StatKey[] = [
  "reputation",
  "love",
  "research",
  "publicImpact",
];

// ---------------------------------------------------------------------------
// UI chrome strings.
// ---------------------------------------------------------------------------

const en = {
  appTitle: "Dental School Life Sim",
  langButton: "中文",
  // Start screen
  tagline: "Balance study, clinic, sleep, mood, and the tiny chaos of dental school.",
  startDescription:
    "A cozy, replayable dental school life sim. Four years, eleven semesters, dozens of tiny decisions, and many possible endings.",
  newGame: "Start New Game",
  continueGame: "Continue",
  difficulty: "Difficulty",
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
  easyDesc: "7 action points, gentler setbacks.",
  normalDesc: "6 action points, balanced.",
  hardDesc: "5 action points, study-only burns out.",
  nameLabel: "Your name",
  namePlaceholder: "Player",
  savedGameFound: "Saved game found",
  // Header
  semester: "Semester",
  week: "Week",
  weekOf: "Week {n} of 4",
  menu: "Menu",
  save: "Save",
  saved: "Saved!",
  restart: "Restart",
  clearSave: "Clear Save",
  close: "Close",
  // Stats panel
  career: "Career",
  life: "Life",
  longTerm: "Long-term",
  derived: "Overall",
  // Planning
  weeklyPlanning: "Weekly Planning",
  apRemaining: "Action points",
  ap: "AP",
  finishWeek: "Finish Week",
  lockedSemester: "Unlocks in Semester {n}",
  locked: "Locked",
  notEnoughAp: "Not enough AP",
  needMoney: "Need ${n}",
  lifeCards: "Life Cards",
  cardsHint: "Draw 3 each week, play up to 2. They cost no action points.",
  playCard: "Play",
  cardPlayed: "Played",
  cardsPlayedOut: "No card plays left this week.",
  spend: "Spend",
  gain: "Gain",
  // Event
  randomEvent: "This Week",
  chooseResponse: "What do you do?",
  continueButton: "Continue",
  needsRequirement: "Requires",
  // Weekly summary
  weeklySummary: "Weekly Summary",
  changesThisWeek: "Changes this week",
  noChanges: "A quiet week. Nothing moved much.",
  warnings: "Heads up",
  semesterProgress: "Semester progress",
  // Boss
  semesterCheck: "Semester Check",
  whatItChecks: "What it checks",
  yourReadiness: "Your readiness",
  beginCheck: "Begin the Check",
  outcomeGreat: "Great",
  outcomePass: "Pass",
  outcomeBarely: "Barely Passed",
  outcomeStruggle: "Struggled",
  toNextSemester: "Continue",
  toEnding: "See How It All Turned Out",
  // Ending
  endingTitle: "Ending",
  finalStats: "Final stats",
  playAgain: "Play Again",
  exportSummary: "Copy Summary",
  copied: "Copied!",
  achievementsUnlocked: "Achievements unlocked",
  strongestStats: "Strongest stats",
  hardestSemester: "Hardest semester",
  // Log
  recentLog: "Recent Log",
  emptyLog: "Your week starts here.",
  // Confirm dialogs
  cancel: "Cancel",
  confirm: "Confirm",
  restartTitle: "Restart the game?",
  restartBody: "This ends the current run and returns to the start screen. Your save will be cleared.",
  clearTitle: "Clear your save?",
  clearBody: "This permanently deletes your saved game. This cannot be undone.",
  // Misc
  unlocked: "Unlocked",
  partnerLabel: "Partner",
  noActions: "No actions available right now.",
};

const zh: typeof en = {
  appTitle: "牙学院生活模拟器",
  langButton: "EN",
  tagline: "在学习、临床、睡眠、心情和牙学院的种种小混乱之间找平衡。",
  startDescription:
    "一个温暖、可反复游玩的牙学院生活模拟器。四年、十一个学期、几十个小选择，以及很多种不同的结局。",
  newGame: "开始新游戏",
  continueGame: "继续游戏",
  difficulty: "难度",
  easy: "简单",
  normal: "普通",
  hard: "困难",
  easyDesc: "7 点行动力，挫折更温柔。",
  normalDesc: "6 点行动力，平衡体验。",
  hardDesc: "5 点行动力，只会学习容易 burnout。",
  nameLabel: "你的名字",
  namePlaceholder: "玩家",
  savedGameFound: "发现存档",
  semester: "学期",
  week: "第几周",
  weekOf: "第 {n} 周 / 共 4 周",
  menu: "菜单",
  save: "保存",
  saved: "已保存！",
  restart: "重新开始",
  clearSave: "清除存档",
  close: "关闭",
  career: "职业能力",
  life: "生活状态",
  longTerm: "长期发展",
  derived: "综合",
  weeklyPlanning: "每周计划",
  apRemaining: "行动力",
  ap: "AP",
  finishWeek: "结束本周",
  lockedSemester: "第 {n} 学期解锁",
  locked: "未解锁",
  notEnoughAp: "行动力不足",
  needMoney: "需要 ${n}",
  lifeCards: "生活卡",
  cardsHint: "每周抽 3 张，最多打出 2 张。不消耗行动力。",
  playCard: "打出",
  cardPlayed: "已打出",
  cardsPlayedOut: "本周的出牌次数用完了。",
  spend: "花费",
  gain: "获得",
  randomEvent: "本周遭遇",
  chooseResponse: "你会怎么做？",
  continueButton: "继续",
  needsRequirement: "需要",
  weeklySummary: "本周小结",
  changesThisWeek: "本周变化",
  noChanges: "平静的一周，没什么大起伏。",
  warnings: "提个醒",
  semesterProgress: "学期进度",
  semesterCheck: "学期考核",
  whatItChecks: "考核内容",
  yourReadiness: "你的准备度",
  beginCheck: "开始考核",
  outcomeGreat: "优秀",
  outcomePass: "通过",
  outcomeBarely: "险过",
  outcomeStruggle: "吃力",
  toNextSemester: "继续",
  toEnding: "看看最后怎么样了",
  endingTitle: "结局",
  finalStats: "最终数值",
  playAgain: "再玩一次",
  exportSummary: "复制总结",
  copied: "已复制！",
  achievementsUnlocked: "解锁成就",
  strongestStats: "最强项",
  hardestSemester: "最难的学期",
  recentLog: "近期日志",
  emptyLog: "你的一周从这里开始。",
  cancel: "取消",
  confirm: "确认",
  restartTitle: "重新开始游戏？",
  restartBody: "这会结束当前存档并回到开始界面，存档会被清除。",
  clearTitle: "清除存档？",
  clearBody: "这会永久删除你的存档，无法撤销。",
  unlocked: "已解锁",
  partnerLabel: "另一半",
  noActions: "现在没有可用的行动。",
};

export const UI: Record<Lang, typeof en> = { en, zh };

export type UIStrings = typeof en;

/** Fill a {n}/{name} style placeholder. */
export function fmt(template: string, values: Record<string, string | number>): string {
  let out = template;
  for (const [k, v] of Object.entries(values)) {
    out = out.split(`{${k}}`).join(String(v));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Language context.
// ---------------------------------------------------------------------------

export type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Resolve a localized text and apply the {partner} token. */
  t: (text?: LocalizedText) => string;
  ui: UIStrings;
};

export const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => undefined,
  t: (text) => withPartner(tr(text, "en")),
  ui: en,
});

export const useLang = () => useContext(LangContext);
