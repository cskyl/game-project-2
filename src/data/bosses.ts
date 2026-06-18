import type { Boss } from "../game/types";

// One semester check per semester. Outcomes are never an instant game-over;
// they nudge stats and tone. See engine.resolveBoss for the score formula.
export const BOSSES: Boss[] = [
  {
    id: "boss_d1_autumn_science_exam",
    semesterId: 1,
    title: { en: "First Big Science Exam", zh: "第一场大型基础科学考试" },
    description: {
      en: "Your first semester ends with a heavy basic-science exam. Mostly knowledge, with a little nerve.",
      zh: "第一个学期以一场厚重的基础科学考试收尾。主要靠知识，也需要一点心理素质。",
    },
    requiredStats: [
      { stat: "knowledge", weight: 0.6 },
      { stat: "stamina", weight: 0.2 },
      { stat: "confidence", weight: 0.2 },
    ],
    outcomes: {
      great: {
        text: {
          en: "It clicked. You walked out knowing you actually understood it, not just memorized it.",
          zh: "豁然开朗。你走出考场时知道自己是真的懂了，而不只是背下来了。",
        },
        effects: { confidence: 5, reputation: 3, stress: -5 },
      },
      pass: {
        text: {
          en: "Solid. Not flawless, but a real, honest pass for a first exam.",
          zh: "稳。不完美，但作为第一场考试，是实打实的通过。",
        },
        effects: { confidence: 2, stress: -2 },
      },
      barely: {
        text: {
          en: "You passed, but it was close enough to rattle you. Lesson noted.",
          zh: "过了，但险得让你心里一紧。教训记下了。",
        },
        effects: { stress: 5, mood: -3 },
      },
      struggle: {
        text: {
          en: "Rough. You get a reminder that the first semester is a learning curve, not a verdict.",
          zh: "挺难。它提醒你：第一个学期是学习曲线，不是判决书。",
        },
        effects: { stress: 10, mood: -8, knowledge: 3 },
      },
    },
  },
  {
    id: "boss_d1_spring_lab_check",
    semesterId: 2,
    title: { en: "Oral Anatomy + Lab Check", zh: "口腔解剖 + 实验考核" },
    description: {
      en: "This semester ends with a combined knowledge and hand skill check.",
      zh: "这个学期以一场知识与手部技能的综合考核收尾。",
    },
    requiredStats: [
      { stat: "knowledge", weight: 0.45 },
      { stat: "handSkill", weight: 0.45 },
      { stat: "confidence", weight: 0.1 },
    ],
    outcomes: {
      great: {
        text: {
          en: "You finished the check with surprising calm. The details finally clicked.",
          zh: "你出乎意料地从容完成了考核。那些细节终于对上了。",
        },
        effects: { confidence: 5, reputation: 3, stress: -5 },
      },
      pass: {
        text: {
          en: "It was not perfect, but you passed and learned what to improve.",
          zh: "不算完美，但你通过了，也知道了下次要改什么。",
        },
        effects: { confidence: 2, stress: -2 },
      },
      barely: {
        text: {
          en: "You passed, but it felt too close. Next semester needs a better plan.",
          zh: "过了，但太险了。下学期得有个更好的计划。",
        },
        effects: { stress: 5, mood: -3 },
      },
      struggle: {
        text: {
          en: "This one hurt. You get extra practice time and a reminder that progress is not linear.",
          zh: "这次有点伤。你得到了额外的练习时间，也被提醒：进步不是线性的。",
        },
        effects: { stress: 10, mood: -8, handSkill: 3 },
      },
    },
  },
  {
    id: "boss_d1_summer_technique",
    semesterId: 3,
    title: { en: "Preclinical Technique Check", zh: "临床前技术考核" },
    description: {
      en: "Hours at the bench come down to one technique evaluation. Hand skill and stamina carry you.",
      zh: "在实验台上的无数小时，浓缩成一次技术评估。手上功夫和体力是你的依靠。",
    },
    requiredStats: [
      { stat: "handSkill", weight: 0.6 },
      { stat: "stamina", weight: 0.2 },
      { stat: "confidence", weight: 0.2 },
    ],
    outcomes: {
      great: {
        text: {
          en: "Clean, steady, precise. Your hands knew exactly what to do.",
          zh: "干净、稳定、精准。你的手清楚地知道该怎么做。",
        },
        effects: { confidence: 5, reputation: 3, handSkill: 2 },
      },
      pass: {
        text: {
          en: "Good enough, with room to grow. The fundamentals are there.",
          zh: "足够好，也还有提升空间。基本功是在的。",
        },
        effects: { confidence: 2, stress: -2 },
      },
      barely: {
        text: {
          en: "You scraped through. Your hands need more reps, and you know it.",
          zh: "你勉强过关。手还需要更多练习量，你心里清楚。",
        },
        effects: { stress: 5, mood: -3, handSkill: 2 },
      },
      struggle: {
        text: {
          en: "Tough day at the bench. Extra lab time it is — your hands will catch up.",
          zh: "实验台上难熬的一天。那就加练吧——手会跟上来的。",
        },
        effects: { stress: 10, mood: -8, handSkill: 3 },
      },
    },
  },
  {
    id: "boss_d2_autumn_restorative",
    semesterId: 4,
    title: { en: "Restorative Simulation Check", zh: "修复模拟考核" },
    description: {
      en: "A restorative simulation that blends hand skill, knowledge, and early clinical judgment.",
      zh: "一次修复模拟考核，融合了手部技能、知识与早期临床判断。",
    },
    requiredStats: [
      { stat: "handSkill", weight: 0.45 },
      { stat: "knowledge", weight: 0.3 },
      { stat: "clinicalSense", weight: 0.25 },
    ],
    outcomes: {
      great: {
        text: {
          en: "Margins, contacts, contours — all of it came together. Quietly impressive.",
          zh: "边缘、邻接、外形——全都对上了。低调地漂亮。",
        },
        effects: { confidence: 5, reputation: 3, clinicalSense: 2 },
      },
      pass: {
        text: {
          en: "A real pass. You see how the pieces of restorative work fit now.",
          zh: "实打实地通过。你开始看懂修复工作里各部分是怎么拼起来的了。",
        },
        effects: { confidence: 2, clinicalSense: 2 },
      },
      barely: {
        text: {
          en: "Close. One or two details cost you, but you learned exactly which ones.",
          zh: "险过。一两个细节让你扣了分，但你清楚是哪些。",
        },
        effects: { stress: 5, mood: -3 },
      },
      struggle: {
        text: {
          en: "Harder than expected. You leave with a precise list of what to rebuild.",
          zh: "比预想的难。你带着一张要重练什么的清单离开。",
        },
        effects: { stress: 10, mood: -8, handSkill: 3 },
      },
    },
  },
  {
    id: "boss_d2_spring_clinic_readiness",
    semesterId: 5,
    title: { en: "Clinic Readiness Review", zh: "临床准备度评估" },
    description: {
      en: "Faculty review whether you are ready for patients: judgment, calm, and a human touch.",
      zh: "老师们评估你是否准备好面对患者:判断力、从容,以及一点人情味。",
    },
    requiredStats: [
      { stat: "clinicalSense", weight: 0.4 },
      { stat: "confidence", weight: 0.3 },
      { stat: "empathy", weight: 0.3 },
    ],
    outcomes: {
      great: {
        text: {
          en: "They can tell you are ready — not perfect, but ready, and that is the point.",
          zh: "他们看得出你准备好了——不是完美,而是准备好了,这才是重点。",
        },
        effects: { confidence: 5, reputation: 3, empathy: 2 },
      },
      pass: {
        text: {
          en: "Cleared for clinic. The real learning starts now.",
          zh: "获准进入临床。真正的学习从现在开始。",
        },
        effects: { confidence: 3, clinicalSense: 2 },
      },
      barely: {
        text: {
          en: "Cleared, with notes. You will keep an eye on the things they flagged.",
          zh: "通过了,但有备注。你会留意他们点到的那些地方。",
        },
        effects: { stress: 5, mood: -2 },
      },
      struggle: {
        text: {
          en: "Not quite yet. A bit more prep, and a reminder that readiness is built, not rushed.",
          zh: "还差一点。再准备准备吧——准备度是攒出来的,急不来。",
        },
        effects: { stress: 8, mood: -6, clinicalSense: 3 },
      },
    },
  },
  {
    id: "boss_d2_summer_first_patient",
    semesterId: 6,
    title: { en: "First Patient Interaction", zh: "第一次接触患者" },
    description: {
      en: "Your first real patient interaction. Empathy and a steady manner matter as much as skill.",
      zh: "你第一次真正和患者打交道。同理心和稳住的姿态,和技术一样重要。",
    },
    requiredStats: [
      { stat: "empathy", weight: 0.4 },
      { stat: "clinicalSense", weight: 0.3 },
      { stat: "confidence", weight: 0.3 },
    ],
    outcomes: {
      great: {
        text: {
          en: "The patient relaxed because you did. You will remember this one.",
          zh: "患者放松下来,因为你放松了。这一次你会记得很久。",
        },
        effects: { confidence: 5, empathy: 3, reputation: 3 },
      },
      pass: {
        text: {
          en: "A good first contact. Nervous, human, and ultimately fine.",
          zh: "不错的第一次接触。紧张、真实,最后一切都好。",
        },
        effects: { confidence: 3, empathy: 2 },
      },
      barely: {
        text: {
          en: "It worked out, even if your hands shook a little. That fades with reps.",
          zh: "顺下来了,尽管手抖了一下。练多了就不抖了。",
        },
        effects: { stress: 5, confidence: 1 },
      },
      struggle: {
        text: {
          en: "Awkward, but no harm done. Everyone's first patient is a little clumsy.",
          zh: "有点笨拙,但没出岔子。每个人的第一位患者都有点手忙脚乱。",
        },
        effects: { stress: 8, mood: -6, empathy: 3 },
      },
    },
  },
  {
    id: "boss_d3_autumn_first_case",
    semesterId: 7,
    title: { en: "First Real Case", zh: "第一个真实病例" },
    description: {
      en: "Your first case you own from plan to chair. Judgment, empathy, and nerve.",
      zh: "第一个从方案到椅旁都由你负责的病例。判断、同理心,以及胆量。",
    },
    requiredStats: [
      { stat: "clinicalSense", weight: 0.4 },
      { stat: "empathy", weight: 0.3 },
      { stat: "confidence", weight: 0.3 },
    ],
    outcomes: {
      great: {
        text: {
          en: "Start to finish, you led it. The patient trusted you, and you earned it.",
          zh: "从头到尾,你主导了它。患者信任你,而这份信任是你赢来的。",
        },
        effects: { confidence: 6, reputation: 4, clinicalSense: 2 },
      },
      pass: {
        text: {
          en: "You handled it. Slower than a pro, but sound and safe.",
          zh: "你搞定了。比熟手慢,但稳妥、安全。",
        },
        effects: { confidence: 3, clinicalSense: 2 },
      },
      barely: {
        text: {
          en: "It came together, barely. You needed a nudge or two from faculty.",
          zh: "勉强串起来了。中间靠老师点了一两下。",
        },
        effects: { stress: 6, mood: -2 },
      },
      struggle: {
        text: {
          en: "A long appointment with a lot of help. You learned an enormous amount.",
          zh: "一次漫长、需要很多帮助的就诊。但你学到的东西极多。",
        },
        effects: { stress: 10, mood: -6, clinicalSense: 3 },
      },
    },
  },
  {
    id: "boss_d3_spring_complex_plan",
    semesterId: 8,
    title: { en: "Complex Treatment Plan", zh: "复杂治疗方案" },
    description: {
      en: "A multi-step case that tests planning, hands, and how you sequence care.",
      zh: "一个多步骤的病例,考验你的方案设计、手上功夫,以及如何安排治疗顺序。",
    },
    requiredStats: [
      { stat: "clinicalSense", weight: 0.4 },
      { stat: "handSkill", weight: 0.3 },
      { stat: "knowledge", weight: 0.3 },
    ],
    outcomes: {
      great: {
        text: {
          en: "A clean, well-sequenced plan. Faculty nodded — the rare good kind of nod.",
          zh: "一份干净、顺序合理的方案。老师点了头——是那种少见的、好的点头。",
        },
        effects: { confidence: 5, reputation: 4, clinicalSense: 3 },
      },
      pass: {
        text: {
          en: "Solid plan with minor revisions. You can hold the whole case in your head now.",
          zh: "方案扎实,稍作修改。你现在能把整个病例装进脑子里了。",
        },
        effects: { confidence: 3, clinicalSense: 2 },
      },
      barely: {
        text: {
          en: "Approved after a few rewrites. Complexity is its own skill, and it is coming.",
          zh: "改了几版才通过。处理复杂本身就是一种能力,它正在长出来。",
        },
        effects: { stress: 7, mood: -3, clinicalSense: 2 },
      },
      struggle: {
        text: {
          en: "Overwhelming at first. Broken into steps, it became survivable — and teachable.",
          zh: "一开始很让人崩。拆成步骤之后,它变得可以应付——也变成了能学的东西。",
        },
        effects: { stress: 10, mood: -7, clinicalSense: 3 },
      },
    },
  },
  {
    id: "boss_d3_summer_difficult_patient",
    semesterId: 9,
    title: { en: "Difficult Patient Week", zh: "难搞患者周" },
    description: {
      en: "A week of demanding patients. Patience, reputation, and stamina are on the line.",
      zh: "一周都是难应付的患者。耐心、口碑和体力都在受考验。",
    },
    requiredStats: [
      { stat: "empathy", weight: 0.4 },
      { stat: "reputation", weight: 0.3 },
      { stat: "confidence", weight: 0.3 },
    ],
    outcomes: {
      great: {
        text: {
          en: "You stayed kind and steady when it was hard to. People noticed.",
          zh: "在很难做到的时候,你依然温和、稳得住。大家都看在眼里。",
        },
        effects: { reputation: 5, empathy: 3, confidence: 3 },
      },
      pass: {
        text: {
          en: "You got through the week with your warmth intact. That is the win.",
          zh: "你撑过了这一周,温柔还在。这就是胜利。",
        },
        effects: { empathy: 2, confidence: 2 },
      },
      barely: {
        text: {
          en: "Draining, but you kept it together. Tonight you actually rest.",
          zh: "很耗,但你没散架。今晚你是真的要好好休息。",
        },
        effects: { stress: 8, stamina: -4, empathy: 2 },
      },
      struggle: {
        text: {
          en: "A hard week that took something out of you. Be gentle with yourself after.",
          zh: "艰难的一周,带走了你一些能量。之后请对自己温柔一点。",
        },
        effects: { stress: 12, mood: -8, empathy: 3 },
      },
    },
  },
  {
    id: "boss_d4_autumn_community",
    semesterId: 10,
    title: { en: "Community Clinic Rotation", zh: "社区诊所轮转" },
    description: {
      en: "A rotation in a community setting. Access, trust, and how you carry yourself in a new system.",
      zh: "一次社区环境下的轮转。可及性、信任,以及你在一个新系统里如何立身。",
    },
    requiredStats: [
      { stat: "publicImpact", weight: 0.4 },
      { stat: "clinicalSense", weight: 0.3 },
      { stat: "reputation", weight: 0.3 },
    ],
    outcomes: {
      great: {
        text: {
          en: "You met people where they were and treated them well. This is the work.",
          zh: "你走到他们所在的地方,把他们照顾好。这就是这份工作的意义。",
        },
        effects: { publicImpact: 5, reputation: 4, empathy: 3 },
      },
      pass: {
        text: {
          en: "A meaningful rotation. You saw dentistry as a system, not just a chair.",
          zh: "一次有意义的轮转。你开始把牙科看成一个系统,而不只是一把椅子。",
        },
        effects: { publicImpact: 3, clinicalSense: 2 },
      },
      barely: {
        text: {
          en: "Busy and a bit chaotic, but you helped real people. That counts.",
          zh: "忙乱了点,但你帮到了真实的人。这就算数。",
        },
        effects: { stress: 6, publicImpact: 2 },
      },
      struggle: {
        text: {
          en: "The pace was relentless. You learned how heavy access-to-care really is.",
          zh: "节奏一刻不停。你体会到了「看得上病」这件事到底有多重。",
        },
        effects: { stress: 10, stamina: -5, publicImpact: 3 },
      },
    },
  },
  {
    id: "boss_d4_spring_final_path",
    semesterId: 11,
    title: { en: "Final Path Decision", zh: "最终方向的决定" },
    description: {
      en: "Graduation is here. This check is about the whole person you have become — career readiness and life balance both.",
      zh: "毕业就在眼前。这一关考的是你成为的整个人——职业准备度和生活平衡,缺一不可。",
    },
    requiredStats: [
      { stat: "careerReadiness", weight: 0.6 },
      { stat: "lifeBalance", weight: 0.4 },
    ],
    outcomes: {
      great: {
        text: {
          en: "You arrive at the end ready and still whole. Whatever you choose next, you can carry it.",
          zh: "你走到终点,既准备好了,又依然完整。无论接下来选什么,你都拿得起。",
        },
        effects: { confidence: 5, mood: 5, reputation: 3 },
      },
      pass: {
        text: {
          en: "Ready enough, grounded enough. The next chapter is yours to write.",
          zh: "准备得够了,也站得够稳了。下一章由你来写。",
        },
        effects: { confidence: 3, mood: 3 },
      },
      barely: {
        text: {
          en: "You made it, a little frayed at the edges. Rest is allowed now.",
          zh: "你做到了,边角有点磨损。现在可以休息了。",
        },
        effects: { stress: 5, mood: -2 },
      },
      struggle: {
        text: {
          en: "You crossed the line tired, but you crossed it. That is not nothing — that is everything.",
          zh: "你是带着疲惫越过终点线的,但你越过去了。这不是小事——这是全部。",
        },
        effects: { stress: 8, mood: -4, confidence: 2 },
      },
    },
  },
];
