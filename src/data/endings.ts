import type { Ending } from "../game/types";

// Endings describe the shape of a life rather than grading it. The engine picks
// the highest-priority matching entry, so specific states and careers must stay
// above build identities, and the balanced/default endings must remain fallbacks.
export const ENDINGS: Ending[] = [
  // State overrides (95)
  {
    id: "health_crisis",
    priority: 95,
    title: { en: "A Necessary Pause", zh: "一次必要的停靠" },
    subtitle: { en: "Your health belongs in the plan", zh: "健康也应该写进人生计划" },
    condition: { requiredFlags: ["health_crisis"] },
    text: {
      en: "Your body made the decision that your calendar would not. Graduation is still yours, and so is the right to recover slowly, ask for care, and build a career that leaves room for a human being.",
      zh: "日程表迟迟不肯做的决定，身体替你做了。毕业依然属于你；慢慢恢复、寻求照护，以及建立一份能给真实的人留出空间的职业，也都属于你。",
    },
  },
  {
    id: "high_achiever_burnout",
    priority: 95,
    title: { en: "Successful, and Running on Empty", zh: "走到了终点，也真的累空了" },
    subtitle: { en: "A care message, never a failure screen", zh: "这是关心，不是失败判定" },
    condition: {
      minStats: { knowledge: 75 },
      maxStats: { wellness: 34 },
    },
    text: {
      en: "You accomplished a great deal, but you should not have to disappear inside the accomplishment. This ending is a warning offered with care: rest is not a reward you earn after becoming useful. You deserve it now.",
      zh: "你完成了很多，但不该把自己消失在这些成就里。这个结局只是一个带着关心的提醒：休息不是变得“有用”以后才能领取的奖励。此刻的你，就已经值得。",
    },
  },

  // Match career tracks (88-92). P7 supplies the accepted flags and may add
  // accepted/waitlisted copy variants without changing this frozen roster.
  {
    id: "career_omfs",
    priority: 92,
    title: { en: "The Long OR Road", zh: "通往手术室的长路" },
    subtitle: { en: "Oral and maxillofacial surgery", zh: "口腔颌面外科" },
    condition: { requiredFlags: ["match_omfs_accepted"] },
    text: {
      en: "The call came: you matched into oral and maxillofacial surgery. The training ahead is formidable, but so is the patient, disciplined person who chose it with open eyes.",
      zh: "录取消息来了：你匹配到了口腔颌面外科。前面的训练很硬，但那个看清代价后仍然认真选择它的你，也同样强大。",
    },
  },
  {
    id: "career_ortho",
    priority: 92,
    title: { en: "Making Room for Change", zh: "为改变腾出空间" },
    subtitle: { en: "Orthodontics", zh: "正畸学" },
    condition: { requiredFlags: ["match_ortho_accepted"] },
    text: {
      en: "You matched into orthodontics. Years of seeing tiny movements, long timelines, and whole faces at once have found a home.",
      zh: "你匹配到了正畸。那些对微小移动、漫长时间线和完整面容的关注，终于找到了归处。",
    },
  },
  {
    id: "career_pedo",
    priority: 91,
    title: { en: "Small Chairs, Enormous Trust", zh: "小小牙椅，大大信任" },
    subtitle: { en: "Pediatric dentistry", zh: "儿童牙科" },
    condition: { requiredFlags: ["match_pedo_accepted"] },
    text: {
      en: "You matched into pediatric dentistry. Your patients may arrive scared, skeptical, or wearing a dinosaur cape; you learned to meet each of them where they are.",
      zh: "你匹配到了儿童牙科。小患者可能害怕、怀疑，也可能披着恐龙斗篷进门；你学会了从他们所在的地方开始建立信任。",
    },
  },
  {
    id: "career_endo",
    priority: 91,
    title: { en: "Finding the Canal", zh: "找到那条根管" },
    subtitle: { en: "Endodontics", zh: "牙髓病学" },
    condition: { requiredFlags: ["match_endo_accepted"] },
    text: {
      en: "You matched into endodontics. Patience, anatomy, and a willingness to stay with the difficult millimeter became your craft.",
      zh: "你匹配到了牙髓病学。耐心、解剖知识，以及和最难的那一毫米周旋到底的意愿，成了你的手艺。",
    },
  },
  {
    id: "career_perio",
    priority: 90,
    title: { en: "The Foundation Matters", zh: "地基很重要" },
    subtitle: { en: "Periodontics", zh: "牙周病学" },
    condition: { requiredFlags: ["match_perio_accepted"] },
    text: {
      en: "You matched into periodontics. You chose the quiet, essential work of protecting the structures that let everything else last.",
      zh: "你匹配到了牙周病学。你选择了那份安静却不可或缺的工作：守住让其他治疗得以长久的基础。",
    },
  },
  {
    id: "career_prostho",
    priority: 90,
    title: { en: "Function, Form, and a Second Draft", zh: "功能、形态，以及人生的第二稿" },
    subtitle: { en: "Prosthodontics", zh: "修复学" },
    condition: { requiredFlags: ["match_prostho_accepted"] },
    text: {
      en: "You matched into prosthodontics. Articulators, occlusion, materials, and human expectations finally became one coherent language.",
      zh: "你匹配到了修复学。颌架、咬合、材料与人的期待，终于在你手里汇成了同一种语言。",
    },
  },
  {
    id: "career_oral_path",
    priority: 90,
    title: { en: "The Clue on the Slide", zh: "切片里的线索" },
    subtitle: { en: "Oral and maxillofacial pathology", zh: "口腔颌面病理" },
    condition: { requiredFlags: ["match_oral_path_accepted"] },
    text: {
      en: "You matched into oral pathology. A strange lesion is no longer just an uncertainty; it is a careful question you know how to pursue.",
      zh: "你匹配到了口腔病理。一个陌生病变不再只意味着不确定；它会变成一道你知道该如何谨慎追查的问题。",
    },
  },
  {
    id: "career_public_health",
    priority: 90,
    title: { en: "Care at the Scale of a City", zh: "把照护做到一座城市的尺度" },
    subtitle: { en: "Dental public health", zh: "牙科公共卫生" },
    condition: { requiredFlags: ["match_public_health_accepted"] },
    text: {
      en: "You entered dental public health. You still care about the person in the chair; now you also work on why some people never reach the chair at all.",
      zh: "你走进了牙科公共卫生。你仍然关心牙椅上的每一个人，也开始处理另一个问题：为什么有些人从来没有机会坐上这把椅子。",
    },
  },
  {
    id: "career_academic",
    priority: 90,
    title: { en: "Questions Worth Keeping", zh: "值得一直追问的问题" },
    subtitle: { en: "Academic dentistry", zh: "学术牙科" },
    condition: { requiredFlags: ["match_academic_accepted"] },
    text: {
      en: "You chose academic dentistry: clinic questions become studies, study results return to the clinic, and students bring better questions than the ones you started with.",
      zh: "你选择了学术牙科：临床问题变成研究，研究结果再回到临床，而学生们会带来比你当初更好的问题。",
    },
  },
  {
    id: "career_gpr_aegd",
    priority: 89,
    title: { en: "One More Year, Much Wider Shoulders", zh: "再练一年，肩膀更稳" },
    subtitle: { en: "GPR / AEGD", zh: "GPR / AEGD 综合进阶训练" },
    condition: { requiredFlags: ["match_gpr_aegd_accepted"] },
    text: {
      en: "You chose a GPR/AEGD year: more complex patients, good supervision, and one more season to turn knowledge into judgment. That is not a detour; it is training on purpose.",
      zh: "你选择了 GPR/AEGD：更复杂的患者、可靠的督导，再用一段时间把知识磨成判断力。这不是绕路，而是有意为之的训练。",
    },
  },
  {
    id: "career_private_practice",
    priority: 88,
    title: { en: "Your Name on the Door", zh: "门上写着你的名字" },
    subtitle: { en: "Private practice", zh: "私人诊所" },
    condition: { requiredFlags: ["match_private_practice_accepted"] },
    text: {
      en: "You stepped into private practice with clinical judgment, a spreadsheet, and healthy respect for both. The office grows one trustworthy decision at a time.",
      zh: "你带着临床判断、一张表格，以及对两者同等的敬意走进私人诊所。诊所靠每一个值得信任的决定慢慢长大。",
    },
  },
  {
    id: "career_associate_then_own",
    priority: 88,
    title: { en: "Learn the Room, Then Build One", zh: "先读懂诊室，再建一间自己的" },
    subtitle: { en: "Associate, then owner", zh: "先做 associate，再成为 owner" },
    condition: { requiredFlags: ["match_associate_then_own_accepted"] },
    text: {
      en: "You chose to learn as an associate before owning. There is wisdom in watching how a practice breathes before deciding what kind of place you want to build.",
      zh: "你选择先以 associate 的身份学习，再考虑成为 owner。先看懂一家诊所如何呼吸，再决定自己想建怎样的地方，这本身就是智慧。",
    },
  },

  // Specialist builds (78-86)
  {
    id: "academic_research",
    priority: 86,
    title: { en: "The Curious Dentist", zh: "好奇的牙医" },
    subtitle: { en: "Always a better question", zh: "永远还有一个更好的问题" },
    condition: {
      minStats: { research: 68, knowledge: 58, reputation: 45 },
      maxStats: { clinicalRecord: 74 },
    },
    text: {
      en: "Clinic taught you which questions matter; research taught you how to stay with an answer that takes time. You graduate fluent in both kinds of uncertainty.",
      zh: "临床教会你哪些问题真正重要，科研教会你如何陪一个需要时间的答案慢慢长成。毕业时，你已经能理解这两种不确定。",
    },
  },
  {
    id: "community_care",
    priority: 85,
    title: { en: "Community Care", zh: "社区里的照护" },
    subtitle: { en: "Showing up where care is needed", zh: "在最需要照护的地方出现" },
    condition: {
      minStats: { publicImpact: 65, empathy: 55, clinicalSense: 48 },
      maxStats: { research: 50 },
    },
    text: {
      en: "You learned that dentistry is also about access, trust, transportation, time off work, and showing up. Your career begins where care has too often stopped.",
      zh: "你明白了牙科也关乎可及性、信任、交通和请假的代价，更关乎愿不愿意真正出现。你的职业生涯，从照护常常中断的地方开始。",
    },
  },
  {
    id: "patient_centered",
    priority: 84,
    title: { en: "Patient Whisperer", zh: "患者的定心丸" },
    subtitle: { en: "Care they remember", zh: "让人记得的照护" },
    condition: {
      minStats: { empathy: 72, clinicalSense: 48, reputation: 48 },
      maxStats: {
        knowledge: 90,
        handSkill: 90,
        research: 65,
        publicImpact: 64,
      },
    },
    text: {
      en: "Patients remember how you explained the hard thing, noticed the clenched hand, and paused without making the pause awkward. Skill brought them in; trust brings them back.",
      zh: "患者记得你如何解释难懂的事，如何注意到攥紧的手，又如何自然地停下来。技术让他们走进诊室，信任让他们愿意回来。",
    },
  },
  {
    id: "steady_hands",
    priority: 85,
    title: { en: "Steady Hands", zh: "稳稳的手" },
    subtitle: { en: "Precise, calm, quietly impressive", zh: "精准、从容、低调地厉害" },
    condition: {
      minStats: { handSkill: 80, clinicalSense: 65, confidence: 55 },
      maxStats: { knowledge: 90, research: 55 },
    },
    text: {
      en: "The millimeters that once haunted you became a language your hands can speak. Your work is precise, your corrections are honest, and your calm is earned.",
      zh: "那些曾经折磨你的毫米，如今成了双手会说的一种语言。你的操作精准，修正坦诚，那份从容也来得有根有据。",
    },
  },
  {
    id: "operator_owner",
    priority: 80,
    title: { en: "The Thoughtful Operator", zh: "会经营，也会照护" },
    subtitle: { en: "A practice is a system of care", zh: "诊所也是一套照护系统" },
    condition: {
      minStats: { money: 190, confidence: 65, reputation: 50 },
      maxStats: { careerReadiness: 75 },
    },
    text: {
      en: "You can read a radiograph and a budget without pretending they are the same problem. You build systems that protect the patient, the team, and the person doing the building.",
      zh: "你既会看影像，也会看预算，而且从不假装它们是同一种问题。你建立的系统会保护患者、团队，也保护那个正在经营这一切的人。",
    },
  },
  {
    id: "teacher",
    priority: 82,
    title: { en: "Leave the Light On", zh: "把灯留给后来的人" },
    subtitle: { en: "The dentist who teaches", zh: "愿意教人的牙医" },
    // Re-expressed for P4. The interim version gated on clinicalSense <= 50,
    // which stopped meaning anything once patient cases raised clinical
    // competence for everyone who reaches D3. A teacher is now identified by
    // what actually distinguishes one: regard *inside* the school rather than
    // a public reputation outside it.
    // Re-expressed for P4. The interim version gated on clinicalSense <= 50,
    // which stopped meaning anything once patient cases raised clinical
    // competence for everyone who reaches D3. A cap on `reputation` was tried
    // and rejected for the same reason G13 exists: reputation saturates, so a
    // cap on it can never fire. What is left is an honest floor — deep
    // knowledge, real warmth, and regard inside the school.
    //
    // No current build reaches it. The systems that should produce a teaching
    // identity are the mentor arc (P5) and the teaching-assistant leadership
    // role (P6); until one of them lands this is authored content waiting for
    // its build, which is recorded rather than hidden.
    condition: {
      minStats: { knowledge: 70, empathy: 55, standing: 58 },
    },
    text: {
      en: "You became the person who can explain the thing without making anyone feel small. Somewhere, a student breathes easier because you remembered what it was like not to know.",
      zh: "你成了那个能把事情讲明白、又不会让人觉得自己很笨的人。因为你没有忘记“不知道”是什么感受，某个学生终于松了一口气。",
    },
  },

  // Relationship / finance (60-70)
  {
    id: "loved_and_grounded",
    priority: 70,
    title: { en: "Loved and Grounded", zh: "被爱着，也站得稳" },
    subtitle: { en: "You let yourself be supported", zh: "你允许自己被支持" },
    condition: {
      minStats: { love: 85, mood: 65, careerReadiness: 65 },
      maxStats: { careerReadiness: 85 },
    },
    text: {
      en: "You became stronger not because someone rescued you, but because you let support be part of the architecture. Some weeks were hard. You did not have to carry them alone.",
      zh: "你变得更强，不是因为有人来拯救你，而是因为你允许支持成为生活结构的一部分。有些周确实很难，但你不必独自扛过。",
    },
  },
  {
    id: "owing_the_future",
    priority: 65,
    title: { en: "Owing the Future", zh: "向未来借来的学费" },
    subtitle: { en: "Debt is a constraint, not a character flaw", zh: "债务是现实约束，不是人格缺点" },
    condition: { requiredFlags: ["high_debt_at_graduation"], maxStats: { money: 30 } },
    text: {
      en: "The diploma is real, and so is the number beside your loans. It may narrow the first set of choices, but it does not define your worth or the whole shape of your future. You make a plan, then take the next humane step.",
      zh: "毕业证是真的，贷款旁边的数字也是真的。它也许会限制最初的一些选择，却不能定义你的价值，更不能概括未来的全部形状。你先做一份计划，再走下一步——对自己也温和一点。",
    },
  },

  // Warm generic fallbacks (50 / 0)
  {
    id: "balanced_dentist",
    priority: 50,
    title: { en: "A Good Dentist, A Whole Person", zh: "一个好牙医，一个完整的人" },
    subtitle: { en: "Balanced, real, and trusted", zh: "平衡、真实、值得信任" },
    condition: {
      minStats: {
        knowledge: 54,
        handSkill: 54,
        clinicalSense: 52,
        empathy: 52,
        mood: 45,
      },
      maxStats: { stress: 82 },
    },
    text: {
      en: "You did not max every stat. You did something harder: learned, cared, adapted, rested, made mistakes, repaired them, and kept going. Patients trust you because you are careful, warm, and real.",
      zh: "你没有把每一项都拉满。你做了更难的事：学习、在意、调整、休息、犯错、修正，然后继续走下去。患者信任你，因为你认真、温暖、真实。",
    },
  },
  {
    id: "graduation_default",
    priority: 0,
    title: { en: "Graduation Day", zh: "毕业那天" },
    subtitle: { en: "Someone who can keep growing", zh: "一个还能继续成长的人" },
    condition: {},
    text: {
      en: "The path was messy, funny, exhausting, and meaningful. You made it through dental school. You do not need a perfect build to deserve the white coat or the chance to keep growing into it.",
      zh: "这条路又乱、又好笑、又累人，也很有意义。你读完了牙学院。你不需要一套完美的能力值，才配得上这件白袍，或配得上继续成长的机会。",
    },
  },
];
