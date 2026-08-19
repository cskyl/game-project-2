import type { PatientCase } from "../game/types";

// ---------------------------------------------------------------------------
// Patient cases (§5.2).
//
// Authoring rules:
//   - Three steps, always history -> diagnosis -> plan.
//   - Wrong options are positions a real student could defend. Never strawmen.
//   - `feedback` is where the case teaches; it fires whatever the player chose.
//   - Best answers are NOT always listed first. Bots and skim-readers should not
//     be able to score well by position.
//   - A few cases have no clean "best" — only an honest one. Those are the ones
//     that stay with you.
//
// Fictionalized for a game. Not a clinical reference.
// ---------------------------------------------------------------------------

export const CASES: PatientCase[] = [
  {
    id: "case_pulpitis_lower_molar",
    patient: {
      name: { en: "Marcus, 34", zh: "Marcus，34 岁" },
      age: 34,
      chiefComplaint: {
        en: "“The bottom right one throbs at night. Cold makes it scream.”",
        zh: "“右下那颗晚上一跳一跳地疼。碰到凉的更是钻心。”",
      },
    },
    stage: ["clinical", "advanced"],
    minSemester: 7,
    difficulty: 6,
    tags: ["endo", "pain"],
    execution: [
      { stat: "clinicalSense", weight: 0.45 },
      { stat: "handSkill", weight: 0.3 },
      { stat: "empathy", weight: 0.25 },
    ],
    steps: [
      {
        id: "history",
        kind: "history",
        prompt: {
          en: "He is tired and a little short with you. What do you do first?",
          zh: "他很疲惫，说话有点冲。你先做什么？",
        },
        options: [
          {
            id: "cold_test",
            quality: "best",
            text: {
              en: "Cold test both sides, and time how long the pain lingers.",
              zh: "两侧都做冷诊，并计时疼痛持续多久。",
            },
            feedback: {
              en: "Lingering over thirty seconds after the stimulus leaves is the finding that separates reversible from irreversible. You have your answer before you touch a handpiece.",
              zh: "刺激移除后疼痛持续超过三十秒——正是这一点把可复性和不可复性分开。你还没碰到手机就已经有答案了。",
            },
          },
          {
            id: "straight_to_xray",
            quality: "ok",
            text: {
              en: "Take a periapical radiograph and read it before asking anything else.",
              zh: "先拍根尖片，看完再问其他。",
            },
            feedback: {
              en: "The film is necessary, but it shows you the bone, not the pulp. A radiograph can look calm while the pulp is dying.",
              zh: "片子是必要的，但它显示的是骨，不是牙髓。牙髓在坏死时，片子也可能看起来风平浪静。",
            },
          },
          {
            id: "assume_and_numb",
            quality: "poor",
            text: {
              en: "He is clearly in pain. Get him numb first, ask questions after.",
              zh: "他明显很疼。先给他打麻药，问题等会儿再问。",
            },
            feedback: {
              en: "Anaesthetic before diagnosis takes away the symptom you were about to use to find the tooth. Now nothing tests true.",
              zh: "诊断前先麻醉，等于拿走了你本来用来定位患牙的症状。现在什么检查都不准了。",
            },
            effects: { clinicalSense: -1 },
          },
        ],
      },
      {
        id: "diagnosis",
        kind: "diagnosis",
        prompt: {
          en: "Cold lingers ninety seconds. Percussion is mildly tender. No swelling, no sinus tract.",
          zh: "冷诊后疼痛持续九十秒。叩诊轻度不适。无肿胀，无窦道。",
        },
        options: [
          {
            id: "reversible",
            quality: "poor",
            text: {
              en: "Reversible pulpitis. Place a sedative filling and review in two weeks.",
              zh: "可复性牙髓炎。做安抚充填，两周后复查。",
            },
            feedback: {
              en: "Reversible pulpitis does not keep someone awake and does not linger for ninety seconds. He will be back, angrier and in more pain.",
              zh: "可复性牙髓炎不会让人整夜睡不着，也不会持续九十秒。他会回来的，更生气、更疼。",
            },
          },
          {
            id: "irreversible_apical",
            quality: "best",
            text: {
              en: "Symptomatic irreversible pulpitis with symptomatic apical periodontitis.",
              zh: "症状性不可复性牙髓炎，伴症状性根尖周炎。",
            },
            feedback: {
              en: "Lingering cold plus percussion tenderness names it exactly: the pulp will not recover, and the inflammation has reached the ligament.",
              zh: "冷诊持续加叩痛，正好指向这个诊断：牙髓无法恢复，炎症已经波及牙周膜。",
            },
          },
          {
            id: "cracked",
            quality: "ok",
            text: {
              en: "Cracked tooth syndrome. Check with a bite stick before committing.",
              zh: "牙隐裂综合征。先用咬诊棒验证再下结论。",
            },
            feedback: {
              en: "Worth ruling out and cheap to test, but a crack usually bites sharp on release rather than throbbing all night on its own.",
              zh: "值得排除，验证成本也低。但隐裂通常是松咬时的锐痛，而不是整夜自发跳痛。",
            },
          },
        ],
      },
      {
        id: "plan",
        kind: "plan",
        prompt: {
          en: "He asks what it costs and whether he can just have it out today.",
          zh: "他问要多少钱，以及能不能今天直接拔掉。",
        },
        options: [
          {
            id: "extract_now",
            quality: "poor",
            text: {
              en: "He asked for extraction. Take it out.",
              zh: "他要求拔牙。那就拔。",
            },
            feedback: {
              en: "Consent is not the same as informed consent. He has not heard what losing a first molar does to the arch over the next ten years.",
              zh: "同意不等于知情同意。他还没听过失去一颗第一磨牙，未来十年会对牙弓意味着什么。",
            },
            effects: { empathy: -2 },
          },
          {
            id: "rct_options",
            quality: "best",
            text: {
              en: "Explain both paths honestly, with costs, then let him choose.",
              zh: "把两条路和费用都如实讲清楚，然后让他自己选。",
            },
            feedback: {
              en: "Root canal and crown, or extraction with a plan for the space. He picks endodontics once he understands the gap is not free either.",
              zh: "根管加冠，或者拔牙并规划缺牙间隙。当他明白“留个空”也不是免费的，他选择了根管。",
            },
            effects: { empathy: 2 },
          },
          {
            id: "pulpotomy_tonight",
            quality: "ok",
            text: {
              en: "Get him out of pain tonight with a pulpotomy, decide next visit.",
              zh: "今晚先做牙髓摘除让他不疼，下次复诊再定方案。",
            },
            feedback: {
              en: "Defensible and kind: pain first, decisions when he can think. It costs you a visit, and he may not come back for the rest.",
              zh: "站得住脚，也够体贴：先止痛，等他能思考时再决定。代价是多一次复诊，而且他可能不会回来做完。",
            },
          },
        ],
      },
    ],
    outcomes: {
      excellent: {
        text: {
          en: "Access, working length, obturation — all in one calm appointment. He shakes your hand on the way out and says he actually slept.",
          zh: "开髓、工作长度、根充——在一次从容的就诊里全部完成。他离开时和你握手，说他终于睡了个好觉。",
        },
        effects: { clinicalSense: 4, confidence: 3, reputation: 3, standing: 2, money: 6, stress: 2 },
      },
      good: {
        text: {
          en: "A ledge in the mesial canal costs you twenty minutes, but the fill is sound and he leaves comfortable.",
          zh: "近中根管出现一处台阶，多花了二十分钟，但根充质量可靠，他舒适地离开了。",
        },
        effects: { clinicalSense: 2, confidence: 1, reputation: 1, money: 4, stress: 3 },
      },
      rough: {
        text: {
          en: "You run out of chair time and dress it for a second visit. He is polite about it, which somehow makes it worse.",
          zh: "椅位时间用完了，你做了封药，约了第二次。他很客气——不知为何这让你更难受。",
        },
        effects: { clinicalSense: 1, confidence: -2, stress: 6, money: 2 },
      },
      bad: {
        text: {
          en: "A separated file in the distal canal. Your attending is kind about it and that is the part you replay at 2am.",
          zh: "远中根管里断了一根锉。带教老师对此很宽容——而这正是你凌晨两点反复回想的部分。",
        },
        effects: { confidence: -5, reputation: -2, stress: 10, mood: -4, clinicalSense: 2 },
      },
    },
  },

  {
    id: "case_perio_staging",
    patient: {
      name: { en: "Denise, 52", zh: "Denise，52 岁" },
      age: 52,
      chiefComplaint: {
        en: "“My gums bleed when I brush. My last dentist said it was normal.”",
        zh: "“我刷牙会出血。上一个牙医说这很正常。”",
      },
    },
    stage: ["clinical", "advanced"],
    minSemester: 7,
    difficulty: 8,
    tags: ["perio"],
    execution: [
      { stat: "clinicalSense", weight: 0.4 },
      { stat: "empathy", weight: 0.35 },
      { stat: "knowledge", weight: 0.25 },
    ],
    steps: [
      {
        id: "history",
        kind: "history",
        prompt: {
          en: "She is embarrassed and apologising before she sits down.",
          zh: "她还没坐下就开始道歉，显得很难为情。",
        },
        options: [
          {
            id: "full_charting",
            quality: "best",
            text: {
              en: "Full six-point charting, bleeding on probing, and ask about smoking and diabetes.",
              zh: "全口六点位牙周检查、探诊出血，并询问吸烟史和糖尿病史。",
            },
            feedback: {
              en: "Staging needs the numbers and grading needs the risk factors. Without both you are guessing at how fast this is moving.",
              zh: "分期需要数值，分级需要危险因素。两者缺一，你就只是在猜它进展得有多快。",
            },
          },
          {
            id: "scale_and_see",
            quality: "poor",
            text: {
              en: "Scale and polish today, see how the gums look in three months.",
              zh: "今天先洁治抛光，三个月后看看牙龈情况。",
            },
            feedback: {
              en: "This is what her last dentist did. Doing it again without measuring is how ten years of attachment loss goes unrecorded.",
              zh: "这正是她上一个牙医做的。不测量就重复一遍，十年的附着丧失就是这样被漏记的。",
            },
            effects: { clinicalSense: -1 },
          },
          {
            id: "reassure_first",
            quality: "ok",
            text: {
              en: "Tell her bleeding gums are never normal, then start examining.",
              zh: "先告诉她牙龈出血从来都不正常，然后开始检查。",
            },
            feedback: {
              en: "She needed to hear that. It buys you the trust to do a probing she will find uncomfortable.",
              zh: "她需要听到这句话。这换来了信任，让她愿意配合一次并不舒服的探诊。",
            },
            effects: { empathy: 2 },
          },
        ],
      },
      {
        id: "diagnosis",
        kind: "diagnosis",
        prompt: {
          en: "Interdental attachment loss 4mm, 35% bone loss on radiographs, no tooth loss, she smokes ten a day.",
          zh: "邻面附着丧失 4mm，影像学骨吸收 35%，未失牙，每天吸烟十支。",
        },
        options: [
          {
            id: "stage_iii_grade_c",
            quality: "best",
            text: {
              en: "Stage III, Grade C periodontitis — the smoking drives the grade.",
              zh: "III 期 C 级牙周炎——吸烟决定了分级。",
            },
            feedback: {
              en: "Bone loss beyond a third stages it, and a smoker at ten a day grades it C. The grade is the part that tells her this is fast.",
              zh: "骨吸收超过三分之一定了分期，每天十支烟定了 C 级。分级才是告诉她“这进展很快”的那部分。",
            },
          },
          {
            id: "gingivitis",
            quality: "poor",
            text: {
              en: "Generalised gingivitis. Reinforce brushing technique.",
              zh: "广泛性龈炎。强化刷牙方法指导。",
            },
            feedback: {
              en: "Gingivitis does not eat 35% of the bone. Calling this gingivitis is how she lost the last decade.",
              zh: "龈炎不会吃掉 35% 的骨。把这个叫龈炎，正是她失去过去十年的原因。",
            },
          },
          {
            id: "stage_iii_grade_b",
            quality: "ok",
            text: {
              en: "Stage III, Grade B. Treat and reassess the rate later.",
              zh: "III 期 B 级。先治疗，之后再评估进展速度。",
            },
            feedback: {
              en: "The staging is right and the treatment barely changes. But grading her B quietly drops the smoking conversation she most needs.",
              zh: "分期是对的，治疗方案也几乎不变。但定成 B 级，等于悄悄跳过了她最需要的那场关于吸烟的谈话。",
            },
          },
        ],
      },
      {
        id: "plan",
        kind: "plan",
        prompt: {
          en: "She asks, quietly, whether she is going to lose her teeth.",
          zh: "她小声问：她是不是要掉牙了。",
        },
        options: [
          {
            id: "honest_and_specific",
            quality: "best",
            text: {
              en: "“Not if we start now” — then explain what “starting” actually involves.",
              zh: "“只要现在开始就不会”——然后解释“开始”具体意味着什么。",
            },
            feedback: {
              en: "Non-surgical therapy quadrant by quadrant, re-evaluation at eight weeks, and a real conversation about the cigarettes. She books all four.",
              zh: "分区进行非手术治疗，八周后复评，再加一场关于香烟的真实谈话。四个区她全约了。",
            },
            effects: { empathy: 2, reputation: 1 },
          },
          {
            id: "soften_it",
            quality: "poor",
            text: {
              en: "Tell her not to worry, most people keep their teeth these days.",
              zh: "告诉她别担心，现在大多数人都能保住牙。",
            },
            feedback: {
              en: "Kindly meant, and it removes the one thing that would have made her quit smoking. Comfort is not always care.",
              zh: "出于好意，却拿走了唯一能让她戒烟的那个理由。安慰并不总是照护。",
            },
          },
          {
            id: "refer_out",
            quality: "ok",
            text: {
              en: "Refer to periodontics — Grade C deserves a specialist.",
              zh: "转诊牙周专科——C 级值得专科医生处理。",
            },
            feedback: {
              en: "Not wrong, and Grade C is a real referral. But she came to you, and initial therapy is squarely within what you can do.",
              zh: "不算错，C 级确实是合理的转诊指征。但她是来找你的，而初期治疗完全在你的能力范围内。",
            },
          },
        ],
      },
    ],
    outcomes: {
      excellent: {
        text: {
          en: "At eight weeks her bleeding score has dropped from 68% to 12%, and she tells you she is down to two a day.",
          zh: "八周复评时，她的出血指数从 68% 降到 12%，她还告诉你现在一天只抽两支了。",
        },
        effects: { clinicalSense: 3, empathy: 2, reputation: 2, standing: 3, money: 5 },
      },
      good: {
        text: {
          en: "Solid debridement, real improvement, and two residual pockets that will need another look.",
          zh: "彻底的龈下刮治，改善明显，还剩两个牙周袋需要再处理。",
        },
        effects: { clinicalSense: 2, empathy: 1, money: 4, stress: 2 },
      },
      rough: {
        text: {
          en: "You run long, she gets sore, and she cancels the second quadrant.",
          zh: "你超时了，她觉得难受，取消了第二个区的预约。",
        },
        effects: { confidence: -2, stress: 5, empathy: 1, money: 2 },
      },
      bad: {
        text: {
          en: "She does not rebook. Six months later you see her name on someone else's schedule, for an extraction.",
          zh: "她没有再约。六个月后，你在别人的预约表上看到她的名字——拔牙。",
        },
        effects: { confidence: -4, reputation: -2, mood: -5, stress: 6, empathy: 2 },
      },
    },
  },

  {
    id: "case_pediatric_behavior",
    patient: {
      name: { en: "Amara, 6", zh: "Amara，6 岁" },
      age: 6,
      chiefComplaint: {
        en: "Two cavities found at a school screening. She has never been to a dentist.",
        zh: "学校筛查发现两颗龋齿。她从没看过牙医。",
      },
    },
    stage: ["clinical", "advanced"],
    minSemester: 7,
    difficulty: 10,
    tags: ["pedo", "behavior"],
    execution: [
      { stat: "empathy", weight: 0.5 },
      { stat: "handSkill", weight: 0.25 },
      { stat: "clinicalSense", weight: 0.25 },
    ],
    steps: [
      {
        id: "history",
        kind: "history",
        prompt: {
          en: "She is gripping the chair arms. Her mother keeps saying “it won't hurt, right?”",
          zh: "她死死抓着椅子扶手。她妈妈一直在说“不会疼的对吧？”",
        },
        options: [
          {
            id: "tell_show_do",
            quality: "best",
            text: {
              en: "Tell-show-do with the mirror first. Let her hold it.",
              zh: "先用口镜做“讲解—演示—操作”。让她自己拿着。",
            },
            feedback: {
              en: "The first appointment is not about the cavities. It is about whether she will ever come back.",
              zh: "第一次就诊不是为了那两颗龋。是为了她以后还愿不愿意来。",
            },
            effects: { empathy: 1 },
          },
          {
            id: "promise_no_pain",
            quality: "poor",
            text: {
              en: "Agree with her mother — promise it will not hurt at all.",
              zh: "顺着她妈妈的话——保证一点都不会疼。",
            },
            feedback: {
              en: "The moment anything pinches, you have become a liar to a six-year-old, and every dentist after you inherits it.",
              zh: "只要有一下刺痛，你在一个六岁孩子眼里就成了骗子——而后面每一个牙医都要替你承担这个后果。",
            },
            effects: { empathy: -2 },
          },
          {
            id: "mother_out",
            quality: "ok",
            text: {
              en: "Ask the mother to wait outside so the anxiety stops bouncing between them.",
              zh: "请妈妈到外面等，让焦虑不再在两人之间来回传染。",
            },
            feedback: {
              en: "Sometimes exactly right, sometimes the thing that starts the screaming. At six, with a first visit, it is a gamble.",
              zh: "有时候完全正确，有时候正是尖叫的开始。六岁、第一次就诊，这是一场赌博。",
            },
          },
        ],
      },
      {
        id: "diagnosis",
        kind: "diagnosis",
        prompt: {
          en: "Two occlusal lesions in primary molars, into dentine, no pulpal signs. She will open, briefly.",
          zh: "两颗乳磨牙咬合面龋损，已达牙本质，无牙髓症状。她愿意张口，但坚持不了多久。",
        },
        options: [
          {
            id: "hall_or_art",
            quality: "best",
            text: {
              en: "Minimally invasive: Hall crown or ART restoration, no local anaesthetic.",
              zh: "微创方案：Hall 冠或非创伤性修复（ART），不打局麻。",
            },
            feedback: {
              en: "Seal the lesion, skip the needle, keep her cooperative for the next twelve years of dental visits. The evidence is on your side.",
              zh: "封闭龋损、避开针头，保住她未来十二年就诊的配合度。循证也站在你这边。",
            },
          },
          {
            id: "full_prep",
            quality: "ok",
            text: {
              en: "Conventional preparation and composite, with local anaesthetic.",
              zh: "常规备洞加复合树脂充填，配合局麻。",
            },
            feedback: {
              en: "Textbook and durable. It also means a needle at a first visit, which is a lot to ask of her today.",
              zh: "教科书式，也耐用。但这意味着第一次就诊就要打针，对今天的她来说要求太高了。",
            },
          },
          {
            id: "refer_ga",
            quality: "poor",
            text: {
              en: "She is too anxious. Refer for treatment under general anaesthetic.",
              zh: "她太焦虑了。转诊全麻下治疗。",
            },
            feedback: {
              en: "General anaesthetic carries real risk and a long wait, for two lesions that a Hall crown handles in ten minutes. Save it for the children who truly need it.",
              zh: "全麻有真实风险，还要排很久的队——而这两颗龋，Hall 冠十分钟就能解决。把全麻留给真正需要的孩子。",
            },
          },
        ],
      },
      {
        id: "plan",
        kind: "plan",
        prompt: {
          en: "Her mother mentions, almost in passing, that Amara drinks juice from a bottle at night.",
          zh: "她妈妈几乎是随口提到，Amara 晚上会用奶瓶喝果汁。",
        },
        options: [
          {
            id: "coach_without_blame",
            quality: "best",
            text: {
              en: "Take the opening. Talk about the bottle without making her the villain.",
              zh: "抓住这个话头。谈奶瓶的问题，但不要把妈妈变成罪人。",
            },
            feedback: {
              en: "Blame closes the conversation and the cavities keep coming. She swaps the juice for water that week because you did not shame her.",
              zh: "指责会让对话终止，而龋齿还会继续。正因为你没有羞辱她，那一周她就把果汁换成了水。",
            },
            effects: { empathy: 2, publicImpact: 1 },
          },
          {
            id: "note_it",
            quality: "ok",
            text: {
              en: "Note it in the record and cover diet properly at the review visit.",
              zh: "记入病历，复诊时再系统地谈饮食问题。",
            },
            feedback: {
              en: "Reasonable — today is already full. The risk is that the review never happens.",
              zh: "合理，今天确实已经排满了。风险是那次复诊可能永远不会发生。",
            },
          },
          {
            id: "lecture",
            quality: "poor",
            text: {
              en: "Explain firmly that night-time juice is why her daughter has cavities.",
              zh: "严肃地告诉她，她女儿长龋就是因为晚上喝果汁。",
            },
            feedback: {
              en: "True, and useless. She stops volunteering information, and the next thing you needed to know goes unmentioned.",
              zh: "是实话，也毫无用处。她从此不再主动提供信息，而你下一件需要知道的事就再没人说了。",
            },
            effects: { empathy: -1 },
          },
        ],
      },
    ],
    outcomes: {
      excellent: {
        text: {
          en: "Two Hall crowns, no tears, and she high-fives you at the door. Her mother books the whole family.",
          zh: "两个 Hall 冠，全程没哭，走的时候她还和你击了个掌。她妈妈把全家人都约上了。",
        },
        effects: { empathy: 3, confidence: 3, reputation: 2, standing: 2, money: 4 },
      },
      good: {
        text: {
          en: "One crown placed, one deferred. She was done being brave, and that is a fair place to stop.",
          zh: "放了一个冠，另一个延后。她的勇气用完了——在这里停下是合理的。",
        },
        effects: { empathy: 2, clinicalSense: 1, money: 2, stress: 3 },
      },
      rough: {
        text: {
          en: "She cried through most of it. The crown is seated, but you are not sure she will come back.",
          zh: "她几乎全程都在哭。冠是戴上了，但你不确定她还会不会回来。",
        },
        effects: { empathy: 1, confidence: -2, stress: 7, mood: -3, money: 2 },
      },
      bad: {
        text: {
          en: "Nothing got done. She would not open again after the first attempt, and everyone left tired.",
          zh: "什么都没做成。第一次尝试之后她再也不肯张口，所有人都疲惫地离开了。",
        },
        effects: { confidence: -4, stress: 8, mood: -4, empathy: 2 },
      },
    },
  },

  {
    id: "case_cost_barrier",
    patient: {
      name: { en: "Ray, 61", zh: "Ray，61 岁" },
      age: 61,
      chiefComplaint: {
        en: "“Just tell me the cheapest thing that stops it hurting.”",
        zh: "“你就告诉我最便宜的、能让它别疼的办法。”",
      },
    },
    stage: ["clinical", "advanced"],
    minSemester: 8,
    difficulty: 12,
    tags: ["ethics", "access"],
    execution: [
      { stat: "empathy", weight: 0.4 },
      { stat: "clinicalSense", weight: 0.35 },
      { stat: "reputation", weight: 0.25 },
    ],
    steps: [
      {
        id: "history",
        kind: "history",
        prompt: {
          en: "He works two jobs and has no dental insurance. Upper left is broken down to the gum.",
          zh: "他打两份工，没有牙科保险。左上那颗已经断到牙龈水平。",
        },
        options: [
          {
            id: "ask_what_he_can_do",
            quality: "best",
            text: {
              en: "Ask directly what he can manage — money, and time off work.",
              zh: "直接问他能承担什么——钱，还有能请多少假。",
            },
            feedback: {
              en: "A plan he cannot afford is not a plan. Asking early stops you designing something he will abandon halfway.",
              zh: "他负担不起的方案不是方案。早点问，能避免你设计出一个他中途就放弃的东西。",
            },
            effects: { empathy: 2 },
          },
          {
            id: "ideal_first",
            quality: "ok",
            text: {
              en: "Work up the ideal treatment plan first, then discuss compromises.",
              zh: "先做出理想治疗方案，再讨论如何折中。",
            },
            feedback: {
              en: "The textbook order, and it does document what he is choosing against. It also spends his chair time on a plan you both know is fiction.",
              zh: "教科书的顺序，也确实记录了他放弃的是什么。但这也把他的椅位时间花在了一个你俩都知道不现实的方案上。",
            },
          },
          {
            id: "assume_extraction",
            quality: "poor",
            text: {
              en: "He said cheapest. Book the extraction.",
              zh: "他说了要最便宜的。约拔牙。",
            },
            feedback: {
              en: "Maybe extraction is right. But you decided it for him, and you never found out he has a daughter's wedding in April.",
              zh: "也许拔牙确实是对的。但这是你替他决定的——你也就永远不会知道，他女儿四月要结婚。",
            },
            effects: { empathy: -2 },
          },
        ],
      },
      {
        id: "diagnosis",
        kind: "diagnosis",
        prompt: {
          en: "Non-restorable without crown lengthening and a post-core. He can find about a fifth of that.",
          zh: "不做冠延长和桩核就无法修复。而他大概只能拿出五分之一的费用。",
        },
        options: [
          {
            id: "name_the_constraint",
            quality: "best",
            text: {
              en: "Say it plainly: the ideal plan exists, and it is out of reach today.",
              zh: "直说：理想方案是存在的，但今天够不着。",
            },
            feedback: {
              en: "Naming the constraint out loud is what lets you plan honestly inside it, instead of pretending the constraint is a preference.",
              zh: "把限制说出口，才能在限制之内诚实地做规划，而不是假装那只是个人偏好。",
            },
          },
          {
            id: "payment_plan",
            quality: "ok",
            text: {
              en: "Look into a payment plan and the school's reduced-fee clinic.",
              zh: "了解一下分期付款，以及学校的减免费用门诊。",
            },
            feedback: {
              en: "Worth doing, and sometimes it works. Waiting lists are long, and the tooth is hurting now.",
              zh: "值得一试，有时确实管用。但排队很长，而牙现在就在疼。",
            },
            effects: { publicImpact: 1 },
          },
          {
            id: "discount_quietly",
            quality: "poor",
            text: {
              en: "Quietly do the work at cost and absorb it yourself.",
              zh: "私下按成本价做，自己贴钱补上。",
            },
            feedback: {
              en: "Generous, and it does not scale past one patient. It also hides a systems problem that your clinic should be recording.",
              zh: "很慷慨，但它只能救一个人。它还掩盖了一个本该被诊所记录下来的系统性问题。",
            },
          },
        ],
      },
      {
        id: "plan",
        kind: "plan",
        prompt: {
          en: "There is no textbook answer here. There is only an honest one.",
          zh: "这里没有教科书答案。只有一个诚实的答案。",
        },
        options: [
          {
            id: "extract_with_plan",
            quality: "best",
            text: {
              en: "Extract, document the ideal plan he declined, and plan the space properly.",
              zh: "拔除，记录他放弃的理想方案，并认真规划缺牙间隙。",
            },
            feedback: {
              en: "Extraction is not a failure when it is chosen with full information and a plan for what comes after. Write down what he chose against — it protects you both.",
              zh: "在充分知情并规划好后续的前提下，拔牙不是失败。把他放弃的方案写清楚——这保护你们双方。",
            },
            effects: { clinicalSense: 2 },
          },
          {
            id: "temporise",
            quality: "ok",
            text: {
              en: "Dress it, get him out of pain, and give him a month to find the money.",
              zh: "先做安抚封药止痛，给他一个月时间凑钱。",
            },
            feedback: {
              en: "Buys time, and time occasionally helps. It also risks him returning with an abscess and one fewer option.",
              zh: "争取了时间，而时间偶尔真的有用。但也有风险：他可能带着脓肿回来，选择又少一个。",
            },
          },
          {
            id: "guilt_him",
            quality: "poor",
            text: {
              en: "Explain how much more it will cost him if he waits.",
              zh: "跟他讲清楚，如果拖下去会贵多少。",
            },
            feedback: {
              en: "He already knows. People without money are not confused about money; the lecture only adds shame to the bill.",
              zh: "他早就知道了。没钱的人对钱这件事一点都不糊涂——这番说教只是在账单上又加了一份羞耻。",
            },
            effects: { empathy: -2 },
          },
        ],
      },
    ],
    outcomes: {
      excellent: {
        text: {
          en: "Clean surgical extraction, sutures, and a written plan for a partial denture when he can. He thanks you for not making him feel small.",
          zh: "干净的手术拔除、缝合，还有一份等他有条件时做局部义齿的书面计划。他谢谢你没有让他觉得低人一等。",
        },
        effects: { clinicalSense: 3, empathy: 2, publicImpact: 2, reputation: 2, standing: 2, money: 3 },
      },
      good: {
        text: {
          en: "The root fractures and takes longer than planned, but he leaves out of pain and with a plan.",
          zh: "牙根断了，比预计花的时间长，但他离开时不疼了，也带走了一份计划。",
        },
        effects: { clinicalSense: 2, empathy: 1, money: 2, stress: 4 },
      },
      rough: {
        text: {
          en: "A dry socket brings him back on his one day off. He is gracious. You feel worse than if he had shouted.",
          zh: "干槽症让他在唯一的休息日又跑了一趟。他很客气——你反而比他冲你发火还难受。",
        },
        effects: { empathy: 1, confidence: -2, stress: 6, mood: -2 },
      },
      bad: {
        text: {
          en: "You are still explaining costs when his chair time ends. He leaves in pain, with nothing done, and does not rebook.",
          zh: "你还在解释费用，他的椅位时间就到了。他带着疼痛离开，什么都没做，也没有再约。",
        },
        effects: { confidence: -4, reputation: -2, mood: -5, stress: 7 },
      },
    },
  },

  {
    id: "case_anticoagulant",
    patient: {
      name: { en: "Halina, 74", zh: "Halina，74 岁" },
      age: 74,
      chiefComplaint: {
        en: "“The loose one at the front. My doctor says I'm on a blood thinner.”",
        zh: "“前面那颗松了。我的内科医生说我在吃抗凝药。”",
      },
    },
    stage: ["clinical", "advanced"],
    minSemester: 8,
    difficulty: 11,
    tags: ["surgery", "medical"],
    execution: [
      { stat: "knowledge", weight: 0.4 },
      { stat: "clinicalSense", weight: 0.35 },
      { stat: "handSkill", weight: 0.25 },
    ],
    steps: [
      {
        id: "history",
        kind: "history",
        prompt: {
          en: "She brought a carrier bag of medication boxes and tipped it onto your desk.",
          zh: "她带来一整袋药盒，直接倒在你桌上。",
        },
        options: [
          {
            id: "identify_the_drug",
            quality: "best",
            text: {
              en: "Work out exactly which anticoagulant, the dose, and when she last took it.",
              zh: "查清楚究竟是哪种抗凝药、剂量多少、最后一次服药是什么时候。",
            },
            feedback: {
              en: "“Blood thinner” covers warfarin, a DOAC and aspirin, and they are managed completely differently. The name is the whole question.",
              zh: "“血液稀释剂”可以指华法林、DOAC 或阿司匹林，处理方式完全不同。药名本身就是全部问题所在。",
            },
          },
          {
            id: "ask_her_to_stop",
            quality: "poor",
            text: {
              en: "Ask her to stop the anticoagulant for three days before the extraction.",
              zh: "让她在拔牙前停用抗凝药三天。",
            },
            feedback: {
              en: "She is anticoagulated for a reason. Stopping it risks a stroke to avoid a bleed you can almost always manage locally.",
              zh: "她吃抗凝药是有原因的。为了避免一次几乎总能局部处理的出血而停药，是在拿卒中风险去换。",
            },
            effects: { knowledge: -1 },
          },
          {
            id: "call_gp",
            quality: "ok",
            text: {
              en: "Phone her physician before deciding anything.",
              zh: "在做任何决定之前先给她的内科医生打电话。",
            },
            feedback: {
              en: "Safe, and appropriate for a complex case. It also delays a simple extraction that current guidance says you can do without stopping anything.",
              zh: "稳妥，对复杂病例也确实合适。但它也拖延了一次简单拔牙——而现行指南说这种情况不需要停药。",
            },
          },
        ],
      },
      {
        id: "diagnosis",
        kind: "diagnosis",
        prompt: {
          en: "Warfarin, INR checked yesterday at 2.4. Grade III mobility, hopeless prognosis, single-rooted.",
          zh: "华法林，昨天查 INR 为 2.4。III 度松动，预后无望，单根牙。",
        },
        options: [
          {
            id: "proceed_local",
            quality: "best",
            text: {
              en: "INR under 4.0 — proceed, with local haemostatic measures ready.",
              zh: "INR 低于 4.0——可以进行，同时备好局部止血措施。",
            },
            feedback: {
              en: "Below 4.0 a simple extraction goes ahead without altering her warfarin. Sutures, a haemostatic dressing and firm packing handle the rest.",
              zh: "INR 低于 4.0 时，简单拔牙无需调整华法林即可进行。缝合、止血敷料和确切压迫足以应付其余。",
            },
          },
          {
            id: "postpone",
            quality: "poor",
            text: {
              en: "Too risky in a student clinic. Postpone and refer to oral surgery.",
              zh: "在学生门诊风险太高。延期并转诊口腔外科。",
            },
            feedback: {
              en: "A Grade III single-rooted tooth at INR 2.4 is a routine extraction. Referring it teaches you to fear a patient group you will see every week.",
              zh: "INR 2.4 的 III 度松动单根牙是常规拔牙。把它转出去，只会让你害怕一个你以后每周都会遇到的患者群体。",
            },
          },
          {
            id: "recheck_inr",
            quality: "ok",
            text: {
              en: "Recheck the INR today before touching anything.",
              zh: "今天再复查一次 INR，然后再动手。",
            },
            feedback: {
              en: "Careful, and a same-day INR is ideal. Yesterday's is within the usual 72-hour window for a stable patient, so this mostly costs her a trip.",
              zh: "谨慎，当日 INR 确实最理想。但对病情稳定的患者，昨天的结果仍在通常的 72 小时窗口内——所以这主要是让她多跑一趟。",
            },
          },
        ],
      },
      {
        id: "plan",
        kind: "plan",
        prompt: {
          en: "She lives alone and takes two buses to get here.",
          zh: "她独居，来这里要换两趟公交。",
        },
        options: [
          {
            id: "haemostasis_and_instructions",
            quality: "best",
            text: {
              en: "Suture, pack, and give her written instructions plus a number to call tonight.",
              zh: "缝合、填塞，给她书面医嘱，以及一个今晚可以打的电话号码。",
            },
            feedback: {
              en: "Local haemostasis is most of the safety. Someone to call at 9pm is the rest, and it matters more because she lives alone.",
              zh: "局部止血解决了大部分安全问题。剩下的那部分，是晚上九点有人可以打电话——而她独居，这一点更重要。",
            },
          },
          {
            id: "just_gauze",
            quality: "poor",
            text: {
              en: "Standard gauze pressure and the usual verbal advice.",
              zh: "常规纱布压迫，加口头医嘱。",
            },
            feedback: {
              en: "Adequate for most patients. She is 74, anticoagulated and alone; this is precisely the patient who needs sutures and something in writing.",
              zh: "对大多数患者够用。但她 74 岁、在用抗凝药、独居——恰恰是最需要缝合和书面医嘱的那类患者。",
            },
          },
          {
            id: "admit_overnight",
            quality: "ok",
            text: {
              en: "Arrange for her to be observed rather than sending her home alone.",
              zh: "安排留观，而不是让她一个人回家。",
            },
            feedback: {
              en: "Thoughtful about the thing that actually worries you. It is also a lot of resource for a bleed that packing will stop.",
              zh: "你确实抓住了真正让你担心的点。但对一个压迫就能止住的出血来说，这动用的资源太多了。",
            },
          },
        ],
      },
    ],
    outcomes: {
      excellent: {
        text: {
          en: "Out in one piece, sutured, haemostasis achieved in the chair. She calls the next morning to say it was fine — and to thank you for the number.",
          zh: "完整拔出、缝合，椅旁即达到止血。第二天早上她打电话来说一切都好——顺便谢谢你留的号码。",
        },
        effects: { knowledge: 3, clinicalSense: 4, confidence: 3, reputation: 3, standing: 3, money: 4 },
      },
      good: {
        text: {
          en: "Slower ooze than you would like, but packing and a second suture settle it before she leaves.",
          zh: "渗血比你希望的慢一些，但在她离开前，填塞加第二针缝合止住了。",
        },
        effects: { clinicalSense: 2, knowledge: 2, confidence: 1, money: 3, stress: 4 },
      },
      rough: {
        text: {
          en: "She is in the chair for an extra forty minutes while you get it dry. Everyone is fine. You are wrung out.",
          zh: "为了止住血，她在椅位上多待了四十分钟。所有人都没事。你被榨干了。",
        },
        effects: { clinicalSense: 1, confidence: -1, stress: 8, stamina: -5, money: 2 },
      },
      bad: {
        text: {
          en: "She rings the emergency line at midnight, still bleeding. Someone else sorts it. You learn the lesson the expensive way.",
          zh: "她半夜打了急诊电话，还在出血。别人处理了。这一课你是用最贵的方式学会的。",
        },
        effects: { confidence: -5, reputation: -3, standing: -2, stress: 10, mood: -5, knowledge: 3 },
      },
    },
  },

  {
    id: "case_oral_lesion",
    patient: {
      name: { en: "Tomás, 58", zh: "Tomás，58 岁" },
      age: 58,
      chiefComplaint: {
        en: "“My denture rubs here. It's been sore maybe two months.”",
        zh: "“我的假牙这里磨得慌。大概疼了两个月了。”",
      },
    },
    stage: ["clinical", "advanced"],
    minSemester: 9,
    difficulty: 14,
    tags: ["oral_med", "referral"],
    execution: [
      { stat: "knowledge", weight: 0.45 },
      { stat: "clinicalSense", weight: 0.35 },
      { stat: "empathy", weight: 0.2 },
    ],
    steps: [
      {
        id: "history",
        kind: "history",
        prompt: {
          en: "There is a firm white patch on the lateral tongue, not under the denture at all.",
          zh: "舌侧缘有一块质硬的白斑——根本不在义齿覆盖的位置。",
        },
        options: [
          {
            id: "note_the_mismatch",
            quality: "best",
            text: {
              en: "Note that the lesion is nowhere near the denture, and ask about smoking and alcohol.",
              zh: "注意到病损根本不在义齿附近，并询问吸烟和饮酒史。",
            },
            feedback: {
              en: "The complaint and the finding do not match, and that mismatch is the whole case. Lateral tongue is a high-risk site.",
              zh: "主诉和体征对不上——这个矛盾就是整个病例的关键。舌侧缘是高危部位。",
            },
          },
          {
            id: "adjust_denture",
            quality: "poor",
            text: {
              en: "Adjust the denture flange and review in two weeks.",
              zh: "调磨义齿基托边缘，两周后复查。",
            },
            feedback: {
              en: "You treated the story he told instead of the thing you saw. Two weeks becomes six months when nobody makes the appointment.",
              zh: "你处理的是他讲的故事，而不是你看到的东西。当没人真去预约时，两周就变成了六个月。",
            },
            effects: { clinicalSense: -2 },
          },
          {
            id: "photograph_and_measure",
            quality: "ok",
            text: {
              en: "Photograph it, measure it, and document the margins carefully.",
              zh: "拍照、测量，仔细记录边界。",
            },
            feedback: {
              en: "Good documentation, and it will matter later. It is not a substitute for deciding what to do about it today.",
              zh: "记录做得好，之后确实有用。但它不能替代“今天要怎么处理”这个决定。",
            },
          },
        ],
      },
      {
        id: "diagnosis",
        kind: "diagnosis",
        prompt: {
          en: "Firm, non-wipeable, 14mm, ill-defined border. Two months. Forty pack-years.",
          zh: "质硬、不可擦除、14mm、边界不清。病程两个月。吸烟四十包年。",
        },
        options: [
          {
            id: "suspicious_refer",
            quality: "best",
            text: {
              en: "Clinically suspicious leukoplakia. Urgent referral for biopsy.",
              zh: "临床可疑白斑。紧急转诊活检。",
            },
            feedback: {
              en: "Non-wipeable, over two weeks, high-risk site, heavy smoker. You do not need a diagnosis — you need a biopsy, quickly.",
              zh: "不可擦除、超过两周、高危部位、重度吸烟。你不需要诊断——你需要的是尽快活检。",
            },
          },
          {
            id: "candida",
            quality: "poor",
            text: {
              en: "Likely candidiasis. Trial of antifungal and review.",
              zh: "考虑念珠菌病。试用抗真菌药后复查。",
            },
            feedback: {
              en: "Candida wipes off. This does not. A two-week antifungal trial here is two weeks a cancer keeps growing.",
              zh: "念珠菌是可以擦掉的。这个不能。在这里试两周抗真菌药，就是让一个癌再长两周。",
            },
            effects: { knowledge: -1 },
          },
          {
            id: "frictional",
            quality: "ok",
            text: {
              en: "Possible frictional keratosis. Remove the cause and reassess in two weeks.",
              zh: "可能是摩擦性角化。去除刺激因素，两周后复评。",
            },
            feedback: {
              en: "Legitimate reasoning when there is an obvious cause. Here there is not one — nothing is rubbing that part of the tongue.",
              zh: "在有明确刺激源时，这个思路是站得住的。但这里没有——舌的那个位置根本没有东西在摩擦。",
            },
          },
        ],
      },
      {
        id: "plan",
        kind: "plan",
        prompt: {
          en: "He asks, watching your face, whether it is something bad.",
          zh: "他盯着你的表情问：是不是什么不好的东西。",
        },
        options: [
          {
            id: "honest_uncertain",
            quality: "best",
            text: {
              en: "“I don't know yet, and that's why I want it looked at this week.”",
              zh: "“我还不知道，正因为这样，我希望这周就有人给它做检查。”",
            },
            feedback: {
              en: "Honest uncertainty is what gets him to the appointment. False reassurance is what makes people not go.",
              zh: "诚实地承认不确定，才能让他真的去赴约。虚假的安慰只会让人不去。",
            },
            effects: { empathy: 2 },
          },
          {
            id: "reassure",
            quality: "poor",
            text: {
              en: "“Probably nothing — most of these turn out fine.”",
              zh: "“八成没事——这类大多数最后都没问题。”",
            },
            feedback: {
              en: "Statistically defensible, and it is why he does not attend the biopsy. Reassurance you cannot back is a cost you pass to him.",
              zh: "统计上说得通——而这正是他没去做活检的原因。你担保不了的安慰，代价是转嫁给他的。",
            },
          },
          {
            id: "full_disclosure",
            quality: "ok",
            text: {
              en: "Tell him it could be cancer and explain the whole pathway now.",
              zh: "直接告诉他这可能是癌，并当场解释完整流程。",
            },
            feedback: {
              en: "Nothing here is untrue, and some patients want exactly this. Others stop hearing anything after the word.",
              zh: "这里没有一句假话，有些患者也正需要这样。但另一些人，在听到那个词之后就什么都听不进去了。",
            },
          },
        ],
      },
    ],
    outcomes: {
      excellent: {
        text: {
          en: "Seen by oral medicine in four days. Early-stage, caught in time. Nine months later he brings you a bag of oranges.",
          zh: "四天后就在口腔黏膜科看上了。早期，抓住了。九个月后他给你带来一袋橙子。",
        },
        effects: { knowledge: 3, clinicalSense: 4, reputation: 2, standing: 3, empathy: 1 },
      },
      good: {
        text: {
          en: "Referred properly. The wait is longer than you would like, but the letter is clear and the flag is raised.",
          zh: "转诊流程走得规范。等待比你希望的久，但转诊信写得清楚，警示已经拉响。",
        },
        effects: { knowledge: 2, clinicalSense: 3, reputation: 2, standing: 2 },
      },
      rough: {
        text: {
          en: "Your referral letter is vague and gets triaged as routine. Your attending rewrites it and explains why urgency lives in the wording.",
          zh: "你的转诊信写得含糊，被分诊为常规。带教老师重写了一遍，并解释了为什么“紧急”是靠措辞传达的。",
        },
        effects: { knowledge: 3, confidence: -2, stress: 6 },
      },
      bad: {
        text: {
          en: "You adjusted a denture. He comes back in seven months and the lesion is 30mm. You will think about this one for years.",
          zh: "你调磨了义齿。七个月后他回来，病损已经 30mm。这一个你会想很多年。",
        },
        effects: { confidence: -6, reputation: -3, standing: -3, mood: -8, stress: 10, clinicalSense: 4 },
      },
    },
  },

  {
    id: "case_failing_crown",
    patient: {
      name: { en: "Priya, 41", zh: "Priya，41 岁" },
      age: 41,
      chiefComplaint: {
        en: "“Floss keeps shredding on my crown. It doesn't hurt.”",
        zh: "“牙线在我那个牙冠上总是刮断。不疼。”",
      },
    },
    stage: ["clinical", "advanced"],
    minSemester: 8,
    difficulty: 9,
    tags: ["restorative", "prostho"],
    execution: [
      { stat: "handSkill", weight: 0.4 },
      { stat: "clinicalSense", weight: 0.35 },
      { stat: "knowledge", weight: 0.25 },
    ],
    steps: [
      {
        id: "history",
        kind: "history",
        prompt: {
          en: "The crown was placed four years ago, elsewhere. She is a diligent flosser and slightly annoyed.",
          zh: "这个冠是四年前在别处做的。她用牙线很勤，情绪略有不满。",
        },
        options: [
          {
            id: "probe_the_margin",
            quality: "best",
            text: {
              en: "Run an explorer around the entire margin and take a bitewing.",
              zh: "用探针沿整个冠边缘探查，并拍咬合翼片。",
            },
            feedback: {
              en: "Shredding floss is a margin telling you something. Explorer plus bitewing finds the overhang or the caries under it.",
              zh: "牙线被刮断，是边缘在告诉你有问题。探针加咬合翼片能找出悬突，或它下面的继发龋。",
            },
          },
          {
            id: "polish_it",
            quality: "poor",
            text: {
              en: "Polish the margin smooth and send her away happy.",
              zh: "把边缘抛光打磨光滑，让她高高兴兴地走。",
            },
            feedback: {
              en: "Polishing a rough margin hides the symptom without asking why it is rough. If there is caries under it, you have just sealed it in.",
              zh: "抛光粗糙边缘只是掩盖症状，却没问它为什么粗糙。如果底下有龋，你刚刚把它封了进去。",
            },
            effects: { clinicalSense: -1 },
          },
          {
            id: "check_contact",
            quality: "ok",
            text: {
              en: "Check the contact point with floss on the adjacent tooth for comparison.",
              zh: "用牙线检查邻牙的接触点作为对照。",
            },
            feedback: {
              en: "Sensible comparison and it localises the problem. It still does not tell you what is happening under the margin.",
              zh: "合理的对照，也能定位问题。但它仍然没告诉你冠边缘之下发生了什么。",
            },
          },
        ],
      },
      {
        id: "diagnosis",
        kind: "diagnosis",
        prompt: {
          en: "Distal overhang with recurrent caries beneath it. Pulp tests normal. No periapical change.",
          zh: "远中悬突，其下有继发龋。牙髓活力正常。无根尖周改变。",
        },
        options: [
          {
            id: "recurrent_caries",
            quality: "best",
            text: {
              en: "Recurrent caries under a defective margin. The crown has to come off.",
              zh: "缺陷边缘下的继发龋。这个冠必须拆。",
            },
            feedback: {
              en: "You cannot excavate what you cannot see. A crown that shreds floss and hides caries has already failed, whatever it looks like.",
              zh: "看不见的地方没法去龋。一个刮断牙线又藏着龋的冠，不管外观如何，它已经失败了。",
            },
          },
          {
            id: "repair_margin",
            quality: "ok",
            text: {
              en: "Repair the margin with composite and monitor radiographically.",
              zh: "用复合树脂修补边缘，影像学随访观察。",
            },
            feedback: {
              en: "A real option when access is good and the patient cannot afford a remake. Here the caries is subgingival, so you would be guessing.",
              zh: "当入路良好、患者负担不起重做时，这是一个真实的选项。但这里龋损在龈下，你只能靠猜。",
            },
          },
          {
            id: "watch_it",
            quality: "poor",
            text: {
              en: "It is asymptomatic. Review in six months.",
              zh: "无症状。六个月后复查。",
            },
            feedback: {
              en: "Asymptomatic is not the same as stable. By the time this one hurts, the tooth may need endodontics as well.",
              zh: "无症状不等于稳定。等到它开始疼的时候，这颗牙可能连根管一起都需要了。",
            },
          },
        ],
      },
      {
        id: "plan",
        kind: "plan",
        prompt: {
          en: "She asks why she is paying twice for the same tooth.",
          zh: "她问，为什么同一颗牙她要付两次钱。",
        },
        options: [
          {
            id: "explain_without_blaming",
            quality: "best",
            text: {
              en: "Explain what failed and why, without trashing the previous dentist.",
              zh: "解释哪里失败了、为什么，但不诋毁前一位牙医。",
            },
            feedback: {
              en: "Margins fail for many reasons, and she does not need a villain. She needs to understand it well enough to notice sooner next time.",
              zh: "边缘失败的原因有很多，她不需要一个反派。她需要理解得足够清楚，好在下次更早察觉。",
            },
            effects: { empathy: 1, reputation: 1 },
          },
          {
            id: "blame_predecessor",
            quality: "poor",
            text: {
              en: "Tell her honestly that the original crown was poorly made.",
              zh: "如实告诉她，原来那个冠做得不合格。",
            },
            feedback: {
              en: "It may even be true. It also teaches her that dentists blame each other, and she will wonder what the next one says about you.",
              zh: "这甚至可能是真的。但它也教会她牙医之间会互相指责——她会想，下一个牙医又会怎么说你。",
            },
            effects: { reputation: -1 },
          },
          {
            id: "quote_and_book",
            quality: "ok",
            text: {
              en: "Give her the cost of a remake and let her think about it.",
              zh: "给她重做的费用，让她回去考虑。",
            },
            feedback: {
              en: "Respects her autonomy and her budget. Without the explanation, though, “think about it” often means “not yet”.",
              zh: "尊重她的自主权和预算。但缺了解释，“考虑考虑”往往就等于“再说吧”。",
            },
          },
        ],
      },
    ],
    outcomes: {
      excellent: {
        text: {
          en: "Crown off, caries out, core built, margin where you can actually see it. The temporary looks better than the old crown did.",
          zh: "拆冠、去龋、堆核，边缘放在你真正能看见的位置。临时冠看起来比原来那个正式冠还好。",
        },
        effects: { handSkill: 4, clinicalSense: 3, confidence: 3, reputation: 2, money: 7 },
      },
      good: {
        text: {
          en: "Deeper than the radiograph suggested, but you get a clean margin and a solid core.",
          zh: "比片子上看起来更深，但你还是拿到了干净的边缘和可靠的核。",
        },
        effects: { handSkill: 2, clinicalSense: 2, money: 5, stress: 3 },
      },
      rough: {
        text: {
          en: "The margin ends up subgingival and the impression takes three tries. The lab will have opinions.",
          zh: "边缘最终落在龈下，取模试了三次。技工室会有意见的。",
        },
        effects: { handSkill: 1, confidence: -2, stress: 6, money: 3 },
      },
      bad: {
        text: {
          en: "The caries runs to the furcation. What was a crown remake is now a conversation about extraction.",
          zh: "龋损一直延伸到根分叉。本来是重做一个冠，现在变成了一场关于拔牙的谈话。",
        },
        effects: { confidence: -4, reputation: -2, stress: 8, mood: -3, clinicalSense: 3 },
      },
    },
  },

  {
    id: "case_avulsion",
    patient: {
      name: { en: "Owen, 11", zh: "Owen，11 岁" },
      age: 11,
      chiefComplaint: {
        en: "Knocked his upper front tooth out at football forty minutes ago. Dad is holding it in a tissue.",
        zh: "四十分钟前踢球时上前牙被撞脱了。爸爸用纸巾包着牙。",
      },
    },
    stage: ["clinical", "advanced"],
    minSemester: 8,
    difficulty: 13,
    tags: ["trauma", "pedo", "emergency"],
    execution: [
      { stat: "clinicalSense", weight: 0.35 },
      { stat: "handSkill", weight: 0.35 },
      { stat: "knowledge", weight: 0.3 },
    ],
    steps: [
      {
        id: "history",
        kind: "history",
        prompt: {
          en: "Everyone is talking at once. The clock is the only thing that matters.",
          zh: "所有人都在同时说话。唯一重要的是时间。",
        },
        options: [
          {
            id: "milk_now",
            quality: "best",
            text: {
              en: "Get the tooth into milk immediately, holding it by the crown, then take the history.",
              zh: "立刻把牙放进牛奶里，只捏牙冠，然后再问病史。",
            },
            feedback: {
              en: "Every dry minute kills more periodontal ligament cells. Storage first, questions second — and never touch the root surface.",
              zh: "每干燥一分钟，就有更多牙周膜细胞死亡。先保存，再问诊——而且绝不能碰牙根表面。",
            },
          },
          {
            id: "rinse_scrub",
            quality: "poor",
            text: {
              en: "Rinse it under the tap and gently scrub the debris off the root.",
              zh: "在水龙头下冲洗，轻轻刷掉牙根上的碎屑。",
            },
            feedback: {
              en: "Scrubbing strips the very ligament cells the tooth needs to reattach. A brief saline rinse is all it ever gets.",
              zh: "刷洗会刮掉牙齿重新附着所必需的牙周膜细胞。最多只能用生理盐水轻轻冲一下。",
            },
            effects: { knowledge: -2 },
          },
          {
            id: "medical_history",
            quality: "ok",
            text: {
              en: "Take a proper trauma and medical history, including tetanus status.",
              zh: "完整采集外伤史和病史，包括破伤风免疫情况。",
            },
            feedback: {
              en: "All of it is needed, including the tetanus question. None of it is needed before the tooth is in a storage medium.",
              zh: "这些都需要，破伤风那一项也确实要问。但在牙被放进保存液之前，一样都不该先做。",
            },
          },
        ],
      },
      {
        id: "diagnosis",
        kind: "diagnosis",
        prompt: {
          en: "Permanent upper central incisor, closed apex, dry time about fifteen minutes, socket intact.",
          zh: "恒上中切牙，根尖已闭合，干燥时间约十五分钟，牙槽窝完整。",
        },
        options: [
          {
            id: "replant_now",
            quality: "best",
            text: {
              en: "Replant it now, then splint. Endodontics follows in seven to ten days.",
              zh: "立即再植，然后固定。七到十天后开始根管治疗。",
            },
            feedback: {
              en: "Under sixty minutes with a closed apex, replantation is the answer and speed is the treatment. The pulp will need treating; the ligament will not wait.",
              zh: "干燥时间不到六十分钟、根尖已闭合，再植就是答案，而速度本身就是治疗。牙髓之后要处理；牙周膜等不了。",
            },
          },
          {
            id: "space_maintainer",
            quality: "poor",
            text: {
              en: "It has been out too long. Plan a space maintainer and a bridge later.",
              zh: "脱位太久了。计划做间隙保持器，以后再做桥。",
            },
            feedback: {
              en: "Fifteen minutes is well inside the window. Writing off an eleven-year-old's central incisor commits him to a lifetime of prosthetics.",
              zh: "十五分钟完全在窗口期内。就此放弃一个十一岁孩子的中切牙，等于让他终身与修复体为伴。",
            },
          },
          {
            id: "check_alveolus",
            quality: "ok",
            text: {
              en: "Radiograph first to rule out an alveolar fracture before replanting.",
              zh: "先拍片排除牙槽突骨折，再做再植。",
            },
            feedback: {
              en: "An alveolar fracture would change the splinting, so it is a fair question. It also spends minutes the ligament does not have.",
              zh: "牙槽突骨折会改变固定方式，所以这个问题合理。但它也花掉了牙周膜没有的那几分钟。",
            },
          },
        ],
      },
      {
        id: "plan",
        kind: "plan",
        prompt: {
          en: "Owen has not said a word. His dad keeps apologising for the tissue.",
          zh: "Owen 一句话都没说。他爸爸一直在为那张纸巾道歉。",
        },
        options: [
          {
            id: "tell_dad_he_did_right",
            quality: "best",
            text: {
              en: "Tell his dad he did the right thing bringing the tooth, then talk Owen through every step.",
              zh: "告诉他爸爸“把牙带来是对的”，然后一步一步讲给 Owen 听。",
            },
            feedback: {
              en: "He did do the right thing. And the boy who is silent is the one who most needs to know what is about to happen to his face.",
              zh: "他确实做对了。而那个一言不发的孩子，最需要知道接下来他的脸上要发生什么。",
            },
            effects: { empathy: 3 },
          },
          {
            id: "work_fast_quiet",
            quality: "ok",
            text: {
              en: "Work fast and quietly. Explanations after the splint is on.",
              zh: "快速安静地操作。固定装好之后再解释。",
            },
            feedback: {
              en: "Time genuinely matters here, so speed is defensible. Silence in a child who has just seen his own tooth in a tissue is not free.",
              zh: "这里时间确实要紧，所以求快说得过去。但对一个刚看见自己的牙躺在纸巾里的孩子来说，沉默是有代价的。",
            },
          },
          {
            id: "correct_dad",
            quality: "poor",
            text: {
              en: "Explain that the tissue was wrong and it should have gone straight into milk.",
              zh: "解释纸巾是错的，本来应该直接泡进牛奶里。",
            },
            feedback: {
              en: "Correct, badly timed, and aimed at a man already blaming himself. Teach him at the review, when the tooth is splinted and everyone can breathe.",
              zh: "说得没错，时机很糟，而且对象是一个已经在自责的父亲。等复诊时再教他——那时牙已固定，所有人都能喘口气。",
            },
            effects: { empathy: -2 },
          },
        ],
      },
    ],
    outcomes: {
      excellent: {
        text: {
          en: "Replanted, flexible splint on, endodontics booked for day eight. At the one-year review there is no sign of replacement resorption.",
          zh: "再植完成，弹性固定就位，第八天的根管治疗已约好。一年复查时没有替代性吸收的迹象。",
        },
        effects: { clinicalSense: 5, handSkill: 4, knowledge: 3, confidence: 4, reputation: 4, standing: 3 },
      },
      good: {
        text: {
          en: "Replanted and splinted. It took two attempts to seat it fully and you were sweating, but it is in.",
          zh: "再植并固定。为了完全就位试了两次，你出了一身汗，但它到位了。",
        },
        effects: { clinicalSense: 3, handSkill: 2, knowledge: 2, confidence: 1, stress: 6 },
      },
      rough: {
        text: {
          en: "Your attending takes over halfway through. The tooth is in, and you learn more in that ten minutes than in a month of lectures.",
          zh: "带教老师中途接手了。牙是植回去了，而你在那十分钟里学到的，比一个月的课还多。",
        },
        effects: { clinicalSense: 3, knowledge: 3, confidence: -3, stress: 8 },
      },
      bad: {
        text: {
          en: "The splint fails within a week and ankylosis follows. He is eleven, and this will shape his smile for decades.",
          zh: "固定一周内失败，随后发生固连。他才十一岁，而这会影响他几十年的笑容。",
        },
        effects: { confidence: -6, reputation: -3, mood: -7, stress: 10, clinicalSense: 3 },
      },
    },
  },
];

export const CASES_BY_ID: Record<string, PatientCase> = Object.fromEntries(
  CASES.map((entry) => [entry.id, entry]),
);
