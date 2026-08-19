import type { SimLabExercise } from "../game/types";

// ---------------------------------------------------------------------------
// Sim-lab practicals (§5.3).
//
// Three stages, each scored on SIGNED error: rushing over-prepares, timidity
// under-prepares, and skill narrows the band rather than pushing one direction.
// Three ideal stages earn a faculty commendation and a perk point.
//
// Failing here is meant to build hand skill. A rough exercise costs confidence
// and returns handSkill, because that is genuinely how the bench works.
// ---------------------------------------------------------------------------

export const SIM_LAB_EXERCISES: SimLabExercise[] = [
  {
    id: "simlab_class_i_amalgam",
    title: { en: "Class I Preparation", zh: "I 类洞制备" },
    description: {
      en: "Occlusal preparation on tooth #30. Outline form, depth, and clean walls.",
      zh: "在 #30 牙上做咬合面洞形制备。外形、深度、洞壁清洁。",
    },
    stage: ["preclinical", "transition"],
    minSemester: 3,
    maxSemester: 6,
    difficulty: 4,
    stages: [
      {
        id: "outline",
        prompt: {
          en: "Outline form — how far do you extend into the fissures?",
          zh: "外形制备——洞缘向窝沟延伸到什么程度？",
        },
        demand: 0,
        feedback: {
          over: {
            en: "You chased every stained groove and the outline is now wider than the lesion ever was.",
            zh: "你顺着每一条着色的沟都追了过去，洞形已经比病损本身宽得多。",
          },
          ideal: {
            en: "Conservative, continuous, and it follows the anatomy instead of fighting it.",
            zh: "保守、连续，顺着牙体解剖走，而不是和它较劲。",
          },
          under: {
            en: "You stopped short of the distal pit. Caries there will simply carry on.",
            zh: "你在远中窝之前就停手了。那里的龋会继续发展。",
          },
        },
      },
      {
        id: "depth",
        prompt: {
          en: "Pulpal floor depth — the part everyone gets wrong first.",
          zh: "髓壁深度——所有人第一次都会做错的地方。",
        },
        demand: 2,
        feedback: {
          over: {
            en: "Too deep. On a live tooth that is a pulp exposure and a very different appointment.",
            zh: "太深了。在活髓牙上，这就是穿髓，也就是完全不同的一次就诊。",
          },
          ideal: {
            en: "Uniform depth, flat floor, and you can see it is right without measuring.",
            zh: "深度均一、髓壁平整，不用测量都看得出来是对的。",
          },
          under: {
            en: "Shallow. The restoration will not have the bulk it needs and will fracture.",
            zh: "太浅。充填体达不到必要的厚度，会折裂。",
          },
        },
      },
      {
        id: "walls",
        prompt: {
          en: "Cavosurface margin and wall convergence.",
          zh: "洞缘角与洞壁聚合度。",
        },
        demand: 1,
        feedback: {
          over: {
            en: "Undercut so aggressive that you have weakened the cusps you were trying to keep.",
            zh: "倒凹做得太狠，反而削弱了你本想保留的牙尖。",
          },
          ideal: {
            en: "Clean 90-degree cavosurface, walls slightly convergent. Textbook.",
            zh: "洞缘角干净的 90 度，洞壁轻微聚合。教科书级别。",
          },
          under: {
            en: "Divergent walls. Nothing will hold — the restoration will lift out whole.",
            zh: "洞壁外张。什么都固位不住——充填体会整块脱出。",
          },
        },
      },
    ],
    outcomes: {
      commendation: {
        text: {
          en: "Your instructor holds it up for the bench to see. You pretend that is not the best thing that has happened all term.",
          zh: "指导老师把它举起来给全组看。你假装这不是整个学期最开心的一件事。",
        },
        effects: { handSkill: 5, confidence: 4, standing: 3, mood: 4 },
      },
      pass: {
        text: {
          en: "Signed off with one note about the distal wall. Solid work.",
          zh: "通过，只在远中壁上留了一条批注。做得扎实。",
        },
        effects: { handSkill: 3, confidence: 1, standing: 1 },
      },
      rough: {
        text: {
          en: "Re-do. You mount a new typodont tooth and stay another two hours, and the second one is better.",
          zh: "重做。你换了一颗新的仿真牙，又留了两个小时——第二个确实好些了。",
        },
        effects: { handSkill: 2, confidence: -3, stamina: -6, stress: 5 },
      },
    },
  },

  {
    id: "simlab_class_ii_composite",
    title: { en: "Class II Composite", zh: "II 类复合树脂" },
    description: {
      en: "Proximal box on #14 with matrix, wedge, and a contact that actually exists.",
      zh: "#14 邻面洞，配成形片、楔子，以及一个真实存在的接触点。",
    },
    stage: ["preclinical", "transition"],
    minSemester: 4,
    maxSemester: 6,
    difficulty: 8,
    stages: [
      {
        id: "box",
        prompt: {
          en: "Proximal box — clearing the contact without touching the neighbour.",
          zh: "邻面盒形——去除接触区，但不能伤到邻牙。",
        },
        demand: 2,
        feedback: {
          over: {
            en: "You nicked the adjacent tooth. Iatrogenic damage is the phrase, and it is on the sheet.",
            zh: "你把邻牙磨到了。术语叫医源性损伤，评分表上有这一项。",
          },
          ideal: {
            en: "Contact cleared, neighbour untouched, gingival floor flat.",
            zh: "接触区清除干净，邻牙毫发无伤，龈壁平整。",
          },
          under: {
            en: "Contact not fully cleared. The matrix will not seat and you will find out the hard way.",
            zh: "接触区没清干净。成形片放不到位——你等下就会知道有多麻烦。",
          },
        },
      },
      {
        id: "matrix",
        prompt: {
          en: "Matrix and wedge placement — the step that decides the contact.",
          zh: "成形片与楔子放置——决定接触点的那一步。",
        },
        demand: 3,
        feedback: {
          over: {
            en: "Wedged so hard the band is deformed and the contour is now a bulge.",
            zh: "楔子打得太狠，成形片变形，外形变成了一个鼓包。",
          },
          ideal: {
            en: "Sectional matrix, ring, wedge sealed at the gingival. It will have a real contact.",
            zh: "分段成形片、固位环、楔子在龈方封闭。这会有一个真正的接触点。",
          },
          under: {
            en: "Loose at the gingival margin. You are about to make an overhang.",
            zh: "龈缘处不密合。你马上就要做出一个悬突了。",
          },
        },
      },
      {
        id: "layering",
        prompt: {
          en: "Incremental placement and cure.",
          zh: "分层充填与固化。",
        },
        demand: 2,
        feedback: {
          over: {
            en: "Overfilled. Twenty minutes of finishing to remove what you should not have placed.",
            zh: "充填过量。为了去掉本不该放上去的部分，你花了二十分钟修形。",
          },
          ideal: {
            en: "Increments under 2mm, cured properly, anatomy already close before finishing.",
            zh: "每层不超过 2mm，固化到位，还没修形就已经接近解剖形态。",
          },
          under: {
            en: "Voids at the gingival floor. They will show on the radiograph forever.",
            zh: "龈壁处有气泡。它们会永远留在片子上。",
          },
        },
      },
    ],
    outcomes: {
      commendation: {
        text: {
          en: "Floss snaps through the contact exactly the way it is supposed to. You do it three more times just to hear it.",
          zh: "牙线通过接触点时“啪”地一下，正是该有的手感。你又试了三次，就为了听那个声音。",
        },
        effects: { handSkill: 6, confidence: 4, standing: 3, mood: 3 },
      },
      pass: {
        text: {
          en: "Contact is light but present. Margin is clean. That will do.",
          zh: "接触点偏轻但存在。边缘干净。可以了。",
        },
        effects: { handSkill: 3, confidence: 1, standing: 1 },
      },
      rough: {
        text: {
          en: "Open contact. Your instructor points out that the matrix decided this ten minutes before you noticed.",
          zh: "接触点开放。指导老师指出，成形片在你察觉的十分钟前就已经决定了这个结果。",
        },
        effects: { handSkill: 2, confidence: -3, stress: 6, stamina: -5 },
      },
    },
  },

  {
    id: "simlab_crown_prep",
    title: { en: "Full Crown Preparation", zh: "全冠牙体预备" },
    description: {
      en: "Reduction, taper, and a margin the lab can actually read.",
      zh: "预备量、聚合度，以及一个技工室真能读懂的边缘。",
    },
    stage: ["preclinical", "transition", "clinical"],
    minSemester: 5,
    difficulty: 12,
    stages: [
      {
        id: "reduction",
        prompt: {
          en: "Occlusal reduction — enough for the material, not more.",
          zh: "咬合面预备量——够材料用即可，不要更多。",
        },
        demand: 2,
        feedback: {
          over: {
            en: "Over-reduced. On a real tooth you have just moved closer to the pulp for nothing.",
            zh: "预备过量。在真牙上，你刚刚白白靠近了牙髓。",
          },
          ideal: {
            en: "Uniform clearance, anatomy preserved in the reduction. The lab will thank you.",
            zh: "预备量均匀，形态在预备中得到保留。技工室会感谢你。",
          },
          under: {
            en: "Not enough clearance. The crown will be thin and it will perforate in service.",
            zh: "预备量不足。冠会太薄，戴用中会穿孔。",
          },
        },
      },
      {
        id: "taper",
        prompt: {
          en: "Axial walls and total occlusal convergence.",
          zh: "轴壁与总聚合度。",
        },
        demand: 4,
        feedback: {
          over: {
            en: "Tapered like a pencil. Retention is gone and no cement will save it.",
            zh: "预备得像根铅笔。固位力没了，什么粘接剂都救不回来。",
          },
          ideal: {
            en: "Six degrees or so. Retentive, and it still has a path of insertion.",
            zh: "大约六度。有固位力，也仍然有就位道。",
          },
          under: {
            en: "Near-parallel walls with an undercut. It will not seat at all.",
            zh: "轴壁近乎平行且存在倒凹。冠根本戴不进去。",
          },
        },
      },
      {
        id: "margin",
        prompt: {
          en: "Margin design and finish.",
          zh: "边缘设计与修整。",
        },
        demand: 3,
        feedback: {
          over: {
            en: "Margin dropped subgingival where nobody can see it or impress it.",
            zh: "边缘落到了龈下，没人看得见，也取不出模。",
          },
          ideal: {
            en: "Continuous, smooth chamfer, supragingival, readable from across the bench.",
            zh: "连续、光滑的凹形边缘，位于龈上，隔着操作台都能看清。",
          },
          under: {
            en: "Indistinct margin. The technician will guess, and the technician will guess wrong.",
            zh: "边缘不清晰。技师只能猜——而技师会猜错。",
          },
        },
      },
    ],
    outcomes: {
      commendation: {
        text: {
          en: "Measured at 6 degrees with a clean chamfer the whole way round. Someone photographs it for next year's class.",
          zh: "测出来正好 6 度，一圈边缘都是干净的凹形。有人把它拍下来给明年的班用。",
        },
        effects: { handSkill: 6, confidence: 5, standing: 4, mood: 3 },
      },
      pass: {
        text: {
          en: "Acceptable taper, margin readable on the buccal, a bit vague distally.",
          zh: "聚合度可接受，颊侧边缘清晰，远中略含糊。",
        },
        effects: { handSkill: 3, confidence: 1, standing: 1 },
      },
      rough: {
        text: {
          en: "Undercut on the mesial. You find it with the surveyor, not the eye, which is the lesson.",
          zh: "近中有倒凹。你是用观测仪发现的，不是用眼睛——这就是这堂课的意义。",
        },
        effects: { handSkill: 2, confidence: -3, stress: 6, stamina: -5 },
      },
    },
  },

  {
    id: "simlab_endo_access",
    title: { en: "Endodontic Access", zh: "开髓入路" },
    description: {
      en: "Access cavity on a molar: find every canal without destroying the tooth.",
      zh: "磨牙开髓洞形：找到每一个根管，同时不毁掉这颗牙。",
    },
    stage: ["preclinical", "transition", "clinical"],
    minSemester: 5,
    difficulty: 14,
    stages: [
      {
        id: "outline",
        prompt: {
          en: "Access outline — projecting the pulp chamber onto the occlusal surface.",
          zh: "开髓洞形——把髓腔投影到咬合面上。",
        },
        demand: 3,
        feedback: {
          over: {
            en: "Too wide. You have removed the marginal ridge and the tooth is now much weaker.",
            zh: "开得太大。边缘嵴被去除，这颗牙已经明显变弱。",
          },
          ideal: {
            en: "Straight-line access to every orifice, marginal ridges intact.",
            zh: "到每个根管口都有直线入路，边缘嵴保持完整。",
          },
          under: {
            en: "Too conservative. You will miss the MB2 and never know it was there.",
            zh: "太保守了。你会漏掉 MB2，而且永远不知道它存在过。",
          },
        },
      },
      {
        id: "deroof",
        prompt: {
          en: "De-roofing the chamber.",
          zh: "揭髓室顶。",
        },
        demand: 4,
        feedback: {
          over: {
            en: "You have gouged the floor. The anatomy that guides you to the canals is gone.",
            zh: "你磨穿了髓室底。那些能指引你找到根管的解剖标志没了。",
          },
          ideal: {
            en: "Roof completely gone, floor untouched, orifice map clearly visible.",
            zh: "髓室顶完全揭除，髓室底毫发无损，根管口分布一目了然。",
          },
          under: {
            en: "Roof overhangs remain. Files will bind on them for the rest of the appointment.",
            zh: "残留髓顶悬突。接下来整个操作中，器械都会卡在上面。",
          },
        },
      },
      {
        id: "orifices",
        prompt: {
          en: "Locating and negotiating the orifices.",
          zh: "定位并疏通根管口。",
        },
        demand: 5,
        feedback: {
          over: {
            en: "Over-instrumented the orifice into a funnel. Straight line, yes; strip perforation risk, also yes.",
            zh: "根管口被扩成了漏斗形。直线入路是有了，带状穿孔的风险也有了。",
          },
          ideal: {
            en: "All four negotiated, including MB2. You found it by following the groove, exactly as described.",
            zh: "四个根管全部疏通，包括 MB2。你是顺着沟找到的——和书上写的一模一样。",
          },
          under: {
            en: "Three canals found, one missed. Missed canals are the commonest reason retreatment exists.",
            zh: "找到三个，漏掉一个。遗漏根管是根管再治疗最常见的原因。",
          },
        },
      },
    ],
    outcomes: {
      commendation: {
        text: {
          en: "Four orifices, clean floor, ridges intact. Your instructor asks how you found MB2 and you get to explain.",
          zh: "四个根管口、干净的髓室底、完整的边缘嵴。指导老师问你怎么找到 MB2 的——你终于有机会讲一次。",
        },
        effects: { handSkill: 6, knowledge: 3, confidence: 5, standing: 4 },
      },
      pass: {
        text: {
          en: "Three canals cleanly accessed. MB2 stays hypothetical, as it does for most people at this stage.",
          zh: "三个根管入路干净。MB2 仍停留在理论上——这个阶段大多数人都是如此。",
        },
        effects: { handSkill: 3, knowledge: 2, confidence: 1 },
      },
      rough: {
        text: {
          en: "You perforate the furcation. On plastic it costs a tooth; the instructor makes sure you feel the weight of what it would cost otherwise.",
          zh: "你在根分叉处穿孔了。在塑料牙上只是废一颗；但指导老师让你切实感受到，如果是真牙，代价会是什么。",
        },
        effects: { handSkill: 2, knowledge: 3, confidence: -4, stress: 8, stamina: -5 },
      },
    },
  },

  {
    id: "simlab_impression",
    title: { en: "Full-Arch Impression", zh: "全牙弓印模" },
    description: {
      en: "Tray selection, material timing, and one clean pull.",
      zh: "托盘选择、材料时机，以及干净利落的一次脱模。",
    },
    stage: ["preclinical", "transition"],
    minSemester: 4,
    maxSemester: 7,
    difficulty: 6,
    stages: [
      {
        id: "tray",
        prompt: {
          en: "Tray selection and try-in.",
          zh: "托盘选择与试戴。",
        },
        demand: 0,
        feedback: {
          over: {
            en: "Tray too large — it will impinge and the patient would have gagged before the material set.",
            zh: "托盘过大——会压迫组织，材料还没凝固患者就已经恶心了。",
          },
          ideal: {
            en: "Even 3-4mm clearance all round, comfortable seat, stops in place.",
            zh: "四周均匀留出 3–4mm 间隙，就位舒适，止位准确。",
          },
          under: {
            en: "Tray too small. The distal molars will not be captured at all.",
            zh: "托盘过小。远中磨牙根本印不出来。",
          },
        },
      },
      {
        id: "mix",
        prompt: {
          en: "Mixing and loading — the clock starts now.",
          zh: "调拌与装载——计时从现在开始。",
        },
        demand: 3,
        feedback: {
          over: {
            en: "You worked past the setting time. The material tore on removal.",
            zh: "你超过了凝固时间才操作。脱模时材料撕裂了。",
          },
          ideal: {
            en: "Loaded and seated inside working time, no voids, no drag.",
            zh: "在工作时间内完成装载和就位，无气泡，无拉丝。",
          },
          under: {
            en: "Seated too early and moved it. Every detail is doubled.",
            zh: "就位过早又动了一下。所有细节都成了双影。",
          },
        },
      },
      {
        id: "removal",
        prompt: {
          en: "Removal — one motion, along the path of insertion.",
          zh: "脱模——沿就位道，一次到位。",
        },
        demand: 2,
        feedback: {
          over: {
            en: "Snatched it. Distortion through the whole posterior segment.",
            zh: "拽得太猛。整个后牙区都变形了。",
          },
          ideal: {
            en: "Broke the seal, single firm pull, detail sharp to the sulcus.",
            zh: "先破除封闭，再一次稳定脱出，细节清晰到龈沟。",
          },
          under: {
            en: "Rocked it out slowly and dragged the material. Blurred margins.",
            zh: "慢慢晃着取出，把材料带拉了。边缘模糊。",
          },
        },
      },
    ],
    outcomes: {
      commendation: {
        text: {
          en: "Every margin sharp, no voids, sulcus captured. The technician would have nothing to complain about, which never happens.",
          zh: "每一处边缘都清晰、无气泡、龈沟完整。技师无可挑剔——这种事从来不会发生。",
        },
        effects: { handSkill: 5, confidence: 3, standing: 3, mood: 3 },
      },
      pass: {
        text: {
          en: "One small void on the lingual of #19. Acceptable, and you know why it is there.",
          zh: "#19 舌侧有一个小气泡。可以接受，而且你知道它是怎么来的。",
        },
        effects: { handSkill: 3, confidence: 1, standing: 1 },
      },
      rough: {
        text: {
          en: "Retake. Alginate is cheap and time is not, which is the entire point of the exercise.",
          zh: "重取。藻酸盐很便宜，时间不便宜——这正是这个练习的全部意义。",
        },
        effects: { handSkill: 2, confidence: -2, stress: 4, stamina: -4 },
      },
    },
  },

  {
    id: "simlab_local_anaesthetic",
    title: { en: "Inferior Alveolar Block", zh: "下牙槽神经阻滞麻醉" },
    description: {
      en: "Landmarks, angle, depth, and aspiration — on the mannequin, for now.",
      zh: "解剖标志、角度、深度、回抽——目前还是在仿头模上。",
    },
    stage: ["preclinical", "transition"],
    minSemester: 5,
    maxSemester: 7,
    difficulty: 9,
    stages: [
      {
        id: "landmarks",
        prompt: {
          en: "Finding the coronoid notch and the pterygomandibular raphe.",
          zh: "定位喙突切迹与翼下颌韧带。",
        },
        demand: 1,
        feedback: {
          over: {
            en: "Too far posterior. That is the parotid, and that is a facial nerve palsy.",
            zh: "太靠后了。那是腮腺——也就是面神经麻痹。",
          },
          ideal: {
            en: "Thumb in the notch, barrel over the contralateral premolars. Textbook landmarks.",
            zh: "拇指置于切迹，注射器筒位于对侧前磨牙上方。标准的解剖定位。",
          },
          under: {
            en: "Too far anterior and medial. You will hit the ramus before the nerve.",
            zh: "太靠前、太靠内。你会先碰到下颌支，而不是神经。",
          },
        },
      },
      {
        id: "depth",
        prompt: {
          en: "Insertion depth before you deposit.",
          zh: "注药前的进针深度。",
        },
        demand: 2,
        feedback: {
          over: {
            en: "Hub-deep. Too deep is how needles break and how blocks fail.",
            zh: "进到针柄了。过深既容易断针，也容易麻醉失败。",
          },
          ideal: {
            en: "About two-thirds, gentle bone contact, withdraw a millimetre.",
            zh: "约三分之二，轻触骨面后退出一毫米。",
          },
          under: {
            en: "Barely past the mucosa. You will anaesthetise the lingual nerve and nothing else.",
            zh: "刚过黏膜。你只会麻到舌神经，别的什么都麻不到。",
          },
        },
      },
      {
        id: "aspirate",
        prompt: {
          en: "Aspiration and rate of deposit.",
          zh: "回抽与注药速度。",
        },
        demand: 2,
        feedback: {
          over: {
            en: "Deposited fast without a second aspiration. Speed is what makes blocks hurt.",
            zh: "没有二次回抽就快速注入。注得快，正是阻滞麻醉疼的原因。",
          },
          ideal: {
            en: "Aspirated in two planes, negative, then slow — a full minute for the cartridge.",
            zh: "两个方向回抽，均为阴性，然后缓慢注药——一支药推满一分钟。",
          },
          under: {
            en: "So slow and hesitant the patient would have been watching your hands shake.",
            zh: "慢得犹豫不决，患者会一直盯着你发抖的手。",
          },
        },
      },
    ],
    outcomes: {
      commendation: {
        text: {
          en: "Landmarks, depth, two-plane aspiration, one minute of deposit. Your instructor says “again, exactly like that.”",
          zh: "定位、深度、双向回抽、一分钟注药。指导老师说：“再来一次，就这样。”",
        },
        effects: { handSkill: 4, knowledge: 3, confidence: 5, standing: 3 },
      },
      pass: {
        text: {
          en: "Technique sound, deposit a little quick. On a person that is the difference between fine and memorable.",
          zh: "技术过关，注药略快。在真人身上，这就是“还行”和“记一辈子”的差别。",
        },
        effects: { handSkill: 2, knowledge: 2, confidence: 2 },
      },
      rough: {
        text: {
          en: "You hit bone immediately and kept pushing. On the mannequin it is a note; you make sure it stays a note.",
          zh: "你一进针就碰到骨，还继续推。在仿头模上只是一条批注——你确保它以后也只是一条批注。",
        },
        effects: { knowledge: 3, confidence: -3, stress: 5 },
      },
    },
  },
];

export const SIM_LAB_BY_ID: Record<string, SimLabExercise> = Object.fromEntries(
  SIM_LAB_EXERCISES.map((entry) => [entry.id, entry]),
);
