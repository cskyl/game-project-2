import type { EventCondition, LocalizedText, Stage, StatBlock } from "../game/types";
import { registerModifier, type ModifierHook } from "../game/modifiers";

/**
 * A semester-long choice.  The engine only needs the registry hooks to apply
 * passive math; the tag and track fields keep the content legible to the
 * elective, case, and Match screens without scattering special cases.
 */
export type Elective = {
  id: string;
  name: LocalizedText;
  title?: LocalizedText;
  description: LocalizedText;
  stage: Array<Stage | "any">;
  minSemester: number;
  maxSemester: number;
  prerequisites?: EventCondition;
  requirements?: EventCondition;
  tags: string[];
  caseTags?: string[];
  matchTrackBonus?: Partial<Record<string, number>>;
  effects?: StatBlock;
  hooks: ModifierHook[];
};

const elective = (definition: Elective): Elective => {
  registerModifier({ id: definition.id, kind: "elective" }, definition.hooks);
  return {
    ...definition,
    title: definition.title ?? definition.name,
    requirements: definition.requirements ?? definition.prerequisites,
  };
};

/** The frozen fourteen-offer pool from §5.9. */
export const ELECTIVES: Elective[] = [
  elective({
    id: "oral_surgery_rotation",
    name: { en: "Oral Surgery Rotation", zh: "口腔外科轮转" },
    description: {
      en: "A calm hand, a clear plan, and a little respect for how much a patient is carrying into the chair.",
      zh: "稳住双手、理清计划，也尊重患者带进诊室的那份重量。",
    },
    stage: ["clinical", "advanced"],
    minSemester: 7,
    maxSemester: 12,
    tags: ["surgery", "clinic"],
    caseTags: ["surgery"],
    matchTrackBonus: { omfs: 10 },
    hooks: [
      { on: "actionEffects", tag: "clinic", stat: "clinicalSense", mult: 1.1 },
      { on: "caseRoll", add: 4 },
    ],
  }),
  elective({
    id: "pediatric_rotation",
    name: { en: "Pediatric Rotation", zh: "儿童牙科轮转" },
    description: {
      en: "Behavior guidance, tiny mouths, and the serious work of making a visit feel safe.",
      zh: "行为引导、小小的嘴巴，以及让一次就诊感觉安全起来的认真工作。",
    },
    stage: ["clinical", "advanced"],
    minSemester: 7,
    maxSemester: 12,
    tags: ["pedo", "clinic", "empathy"],
    caseTags: ["pedo"],
    matchTrackBonus: { pedo: 11 },
    hooks: [
      { on: "actionEffects", tag: "clinic", stat: "empathy", mult: 1.12 },
      { on: "caseRoll", add: 3 },
    ],
  }),
  elective({
    id: "orthodontics_selective",
    name: { en: "Orthodontics Selective", zh: "正畸选修" },
    description: {
      en: "Learn to see the long arc: growth, occlusion, and the patience of small adjustments.",
      zh: "学着看见更长的时间线：生长、咬合，以及一点点调整所需要的耐心。",
    },
    stage: ["early", "preclinical", "transition", "clinical", "advanced"],
    minSemester: 1,
    maxSemester: 12,
    tags: ["ortho", "diagnosis"],
    caseTags: ["ortho"],
    matchTrackBonus: { ortho: 12 },
    hooks: [
      { on: "actionEffects", tag: "study", stat: "knowledge", mult: 1.1 },
      { on: "actionEffects", tag: "clinic", stat: "handSkill", mult: 1.08 },
    ],
  }),
  elective({
    id: "community_outreach_block",
    name: { en: "Community Outreach Block", zh: "社区口腔健康外展" },
    description: {
      en: "Take dentistry out of the building and listen to what access looks like from the other side.",
      zh: "把牙科带出大楼，听听在诊室另一边，“获得照护”到底是什么样。",
    },
    stage: ["transition", "clinical", "advanced"],
    minSemester: 6,
    maxSemester: 12,
    tags: ["community", "public-health"],
    caseTags: ["access"],
    matchTrackBonus: { public_health: 13 },
    hooks: [
      { on: "actionEffects", tag: "community", stat: "publicImpact", mult: 1.18 },
      { on: "actionEffects", tag: "community", stat: "empathy", add: 1 },
    ],
  }),
  elective({
    id: "hospital_dentistry",
    name: { en: "Hospital Dentistry", zh: "医院牙科" },
    description: {
      en: "Care plans get more careful when the rest of a patient's health is in the room too.",
      zh: "当患者的全身健康也在诊室里时，治疗计划会变得更加谨慎。",
    },
    stage: ["clinical", "advanced"],
    minSemester: 7,
    maxSemester: 12,
    tags: ["hospital", "medically-complex"],
    caseTags: ["medically-complex"],
    matchTrackBonus: { gpr_aegd: 9, oral_path: 5 },
    hooks: [
      { on: "actionEffects", tag: "clinic", stat: "clinicalSense", mult: 1.12 },
      { on: "caseRoll", add: 3 },
    ],
  }),
  elective({
    id: "dental_materials_seminar",
    name: { en: "Dental Materials Seminar", zh: "牙科材料研讨课" },
    description: {
      en: "The small print matters: bonding, wear, moisture, and why the material is part of the treatment.",
      zh: "细节很重要：粘接、磨耗、湿度，以及材料为什么本身就是治疗的一部分。",
    },
    stage: ["early", "preclinical", "transition"],
    minSemester: 1,
    maxSemester: 6,
    tags: ["materials", "lab"],
    caseTags: ["restorative"],
    matchTrackBonus: { prostho: 8, endo: 4 },
    hooks: [
      { on: "actionEffects", tag: "lab", stat: "handSkill", mult: 1.1 },
      { on: "actionEffects", tag: "study", stat: "knowledge", add: 1 },
    ],
  }),
  elective({
    id: "teaching_assistant",
    name: { en: "Teaching Assistantship", zh: "助教岗位" },
    description: {
      en: "Explain a tricky concept to someone else and discover which parts you understand for real.",
      zh: "把难懂的概念讲给别人听，也顺便发现自己真正理解了哪些部分。",
    },
    stage: ["early", "preclinical", "transition", "clinical"],
    minSemester: 1,
    maxSemester: 9,
    tags: ["teaching", "standing"],
    matchTrackBonus: { academic: 8, public_health: 4 },
    hooks: [
      { on: "actionEffects", tag: "study", stat: "knowledge", mult: 1.15 },
      { on: "actionEffects", tag: "study", stat: "knowledge", add: 1 },
      { on: "softCapBand", stat: "knowledge", shift: 3 },
    ],
  }),
  elective({
    id: "practice_management_course",
    name: { en: "Practice Management Course", zh: "诊所管理课程" },
    description: {
      en: "Schedules, teams, budgets, and the unglamorous infrastructure that lets good care happen.",
      zh: "排班、团队、预算，以及让优质照护真正发生的朴素基础设施。",
    },
    stage: ["advanced"],
    minSemester: 10,
    maxSemester: 12,
    tags: ["operator", "management"],
    matchTrackBonus: { private_practice: 12, associate_then_own: 10 },
    hooks: [
      { on: "actionEffects", tag: "work", stat: "money", mult: 1.12 },
      { on: "actionEffects", tag: "clinic", stat: "clinicalSense", add: 1 },
      { on: "income", mult: 1.1 },
    ],
  }),
  elective({
    id: "implant_selective",
    name: { en: "Implant Selective", zh: "种植选修" },
    description: {
      en: "Treatment sequencing, tissue, and the humility to plan for the years after the appointment.",
      zh: "治疗排序、组织，以及为就诊之后的几年做计划所需要的谦逊。",
    },
    stage: ["clinical", "advanced"],
    minSemester: 8,
    maxSemester: 12,
    tags: ["implant", "surgery", "prostho"],
    caseTags: ["surgery", "prostho"],
    matchTrackBonus: { omfs: 7, prostho: 10 },
    hooks: [
      { on: "actionEffects", tag: "clinic", stat: "handSkill", mult: 1.1 },
      { on: "actionEffects", tag: "clinic", stat: "clinicalSense", add: 1 },
    ],
  }),
  elective({
    id: "research_selective",
    name: { en: "Research Selective", zh: "科研选修" },
    description: {
      en: "A semester with a methods question always open in the background, asking for evidence rather than vibes.",
      zh: "整个学期都留着一个方法学问题，提醒你要找证据，而不是凭感觉。",
    },
    stage: ["early", "preclinical", "transition", "clinical", "advanced"],
    minSemester: 2,
    maxSemester: 12,
    tags: ["research", "academic"],
    matchTrackBonus: { academic: 14, oral_path: 7, omfs: 4 },
    hooks: [
      { on: "actionEffects", tag: "study", stat: "research", mult: 1.2 },
      { on: "actionEffects", tag: "study", stat: "knowledge", add: 1 },
      { on: "projectQuality", add: 7 },
    ],
  }),
  elective({
    id: "sedation_selective",
    name: { en: "Sedation Selective", zh: "镇静选修" },
    description: {
      en: "Preparation, monitoring, and a steady respect for the patient's nervous system.",
      zh: "准备、监测，以及对患者神经系统始终保持的尊重与谨慎。",
    },
    stage: ["clinical", "advanced"],
    minSemester: 7,
    maxSemester: 12,
    tags: ["sedation", "anxiety-care"],
    caseTags: ["anxious"],
    matchTrackBonus: { gpr_aegd: 8, omfs: 5 },
    hooks: [
      { on: "actionEffects", tag: "clinic", stat: "empathy", mult: 1.1 },
      { on: "caseRoll", add: 4 },
    ],
  }),
  elective({
    id: "special_needs_clinic",
    name: { en: "Special-Needs Clinic", zh: "特殊需求门诊" },
    description: {
      en: "Adapt the environment, the timing, and the plan so care can meet the person in front of you.",
      zh: "调整环境、节奏和计划，让照护真正来到面前这个人的位置。",
    },
    stage: ["clinical", "advanced"],
    minSemester: 7,
    maxSemester: 12,
    tags: ["special-needs", "empathy", "clinic"],
    caseTags: ["special-needs"],
    matchTrackBonus: { pedo: 6, public_health: 9 },
    hooks: [
      { on: "actionEffects", tag: "clinic", stat: "empathy", mult: 1.15 },
      { on: "actionEffects", tag: "clinic", stat: "clinicalSense", add: 1 },
    ],
  }),
  elective({
    id: "geriatric_rotation",
    name: { en: "Geriatric Rotation", zh: "老年牙科轮转" },
    description: {
      en: "Long histories, changing medications, and care plans built with—not merely for—the patient.",
      zh: "漫长的病史、不断变化的用药，以及和患者一起而不是替患者制定的计划。",
    },
    stage: ["clinical", "advanced"],
    minSemester: 7,
    maxSemester: 12,
    tags: ["geriatric", "clinic", "prostho"],
    caseTags: ["geriatric", "prostho"],
    matchTrackBonus: { prostho: 9, public_health: 6 },
    hooks: [
      { on: "actionEffects", tag: "clinic", stat: "empathy", mult: 1.1 },
      { on: "actionEffects", tag: "clinic", stat: "clinicalSense", mult: 1.08 },
    ],
  }),
  elective({
    id: "emergency_clinic",
    name: { en: "Emergency Clinic", zh: "急诊牙科门诊" },
    description: {
      en: "Triage first, reassure second, and make the next safe step when the perfect plan is not available today.",
      zh: "先分诊、再安抚，在今天无法实现完美方案时先做出安全的下一步。",
    },
    stage: ["transition", "clinical", "advanced"],
    minSemester: 6,
    maxSemester: 12,
    tags: ["emergency", "clinic", "triage"],
    caseTags: ["emergency", "pain"],
    matchTrackBonus: { gpr_aegd: 11, endo: 6, perio: 4 },
    hooks: [
      { on: "actionEffects", tag: "clinic", stat: "confidence", mult: 1.1 },
      { on: "caseRoll", add: 3 },
    ],
  }),
];

export const ELECTIVES_BY_ID: Record<string, Elective> = Object.fromEntries(
  ELECTIVES.map((entry) => [entry.id, entry]),
);

/** Re-register data hooks after deterministic test harnesses reset the registry. */
export function registerElectiveModifiers(): void {
  for (const entry of ELECTIVES) {
    registerModifier({ id: entry.id, kind: "elective" }, entry.hooks);
  }
}
