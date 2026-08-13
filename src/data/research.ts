import type {
  ConditionStatKey,
  EventCondition,
  LocalizedText,
  ProjectPhase,
  StatBlock,
} from "../game/types";

/** A research home the player can join after building a faculty relationship. */
export type LabTemplate = {
  id: string;
  name: LocalizedText;
  piNpcId: string;
  field: LocalizedText;
  description: LocalizedText;
  intensity: 1 | 2 | 3;
  prestige: number;
  requirements: EventCondition;
  perks: string[];
};

export type ProjectPayoff = {
  research: number;
  reputation: number;
  standing: number;
  money?: number;
};

export type ProjectTemplate = {
  id: string;
  labId: string;
  title: LocalizedText;
  description: LocalizedText;
  baseRisk: number;
  phaseWeeks: Record<ProjectPhase, number>;
  qualityDrivers: Array<{ stat: ConditionStatKey; weight: number }>;
  setbackEvents: string[];
  payoff: ProjectPayoff;
};

export type ResearchEventEffect = {
  progress?: number;
  quality?: number;
  researchPoints?: number;
  reputationInLab?: number;
  stats?: StatBlock;
  /** A visible pause in project progress; the weekly research tick owns it. */
  stallWeeks?: number;
  /** Reset the current phase to its beginning, used only for real rework. */
  repeatPhase?: boolean;
};

export type ResearchEventTemplate = {
  id: string;
  kind: "setback" | "lucky";
  title: LocalizedText;
  text: LocalizedText;
  phases: ProjectPhase[];
  effects: ResearchEventEffect;
};

const phaseWeeks = (
  overrides: Partial<Record<ProjectPhase, number>> = {},
): Record<ProjectPhase, number> => ({
  idea: 1,
  pilot: 2,
  irb: 2,
  collection: 4,
  analysis: 2,
  writing: 2,
  submitted: 3,
  revision: 2,
  accepted: 0,
  rejected: 0,
  abandoned: 0,
  ...overrides,
});

/**
 * Four research identities, all nested in Dr. Reyes's interdisciplinary
 * collaborative so the P5 NPC roster has one honest source of lab affinity.
 */
export const RESEARCH_LABS: LabTemplate[] = [
  {
    id: "reyes_biomaterials",
    name: { en: "Reyes Biomaterials Lab", zh: "Reyes 牙科生物材料实验室" },
    piNpcId: "reyes",
    field: { en: "Restorative biomaterials", zh: "修复生物材料" },
    description: {
      en: "Bonding, aging, and the small material decisions that decide whether a restoration lasts.",
      zh: "研究粘接、老化，以及那些最终决定修复体能用多久的细小材料选择。",
    },
    intensity: 2,
    prestige: 82,
    requirements: { minSemester: 2, minStats: { knowledge: 45 } },
    perks: ["lab_reyes_biomaterials"],
  },
  {
    id: "reyes_clinical_outcomes",
    name: { en: "Reyes Clinical Outcomes Group", zh: "Reyes 临床结局研究组" },
    piNpcId: "reyes",
    field: { en: "Patient-centered clinical outcomes", zh: "以患者为中心的临床结局" },
    description: {
      en: "Follow what happens after the appointment: healing, return visits, and whether a plan worked in real life.",
      zh: "把目光放在就诊之后：愈合、复诊，以及治疗计划在真实生活里究竟有没有奏效。",
    },
    intensity: 3,
    prestige: 88,
    requirements: { minSemester: 3, minStats: { knowledge: 45, clinicalSense: 42 } },
    perks: ["lab_reyes_clinical_outcomes"],
  },
  {
    id: "reyes_community_health",
    name: { en: "Reyes Community Oral Health Lab", zh: "Reyes 社区口腔健康实验室" },
    piNpcId: "reyes",
    field: { en: "Access and implementation science", zh: "医疗可及性与实施科学" },
    description: {
      en: "Maps, interviews, and clinic workflows aimed at making good care easier to reach and easier to keep.",
      zh: "用地图、访谈和诊所流程研究，让优质照护更容易抵达，也更容易持续。",
    },
    intensity: 1,
    prestige: 72,
    requirements: { minSemester: 2, minStats: { empathy: 43 } },
    perks: ["lab_reyes_community_health"],
  },
  {
    id: "reyes_digital_dentistry",
    name: { en: "Reyes Digital Dentistry Studio", zh: "Reyes 数字牙科研究室" },
    piNpcId: "reyes",
    field: { en: "Imaging and digital workflow", zh: "影像与数字化工作流程" },
    description: {
      en: "Scanners, landmark reliability, and a standing rule that a clean render is not the same thing as a true measurement.",
      zh: "研究扫描、标志点可靠性，并始终记得：画面干净，不等于测量真实。",
    },
    intensity: 2,
    prestige: 78,
    requirements: { minSemester: 3, minStats: { knowledge: 47, handSkill: 42 } },
    perks: ["lab_reyes_digital_dentistry"],
  },
];

/**
 * Every project travels through the same pipeline, so each needs at least one
 * compatible authored outcome in every active phase. Specific additions below
 * give projects their material, clinical, community, or imaging identity.
 */
const projectEvents = (...specific: string[]): string[] => [
  ...new Set([
    ...specific,
    "research_budget_shortfall",
    "research_mentor_margin_note",
    "research_irb_clarification",
    "research_clean_signal",
    "research_coauthor_schedule",
    "research_submission_file_error",
    "research_reviewer_sees_value",
  ]),
];

/** Ten startable projects spread across every lab in the frozen roster. */
export const RESEARCH_PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "bond_aging_cycles",
    labId: "reyes_biomaterials",
    title: { en: "Bond Strength After Artificial Aging", zh: "人工老化后的粘接强度" },
    description: {
      en: "Compare two adhesive workflows after thermocycling, including the failures that make the tidy average less tidy.",
      zh: "比较两种粘接流程经过冷热循环后的表现，也把那些让漂亮均值不再漂亮的失败样本认真算进去。",
    },
    baseRisk: 0.12,
    phaseWeeks: phaseWeeks({ pilot: 3, collection: 4 }),
    qualityDrivers: [
      { stat: "knowledge", weight: 0.35 },
      { stat: "handSkill", weight: 0.25 },
      { stat: "research", weight: 0.4 },
    ],
    setbackEvents: projectEvents(
      "research_specimen_contamination",
      "research_calibration_drift",
      "research_failed_replication",
      "research_clean_signal",
      "research_mentor_margin_note",
    ),
    payoff: { research: 9, reputation: 4, standing: 5 },
  },
  {
    id: "bioactive_liner_pilot",
    labId: "reyes_biomaterials",
    title: { en: "Bioactive Liner Feasibility Pilot", zh: "生物活性衬垫可行性预实验" },
    description: {
      en: "Build a modest pilot around handling, marginal adaptation, and which outcome can actually be measured well.",
      zh: "围绕操作手感、边缘适合性和真正能够可靠测量的结局，做一个克制而扎实的预实验。",
    },
    baseRisk: 0.1,
    phaseWeeks: phaseWeeks({ irb: 1, collection: 3 }),
    qualityDrivers: [
      { stat: "knowledge", weight: 0.3 },
      { stat: "focus", weight: 0.25 },
      { stat: "research", weight: 0.45 },
    ],
    setbackEvents: projectEvents(
      "research_budget_shortfall",
      "research_instrument_breakdown",
      "research_failed_replication",
      "research_clean_dataset",
      "research_shared_method",
    ),
    payoff: { research: 8, reputation: 4, standing: 4, money: 3 },
  },
  {
    id: "printed_denture_accuracy",
    labId: "reyes_biomaterials",
    title: { en: "Printed Denture Base Accuracy", zh: "3D 打印义齿基托精度" },
    description: {
      en: "Measure fit across print orientation and post-curing choices without pretending one glossy model represents every mouth.",
      zh: "比较不同打印方向和后固化方案的适合性，也不把一个光鲜模型当成所有口腔的代表。",
    },
    baseRisk: 0.14,
    phaseWeeks: phaseWeeks({ pilot: 3, analysis: 3 }),
    qualityDrivers: [
      { stat: "handSkill", weight: 0.3 },
      { stat: "focus", weight: 0.25 },
      { stat: "research", weight: 0.45 },
    ],
    setbackEvents: projectEvents(
      "research_scanner_export_corrupt",
      "research_specimen_mislabel",
      "research_analysis_bug",
      "research_clean_signal",
      "research_travel_award",
    ),
    payoff: { research: 10, reputation: 5, standing: 5 },
  },
  {
    id: "diabetes_perio_recall",
    labId: "reyes_clinical_outcomes",
    title: { en: "Diabetes and Periodontal Recall Outcomes", zh: "糖尿病患者的牙周复诊结局" },
    description: {
      en: "Study recall patterns and periodontal outcomes while treating medication, access, and follow-up as context—not blame.",
      zh: "研究复诊规律与牙周结局，把用药、可及性和后续照护视为背景，而不是责备患者的理由。",
    },
    baseRisk: 0.15,
    phaseWeeks: phaseWeeks({ irb: 3, collection: 5, analysis: 3 }),
    qualityDrivers: [
      { stat: "clinicalSense", weight: 0.3 },
      { stat: "empathy", weight: 0.25 },
      { stat: "research", weight: 0.45 },
    ],
    setbackEvents: projectEvents(
      "research_irb_clarification",
      "research_recruitment_slowdown",
      "research_missing_followup",
      "research_unexpected_confounder",
      "research_clean_dataset",
      "research_mentor_margin_note",
    ),
    payoff: { research: 12, reputation: 6, standing: 7 },
  },
  {
    id: "urgent_care_followup",
    labId: "reyes_clinical_outcomes",
    title: { en: "After the Urgent Dental Visit", zh: "急诊牙科就诊之后" },
    description: {
      en: "Trace whether urgent-care patients reached definitive treatment, and where the handoff quietly failed them.",
      zh: "追踪急诊患者是否最终获得了确定性治疗，也看看照护交接在哪些地方悄悄失灵。",
    },
    baseRisk: 0.16,
    phaseWeeks: phaseWeeks({ irb: 3, collection: 4 }),
    qualityDrivers: [
      { stat: "clinicalSense", weight: 0.3 },
      { stat: "publicImpact", weight: 0.25 },
      { stat: "research", weight: 0.45 },
    ],
    setbackEvents: projectEvents(
      "research_irb_clarification",
      "research_recruitment_slowdown",
      "research_missing_followup",
      "research_coauthor_schedule",
      "research_shared_method",
      "research_reviewer_sees_value",
    ),
    payoff: { research: 11, reputation: 6, standing: 6 },
  },
  {
    id: "crown_margin_rework",
    labId: "reyes_clinical_outcomes",
    title: { en: "Crown Margin Rework Audit", zh: "牙冠边缘返工审查" },
    description: {
      en: "Audit why crowns return for adjustment or remake, then separate operator learning from material and workflow effects.",
      zh: "审查牙冠为何需要调整或重做，再把操作者学习、材料和流程的影响认真区分开。",
    },
    baseRisk: 0.13,
    phaseWeeks: phaseWeeks({ collection: 3, analysis: 3 }),
    qualityDrivers: [
      { stat: "handSkill", weight: 0.25 },
      { stat: "clinicalSense", weight: 0.3 },
      { stat: "research", weight: 0.45 },
    ],
    setbackEvents: projectEvents(
      "research_missing_followup",
      "research_analysis_bug",
      "research_unexpected_confounder",
      "research_scooped_abstract",
      "research_submission_file_error",
      "research_clean_dataset",
    ),
    payoff: { research: 9, reputation: 5, standing: 6 },
  },
  {
    id: "sealant_access_map",
    labId: "reyes_community_health",
    title: { en: "School Sealant Access Map", zh: "学校窝沟封闭可及性地图" },
    description: {
      en: "Map where a school sealant program reaches families—and where travel, consent, or timing leaves a gap.",
      zh: "绘制学校窝沟封闭项目真正覆盖到哪些家庭，也看清交通、知情同意和时间安排留下了哪些空白。",
    },
    baseRisk: 0.09,
    phaseWeeks: phaseWeeks({ irb: 2, collection: 4 }),
    qualityDrivers: [
      { stat: "empathy", weight: 0.25 },
      { stat: "publicImpact", weight: 0.35 },
      { stat: "research", weight: 0.4 },
    ],
    setbackEvents: projectEvents(
      "research_irb_clarification",
      "research_recruitment_slowdown",
      "research_budget_shortfall",
      "research_partner_data_delay",
      "research_clean_dataset",
      "research_travel_award",
    ),
    payoff: { research: 8, reputation: 7, standing: 4, money: 4 },
  },
  {
    id: "missed_visit_transport",
    labId: "reyes_community_health",
    title: { en: "Transportation and Missed Visits", zh: "交通与失约就诊" },
    description: {
      en: "Pair scheduling data with patient interviews so a missed visit becomes a system question, not a character judgment.",
      zh: "把排班数据和患者访谈放在一起，让一次失约成为系统问题，而不是对个人品格的判断。",
    },
    baseRisk: 0.11,
    phaseWeeks: phaseWeeks({ irb: 3, collection: 5, writing: 3 }),
    qualityDrivers: [
      { stat: "empathy", weight: 0.3 },
      { stat: "publicImpact", weight: 0.3 },
      { stat: "research", weight: 0.4 },
    ],
    setbackEvents: projectEvents(
      "research_irb_clarification",
      "research_partner_data_delay",
      "research_coauthor_schedule",
      "research_scooped_abstract",
      "research_mentor_margin_note",
      "research_shared_method",
    ),
    payoff: { research: 10, reputation: 7, standing: 5 },
  },
  {
    id: "intraoral_scan_margin",
    labId: "reyes_digital_dentistry",
    title: { en: "Intraoral Scan Margin Reliability", zh: "口内扫描边缘识别可靠性" },
    description: {
      en: "Ask how consistently different readers mark a finish line when moisture, tissue, and scan artifacts enter the frame.",
      zh: "当湿度、软组织和扫描伪影进入画面时，不同观察者能否稳定识别终止线？这个项目就问这件事。",
    },
    baseRisk: 0.12,
    phaseWeeks: phaseWeeks({ pilot: 3, collection: 3, analysis: 3 }),
    qualityDrivers: [
      { stat: "handSkill", weight: 0.25 },
      { stat: "focus", weight: 0.25 },
      { stat: "research", weight: 0.5 },
    ],
    setbackEvents: projectEvents(
      "research_calibration_drift",
      "research_scanner_export_corrupt",
      "research_analysis_bug",
      "research_instrument_breakdown",
      "research_clean_signal",
      "research_reviewer_sees_value",
    ),
    payoff: { research: 10, reputation: 5, standing: 6 },
  },
  {
    id: "cbct_landmark_reliability",
    labId: "reyes_digital_dentistry",
    title: { en: "CBCT Landmark Reliability Study", zh: "CBCT 标志点可靠性研究" },
    description: {
      en: "Measure reader agreement on craniofacial landmarks and make the uncertainty visible instead of smoothing it away.",
      zh: "测量不同观察者对颅颌面标志点的一致性，把不确定性展示出来，而不是悄悄抹平。",
    },
    baseRisk: 0.14,
    phaseWeeks: phaseWeeks({ irb: 2, collection: 4, analysis: 4 }),
    qualityDrivers: [
      { stat: "knowledge", weight: 0.25 },
      { stat: "focus", weight: 0.25 },
      { stat: "research", weight: 0.5 },
    ],
    setbackEvents: projectEvents(
      "research_calibration_drift",
      "research_specimen_mislabel",
      "research_unexpected_confounder",
      "research_methods_revision",
      "research_major_revision",
      "research_reviewer_sees_value",
    ),
    payoff: { research: 12, reputation: 6, standing: 7 },
  },
];

/**
 * The frozen set of 24 authored weekly research events. Their ids are consumed
 * only by project templates, so an event cannot silently enter the generic
 * life-event pool or suppress a future patient case.
 */
export const RESEARCH_EVENTS: ResearchEventTemplate[] = [
  {
    id: "research_specimen_contamination",
    kind: "setback",
    title: { en: "The Control Looks Wrong", zh: "对照组不太对劲" },
    text: {
      en: "A faint film on the specimens turns out not to be a finding. You discard the batch, clean the bench, and write down exactly what happened.",
      zh: "样本上的薄膜最终并不是什么新发现。你丢弃这一批，清理台面，也把经过一字不漏地记下来。",
    },
    phases: ["pilot", "collection"],
    effects: { progress: -35, quality: -4, stats: { stress: 3, mood: -2 } },
  },
  {
    id: "research_calibration_drift",
    kind: "setback",
    title: { en: "Calibration Drift", zh: "校准漂移" },
    text: {
      en: "The instrument passes its startup check but not your repeat measurement. Catching it now costs a day and saves a month.",
      zh: "仪器通过了开机检查，却没通过你的重复测量。现在发现会损失一天，但也救下了一个月。",
    },
    phases: ["pilot", "collection", "analysis"],
    effects: { progress: -22, quality: 2, stats: { focus: -3, confidence: 1 } },
  },
  {
    id: "research_failed_replication",
    kind: "setback",
    title: { en: "The Effect Does Not Come Back", zh: "那个效应没有再次出现" },
    text: {
      en: "The replication is flat. It hurts, then it clarifies the paper: the honest result is narrower and more useful than the exciting first run.",
      zh: "重复实验没有效应。失落之后，论文反而更清楚了：诚实而克制的结果，比第一次那条兴奋的曲线更有用。",
    },
    phases: ["pilot", "collection", "analysis"],
    effects: { progress: -40, quality: -6, stats: { mood: -3, research: 1 } },
  },
  {
    id: "research_irb_clarification",
    kind: "setback",
    title: { en: "IRB: Please Clarify", zh: "伦理审查：请进一步说明" },
    text: {
      en: "The board asks who can see the linkage file and how a participant can withdraw. Both are fair questions; both need a careful rewrite.",
      zh: "伦理委员会问：谁能查看关联文件？参与者如何退出？问题都很合理，也都需要你认真重写。",
    },
    phases: ["irb"],
    effects: {
      progress: -45,
      quality: 4,
      repeatPhase: true,
      stats: { stress: 2, knowledge: 1 },
    },
  },
  {
    id: "research_recruitment_slowdown",
    kind: "setback",
    title: { en: "Tuesday's Chair Is Empty", zh: "周二那张诊疗椅空着" },
    text: {
      en: "Recruitment slows during clinic exams. You revise the timeline instead of leaning on patients who already have enough to manage.",
      zh: "临床考试周让招募慢了下来。你选择调整时间线，而不是催促本来就有许多事情要应付的患者。",
    },
    phases: ["collection"],
    effects: { progress: -28, stats: { stress: 2, empathy: 1 } },
  },
  {
    id: "research_missing_followup",
    kind: "setback",
    title: { en: "The Follow-up Column Has Holes", zh: "随访那一列有不少空白" },
    text: {
      en: "Several return visits never happened. You report the missingness, revisit the question, and resist inventing certainty.",
      zh: "几次复诊最终没有发生。你如实报告缺失，重新审视问题，也拒绝凭空制造确定性。",
    },
    phases: ["collection", "analysis"],
    effects: { progress: -20, quality: -5, stats: { research: 1 } },
  },
  {
    id: "research_analysis_bug",
    kind: "setback",
    title: { en: "One Row per Visit, Not per Patient", zh: "一行代表一次就诊，不是一个患者" },
    text: {
      en: "A suspiciously tiny p-value leads you to the unit-of-analysis bug. The result shrinks; your trust in the workflow grows.",
      zh: "一个小得可疑的 p 值让你找到了分析单位错误。效应变小了，但你对整个分析流程更放心了。",
    },
    phases: ["analysis", "writing"],
    effects: { progress: -30, quality: 3, stats: { stress: 3, knowledge: 1 } },
  },
  {
    id: "research_scooped_abstract",
    kind: "setback",
    title: { en: "A Familiar Abstract Appears", zh: "一篇眼熟的摘要出现了" },
    text: {
      en: "Another group presents the broad version first. Reyes helps you find the question your data can answer more carefully, not more loudly.",
      zh: "另一个团队先发表了更宽泛的版本。Reyes 帮你找到自己的数据能够更细致回答的问题，而不是让你喊得更响。",
    },
    phases: ["analysis", "writing", "submitted"],
    effects: { quality: -25, progress: -15, stats: { mood: -4, research: 1 } },
  },
  {
    id: "research_instrument_breakdown",
    kind: "setback",
    title: { en: "The Machine Chooses Silence", zh: "机器决定保持沉默" },
    text: {
      en: "The testing frame stops mid-run. Parts are coming; for two weeks, the project calendar has a very visible blank space.",
      zh: "测试机在实验中途停了下来。零件已经在路上；接下来两周，项目日历上会有一块非常显眼的空白。",
    },
    phases: ["pilot", "collection"],
    effects: { stallWeeks: 2, progress: -12, stats: { stress: 3 } },
  },
  {
    id: "research_coauthor_schedule",
    kind: "setback",
    title: { en: "Four Calendars, No Common Hour", zh: "四本日历，找不到同一个小时" },
    text: {
      en: "Clinic, call, teaching, and your own exam week refuse to align. The draft waits while the team agrees on smaller handoffs.",
      zh: "门诊、值班、教学和你的考试周怎么都对不上。稿件停了一下，团队也终于把交接任务拆得更小。",
    },
    phases: ["analysis", "writing", "revision"],
    effects: { stallWeeks: 1, progress: -15, stats: { stress: 2 } },
  },
  {
    id: "research_specimen_mislabel",
    kind: "setback",
    title: { en: "Two Labels, One Handwriting", zh: "两张标签，一样的笔迹" },
    text: {
      en: "Two specimen ids cannot be resolved with confidence. You exclude them and improve the chain-of-custody sheet before touching the next tray.",
      zh: "两个样本编号无法可靠区分。你将它们排除，也在碰下一盘样本前改好了流转记录表。",
    },
    phases: ["collection", "analysis"],
    effects: { progress: -32, quality: -7, stats: { confidence: -2, focus: 1 } },
  },
  {
    id: "research_methods_revision",
    kind: "setback",
    title: { en: "Reviewer Two Wants the Reliability Study", zh: "二号审稿人想看可靠性分析" },
    text: {
      en: "The request is substantial and, annoyingly, correct. You reopen the methods notebook and make the measurement claim match the evidence.",
      zh: "这个要求工作量不小，而且令人无奈地很有道理。你重新打开方法记录，让测量结论真正与证据相称。",
    },
    phases: ["submitted", "revision"],
    effects: { progress: -35, quality: 8, stats: { stress: 4, knowledge: 1 } },
  },
  {
    id: "research_submission_file_error",
    kind: "setback",
    title: { en: "The Submission PDF Drops a Figure", zh: "投稿 PDF 少了一张图" },
    text: {
      en: "The portal-generated PDF omits Figure 2. You withdraw, rebuild the file, and submit again with every panel checked at human size.",
      zh: "投稿系统生成的 PDF 漏掉了图 2。你撤回稿件、重建文件，再按正常阅读大小逐页检查后重新提交。",
    },
    phases: ["submitted"],
    effects: { quality: -10, progress: -30, stats: { mood: -3, stress: 2 } },
  },
  {
    id: "research_major_revision",
    kind: "setback",
    title: { en: "Major Revision, Six Pages", zh: "大修意见，整整六页" },
    text: {
      en: "The letter is long because someone read closely. You triage the requests, defend one choice, and change three others.",
      zh: "信很长，是因为有人真的认真读了。你把意见分门别类，坚持一个选择，也修改另外三个。",
    },
    phases: ["submitted", "revision"],
    effects: { progress: -40, quality: 10, stats: { stress: 5, research: 1 } },
  },
  {
    id: "research_partner_data_delay",
    kind: "setback",
    title: { en: "The Partner File Is Still Coming", zh: "合作方的数据还在路上" },
    text: {
      en: "The community clinic is short-staffed; exporting your spreadsheet is rightly not its emergency. You narrow this week's task and wait.",
      zh: "社区诊所人手不足；导出你的表格确实不是他们眼下最紧急的事。你缩小本周任务，然后耐心等待。",
    },
    phases: ["collection"],
    effects: { stallWeeks: 1, progress: -18, stats: { empathy: 1 } },
  },
  {
    id: "research_budget_shortfall",
    kind: "setback",
    title: { en: "The Reagent Quote Changed", zh: "试剂报价变了" },
    text: {
      en: "The new quote does not care about the old budget. You shrink the batch without shrinking the transparency of the limitation.",
      zh: "新报价并不会照顾旧预算。你缩小样本批次，但不会缩小对研究局限的透明说明。",
    },
    phases: ["idea", "pilot", "collection"],
    effects: { progress: -20, quality: -3, stats: { money: -4, stress: 2 } },
  },
  {
    id: "research_scanner_export_corrupt",
    kind: "setback",
    title: { en: "The Mesh Opens Like Confetti", zh: "网格文件打开后像一地彩纸" },
    text: {
      en: "A scanner export is corrupted. The raw scan survives, so you rebuild the pipeline and add the backup check you wish existed yesterday.",
      zh: "扫描导出文件损坏了，好在原始扫描还在。你重建流程，也加上了昨天就希望存在的备份检查。",
    },
    phases: ["pilot", "collection", "analysis"],
    effects: { progress: -25, stats: { stress: 3, focus: -2 } },
  },
  {
    id: "research_unexpected_confounder",
    kind: "setback",
    title: { en: "The Groups Differ Before Treatment", zh: "治疗前，两组就已经不同" },
    text: {
      en: "A baseline imbalance changes the question. You adjust what can be adjusted and say plainly what cannot.",
      zh: "基线不平衡改变了问题。能调整的认真调整，不能调整的也直白说明。",
    },
    phases: ["analysis", "writing"],
    effects: { progress: -20, quality: -12, stats: { research: 1, stress: 2 } },
  },
  {
    id: "research_clean_signal",
    kind: "lucky",
    title: { en: "The Replicates Line Up", zh: "重复实验对上了" },
    text: {
      en: "Not perfectly—nothing honest is—but well enough that the pattern survives a second look and a fresh plot.",
      zh: "不是完美一致——诚实的数据很少如此——但足以让这个规律经得起第二次检查和一张新图。",
    },
    phases: ["pilot", "collection", "analysis"],
    effects: { progress: 22, quality: 18, stats: { confidence: 2, mood: 2 } },
  },
  {
    id: "research_mentor_margin_note",
    kind: "lucky",
    title: { en: "Reyes Circles One Sentence", zh: "Reyes 圈出了一句话" },
    text: {
      en: "“This is the paper.” One margin note turns six pages of wandering into a question you can finally state in one breath.",
      zh: "“这才是这篇论文。”页边的一句话，把六页绕路收拢成了一个终于能一口气说清的问题。",
    },
    phases: ["idea", "analysis", "writing"],
    effects: { progress: 28, quality: 14, reputationInLab: 4, stats: { focus: 3 } },
  },
  {
    id: "research_clean_dataset",
    kind: "lucky",
    title: { en: "The Data Dictionary Was Worth It", zh: "数据字典没有白写" },
    text: {
      en: "The merge works on the first careful try. Future-you sends past-you a quiet thank-you for naming every variable clearly.",
      zh: "这次合并一次就成功了。未来的你安静地感谢过去的你：每个变量都命名得很清楚。",
    },
    phases: ["collection", "analysis"],
    effects: { progress: 30, quality: 10, stats: { focus: 2, mood: 2 } },
  },
  {
    id: "research_travel_award",
    kind: "lucky",
    title: { en: "A Small Travel Award", zh: "一笔小额差旅奖" },
    text: {
      en: "The award covers the train and two nights near the meeting. It is not glamorous; it makes presenting possible.",
      zh: "这笔奖项刚好够火车票和会议附近两晚住宿。谈不上光鲜，却让展示研究成为可能。",
    },
    phases: ["writing", "submitted", "revision"],
    effects: { quality: 8, reputationInLab: 3, stats: { money: 8, standing: 3 } },
  },
  {
    id: "research_shared_method",
    kind: "lucky",
    title: { en: "A Collaborator Shares the Script", zh: "合作者分享了脚本" },
    text: {
      en: "A neighboring team has already solved the tedious formatting step and shares the method, tests included. You cite them and keep moving.",
      zh: "隔壁团队已经解决了那套繁琐的格式转换，还连测试一起分享给你。你认真引用，然后继续往前走。",
    },
    phases: ["pilot", "analysis", "revision"],
    effects: { progress: 24, quality: 12, reputationInLab: 2, stats: { mood: 2 } },
  },
  {
    id: "research_reviewer_sees_value",
    kind: "lucky",
    title: { en: "A Reviewer Understands the Point", zh: "有位审稿人读懂了重点" },
    text: {
      en: "The review names the modest contribution exactly as you hoped: useful evidence, bounded honestly. The remaining edits feel possible.",
      zh: "审稿意见准确说出了你期待的那份克制贡献：证据有用，边界也诚实。剩下的修改忽然变得可以完成。",
    },
    phases: ["submitted", "revision"],
    effects: { progress: 25, quality: 18, stats: { confidence: 3, stress: -2 } },
  },
];

export const RESEARCH_LABS_BY_ID: Readonly<Record<string, LabTemplate>> =
  Object.fromEntries(RESEARCH_LABS.map((lab) => [lab.id, lab]));

export const RESEARCH_PROJECTS_BY_ID: Readonly<Record<string, ProjectTemplate>> =
  Object.fromEntries(RESEARCH_PROJECT_TEMPLATES.map((project) => [project.id, project]));

export const RESEARCH_EVENTS_BY_ID: Readonly<Record<string, ResearchEventTemplate>> =
  Object.fromEntries(RESEARCH_EVENTS.map((event) => [event.id, event]));
