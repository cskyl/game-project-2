// AUTO-GENERATED from content-gen/*.json by content-gen/merge.mjs. Do not edit by hand.
import type { GameEvent } from "../game/types";

export const GENERATED_EVENTS: GameEvent[] = [
  {
    "id": "early_first_week_overload",
    "title": {
      "en": "Eighty Tabs and a Dream",
      "zh": "八十个标签页和一个梦想"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "study",
      "stress"
    ],
    "weight": 11,
    "text": {
      "en": "It's day three and your brain already feels like a browser with eighty tabs open, two of them playing audio you can't find. Orientation packets, syllabi, locker combos, and a map that lies about where Room 114 is.",
      "zh": "开学第三天，你的大脑已经像开了八十个标签页的浏览器，其中两个还在放找不到来源的声音。迎新材料、syllabus、储物柜密码，还有一张关于 114 教室在哪里全在撒谎的地图。"
    },
    "choices": [
      {
        "id": "make_a_system",
        "text": {
          "en": "Build one tidy folder system tonight",
          "zh": "今晚搭一个干净的文件夹系统"
        },
        "resultText": {
          "en": "You spend the evening sorting everything into neat folders. It eats your free time, but tomorrow-you nearly cries with gratitude.",
          "zh": "你花了一晚上把所有东西归类整理好。虽然搭进去了休息时间，但明天的你差点感动到哭。"
        },
        "effects": {
          "knowledge": 4,
          "confidence": 5,
          "stress": -3,
          "stamina": -4
        }
      },
      {
        "id": "wing_it",
        "text": {
          "en": "Close the tabs and just go to sleep",
          "zh": "关掉标签页，先去睡觉"
        },
        "resultText": {
          "en": "You decide the tooth can wait and your nervous system cannot. You wake up foggy on logistics but genuinely rested.",
          "zh": "你决定：牙可以等，你的神经系统不能。第二天虽然各种安排都迷迷糊糊，但是真的睡饱了。"
        },
        "effects": {
          "stress": -8,
          "stamina": 6,
          "knowledge": -2
        }
      },
      {
        "id": "ask_a_senior",
        "text": {
          "en": "Message a second-year for survival tips",
          "zh": "私信一个二年级要点生存攻略"
        },
        "resultText": {
          "en": "A kind upperclassman sends you a chaotic but lifesaving voice memo. You feel less alone and slightly more located in space.",
          "zh": "一位热心学长发来一段混乱但救命的语音。你觉得没那么孤单了，也终于大概知道自己在哪了。"
        },
        "effects": {
          "confidence": 4,
          "reputation": 3,
          "stress": -4,
          "knowledge": 2
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 2,
    "condition": {
      "maxStats": {
        "mood": 55
      }
    }
  },
  {
    "id": "early_big_basic_science_exam",
    "title": {
      "en": "The Anatomy Boss Fight",
      "zh": "解剖学 Boss 战"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "exam",
      "stress",
      "study"
    ],
    "weight": 10,
    "text": {
      "en": "Your first big basic-science exam is in five days, and it covers roughly the entire human head. The study guide is forty pages and somehow gets longer every time you look at it.",
      "zh": "你的第一场大型基础学科考试还有五天，内容大致涵盖了整个人头。复习提纲四十页，而且你每看一次它好像就变长一点。"
    },
    "choices": [
      {
        "id": "marathon",
        "text": {
          "en": "Cram in one heroic 9-hour session",
          "zh": "来一场英雄式的九小时通宵刷题"
        },
        "resultText": {
          "en": "You absorb a frightening amount, then forget your own phone number. The exam goes okay; your eye twitches for two days.",
          "zh": "你吸收了惊人的信息量，然后忘了自己的手机号。考试还行；眼皮跳了两天。"
        },
        "effects": {
          "knowledge": 10,
          "stress": 9,
          "stamina": -8
        }
      },
      {
        "id": "spaced",
        "text": {
          "en": "Spread it over five calmer days",
          "zh": "拆成五天慢慢复习"
        },
        "resultText": {
          "en": "Suspiciously mature, surprisingly effective. You walk in tired but steady, and actually remember the cranial nerves.",
          "zh": "成熟得有点可疑，效果好得出奇。你走进考场时虽然累但很稳，居然真的记住了颅神经。"
        },
        "effects": {
          "knowledge": 8,
          "confidence": 5,
          "stress": 2,
          "stamina": -3
        }
      },
      {
        "id": "group_quiz",
        "text": {
          "en": "Quiz each other with classmates",
          "zh": "和同学互相抽背"
        },
        "resultText": {
          "en": "Half studying, half comedy show, but the embarrassing mistakes are the ones you'll never forget on the test.",
          "zh": "一半在复习，一半在开演唱会，但那些丢人的错答恰好是考场上你永远忘不了的。"
        },
        "effects": {
          "knowledge": 6,
          "reputation": 4,
          "mood": 5,
          "stress": -3
        }
      },
      {
        "id": "fake_break",
        "text": {
          "en": "Rest now, panic-study later",
          "zh": "现在先休息，临时再爆肝"
        },
        "resultText": {
          "en": "The break is lovely. Future-you is less thrilled, but you survive on adrenaline and snacks.",
          "zh": "休息很舒服。未来的你没那么开心，但靠着肾上腺素和零食活了下来。"
        },
        "effects": {
          "stress": -5,
          "stamina": 5,
          "knowledge": 2
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 3
  },
  {
    "id": "early_endless_memorization",
    "title": {
      "en": "The Memorization Mountain",
      "zh": "背诵的大山"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "study",
      "stress"
    ],
    "weight": 9,
    "text": {
      "en": "There are two hundred terms to memorize and your flashcard app cheerfully informs you that you have one thousand cards due today. It is not joking.",
      "zh": "有两百个术语要背，你的 flashcard app 还很开心地告诉你今天有一千张卡要复习。它是认真的。"
    },
    "choices": [
      {
        "id": "mnemonics",
        "text": {
          "en": "Invent absurd mnemonics",
          "zh": "编一堆离谱的记忆口诀"
        },
        "resultText": {
          "en": "Your mnemonics are deeply stupid and 100% effective. You'll be muttering them in the exam, smiling.",
          "zh": "你的口诀蠢到家了，但有效率百分之百。考试时你会一边默念一边偷笑。"
        },
        "effects": {
          "knowledge": 7,
          "mood": 4,
          "stress": -2
        }
      },
      {
        "id": "grind",
        "text": {
          "en": "Grind every card, no shortcuts",
          "zh": "硬刚每一张卡，绝不偷懒"
        },
        "resultText": {
          "en": "Brute force works, but your soul leaves your body somewhere around card 700.",
          "zh": "硬刚确实有用，但刷到第七百张卡的时候你的灵魂已经出窍了。"
        },
        "effects": {
          "knowledge": 9,
          "stamina": -6,
          "stress": 5
        }
      },
      {
        "id": "split_load",
        "text": {
          "en": "Only do the cards due today, guilt-free",
          "zh": "只刷今天该刷的，不愧疚"
        },
        "resultText": {
          "en": "You cap the damage at a humane level and close the laptop. Progress is progress, and you slept like a person.",
          "zh": "你把任务量控制在了人能承受的范围然后合上电脑。进步就是进步，而且你像个正常人一样睡了觉。"
        },
        "effects": {
          "knowledge": 4,
          "stress": -5,
          "stamina": 3
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 3
  },
  {
    "id": "early_finding_a_rhythm",
    "title": {
      "en": "Hunting for a Routine",
      "zh": "寻找属于自己的节奏"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "study",
      "confidence"
    ],
    "weight": 9,
    "text": {
      "en": "Everyone seems to have a study routine except you. One classmate is a 5 a.m. person; another studies until 2 a.m. You're just a person who studies whenever the panic hits.",
      "zh": "好像所有人都有自己的学习节奏，除了你。一个同学是五点起的晨型人，另一个学到凌晨两点。而你只是一个一焦虑就开始学的人。"
    },
    "choices": [
      {
        "id": "copy_morning",
        "text": {
          "en": "Try the 5 a.m. early-bird life",
          "zh": "试试五点起的晨型人生"
        },
        "resultText": {
          "en": "The sunrise is gorgeous and the library is empty. You're also asleep by 9 p.m. like a tiny tired farmer.",
          "zh": "日出美极了，图书馆空荡荡的。你也像个又累又小的农民一样晚上九点就睡了。"
        },
        "effects": {
          "knowledge": 5,
          "stamina": -3,
          "confidence": 4,
          "stress": -2
        }
      },
      {
        "id": "build_own",
        "text": {
          "en": "Track your energy and design your own",
          "zh": "记录自己的精力，定制专属节奏"
        },
        "resultText": {
          "en": "Turns out you peak mid-afternoon. Building around that takes a week, but suddenly studying stops fighting you.",
          "zh": "原来你的高峰期在下午。围绕这个安排花了一周，但突然之间学习不再跟你对着干了。"
        },
        "effects": {
          "knowledge": 4,
          "confidence": 6,
          "stress": -4,
          "mood": 3
        }
      },
      {
        "id": "no_routine",
        "text": {
          "en": "Embrace chaos, lean on caffeine",
          "zh": "拥抱混乱，靠咖啡因续命"
        },
        "resultText": {
          "en": "Pure vibes-based scheduling. It works until it spectacularly doesn't, but at least it's flexible.",
          "zh": "纯凭感觉排日程。一直管用，直到某天彻底崩盘，但至少够灵活。"
        },
        "effects": {
          "knowledge": 3,
          "stress": 4,
          "mood": 2
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 3
  },
  {
    "id": "early_meeting_classmates",
    "title": {
      "en": "Strangers in Scrubs",
      "zh": "穿刷手服的陌生人们"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "social",
      "confidence"
    ],
    "weight": 10,
    "text": {
      "en": "Lunch break, and the cafeteria is a sea of people who all seem to already know each other. There's one open seat at a table of laughing strangers.",
      "zh": "午休时间，食堂里全是看起来早就互相认识的人。一桌有说有笑的陌生人那边，正好空着一个座位。"
    },
    "choices": [
      {
        "id": "sit_down",
        "text": {
          "en": "Take the seat and say hi",
          "zh": "坐下，打个招呼"
        },
        "resultText": {
          "en": "Awkward for nine seconds, then someone offers you a fry and it's fine. You've found your people, or at least lunch people.",
          "zh": "尴尬了九秒，然后有人递给你一根薯条，一切就好了。你找到了自己人，至少是饭搭子。"
        },
        "effects": {
          "reputation": 6,
          "mood": 6,
          "stress": -4,
          "confidence": 4
        }
      },
      {
        "id": "eat_alone",
        "text": {
          "en": "Eat alone and recharge",
          "zh": "一个人吃饭，回回血"
        },
        "resultText": {
          "en": "Sometimes the social battery just needs a quiet sandwich. You come back to the afternoon calmer, if a little lonelier.",
          "zh": "有时候社交电量就是需要一个安静的三明治。回到下午时你平静了一些，虽然也有点孤单。"
        },
        "effects": {
          "stress": -5,
          "stamina": 3,
          "mood": -1
        }
      },
      {
        "id": "study_lunch",
        "text": {
          "en": "Skip lunch chat, review notes instead",
          "zh": "不聊天，趁机看笔记"
        },
        "resultText": {
          "en": "You get ahead on the reading, but the table-laughter drifts over and you feel a small pang of FOMO.",
          "zh": "你提前看完了阅读材料，但那桌的笑声飘过来，你心里还是闪过一丝 FOMO。"
        },
        "effects": {
          "knowledge": 5,
          "reputation": -2,
          "stress": 2
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 2
  },
  {
    "id": "early_first_white_coat",
    "title": {
      "en": "The White Coat Fits",
      "zh": "白大褂上身的那一刻"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "confidence",
      "social"
    ],
    "weight": 11,
    "text": {
      "en": "White coat ceremony day. The coat is a little stiff, your name is embroidered on the chest, and your stomach is doing nervous-excited backflips.",
      "zh": "白大褂授袍仪式那天。大褂还有点硬挺，胸前绣着你的名字，你的胃在做着又紧张又兴奋的后空翻。"
    },
    "choices": [
      {
        "id": "soak_it_in",
        "text": {
          "en": "Stand still and let the moment land",
          "zh": "站定，让这一刻沉淀下来"
        },
        "resultText": {
          "en": "You let yourself feel how far you've come. Something quiet and proud settles in your chest, right under the embroidery.",
          "zh": "你允许自己感受这一路走了多远。一种安静又骄傲的东西落进胸口，正好在那行刺绣下面。"
        },
        "effects": {
          "confidence": 8,
          "mood": 7,
          "stress": -3
        }
      },
      {
        "id": "selfie_call",
        "text": {
          "en": "Video-call {partner} immediately",
          "zh": "立刻视频电话给 {partner}"
        },
        "resultText": {
          "en": "{partner} pretends to faint at how official you look, then says they always knew. You laugh so hard you nearly drop the phone.",
          "zh": "{partner} 假装被你专业的样子帅晕过去，然后说早就知道你能行。你笑得差点把手机摔了。"
        },
        "effects": {
          "love": 7,
          "mood": 6,
          "confidence": 4
        }
      },
      {
        "id": "imposter",
        "text": {
          "en": "Quietly worry you don't belong",
          "zh": "悄悄担心自己根本不配"
        },
        "resultText": {
          "en": "The imposter voice whispers, but you notice it's just a voice. You straighten the coat and decide to stay anyway.",
          "zh": "冒充者的声音在耳边低语，但你发现那只是个声音而已。你理了理大褂，决定不管怎样都留下来。"
        },
        "effects": {
          "confidence": 2,
          "stress": 3,
          "knowledge": 1
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 3
  },
  {
    "id": "early_time_management",
    "title": {
      "en": "Where Did the Day Go",
      "zh": "一天怎么就没了"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "study",
      "stress"
    ],
    "weight": 9,
    "text": {
      "en": "You blinked and it's 11 p.m. You had three things to do today and somehow did seven other things, none of which were on the list.",
      "zh": "你一眨眼就晚上十一点了。今天本来有三件事要做，结果你做了另外七件事，没有一件在清单上。"
    },
    "choices": [
      {
        "id": "time_block",
        "text": {
          "en": "Try time-blocking tomorrow",
          "zh": "明天试试时间分块"
        },
        "resultText": {
          "en": "You assign each hour a job like a tiny manager. It feels rigid for a day, then strangely freeing.",
          "zh": "你像个小经理一样给每个小时分配任务。头一天觉得很死板，然后竟然有种奇妙的自由感。"
        },
        "effects": {
          "knowledge": 4,
          "confidence": 5,
          "stress": -3,
          "stamina": -2
        }
      },
      {
        "id": "two_things",
        "text": {
          "en": "Pick just two priorities a day",
          "zh": "每天只挑两件最重要的"
        },
        "resultText": {
          "en": "Radically smaller list, radically less guilt. You finish both and feel like a functioning adult for once.",
          "zh": "清单大幅缩水，愧疚也大幅缩水。两件都做完了，你难得觉得自己是个正常运转的成年人。"
        },
        "effects": {
          "knowledge": 3,
          "stress": -6,
          "mood": 4
        }
      },
      {
        "id": "just_push",
        "text": {
          "en": "Stay up to claw the day back",
          "zh": "熬夜把今天找补回来"
        },
        "resultText": {
          "en": "You reclaim the lost hours from your sleep account. The interest rate on that loan is brutal.",
          "zh": "你从睡眠账户里把丢掉的时间补了回来。这笔贷款的利息高得吓人。"
        },
        "effects": {
          "knowledge": 5,
          "stamina": -7,
          "stress": 4
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 3
  },
  {
    "id": "early_homesickness",
    "title": {
      "en": "A Long Way From Home",
      "zh": "离家很远的夜晚"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "stress",
      "social"
    ],
    "weight": 9,
    "text": {
      "en": "It's a rainy Sunday and the apartment is too quiet. You miss your old kitchen, your old friends, and the way nobody back home asks what a periodontal ligament is.",
      "zh": "一个下雨的周日，公寓安静得过分。你想念以前的厨房，以前的朋友，还有老家没人会问你牙周韧带是什么的日子。"
    },
    "choices": [
      {
        "id": "call_home",
        "text": {
          "en": "Call family and just talk",
          "zh": "给家里打个电话，就随便聊聊"
        },
        "resultText": {
          "en": "They tell you the dog is fine and the neighbor is still weird. You hang up lighter, homesickness softened into something warm.",
          "zh": "他们告诉你狗很好，邻居还是那么怪。挂电话时你轻松了不少，乡愁化成了某种温暖的东西。"
        },
        "effects": {
          "mood": 6,
          "stress": -6,
          "stamina": 2
        }
      },
      {
        "id": "cook_comfort",
        "text": {
          "en": "Cook a dish from back home",
          "zh": "做一道家乡菜"
        },
        "resultText": {
          "en": "The kitchen smells like your childhood and you eat it standing up, smiling. It costs a bit but the comfort is worth it.",
          "zh": "厨房里飘着童年的味道，你站着把它吃完，一直在笑。花了点钱，但这份慰藉值。"
        },
        "effects": {
          "mood": 7,
          "stress": -5,
          "money": -4
        }
      },
      {
        "id": "bury_it",
        "text": {
          "en": "Push it down and study harder",
          "zh": "把情绪压下去，更拼命地学"
        },
        "resultText": {
          "en": "You get a lot done, but the quiet ache is still there at midnight. Productive, not exactly healed.",
          "zh": "你学了很多东西，但那种安静的酸楚到了半夜还在。是高效，但说不上治愈。"
        },
        "effects": {
          "knowledge": 6,
          "mood": -3,
          "stress": 3
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 3,
    "condition": {
      "maxStats": {
        "mood": 50
      }
    }
  },
  {
    "id": "early_comparing_to_peers",
    "title": {
      "en": "The Comparison Trap",
      "zh": "比较的陷阱"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "stress",
      "confidence",
      "social"
    ],
    "weight": 10,
    "text": {
      "en": "A classmate casually mentions they've already read three chapters ahead, finished the optional cases, and learned to suture from a YouTube channel. You have read the syllabus. Once.",
      "zh": "一个同学随口提到他们已经提前看了三章，做完了选做病例，还在 YouTube 上学会了缝合。而你看完了 syllabus。看了一次。"
    },
    "choices": [
      {
        "id": "own_pace",
        "text": {
          "en": "Remind yourself it's not a race",
          "zh": "提醒自己这不是赛跑"
        },
        "resultText": {
          "en": "You exhale and remember everyone's timeline is different. The comparison loosens its grip, just a little.",
          "zh": "你呼出一口气，想起每个人的时间线都不一样。比较的手稍微松开了一点。"
        },
        "effects": {
          "confidence": 5,
          "stress": -5,
          "mood": 3
        }
      },
      {
        "id": "use_as_fuel",
        "text": {
          "en": "Use it as motivation to push",
          "zh": "把它当成往前冲的燃料"
        },
        "resultText": {
          "en": "You channel the sting into a focused study night. It works, but you make a note to not do this every day.",
          "zh": "你把那点刺痛转化成了一个专注的学习夜晚。有用，但你提醒自己别天天这样。"
        },
        "effects": {
          "knowledge": 7,
          "stress": 4,
          "confidence": 2
        }
      },
      {
        "id": "ask_to_share",
        "text": {
          "en": "Ask them to study together",
          "zh": "约他们一起学"
        },
        "resultText": {
          "en": "Turns out the over-achiever is lonely and thrilled to share notes. You both come out ahead, and they're actually funny.",
          "zh": "原来那个学霸其实很孤单，超开心地分享了笔记。你俩都赚了，而且他人还挺逗。"
        },
        "effects": {
          "knowledge": 6,
          "reputation": 4,
          "stress": -3
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 3,
    "condition": {
      "maxStats": {
        "confidence": 50
      }
    }
  },
  {
    "id": "early_discovering_coffee",
    "title": {
      "en": "First Real Cup of Coffee",
      "zh": "人生第一杯认真的咖啡"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "study",
      "social"
    ],
    "weight": 8,
    "text": {
      "en": "Until now, coffee was a thing other people did. Tonight, staring down a thick study packet, you consider crossing over to the dark, caffeinated side.",
      "zh": "在此之前，咖啡是别人才喝的东西。今晚，盯着一叠厚厚的复习资料，你考虑要不要投奔黑暗的、含咖啡因的那一边。"
    },
    "choices": [
      {
        "id": "small_cup",
        "text": {
          "en": "Try one small cup, see how it goes",
          "zh": "先来一小杯，看看情况"
        },
        "resultText": {
          "en": "Mild buzz, pleasant focus, no regrets. You feel like a slightly more dangerous version of yourself.",
          "zh": "微微上头，专注度愉快地提升，毫无遗憾。你感觉自己变成了一个稍微危险一点的版本。"
        },
        "effects": {
          "knowledge": 4,
          "stamina": 4,
          "stress": -1
        }
      },
      {
        "id": "double_shot",
        "text": {
          "en": "Go straight to a double shot",
          "zh": "直接上双份浓缩"
        },
        "resultText": {
          "en": "You study with the intensity of a hummingbird, then lie awake at 3 a.m. hearing your own heartbeat. Worth it? Debatable.",
          "zh": "你以蜂鸟般的强度学习，然后凌晨三点躺着睡不着，听见自己的心跳。值吗？有待商榷。"
        },
        "effects": {
          "knowledge": 7,
          "stamina": 5,
          "stress": 6
        }
      },
      {
        "id": "stay_tea",
        "text": {
          "en": "Stick with tea and an early night",
          "zh": "还是喝茶，早点睡"
        },
        "resultText": {
          "en": "You keep your nervous system intact and review a little less. The tooth can wait; your sleep schedule thanks you.",
          "zh": "你保住了自己的神经系统，少复习了一点。牙可以等；你的作息表很感激你。"
        },
        "effects": {
          "stress": -5,
          "stamina": 3,
          "knowledge": 1
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 2
  },
  {
    "id": "early_quiz_back",
    "title": {
      "en": "Getting the Quiz Back",
      "zh": "小测发回来了"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "exam",
      "confidence",
      "stress"
    ],
    "weight": 10,
    "text": {
      "en": "The first quiz is handed back and your score is lower than you hoped. The red ink is doing the most. Around you, people are comparing numbers.",
      "zh": "第一次小测发回来了，分数比你期望的低。那些红笔批注简直用力过猛。你周围的人在互相对答案、比分数。"
    },
    "choices": [
      {
        "id": "review_mistakes",
        "text": {
          "en": "Quietly go through every wrong answer",
          "zh": "安静地把每道错题过一遍"
        },
        "resultText": {
          "en": "Painful but useful: you find a pattern in your mistakes and patch it. The next quiz won't catch you the same way.",
          "zh": "痛但有用：你发现了错题里的规律并补上了它。下次小测不会用同样的方式抓到你了。"
        },
        "effects": {
          "knowledge": 7,
          "confidence": 3,
          "stress": -1
        }
      },
      {
        "id": "spiral",
        "text": {
          "en": "Compare scores and quietly spiral",
          "zh": "对比分数然后悄悄内耗"
        },
        "resultText": {
          "en": "The numbers game eats an hour and leaves you flatter than before. You learn that this particular hobby has no winners.",
          "zh": "比分数这个游戏吃掉了你一个小时，让你比之前更低落。你学到了：这个爱好没有赢家。"
        },
        "effects": {
          "mood": -4,
          "stress": 5,
          "confidence": -3
        }
      },
      {
        "id": "talk_prof",
        "text": {
          "en": "Ask the professor what you missed",
          "zh": "去问教授自己哪里没掌握"
        },
        "resultText": {
          "en": "The professor is kinder than the red ink suggested and points you to exactly what to fix. You leave reassured.",
          "zh": "教授比那些红笔批注温和多了，精准地告诉你该补哪里。你走出办公室时安心了不少。"
        },
        "effects": {
          "knowledge": 5,
          "confidence": 5,
          "reputation": 2,
          "stress": -3
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 3
  },
  {
    "id": "early_study_group_dynamics",
    "title": {
      "en": "Study Group Chemistry",
      "zh": "学习小组的化学反应"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "social",
      "study",
      "stress"
    ],
    "weight": 9,
    "text": {
      "en": "Your new study group has one person who over-explains, one who only shows up to copy, and one who is genuinely brilliant but easily distracted. Tonight's session could go either way.",
      "zh": "你的新学习小组里有一个什么都过度讲解的，一个只来抄答案的，还有一个真的很聪明但特别容易跑题的。今晚这场学习不好说会往哪走。"
    },
    "choices": [
      {
        "id": "set_structure",
        "text": {
          "en": "Gently propose an agenda",
          "zh": "温和地提议定个流程"
        },
        "resultText": {
          "en": "You suggest topics and time limits without being bossy. The group actually gets through the material and likes you for it.",
          "zh": "你不强势地提出了主题和时间限制。小组真的把内容过完了，还因此更喜欢你了。"
        },
        "effects": {
          "knowledge": 6,
          "reputation": 5,
          "confidence": 4,
          "stress": -2
        }
      },
      {
        "id": "go_along",
        "text": {
          "en": "Go with the flow, chaos and all",
          "zh": "随大流，混乱就混乱吧"
        },
        "resultText": {
          "en": "It's 40% studying, 60% tangents about cafeteria pizza. You learn a little and laugh a lot.",
          "zh": "百分之四十在学习，百分之六十在跑题聊食堂披萨。你学到了一点点，笑到了一大堆。"
        },
        "effects": {
          "mood": 5,
          "reputation": 3,
          "knowledge": 2,
          "stress": -3
        }
      },
      {
        "id": "leave_solo",
        "text": {
          "en": "Bow out and study solo tonight",
          "zh": "退出，今晚自己学"
        },
        "resultText": {
          "en": "Alone, you cover twice the material in half the time. You also miss the in-jokes forming without you.",
          "zh": "一个人时，你用一半的时间学了两倍的内容。但你也错过了在没有你的情况下形成的那些梗。"
        },
        "effects": {
          "knowledge": 7,
          "reputation": -2,
          "stress": 1
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 3
  },
  {
    "id": "early_office_hours",
    "title": {
      "en": "Daring to Knock",
      "zh": "鼓起勇气敲门"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "confidence",
      "study",
      "social"
    ],
    "weight": 9,
    "text": {
      "en": "There's a concept that has refused to make sense for two weeks. Office hours are right now, the professor's door is open, and your hand is hovering near the doorframe.",
      "zh": "有个概念已经整整两周拒绝被你理解。教授的 office hours 正好是现在，门开着，你的手悬在门框边上。"
    },
    "choices": [
      {
        "id": "go_in",
        "text": {
          "en": "Knock and ask your 'dumb' question",
          "zh": "敲门，问出你那个“蠢”问题"
        },
        "resultText": {
          "en": "Turns out half the class was confused by the same thing. The professor explains it once and it finally clicks.",
          "zh": "原来半个班都被同一个东西困住了。教授讲了一遍，它终于通了。"
        },
        "effects": {
          "knowledge": 8,
          "confidence": 5,
          "reputation": 3,
          "stress": -2
        }
      },
      {
        "id": "google_first",
        "text": {
          "en": "Retreat and try to Google it alone",
          "zh": "撤退，自己先去 Google"
        },
        "resultText": {
          "en": "You eventually sort of get it from a forum post, but it took three times as long and you're not fully sure.",
          "zh": "你最后靠一个论坛帖子勉强搞懂了，但花了三倍时间，而且也没完全确定。"
        },
        "effects": {
          "knowledge": 3,
          "stamina": -3,
          "confidence": -1
        }
      },
      {
        "id": "bring_partner_note",
        "text": {
          "en": "Go in with the questions {partner} helped you list",
          "zh": "带着 {partner} 帮你列的问题清单进去"
        },
        "resultText": {
          "en": "{partner} had made you write your questions down last night 'so you don't freeze.' You don't freeze. It works beautifully.",
          "zh": "{partner} 昨晚让你把问题都写下来，“免得你一紧张就忘”。你没忘。效果好得很。"
        },
        "effects": {
          "knowledge": 7,
          "confidence": 6,
          "love": 3,
          "stress": -3
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 3
  },
  {
    "id": "early_learning_to_say_no",
    "title": {
      "en": "Learning to Say No",
      "zh": "学着说不"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "stress",
      "social",
      "confidence"
    ],
    "weight": 9,
    "text": {
      "en": "You're already stretched thin when three invitations land at once: a club committee, a weekend trip, and a classmate begging for help moving apartments. Your calendar is sweating.",
      "zh": "你已经快被掏空了，结果三个邀约同时砸下来：一个社团委员会、一个周末旅行，还有一个同学求你帮忙搬家。你的日历都在冒汗。"
    },
    "choices": [
      {
        "id": "say_no_kindly",
        "text": {
          "en": "Politely decline two of them",
          "zh": "礼貌地推掉其中两个"
        },
        "resultText": {
          "en": "Saying no out loud feels weird and then immediately wonderful. You protect your week and nobody hates you.",
          "zh": "把“不”说出口很奇怪，然后立刻变得超爽。你守住了自己的一周，也没人因此讨厌你。"
        },
        "effects": {
          "stress": -7,
          "stamina": 5,
          "confidence": 4,
          "reputation": -1
        }
      },
      {
        "id": "say_yes_all",
        "text": {
          "en": "Say yes to everything, somehow",
          "zh": "全都答应，硬撑"
        },
        "resultText": {
          "en": "You become wildly popular and wildly exhausted. By Sunday night you are a husk with great social connections.",
          "zh": "你变得超受欢迎，也超级累。到周日晚上，你成了一个社交关系良好的空壳。"
        },
        "effects": {
          "reputation": 6,
          "mood": 3,
          "stamina": -8,
          "stress": 7
        }
      },
      {
        "id": "help_friend_only",
        "text": {
          "en": "Skip the fun, help the friend move",
          "zh": "放弃娱乐，去帮朋友搬家"
        },
        "resultText": {
          "en": "Carrying boxes is tiring, but the friendship deepens over pizza on the floor afterward. A fair trade.",
          "zh": "搬箱子很累，但事后坐在地板上吃披萨时，这段友情更深了。划算。"
        },
        "effects": {
          "reputation": 4,
          "mood": 4,
          "stamina": -5,
          "stress": 2
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 3,
    "condition": {
      "maxStats": {
        "stamina": 50
      }
    }
  },
  {
    "id": "early_first_small_win",
    "title": {
      "en": "A Small, Real Win",
      "zh": "一个小小的、真实的胜利"
    },
    "stage": [
      "early"
    ],
    "tags": [
      "confidence",
      "study"
    ],
    "weight": 10,
    "text": {
      "en": "For the first time, something just worked: you explained a concept to a classmate and they finally got it, watching the understanding land on their face like sunrise. Huh. You actually know things now.",
      "zh": "第一次，有件事就这么顺了：你给同学讲了一个概念，他们终于懂了，那种恍然大悟像日出一样落在他们脸上。咦，原来你现在是真的懂东西了。"
    },
    "choices": [
      {
        "id": "celebrate",
        "text": {
          "en": "Treat yourself to something small",
          "zh": "给自己买点小东西庆祝一下"
        },
        "resultText": {
          "en": "You buy the fancy pastry, no guilt. Marking small wins turns out to be how you keep going for the long haul.",
          "zh": "你买了那个高级点心，毫无愧疚。给小胜利打个卡，原来正是能撑到最后的秘诀。"
        },
        "effects": {
          "mood": 6,
          "confidence": 5,
          "money": -3,
          "stress": -3
        }
      },
      {
        "id": "tutor_more",
        "text": {
          "en": "Offer to keep helping classmates",
          "zh": "主动表示愿意继续帮同学"
        },
        "resultText": {
          "en": "Teaching cements your own knowledge and your reputation quietly grows. It does eat into your own study time, though.",
          "zh": "教别人巩固了你自己的知识，你的口碑也悄悄涨了。不过确实占用了你自己的学习时间。"
        },
        "effects": {
          "knowledge": 6,
          "reputation": 6,
          "confidence": 3,
          "stamina": -3
        }
      },
      {
        "id": "tell_partner",
        "text": {
          "en": "Text {partner} about it right away",
          "zh": "马上发消息告诉 {partner}"
        },
        "resultText": {
          "en": "{partner} replies with seventeen exclamation marks and calls you 'professor' for the rest of the week. You glow a little.",
          "zh": "{partner} 回了十七个感叹号，接下来一整周都叫你“教授”。你心里美滋滋的。"
        },
        "effects": {
          "love": 5,
          "mood": 6,
          "confidence": 4
        }
      }
    ],
    "minSemester": 1,
    "maxSemester": 3
  },
  {
    "id": "pre_first_sim_lab",
    "title": {
      "en": "First Sim Lab",
      "zh": "第一次 sim lab"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "handSkill",
      "stress"
    ],
    "weight": 11,
    "text": {
      "en": "The typodont stares back at you. The handpiece feels like a power tool you definitely did not pass a safety course for. Everyone around you is already going.",
      "zh": "假牙模型静静地盯着你。手机（handpiece）拿在手里像个你绝对没考过安全证的电动工具。周围的人都已经开始动手了。"
    },
    "choices": [
      {
        "id": "dive_in",
        "text": {
          "en": "Just start and learn by doing",
          "zh": "直接开整，边做边学"
        },
        "resultText": {
          "en": "Chaotic, but your hands start remembering what your brain forgot.",
          "zh": "手忙脚乱，但你的手开始记住大脑忘掉的东西。"
        },
        "effects": {
          "handSkill": 6,
          "stress": 4,
          "confidence": 2
        }
      },
      {
        "id": "watch_neighbor",
        "text": {
          "en": "Quietly copy the calm person next to you",
          "zh": "悄悄模仿旁边那个很淡定的同学"
        },
        "resultText": {
          "en": "You learn the grip but lose ten minutes of bench time.",
          "zh": "学会了握持的姿势，但少了十分钟练习时间。"
        },
        "effects": {
          "handSkill": 3,
          "knowledge": 3,
          "stress": -1
        }
      },
      {
        "id": "read_manual",
        "text": {
          "en": "Reread the lab manual first",
          "zh": "先把实验手册重新看一遍"
        },
        "resultText": {
          "en": "Suspiciously mature, surprisingly effective. Slower start though.",
          "zh": "成熟得有点可疑，但意外地有效。就是起步慢了点。"
        },
        "effects": {
          "knowledge": 5,
          "handSkill": 1,
          "stress": -2
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "pre_waxup_marathon",
    "title": {
      "en": "Wax-Up Marathon",
      "zh": "蜡型马拉松"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "handSkill",
      "stress"
    ],
    "weight": 10,
    "text": {
      "en": "Carving cusps out of wax for the fifth hour. Your tiny molar is either a masterpiece or a potato, depending on the lighting.",
      "zh": "雕蜡型雕到第五个小时了。你那颗小磨牙到底是艺术品还是个土豆，全看打光角度。"
    },
    "choices": [
      {
        "id": "perfect_anatomy",
        "text": {
          "en": "Chase textbook-perfect anatomy",
          "zh": "死磕教科书级别的解剖结构"
        },
        "resultText": {
          "en": "The cusps look real. Your back and stamina disagree with the decision.",
          "zh": "牙尖看着挺真。但你的腰和体力对这个决定有意见。"
        },
        "effects": {
          "handSkill": 8,
          "stamina": -6,
          "stress": 3
        }
      },
      {
        "id": "good_enough",
        "text": {
          "en": "Call it good enough and go home",
          "zh": "差不多得了，回家"
        },
        "resultText": {
          "en": "Done is better than perfect. {partner} reheats dinner for you.",
          "zh": "完成胜过完美。{partner} 把饭给你热好了。"
        },
        "effects": {
          "handSkill": 4,
          "stress": -4,
          "love": 3,
          "stamina": 2
        }
      },
      {
        "id": "ask_feedback",
        "text": {
          "en": "Flag down a tutor for a quick check",
          "zh": "拦个助教快速看一眼"
        },
        "resultText": {
          "en": "One tip about your marginal ridge saves you an hour of guessing.",
          "zh": "关于边缘嵴的一句提点，省了你一小时瞎猜。"
        },
        "effects": {
          "knowledge": 4,
          "handSkill": 3,
          "stress": -1
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "pre_half_mm_off",
    "title": {
      "en": "Off by 0.5 mm",
      "zh": "差了 0.5 毫米"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "handSkill",
      "confidence"
    ],
    "weight": 11,
    "text": {
      "en": "Your prep depth is 0.5 mm too deep. On paper that's nothing. In your nervous system, it is a catastrophe.",
      "zh": "你的预备深度多了 0.5 毫米。写在纸上啥也不是。但在你的神经系统里，这是一场灾难。"
    },
    "choices": [
      {
        "id": "redo_clean",
        "text": {
          "en": "Redo it properly on a fresh tooth",
          "zh": "换颗新牙，老老实实重做"
        },
        "resultText": {
          "en": "The second one is sharper. The tooth can wait; your standards can't.",
          "zh": "第二颗明显更利落。牙可以等，但你的标准不能。"
        },
        "effects": {
          "handSkill": 6,
          "stress": 2,
          "confidence": 4,
          "stamina": -3
        }
      },
      {
        "id": "let_it_go",
        "text": {
          "en": "Accept it and note the lesson",
          "zh": "接受它，记下教训"
        },
        "resultText": {
          "en": "0.5 mm of grace for yourself. You'll feel it in your hands next time.",
          "zh": "给自己 0.5 毫米的宽容。下次手上自然会有感觉。"
        },
        "effects": {
          "knowledge": 4,
          "stress": -3,
          "confidence": 1
        }
      },
      {
        "id": "spiral",
        "text": {
          "en": "Stare at it and quietly spiral",
          "zh": "盯着它，默默 emo"
        },
        "resultText": {
          "en": "Twenty minutes gone, no tooth improved. Spiraling is not a technique.",
          "zh": "二十分钟没了，牙一点没变好。emo 不是一种技术。"
        },
        "effects": {
          "stress": 5,
          "mood": -3,
          "confidence": -2
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6,
    "condition": {
      "maxStats": {
        "confidence": 55
      }
    }
  },
  {
    "id": "pre_hand_fatigue",
    "title": {
      "en": "Hand Fatigue",
      "zh": "手累了"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "handSkill",
      "stress"
    ],
    "weight": 10,
    "text": {
      "en": "Three hours of fine motor control and your fingers are starting to file their own complaint. Your grip is getting shaky.",
      "zh": "精细操作三个小时，你的手指开始自己写投诉信了。握得越来越抖。"
    },
    "choices": [
      {
        "id": "push_through",
        "text": {
          "en": "Push through to finish the unit",
          "zh": "硬撑着把这个单元做完"
        },
        "resultText": {
          "en": "You finish, but the last cuts are messier than the first.",
          "zh": "做完了，但最后几刀明显比开头糙。"
        },
        "effects": {
          "handSkill": 3,
          "stamina": -7,
          "stress": 4
        }
      },
      {
        "id": "stretch_break",
        "text": {
          "en": "Stop, stretch, shake it out",
          "zh": "停下，拉伸，甩甩手"
        },
        "resultText": {
          "en": "Five minutes of stretching and your hands come back online.",
          "zh": "拉伸五分钟，手又重新上线了。"
        },
        "effects": {
          "stamina": 4,
          "stress": -3,
          "handSkill": 1
        }
      },
      {
        "id": "coffee_run",
        "text": {
          "en": "Grab coffee with a labmate",
          "zh": "和同学去买杯咖啡"
        },
        "resultText": {
          "en": "Caffeine and gossip. Your money goes down; your mood goes up.",
          "zh": "咖啡因加八卦。钱包瘪了，心情好了。"
        },
        "effects": {
          "mood": 4,
          "stress": -2,
          "money": -2,
          "stamina": 2
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "pre_instrument_names",
    "title": {
      "en": "Learning the Instrument Names",
      "zh": "记器械的名字"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "stress",
      "confidence"
    ],
    "weight": 9,
    "text": {
      "en": "The tray has fourteen pointy things and they all have the energy of a password you forgot. The instructor calls one by name and waits.",
      "zh": "托盘上十四个尖尖的东西，每一个都散发着你忘掉的密码的气息。老师报了一个名字，等着你递。"
    },
    "choices": [
      {
        "id": "flashcards",
        "text": {
          "en": "Make flashcards that night",
          "zh": "当晚做一套抽认卡"
        },
        "resultText": {
          "en": "Boring, but next week you hand them over without hesitating.",
          "zh": "无聊，但下周你递器械时一点都不带犹豫的。"
        },
        "effects": {
          "knowledge": 6,
          "confidence": 3,
          "stress": -1
        }
      },
      {
        "id": "wing_it",
        "text": {
          "en": "Wing it and hope context helps",
          "zh": "硬猜，指望情境能帮忙"
        },
        "resultText": {
          "en": "You guess wrong twice. Mildly embarrassing, weirdly memorable.",
          "zh": "你猜错了两次。有点尴尬，但记得出奇地牢。"
        },
        "effects": {
          "knowledge": 2,
          "confidence": -2,
          "stress": 2
        }
      },
      {
        "id": "quiz_partner",
        "text": {
          "en": "Quiz each other with a labmate",
          "zh": "和同学互相抽背"
        },
        "resultText": {
          "en": "You both learn faster and laugh at the silly names.",
          "zh": "两个人都学得更快，还顺便嘲笑了那些奇怪的名字。"
        },
        "effects": {
          "knowledge": 5,
          "mood": 3,
          "reputation": 1
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "pre_faculty_bench_check",
    "title": {
      "en": "The Faculty Bench Check",
      "zh": "老师来查台"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "stress",
      "confidence"
    ],
    "weight": 11,
    "text": {
      "en": "A faculty member is doing the rounds with a mirror and an explorer, working their way down the bench toward you. Your prep is... fine? Probably?",
      "zh": "一位老师正拿着口镜和探针挨个查台，沿着桌子一步步朝你这边走来。你的预备……还行吧？应该吧？"
    },
    "choices": [
      {
        "id": "own_it",
        "text": {
          "en": "Point out your own weak spot first",
          "zh": "主动先指出自己的薄弱点"
        },
        "resultText": {
          "en": "They nod, respect the honesty, and give you a real fix.",
          "zh": "老师点点头，欣赏你的坦诚，给了你一个真正有用的改法。"
        },
        "effects": {
          "knowledge": 5,
          "reputation": 3,
          "stress": -2
        }
      },
      {
        "id": "say_nothing",
        "text": {
          "en": "Stay quiet and let them find it",
          "zh": "闭嘴，让老师自己发现"
        },
        "resultText": {
          "en": "They find it anyway. Same feedback, slightly more sweating.",
          "zh": "老师反正也发现了。一样的反馈，就是你多出了点汗。"
        },
        "effects": {
          "knowledge": 4,
          "stress": 3
        }
      },
      {
        "id": "oversell",
        "text": {
          "en": "Confidently oversell the prep",
          "zh": "自信满满地夸大其词"
        },
        "resultText": {
          "en": "The explorer catches the undercut. Confidence: re-calibrated.",
          "zh": "探针一下就勾到了倒凹。自信：已重新校准。"
        },
        "effects": {
          "confidence": -3,
          "reputation": -2,
          "knowledge": 3
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "pre_redo_prep",
    "title": {
      "en": "Redo the Prep",
      "zh": "重做预备"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "handSkill",
      "stress"
    ],
    "weight": 10,
    "text": {
      "en": "\"Start over,\" says the tutor, not unkindly. You have one fresh typodont tooth and a slowly sinking feeling.",
      "zh": "“重来一次吧，”助教语气其实不坏。你手里有一颗新的假牙，外加一种慢慢往下沉的心情。"
    },
    "choices": [
      {
        "id": "fresh_mindset",
        "text": {
          "en": "Treat it as a free practice rep",
          "zh": "把它当成一次免费的练习机会"
        },
        "resultText": {
          "en": "Reframed and relaxed, your hands actually do better this time.",
          "zh": "换个心态放松下来，这次你的手反而做得更好。"
        },
        "effects": {
          "handSkill": 7,
          "confidence": 3,
          "stress": -1
        }
      },
      {
        "id": "grumble",
        "text": {
          "en": "Grumble but grind it out",
          "zh": "嘴上抱怨，手上照做"
        },
        "resultText": {
          "en": "Done correctly, mood slightly dented, lesson absolutely learned.",
          "zh": "做对了，心情有点小受伤，但教训是真学到了。"
        },
        "effects": {
          "handSkill": 5,
          "mood": -2,
          "stamina": -3,
          "stress": 2
        }
      },
      {
        "id": "ask_why",
        "text": {
          "en": "Ask exactly what to change",
          "zh": "问清楚到底要改哪里"
        },
        "resultText": {
          "en": "The specific answer turns a redo into an upgrade.",
          "zh": "一个具体的答案，把重做变成了升级。"
        },
        "effects": {
          "knowledge": 5,
          "handSkill": 4
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "pre_flow_state",
    "title": {
      "en": "Flow State",
      "zh": "心流状态"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "handSkill",
      "confidence"
    ],
    "weight": 9,
    "text": {
      "en": "Somewhere in the last half hour the noise faded and it was just you, the bur, and the tooth. Your hands knew exactly what to do. Then you look up and three hours vanished.",
      "zh": "不知道从哪半小时开始，周围的噪音消失了，只剩下你、车针和那颗牙。你的手清楚地知道该干嘛。等你一抬头，三个小时没了。"
    },
    "choices": [
      {
        "id": "ride_it",
        "text": {
          "en": "Ride the wave for one more unit",
          "zh": "趁手感再多做一个单元"
        },
        "resultText": {
          "en": "Best work of the semester. Also you forgot to eat.",
          "zh": "这学期做得最好的一次。顺便你忘了吃饭。"
        },
        "effects": {
          "handSkill": 9,
          "confidence": 4,
          "stamina": -5
        }
      },
      {
        "id": "stop_high",
        "text": {
          "en": "Stop on a high note and rest",
          "zh": "在状态最好的时候收手休息"
        },
        "resultText": {
          "en": "Suspiciously mature. You leave proud and still have energy.",
          "zh": "成熟得有点可疑。你心满意足地走了，还有余力。"
        },
        "effects": {
          "handSkill": 5,
          "confidence": 3,
          "stress": -3
        }
      },
      {
        "id": "tell_partner",
        "text": {
          "en": "Text {partner} that it finally clicked",
          "zh": "发消息告诉 {partner} 你突然开窍了"
        },
        "resultText": {
          "en": "{partner} replies with three exclamation marks and a cookie emoji.",
          "zh": "{partner} 回了你三个感叹号和一个饼干表情。"
        },
        "effects": {
          "handSkill": 4,
          "mood": 4,
          "love": 3
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "pre_late_night_lab",
    "title": {
      "en": "Late-Night Lab",
      "zh": "深夜实验室"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "stress",
      "handSkill"
    ],
    "weight": 10,
    "text": {
      "en": "It's 10:40 pm and the lab is nearly empty. Your brain has roughly 80 tabs open and two of them are playing audio. The deadline is tomorrow.",
      "zh": "晚上十点四十，实验室快空了。你的大脑大概开了 80 个标签页，其中两个还在自动播放声音。明天就是 deadline。"
    },
    "choices": [
      {
        "id": "finish_tonight",
        "text": {
          "en": "Power through and finish tonight",
          "zh": "拼一把，今晚做完"
        },
        "resultText": {
          "en": "Done at midnight. Tomorrow-you will have opinions about tonight-you.",
          "zh": "半夜搞定。明天的你会对今晚的你有点意见。"
        },
        "effects": {
          "handSkill": 4,
          "stamina": -8,
          "stress": 3
        }
      },
      {
        "id": "go_home_sleep",
        "text": {
          "en": "Go home; the tooth can wait",
          "zh": "回家，牙可以等"
        },
        "resultText": {
          "en": "The tooth can wait; your nervous system cannot. You sleep, you recover.",
          "zh": "牙可以等，你的神经系统不能。你好好睡了一觉，缓过来了。"
        },
        "effects": {
          "stamina": 6,
          "stress": -5,
          "handSkill": -1
        }
      },
      {
        "id": "early_morning",
        "text": {
          "en": "Set a 6 am alarm to finish fresh",
          "zh": "定个早上六点的闹钟，醒来再做"
        },
        "resultText": {
          "en": "A gamble, but morning-you has steadier hands and clearer eyes.",
          "zh": "有点赌，但早上的你手更稳、眼更清。"
        },
        "effects": {
          "handSkill": 5,
          "stamina": -2,
          "stress": -1
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6,
    "condition": {
      "maxStats": {
        "stamina": 50
      }
    }
  },
  {
    "id": "pre_loupes_upgrade",
    "title": {
      "en": "Loupes and Magnification",
      "zh": "放大镜（loupes）"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "handSkill",
      "confidence"
    ],
    "weight": 9,
    "text": {
      "en": "You finally try a borrowed pair of loupes. Suddenly your prep, which felt smooth, looks like a moon landscape. Both horrifying and incredibly useful.",
      "zh": "你终于试了试借来的 loupes。本来感觉很顺滑的预备，一下子变成了月球表面。又吓人又超级有用。"
    },
    "choices": [
      {
        "id": "buy_own",
        "text": {
          "en": "Save up and order your own pair",
          "zh": "攒钱给自己买一副"
        },
        "resultText": {
          "en": "Pricey, but your detail work jumps a whole level. Worth it.",
          "zh": "挺贵，但你的细节处理直接上了一个台阶。值。"
        },
        "effects": {
          "handSkill": 7,
          "money": -12,
          "confidence": 4
        }
      },
      {
        "id": "borrow_more",
        "text": {
          "en": "Keep borrowing for now",
          "zh": "暂时先继续借着用"
        },
        "resultText": {
          "en": "Free, but you only get the benefit on lucky days.",
          "zh": "免费，但只有运气好的时候才借得到。"
        },
        "effects": {
          "handSkill": 3,
          "stress": 1
        }
      },
      {
        "id": "naked_eye",
        "text": {
          "en": "Stick to the naked eye for grit",
          "zh": "坚持肉眼，练基本功"
        },
        "resultText": {
          "en": "Your eyes work harder; your fundamentals get tougher. Trade-off accepted.",
          "zh": "眼睛更累，但基本功更扎实。这笔交易你接受。"
        },
        "effects": {
          "handSkill": 4,
          "stamina": -3,
          "confidence": 1
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "pre_perfectionism_deadline",
    "title": {
      "en": "Perfectionism vs Deadline",
      "zh": "完美主义 vs 截止时间"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "stress",
      "confidence"
    ],
    "weight": 11,
    "text": {
      "en": "You could submit a solid prep now, or spend two more hours chasing a polish nobody asked for. The clock is very much watching.",
      "zh": "你现在可以交一份很扎实的预备，也可以再花两小时去追一个没人要求的抛光。时钟正盯着你呢。"
    },
    "choices": [
      {
        "id": "submit_now",
        "text": {
          "en": "Submit the solid version now",
          "zh": "现在就交这份扎实的版本"
        },
        "resultText": {
          "en": "Good enough is genuinely good. You buy back your evening.",
          "zh": "“差不多”其实真的挺好。你把整个晚上赎回来了。"
        },
        "effects": {
          "stress": -5,
          "mood": 3,
          "handSkill": 2
        }
      },
      {
        "id": "two_more_hours",
        "text": {
          "en": "Chase the perfect polish",
          "zh": "继续追求完美抛光"
        },
        "resultText": {
          "en": "Marginally prettier, meaningfully more tired. The grade is identical.",
          "zh": "稍微好看了一点点，但累了一大截。分数一模一样。"
        },
        "effects": {
          "handSkill": 3,
          "stamina": -6,
          "stress": 4
        }
      },
      {
        "id": "one_fix",
        "text": {
          "en": "Fix one thing, then submit",
          "zh": "只改一个地方，然后就交"
        },
        "resultText": {
          "en": "Disciplined. One targeted fix, then you walk away clean.",
          "zh": "有分寸。改一处关键的，然后干净利落地收工。"
        },
        "effects": {
          "handSkill": 4,
          "stress": -2,
          "confidence": 2
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6,
    "condition": {
      "maxStats": {
        "mood": 55
      }
    }
  },
  {
    "id": "pre_back_ergonomics",
    "title": {
      "en": "Your Back Files a Complaint",
      "zh": "你的腰提交了投诉"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "stress",
      "handSkill"
    ],
    "weight": 10,
    "text": {
      "en": "You've been hunched over the typodont like a question mark for hours. There's a knot between your shoulder blades that has its own zip code now.",
      "zh": "你已经像个问号一样弓在假牙模型上好几个小时了。肩胛骨之间那个结，现在都有自己的门牌号了。"
    },
    "choices": [
      {
        "id": "fix_posture",
        "text": {
          "en": "Reset your chair, mirror, and posture",
          "zh": "重新调整椅子、口镜和坐姿"
        },
        "resultText": {
          "en": "Ten minutes of setup saves your spine and steadies your hands.",
          "zh": "花十分钟调整，救了你的脊椎，也让手更稳了。"
        },
        "effects": {
          "stamina": 4,
          "handSkill": 3,
          "stress": -2
        }
      },
      {
        "id": "ignore_back",
        "text": {
          "en": "Ignore it and keep grinding",
          "zh": "无视它，继续干"
        },
        "resultText": {
          "en": "You finish more, but you'll be walking like a creaky door tomorrow.",
          "zh": "多做了点，但明天你走路会像扇吱呀作响的门。"
        },
        "effects": {
          "handSkill": 3,
          "stamina": -7,
          "stress": 2
        }
      },
      {
        "id": "walk_lap",
        "text": {
          "en": "Take a lap and roll your shoulders",
          "zh": "出去走一圈，转转肩膀"
        },
        "resultText": {
          "en": "The knot loosens, your eyes refocus. Cheap, effective maintenance.",
          "zh": "结松开了，眼睛也重新对上焦了。便宜又有效的保养。"
        },
        "effects": {
          "stamina": 3,
          "stress": -3,
          "mood": 2
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "pre_it_finally_clicks",
    "title": {
      "en": "The First Time It Clicks",
      "zh": "第一次开窍"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "handSkill",
      "confidence"
    ],
    "weight": 10,
    "text": {
      "en": "For weeks the bur felt like a stranger. Today, mid-cut, your hand just... knows the angle. No thinking. It clicks, quietly, and you almost tear up over a plastic molar.",
      "zh": "好几个星期了，车针一直像个陌生人。今天切到一半，你的手突然就……知道了那个角度。不用想。咔哒一下，你差点对着一颗塑料磨牙落泪。"
    },
    "choices": [
      {
        "id": "savor_it",
        "text": {
          "en": "Pause and let yourself feel it",
          "zh": "停一下，让自己好好感受一下"
        },
        "resultText": {
          "en": "You earned this one. Confidence quietly upgrades to a real number.",
          "zh": "这个是你应得的。自信悄悄升级成了一个真实的数字。"
        },
        "effects": {
          "confidence": 6,
          "mood": 4,
          "handSkill": 3
        }
      },
      {
        "id": "lock_it_in",
        "text": {
          "en": "Immediately repeat it to lock it in",
          "zh": "马上再做一遍，把手感固定住"
        },
        "resultText": {
          "en": "Three clean reps in a row. The muscle memory is now actually yours.",
          "zh": "连续三个干净的动作。肌肉记忆现在是真正属于你的了。"
        },
        "effects": {
          "handSkill": 7,
          "stamina": -4,
          "confidence": 3
        }
      },
      {
        "id": "share_partner",
        "text": {
          "en": "Call {partner} from the hallway",
          "zh": "跑到走廊给 {partner} 打个电话"
        },
        "resultText": {
          "en": "{partner} doesn't fully get the bur angle, but cheers anyway. That helps more than the angle did.",
          "zh": "{partner} 其实没完全听懂那个车针角度，但还是给你欢呼。这比那个角度还管用。"
        },
        "effects": {
          "mood": 5,
          "love": 4,
          "confidence": 2
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "pre_typodont_swap",
    "title": {
      "en": "The Typodont Mix-Up",
      "zh": "假牙模型搞错了"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "stress",
      "handSkill"
    ],
    "weight": 9,
    "text": {
      "en": "Halfway through you realize the typodont on your bench isn't yours, and the missing tooth slot means you've been prepping the wrong number entirely.",
      "zh": "做到一半你才发现，台上这副假牙模型不是你的，缺牙的位置说明你一直在预备完全错误的那颗牙。"
    },
    "choices": [
      {
        "id": "swap_calmly",
        "text": {
          "en": "Calmly swap and restart on yours",
          "zh": "冷静地换回自己的，重新开始"
        },
        "resultText": {
          "en": "Annoying, but you keep the practice and lose only some time.",
          "zh": "挺烦的，但练习没白费，只是损失了点时间。"
        },
        "effects": {
          "handSkill": 3,
          "stress": 2,
          "stamina": -2
        }
      },
      {
        "id": "tell_owner",
        "text": {
          "en": "Track down whose it is and apologize",
          "zh": "找出是谁的，去道个歉"
        },
        "resultText": {
          "en": "Turns out they had yours too. You both laugh; goodwill restored.",
          "zh": "结果对方也拿了你的。两人一起笑了，关系反而更好了。"
        },
        "effects": {
          "reputation": 3,
          "mood": 2,
          "stress": -1
        }
      },
      {
        "id": "panic_quietly",
        "text": {
          "en": "Panic quietly for a minute first",
          "zh": "先默默崩溃一分钟"
        },
        "resultText": {
          "en": "The panic changes nothing, but it does cost you a minute.",
          "zh": "崩溃啥也没改变，倒是花了你一分钟。"
        },
        "effects": {
          "stress": 3,
          "mood": -1
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "pre_labmate_struggling",
    "title": {
      "en": "The Labmate Who's Stuck",
      "zh": "卡住的同学"
    },
    "stage": [
      "preclinical",
      "transition"
    ],
    "tags": [
      "lab",
      "confidence",
      "stress"
    ],
    "weight": 9,
    "text": {
      "en": "The student next to you keeps fracturing their wax margin and is one sigh away from giving up. You actually know the fix for this one.",
      "zh": "你旁边的同学蜡型边缘老是崩，再叹一口气就要放弃了。这个问题你正好知道怎么解决。"
    },
    "choices": [
      {
        "id": "help_them",
        "text": {
          "en": "Stop and show them your trick",
          "zh": "停下来，教他们你的小窍门"
        },
        "resultText": {
          "en": "Teaching it locks it in for you too, and they breathe again.",
          "zh": "教别人的过程也帮你巩固了，而对方终于能喘口气了。"
        },
        "effects": {
          "knowledge": 3,
          "reputation": 4,
          "empathy": 3,
          "handSkill": -1
        }
      },
      {
        "id": "stay_focused",
        "text": {
          "en": "Stay focused on your own deadline",
          "zh": "专注于自己的截止时间"
        },
        "resultText": {
          "en": "You finish on time, but a small guilty pang lingers.",
          "zh": "你按时做完了，但心里有点小小的过意不去。"
        },
        "effects": {
          "handSkill": 4,
          "mood": -2,
          "stress": -1
        }
      },
      {
        "id": "quick_tip",
        "text": {
          "en": "Give one quick tip, then keep going",
          "zh": "给一句快速提示，然后继续干活"
        },
        "resultText": {
          "en": "A balanced move: they get unstuck, you barely lose a minute.",
          "zh": "一个平衡的选择：他们脱困了，你也几乎没耽误时间。"
        },
        "effects": {
          "empathy": 2,
          "reputation": 2,
          "handSkill": 2
        }
      }
    ],
    "minSemester": 2,
    "maxSemester": 6
  },
  {
    "id": "clin_first_patient",
    "title": {
      "en": "Your First Real Patient",
      "zh": "你的第一位真实病人"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinic",
      "patient",
      "confidence"
    ],
    "weight": 11,
    "text": {
      "en": "The chart is real, the chair is real, and the person sitting in it is a real human who trusted the appointment system. Your hands are doing that thing where they pretend they've never held an instrument before.",
      "zh": "病历是真的，椅子是真的，坐在上面的也是一个真真切切信任了预约系统的活人。你的手又开始装作这辈子没拿过器械的样子。"
    },
    "choices": [
      {
        "id": "breathe_first",
        "text": {
          "en": "Breathe, introduce yourself, go slow",
          "zh": "深呼吸，自我介绍，慢慢来"
        },
        "resultText": {
          "en": "You say your name out loud and your shoulders drop two inches. Slow turns out to be steady.",
          "zh": "你把名字说出口，肩膀一下子松了下来。慢，原来就是稳。"
        },
        "effects": {
          "confidence": 6,
          "empathy": 5,
          "stress": -3
        }
      },
      {
        "id": "rush_to_prove",
        "text": {
          "en": "Move fast to look competent",
          "zh": "动作麻利点显得专业"
        },
        "resultText": {
          "en": "You look efficient and feel like a hummingbird. You finish, but your heart rate files a complaint.",
          "zh": "你看着很利落，心里却像只蜂鸟。活儿干完了，但你的心率提出了投诉。"
        },
        "effects": {
          "handSkill": 3,
          "confidence": 4,
          "stress": 7
        }
      },
      {
        "id": "lean_on_faculty",
        "text": {
          "en": "Quietly ask faculty to shadow",
          "zh": "悄悄请带教在旁边盯着"
        },
        "resultText": {
          "en": "Faculty hovers and nods. The patient never notices; you learn three things you'd have missed.",
          "zh": "带教在旁边盯着、点头。病人毫无察觉，你学到了三个本来会漏掉的细节。"
        },
        "effects": {
          "knowledge": 5,
          "clinicalSense": 4,
          "confidence": -2
        }
      }
    ],
    "minSemester": 7,
    "maxSemester": 11,
    "condition": {
      "maxStats": {
        "confidence": 55
      }
    }
  },
  {
    "id": "clin_will_it_hurt",
    "title": {
      "en": "\"Will It Hurt?\"",
      "zh": "“会疼吗？”"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "patient",
      "empathy",
      "confidence"
    ],
    "weight": 10,
    "text": {
      "en": "Your patient grips the armrest before you've touched a single thing and asks the oldest question in dentistry: will it hurt?",
      "zh": "你还什么都没碰，病人就攥紧了扶手，问出了牙科界最古老的那个问题：会疼吗？"
    },
    "choices": [
      {
        "id": "honest_gentle",
        "text": {
          "en": "Be honest: a pinch, then numb",
          "zh": "如实说：先有点扎，然后就麻了"
        },
        "resultText": {
          "en": "\"A small pinch, then nothing.\" They believe you because it's true, and it goes exactly that way.",
          "zh": "“先一点点扎，然后就没感觉了。”因为是真话，他们信了，结果也确实如此。"
        },
        "effects": {
          "empathy": 6,
          "confidence": 4,
          "stress": -2
        }
      },
      {
        "id": "overpromise",
        "text": {
          "en": "Promise they'll feel nothing at all",
          "zh": "保证一点都不会疼"
        },
        "resultText": {
          "en": "They feel the pinch you swore wouldn't come. Trust takes a small, avoidable dent.",
          "zh": "他们还是感觉到了你发誓不会有的那一下。信任出现了一道本可避免的小裂痕。"
        },
        "effects": {
          "empathy": -4,
          "reputation": -2,
          "stress": 3
        }
      },
      {
        "id": "explain_each_step",
        "text": {
          "en": "Narrate every step before you do it",
          "zh": "每一步动手前都先讲一遍"
        },
        "resultText": {
          "en": "Talking it through eats a few minutes but the white-knuckle grip relaxes. Worth it.",
          "zh": "讲解花了几分钟，但那双攥白的手松开了。值。"
        },
        "effects": {
          "empathy": 5,
          "clinicalSense": 2,
          "stress": 2
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_no_show",
    "title": {
      "en": "The No-Show",
      "zh": "病人放鸽子了"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinic",
      "patient"
    ],
    "weight": 9,
    "text": {
      "en": "Twenty minutes past the appointment time, your chair is empty and your quota requirement is staring at you like an unread email.",
      "zh": "约定时间过了二十分钟，你的椅位空着，而你的临床指标正像一封未读邮件一样盯着你。"
    },
    "choices": [
      {
        "id": "call_reschedule",
        "text": {
          "en": "Call them and reschedule kindly",
          "zh": "打电话过去，好好改个时间"
        },
        "resultText": {
          "en": "Turns out the bus stranded them. You rebook; they show up early next time, grateful.",
          "zh": "原来是公交把他们困住了。你重新约了时间，下次他们提早就来了，满是感激。"
        },
        "effects": {
          "reputation": 4,
          "empathy": 3,
          "stress": -1
        }
      },
      {
        "id": "study_the_gap",
        "text": {
          "en": "Use the empty slot to study",
          "zh": "用这段空当复习"
        },
        "resultText": {
          "en": "You crack open notes and actually absorb a chapter. The day isn't wasted, just rerouted.",
          "zh": "你翻开笔记，居然真把一章看进去了。这天没浪费，只是改道了。"
        },
        "effects": {
          "knowledge": 6,
          "stress": -2,
          "confidence": 1
        }
      },
      {
        "id": "stew_about_quota",
        "text": {
          "en": "Spiral about your requirement count",
          "zh": "为指标焦虑到原地打转"
        },
        "resultText": {
          "en": "You spend the slot doing anxiety math. The numbers don't move; your stress does.",
          "zh": "你花了一整段时间做焦虑算术。数字没动，焦虑倒是涨了。"
        },
        "effects": {
          "stress": 8,
          "mood": -4,
          "knowledge": -1
        }
      },
      {
        "id": "grab_walkin",
        "text": {
          "en": "Ask the desk for a walk-in",
          "zh": "去前台问有没有 walk-in"
        },
        "resultText": {
          "en": "The desk hands you a walk-in screening. Unexpected case, unexpectedly good practice.",
          "zh": "前台塞给你一个临时检查的病人。意外的病例，意外地很练手。"
        },
        "effects": {
          "clinicalSense": 4,
          "stress": 3,
          "reputation": 2
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_late_patient",
    "title": {
      "en": "Twenty-Five Minutes Late",
      "zh": "迟到了二十五分钟"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinic",
      "patient",
      "empathy"
    ],
    "weight": 9,
    "text": {
      "en": "Your patient rushes in apologizing, hair still wet, coat half on. There's not really enough time left to do the whole plan.",
      "zh": "病人冲进来连声道歉，头发还是湿的，外套挂了一半。说实话，剩下的时间已经不够做完整个计划了。"
    },
    "choices": [
      {
        "id": "do_partial",
        "text": {
          "en": "Do what fits, schedule the rest",
          "zh": "能做多少做多少，剩下的再约"
        },
        "resultText": {
          "en": "You handle the priority step well and rebook the rest. Honest, tidy, no drama.",
          "zh": "你把最要紧的一步做漂亮了，其余的另约。诚实、干净、不闹腾。"
        },
        "effects": {
          "clinicalSense": 4,
          "empathy": 3,
          "reputation": 2
        }
      },
      {
        "id": "cram_it_all",
        "text": {
          "en": "Try to cram the full plan in",
          "zh": "硬塞，把全部计划做完"
        },
        "resultText": {
          "en": "You finish by sprinting and your notes suffer. The tooth's fine; your focus is fried.",
          "zh": "你一路狂奔做完了，病历记得潦草。牙没问题，你的脑子先烧了。"
        },
        "effects": {
          "handSkill": 2,
          "stress": 9,
          "mood": -3
        }
      },
      {
        "id": "guilt_trip",
        "text": {
          "en": "Let them know they were quite late",
          "zh": "让他们知道这次真的挺晚"
        },
        "resultText": {
          "en": "They get quieter and apologize more. You realize the lecture helped no one.",
          "zh": "他们变得更安静，道歉得更多了。你意识到这通说教谁都没帮上。"
        },
        "effects": {
          "empathy": -3,
          "reputation": -2,
          "mood": -1
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_treatment_plan",
    "title": {
      "en": "Building the Treatment Plan",
      "zh": "制定治疗计划"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinicalSense",
      "patient"
    ],
    "weight": 10,
    "text": {
      "en": "Three reasonable options, one patient, and that quiet pressure to pick the plan that looks most impressive on your case log.",
      "zh": "三个都说得通的方案，一个病人，还有那股悄悄的压力——选个在你病例本上最好看的。"
    },
    "choices": [
      {
        "id": "patient_first",
        "text": {
          "en": "Pick what's best for the patient",
          "zh": "选对病人最好的那个"
        },
        "resultText": {
          "en": "You choose the simpler, sturdier plan. Less flashy for your log, exactly right for them.",
          "zh": "你选了更简单、更耐用的方案。病例本上不够炫，但对他们刚刚好。"
        },
        "effects": {
          "clinicalSense": 6,
          "empathy": 5,
          "reputation": 3
        }
      },
      {
        "id": "impressive_case",
        "text": {
          "en": "Pick the more impressive procedure",
          "zh": "选更能撑场面的术式"
        },
        "resultText": {
          "en": "Great for your portfolio, heavier for them. Faculty raises one slow eyebrow.",
          "zh": "对你的作品集很好，对他们负担更重。带教缓缓挑了挑眉。"
        },
        "effects": {
          "handSkill": 4,
          "clinicalSense": -2,
          "reputation": -1
        }
      },
      {
        "id": "ask_faculty_input",
        "text": {
          "en": "Talk all three through with faculty",
          "zh": "把三个方案都跟带教过一遍"
        },
        "resultText": {
          "en": "Faculty walks you through the tradeoffs. Slower today, sharper for every plan after.",
          "zh": "带教带你把利弊一条条捋了。今天慢了点，但往后每个方案你都更利落了。"
        },
        "effects": {
          "knowledge": 5,
          "clinicalSense": 4,
          "stress": 1
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_waiting_approval",
    "title": {
      "en": "Waiting for the Check-Off",
      "zh": "等带教签字"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinic",
      "confidence"
    ],
    "weight": 9,
    "text": {
      "en": "You're prepped, gloved, and ready, but faculty is across the clinic mid-conversation. Your patient waits; your gloves slowly fog with patience.",
      "zh": "你准备好了，戴好手套，万事俱备，但带教在诊室另一头聊得正起劲。病人等着，你的手套也在耐心里慢慢起雾。"
    },
    "choices": [
      {
        "id": "use_time_well",
        "text": {
          "en": "Chat with your patient while you wait",
          "zh": "等的时候跟病人聊聊天"
        },
        "resultText": {
          "en": "You learn they're a beekeeper. The wait flies by and rapport quietly doubles.",
          "zh": "你听说他们是养蜂人。等待飞快过去，关系悄悄翻了倍。"
        },
        "effects": {
          "empathy": 5,
          "mood": 3,
          "stress": -2
        }
      },
      {
        "id": "flag_politely",
        "text": {
          "en": "Politely flag that you're ready",
          "zh": "礼貌地示意你这边好了"
        },
        "resultText": {
          "en": "You catch faculty's eye with a small wave. They come over sooner; nobody's annoyed.",
          "zh": "你一个小招手抓住带教的目光。他们提早过来了，谁都没不高兴。"
        },
        "effects": {
          "confidence": 4,
          "clinicalSense": 2,
          "stress": -1
        }
      },
      {
        "id": "start_without",
        "text": {
          "en": "Start the irreversible step solo",
          "zh": "不等了，自己先做不可逆的一步"
        },
        "resultText": {
          "en": "You jump ahead and faculty has to pause you. A teachable moment, the awkward kind.",
          "zh": "你抢跑了，带教不得不叫停你。一个可以学习的瞬间——尴尬的那种。"
        },
        "effects": {
          "handSkill": 2,
          "reputation": -4,
          "stress": 6
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_anesthesia_nerves",
    "title": {
      "en": "The Anesthesia Jitters",
      "zh": "打麻药的手抖"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinicalSense",
      "confidence"
    ],
    "weight": 10,
    "text": {
      "en": "It's just an inferior alveolar block, which you've done on the manikin a hundred times. The needle suddenly feels like it weighs a kilogram.",
      "zh": "不过是个下牙槽神经阻滞，你在仿真头模上做过一百遍了。这根针忽然重得像有一公斤。"
    },
    "choices": [
      {
        "id": "visualize_landmarks",
        "text": {
          "en": "Pause, picture the landmarks, go",
          "zh": "停一秒，在脑里过一遍标志点，再下针"
        },
        "resultText": {
          "en": "You find the coronoid notch, the angle's right, the patient feels almost nothing. Clean.",
          "zh": "你摸到喙突切迹，角度对了，病人几乎没感觉。漂亮。"
        },
        "effects": {
          "clinicalSense": 5,
          "confidence": 6,
          "stress": -2
        }
      },
      {
        "id": "rush_the_stick",
        "text": {
          "en": "Just get it over with quickly",
          "zh": "赶紧扎完算了"
        },
        "resultText": {
          "en": "Speed beats precision today; you reposition once. Numb in the end, nerves still buzzing.",
          "zh": "今天快赢了准，你重新调整了一次。最后是麻了，可你的神经还在嗡嗡。"
        },
        "effects": {
          "handSkill": 1,
          "confidence": -2,
          "stress": 6
        }
      },
      {
        "id": "ask_faculty_watch",
        "text": {
          "en": "Ask faculty to watch this one",
          "zh": "请带教看着这一针"
        },
        "resultText": {
          "en": "They confirm your angle before you advance. Your hand steadies the moment they nod.",
          "zh": "他们在你进针前确认了角度。他们一点头，你的手就稳了。"
        },
        "effects": {
          "clinicalSense": 4,
          "confidence": 3,
          "stress": -1
        }
      }
    ],
    "minSemester": 7,
    "condition": {
      "maxStats": {
        "confidence": 60
      }
    }
  },
  {
    "id": "clin_running_behind",
    "title": {
      "en": "Running Behind",
      "zh": "进度落后了"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinic",
      "patient"
    ],
    "weight": 9,
    "text": {
      "en": "The case is taking longer than planned, your next patient is already in the waiting room, and the clinic clock has no sympathy whatsoever.",
      "zh": "这个病例做得比计划久，下一位病人已经在候诊区了，而诊室的钟对你毫无同情心。"
    },
    "choices": [
      {
        "id": "do_it_right",
        "text": {
          "en": "Finish this one properly",
          "zh": "先把这个好好做完"
        },
        "resultText": {
          "en": "You don't cut corners. The next patient waits a bit, both end up well treated.",
          "zh": "你没偷工减料。下一位多等了一会儿，但两位最后都治得妥妥的。"
        },
        "effects": {
          "clinicalSense": 5,
          "stress": 4,
          "reputation": 1
        }
      },
      {
        "id": "warn_next",
        "text": {
          "en": "Have the desk warn the next patient",
          "zh": "让前台提前知会下一位"
        },
        "resultText": {
          "en": "A heads-up turns frustration into patience. Communication does what speed couldn't.",
          "zh": "一句提前知会把烦躁变成了耐心。沟通做到了速度做不到的事。"
        },
        "effects": {
          "empathy": 4,
          "reputation": 3,
          "stress": -1
        }
      },
      {
        "id": "panic_speed",
        "text": {
          "en": "Panic-rush to claw back time",
          "zh": "慌慌张张抢时间"
        },
        "resultText": {
          "en": "Hurrying makes you drop an instrument and restart a step. Time saved: negative.",
          "zh": "一急你掉了个器械，又得重做一步。省下的时间：负数。"
        },
        "effects": {
          "handSkill": -2,
          "stress": 9,
          "mood": -3
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_cost_conversation",
    "title": {
      "en": "The Cost Conversation",
      "zh": "聊费用"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "patient",
      "empathy"
    ],
    "weight": 9,
    "text": {
      "en": "Your patient hears the estimate and goes quiet. You can see them doing the same math everyone does, the kind where the tooth competes with the grocery bill.",
      "zh": "病人听到估价后沉默了。你看得出他们在做那道每个人都会做的算术——牙和买菜钱抢预算的那种。"
    },
    "choices": [
      {
        "id": "lay_out_options",
        "text": {
          "en": "Walk through phased, cheaper options",
          "zh": "讲讲分期、更省钱的方案"
        },
        "resultText": {
          "en": "You map a do-it-in-stages plan. Their shoulders drop; the tooth and the budget can coexist.",
          "zh": "你给他们排了个分阶段做的计划。他们松了口气，牙和预算可以共存了。"
        },
        "effects": {
          "empathy": 6,
          "clinicalSense": 3,
          "reputation": 3
        }
      },
      {
        "id": "stay_quiet",
        "text": {
          "en": "Let the silence do the selling",
          "zh": "用沉默替你推方案"
        },
        "resultText": {
          "en": "The awkward pause pushes them to agree, but they leave looking cornered, not cared for.",
          "zh": "尴尬的停顿逼他们点了头，可他们走时像被将了军，而不是被照顾。"
        },
        "effects": {
          "money": 2,
          "empathy": -4,
          "reputation": -2
        }
      },
      {
        "id": "loop_in_admin",
        "text": {
          "en": "Loop in the financial coordinator",
          "zh": "叫上费用协调员一起看"
        },
        "resultText": {
          "en": "The coordinator finds a plan you didn't know existed. Teamwork, and a relieved patient.",
          "zh": "协调员找到了一个你都不知道的方案。团队协作，外加一个松了口气的病人。"
        },
        "effects": {
          "empathy": 4,
          "reputation": 2,
          "stress": -1
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_language_barrier",
    "title": {
      "en": "When Words Don't Quite Reach",
      "zh": "语言不太通的时候"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "patient",
      "empathy"
    ],
    "weight": 9,
    "text": {
      "en": "Your patient's English and your handful of their language are both running on fumes, but the worried look needs no translation.",
      "zh": "病人的英语和你那点对方的语言都快见底了，但那副担忧的神情根本不需要翻译。"
    },
    "choices": [
      {
        "id": "use_interpreter",
        "text": {
          "en": "Call the interpreter line, go slow",
          "zh": "接通翻译专线，慢慢来"
        },
        "resultText": {
          "en": "The interpreter bridges everything. Consent is real consent now, and they visibly relax.",
          "zh": "翻译把一切都接通了。现在的知情同意是真的知情同意，他们肉眼可见地放松了。"
        },
        "effects": {
          "empathy": 6,
          "clinicalSense": 3,
          "stress": 2
        }
      },
      {
        "id": "gestures_diagrams",
        "text": {
          "en": "Lean on diagrams and gestures",
          "zh": "靠画图和手势"
        },
        "resultText": {
          "en": "You sketch the tooth and mime the steps. Imperfect, but the smile back says it landed.",
          "zh": "你画了牙，比划了步骤。不完美，但回过来的那个笑说明传达到了。"
        },
        "effects": {
          "empathy": 4,
          "confidence": 2,
          "stress": 1
        }
      },
      {
        "id": "push_through",
        "text": {
          "en": "Push through with simple English",
          "zh": "用简单英语硬聊过去"
        },
        "resultText": {
          "en": "You get the gist across but miss a worry they couldn't phrase. It surfaces awkwardly later.",
          "zh": "大意是传到了，可你漏掉了一个他们说不出口的担忧，后来别扭地冒了出来。"
        },
        "effects": {
          "empathy": -2,
          "clinicalSense": -1,
          "stress": 4
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_pediatric_patient",
    "title": {
      "en": "A Very Small Patient",
      "zh": "一个很小的病人"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "patient",
      "empathy",
      "confidence"
    ],
    "weight": 9,
    "text": {
      "en": "A six-year-old sits in the big chair swinging their legs, deciding in real time whether you are a friend or the enemy of all teeth.",
      "zh": "一个六岁小孩坐在大椅子上晃着腿，正实时判断你到底是朋友，还是全体牙齿的公敌。"
    },
    "choices": [
      {
        "id": "make_it_a_game",
        "text": {
          "en": "Turn the exam into a game",
          "zh": "把检查变成游戏"
        },
        "resultText": {
          "en": "You count teeth like treasure and let them hold the mirror. Giggles replace tears. Win.",
          "zh": "你像数宝藏一样数牙，还让他们拿镜子。咯咯笑取代了眼泪。赢了。"
        },
        "effects": {
          "empathy": 6,
          "confidence": 4,
          "stress": -2
        }
      },
      {
        "id": "be_strictly_clinical",
        "text": {
          "en": "Stay strictly business to save time",
          "zh": "为省时间一切照流程走"
        },
        "resultText": {
          "en": "Efficient, but the legs stop swinging and the trust along with them. Slower would've been faster.",
          "zh": "是高效，可晃动的腿停了，信任也跟着停了。慢一点反而会更快。"
        },
        "effects": {
          "handSkill": 1,
          "empathy": -3,
          "stress": 4
        }
      },
      {
        "id": "involve_parent",
        "text": {
          "en": "Coach the parent to help",
          "zh": "教家长一起配合"
        },
        "resultText": {
          "en": "You give the parent a job and the kid a hand to hold. The room calms by half.",
          "zh": "你给家长派了任务，给孩子留了只手牵着。整个房间的紧张少了一半。"
        },
        "effects": {
          "empathy": 5,
          "clinicalSense": 2,
          "stress": -1
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_complex_case",
    "title": {
      "en": "The Complicated One",
      "zh": "复杂病例"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinicalSense",
      "clinic"
    ],
    "weight": 10,
    "text": {
      "en": "Multiple issues, a thick medical history, and a patient who's seen four other clinics. This is the case your textbook called \"beyond the scope of this chapter.\"",
      "zh": "好几个问题，厚厚的病史，还有一个跑过四家诊所的病人。这就是你课本里写着“超出本章范围”的那种病例。"
    },
    "choices": [
      {
        "id": "break_it_down",
        "text": {
          "en": "Break it into a phased plan",
          "zh": "拆成分阶段的计划"
        },
        "resultText": {
          "en": "You sequence it step by patient step. Suddenly the impossible just looks like a long list.",
          "zh": "你一步一步给它排了序。忽然之间，不可能只是一张长清单而已。"
        },
        "effects": {
          "clinicalSense": 6,
          "knowledge": 4,
          "stress": 2
        }
      },
      {
        "id": "refer_out",
        "text": {
          "en": "Refer the hardest part to a specialist",
          "zh": "把最难的部分转给专科"
        },
        "resultText": {
          "en": "Knowing your limit is a skill too. The patient gets better care; your log loses a flashy entry.",
          "zh": "知道自己的边界也是一种本事。病人得到更好的照顾，你的病例本少了个亮眼条目。"
        },
        "effects": {
          "clinicalSense": 4,
          "empathy": 3,
          "reputation": 2
        }
      },
      {
        "id": "tackle_alone",
        "text": {
          "en": "Take the whole thing on yourself",
          "zh": "整个全包下来自己做"
        },
        "resultText": {
          "en": "Ambitious. You learn a ton and lose a weekend of sleep to anxious chart-reading.",
          "zh": "很有志气。你学到一大堆，也搭进一个周末的睡眠去焦虑地翻病历。"
        },
        "effects": {
          "knowledge": 6,
          "handSkill": 3,
          "stress": 10,
          "stamina": -4
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_small_complication",
    "title": {
      "en": "A Small Surprise Mid-Procedure",
      "zh": "操作中的小意外"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinicalSense",
      "confidence"
    ],
    "weight": 10,
    "text": {
      "en": "Something unexpected shows up partway through, nothing dangerous, just not in the lesson plan. The patient is watching your eyes for a reaction.",
      "zh": "做到一半冒出个没料到的情况，不危险，只是不在教案里。病人正盯着你的眼睛找反应。"
    },
    "choices": [
      {
        "id": "stay_calm",
        "text": {
          "en": "Keep a calm face, reassess",
          "zh": "面不改色，重新评估"
        },
        "resultText": {
          "en": "You keep your voice level, step back, and adjust. The tooth can wait; your composure can't.",
          "zh": "你声音平稳，退一步，调整方案。牙可以等，你的镇定不能丢。"
        },
        "effects": {
          "clinicalSense": 6,
          "confidence": 5,
          "stress": 2
        }
      },
      {
        "id": "visible_panic",
        "text": {
          "en": "Let the worry show on your face",
          "zh": "把慌张写在脸上"
        },
        "resultText": {
          "en": "Your face does the talking and the patient tenses up. You fix it, but the room got harder first.",
          "zh": "你的表情先开了口，病人也跟着紧张。你最后解决了，但房间先变难了。"
        },
        "effects": {
          "clinicalSense": 2,
          "empathy": -2,
          "stress": 7
        }
      },
      {
        "id": "call_for_help",
        "text": {
          "en": "Calmly call faculty over",
          "zh": "镇定地请带教过来"
        },
        "resultText": {
          "en": "\"Could you take a look?\" handled smoothly. Faculty confirms your read; everyone exhales.",
          "zh": "“能过来看一眼吗？”处理得很从容。带教确认了你的判断，大家都松了口气。"
        },
        "effects": {
          "clinicalSense": 4,
          "confidence": 3,
          "stress": -1
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_chart_notes",
    "title": {
      "en": "The Chart Notes at 6pm",
      "zh": "晚上六点的病历"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinic",
      "clinicalSense"
    ],
    "weight": 8,
    "text": {
      "en": "Patients are gone, the clinic's emptying, and your charting backlog sits there like a browser with eighty tabs open. Future-you is begging present-you to write it down right.",
      "zh": "病人都走了，诊室在清场，你那堆没写完的病历像开了八十个标签页的浏览器一样杵着。未来的你正求现在的你把它好好写清楚。"
    },
    "choices": [
      {
        "id": "chart_thoroughly",
        "text": {
          "en": "Chart thoroughly now while it's fresh",
          "zh": "趁记忆新鲜，现在就认真写"
        },
        "resultText": {
          "en": "You write clean, complete notes. Tired tonight, blessed at next week's recall appointment.",
          "zh": "你写下干净完整的记录。今晚累，但下周复诊时你会感谢自己。"
        },
        "effects": {
          "clinicalSense": 5,
          "reputation": 2,
          "stamina": -3
        }
      },
      {
        "id": "bare_minimum",
        "text": {
          "en": "Jot the bare minimum and go home",
          "zh": "随便记几笔就回家"
        },
        "resultText": {
          "en": "You're out the door fast. Next visit you stare at \"tx done, pt ok\" and have no idea.",
          "zh": "你飞快地出了门。下次复诊看着“做了治疗，病人ok”，一脸茫然。"
        },
        "effects": {
          "stress": -2,
          "clinicalSense": -3,
          "mood": 1
        }
      },
      {
        "id": "ask_assistant_help",
        "text": {
          "en": "Co-write with the assistant, split it",
          "zh": "和助手分工一起写"
        },
        "resultText": {
          "en": "Two sets of memory beat one. You finish faster and catch a detail you'd have missed.",
          "zh": "两个人的记忆胜过一个。你写得更快，还补上了一个本会漏掉的细节。"
        },
        "effects": {
          "clinicalSense": 3,
          "reputation": 2,
          "stamina": -1
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_working_with_assistant",
    "title": {
      "en": "Four Hands, One Plan",
      "zh": "四只手，一个计划"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinic",
      "confidence"
    ],
    "weight": 9,
    "text": {
      "en": "Today you've got a dental assistant who's done this longer than you've been in dental school. Four-handed dentistry only works if you actually let the other two hands help.",
      "zh": "今天给你配了个助手，干这行的年头比你上牙学院还久。四手操作只有在你真的肯让另外两只手帮忙时才奏效。"
    },
    "choices": [
      {
        "id": "communicate_clearly",
        "text": {
          "en": "Set a clear rhythm together",
          "zh": "一起定个清晰的节奏"
        },
        "resultText": {
          "en": "You call instruments by name and they're in your palm before you finish the word. Smooth.",
          "zh": "你叫器械名，话还没说完器械就到了你手心。行云流水。"
        },
        "effects": {
          "handSkill": 4,
          "confidence": 4,
          "stress": -3
        }
      },
      {
        "id": "do_everything_solo",
        "text": {
          "en": "Just do everything yourself",
          "zh": "干脆全自己来"
        },
        "resultText": {
          "en": "You reach for your own everything and the assistant stands idle. Slower, lonelier, your call.",
          "zh": "你什么都自己伸手去拿，助手在旁边闲着。更慢，更孤单，是你的选择。"
        },
        "effects": {
          "handSkill": 1,
          "stress": 5,
          "reputation": -1
        }
      },
      {
        "id": "ask_their_tips",
        "text": {
          "en": "Ask the assistant for their tips",
          "zh": "向助手请教窍门"
        },
        "resultText": {
          "en": "They show you a retraction trick worth three lectures. Humility pays interest.",
          "zh": "他们教你一个抵得上三节课的牵拉小技巧。谦虚是有利息的。"
        },
        "effects": {
          "handSkill": 5,
          "knowledge": 3,
          "confidence": 2
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_patient_gratitude",
    "title": {
      "en": "\"Thank You, Doctor\"",
      "zh": "“谢谢你，医生”"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "patient",
      "empathy",
      "confidence"
    ],
    "weight": 8,
    "text": {
      "en": "Your patient pauses at the door, turns, and says they haven't smiled in a photo for years and now they will. They call you doctor. You are very much still a student.",
      "zh": "病人在门口停下，回过头，说他们好多年没在照片里笑过了，现在终于能笑了。他们叫你医生。而你其实还是个学生。"
    },
    "choices": [
      {
        "id": "let_it_land",
        "text": {
          "en": "Let yourself feel it",
          "zh": "让自己好好感受这一刻"
        },
        "resultText": {
          "en": "You let the moment in instead of deflecting. This is why the eighty tabs are worth it.",
          "zh": "你没有岔开话题，而是让这一刻进了心里。这就是那八十个标签页值得的原因。"
        },
        "effects": {
          "confidence": 6,
          "mood": 6,
          "stress": -4
        }
      },
      {
        "id": "deflect_modestly",
        "text": {
          "en": "Deflect: \"It was nothing\"",
          "zh": "谦虚带过：“没什么啦”"
        },
        "resultText": {
          "en": "You wave it off out of habit. They look slightly deflated; the gratitude needed a landing pad.",
          "zh": "你习惯性地摆摆手。他们神色微微一沉，那份感激本需要一个落脚的地方。"
        },
        "effects": {
          "confidence": 1,
          "empathy": -2,
          "mood": 1
        }
      },
      {
        "id": "credit_the_team",
        "text": {
          "en": "Share the credit with the team",
          "zh": "把功劳分给团队"
        },
        "resultText": {
          "en": "\"My faculty and assistant earned this too.\" Warm, true, and the whole pod stands taller.",
          "zh": "“我的带教和助手也有功劳。”温暖、真诚，整个小组都挺直了腰。"
        },
        "effects": {
          "empathy": 4,
          "reputation": 3,
          "mood": 3
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_thoroughness_vs_time",
    "title": {
      "en": "Good Enough vs. Right",
      "zh": "差不多 还是 做对"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinicalSense",
      "clinic"
    ],
    "weight": 9,
    "text": {
      "en": "It looks fine. It would pass. But that one margin is nagging at you, and the clock is nagging right back.",
      "zh": "看着挺好，能过关。可那一处边缘一直在你心里嘀咕，而钟也在那边回嘀咕。"
    },
    "choices": [
      {
        "id": "redo_the_margin",
        "text": {
          "en": "Redo the margin until it's right",
          "zh": "重做那处边缘，直到做对"
        },
        "resultText": {
          "en": "Extra fifteen minutes, but it's genuinely good now. Your standards just set a little harder.",
          "zh": "多花了十五分钟，但现在是真的好。你的标准刚刚又硬了一点。"
        },
        "effects": {
          "handSkill": 5,
          "clinicalSense": 4,
          "stamina": -2
        }
      },
      {
        "id": "let_it_pass",
        "text": {
          "en": "Let it pass and move on",
          "zh": "就这样，过了往下走"
        },
        "resultText": {
          "en": "It checks off. But the nagging follows you home and sits on the end of the bed.",
          "zh": "确实过了。可那点嘀咕跟你回了家，坐在床尾。"
        },
        "effects": {
          "stress": 4,
          "clinicalSense": -2,
          "confidence": -1
        }
      },
      {
        "id": "ask_faculty_eval",
        "text": {
          "en": "Ask faculty if it truly needs redoing",
          "zh": "问带教这处到底要不要重做"
        },
        "resultText": {
          "en": "They show you the threshold that actually matters. Now you'll know on your own next time.",
          "zh": "他们给你指了真正要紧的那条线。下次你自己就能判断了。"
        },
        "effects": {
          "knowledge": 5,
          "clinicalSense": 3,
          "stress": -1
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "clin_small_mistake",
    "title": {
      "en": "A Small Mistake, Calmly Caught",
      "zh": "一个小失误，从容补回"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinicalSense",
      "confidence"
    ],
    "weight": 10,
    "text": {
      "en": "You realize you've reached for the wrong shade, caught before it mattered but after your stomach already dropped. Nobody's hurt; your pride is just slightly bruised.",
      "zh": "你发现自己拿错了比色，在出问题前就察觉了，可你的胃已经先沉了一下。没人受伤，受伤的只是你那点自尊。"
    },
    "choices": [
      {
        "id": "own_it_fix_it",
        "text": {
          "en": "Own it out loud and correct it",
          "zh": "大方承认，当场纠正"
        },
        "resultText": {
          "en": "\"Let me grab the right one.\" Honest and unbothered. The patient trusts you more, not less.",
          "zh": "“我去换正确的那个。”坦荡、不慌。病人反而更信你了，而不是更不信。"
        },
        "effects": {
          "clinicalSense": 5,
          "confidence": 4,
          "reputation": 2
        }
      },
      {
        "id": "hide_it",
        "text": {
          "en": "Quietly swap it, mention nothing",
          "zh": "悄悄换掉，什么都不说"
        },
        "resultText": {
          "en": "You fix it silently. No harm done, but the habit of hiding small things is a slippery one.",
          "zh": "你默默改好了。没造成伤害，但藏小事这个习惯，是会打滑的。"
        },
        "effects": {
          "handSkill": 1,
          "clinicalSense": -2,
          "stress": 3
        }
      },
      {
        "id": "tell_faculty",
        "text": {
          "en": "Flag it to faculty as a learning point",
          "zh": "当作学习点报给带教"
        },
        "resultText": {
          "en": "Faculty respects the honesty and shares a trick to never mix shades up again. Net gain.",
          "zh": "带教欣赏这份坦诚，还教了你一招再也不弄混比色的方法。净赚。"
        },
        "effects": {
          "knowledge": 4,
          "clinicalSense": 3,
          "reputation": 1
        }
      }
    ],
    "minSemester": 7,
    "condition": {
      "maxStats": {
        "confidence": 65
      }
    }
  },
  {
    "id": "clin_quota_pressure",
    "title": {
      "en": "The Requirement Count",
      "zh": "指标的压力"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "clinic",
      "clinicalSense"
    ],
    "weight": 10,
    "text": {
      "en": "Graduation requirements need a certain number of each procedure, and yours are uneven. There's a quiet temptation to see patients as boxes to tick. The tooth can wait; your conscience cannot.",
      "zh": "毕业要求每种术式都得攒够数，而你的进度参差不齐。有一股悄悄的诱惑想把病人看成待打钩的格子。牙可以等，你的良心不能。"
    },
    "choices": [
      {
        "id": "patient_over_quota",
        "text": {
          "en": "Treat the patient, not the checkbox",
          "zh": "治病人，不是治那个格子"
        },
        "resultText": {
          "en": "You do what they need, not what your tally wants. The numbers catch up; your integrity never wobbles.",
          "zh": "你做的是他们需要的，不是你计数表想要的。数字后来补上了，你的良心一直没晃。"
        },
        "effects": {
          "clinicalSense": 5,
          "empathy": 5,
          "stress": 3
        }
      },
      {
        "id": "chase_the_count",
        "text": {
          "en": "Steer toward what fills your quota",
          "zh": "往能凑指标的方向引导"
        },
        "resultText": {
          "en": "Your tally improves; something in your gut doesn't. You pass, with an asterisk only you can see.",
          "zh": "你的计数好看了，胃里却有点不对劲。你过关了，带着一个只有你看得见的星号。"
        },
        "effects": {
          "handSkill": 2,
          "empathy": -4,
          "stress": 5
        }
      },
      {
        "id": "talk_to_coordinator",
        "text": {
          "en": "Ask the clinic coordinator for cases",
          "zh": "找诊室协调员帮你匹配病例"
        },
        "resultText": {
          "en": "They flag suitable patients who genuinely need those procedures. Quota and care, aligned.",
          "zh": "他们帮你留意真正需要那些术式的合适病例。指标和关怀，对上了。"
        },
        "effects": {
          "clinicalSense": 4,
          "reputation": 2,
          "stress": -2
        }
      }
    ],
    "minSemester": 7,
    "condition": {
      "maxStats": {
        "stress": 50
      }
    }
  },
  {
    "id": "clin_returning_patient",
    "title": {
      "en": "The One Who Came Back for You",
      "zh": "专程回来找你的病人"
    },
    "stage": [
      "clinical",
      "advanced"
    ],
    "tags": [
      "patient",
      "empathy",
      "confidence"
    ],
    "weight": 9,
    "text": {
      "en": "A patient from last semester requested you by name for their recall. They drove past two closer clinics because, they say, you actually listened. No pressure or anything.",
      "zh": "上学期的一位病人复诊时点名要你。他们说，自己开车路过了两家更近的诊所，就因为你是真的在听。一点压力都没有，真的。"
    },
    "choices": [
      {
        "id": "rise_to_trust",
        "text": {
          "en": "Meet the trust, take your time",
          "zh": "不辜负这份信任，慢慢来"
        },
        "resultText": {
          "en": "You give them the careful visit they came back for. Being someone's chosen dentist feels like a milestone.",
          "zh": "你给了他们专程回来求的那种细致诊疗。成为某人指定的牙医，像一个里程碑。"
        },
        "effects": {
          "confidence": 6,
          "empathy": 5,
          "mood": 4
        }
      },
      {
        "id": "freeze_under_pressure",
        "text": {
          "en": "Tense up under the expectation",
          "zh": "在期待下绷紧了"
        },
        "resultText": {
          "en": "You overthink every move trying to be perfect. Still good care, just a stressful way to give it.",
          "zh": "你为了完美把每个动作都想过头了。诊疗还是不错，只是把过程做得很紧张。"
        },
        "effects": {
          "handSkill": 2,
          "stress": 7,
          "confidence": -1
        }
      },
      {
        "id": "be_honest_growth",
        "text": {
          "en": "Admit you've grown since last time",
          "zh": "坦白自己比上次更进步了"
        },
        "resultText": {
          "en": "\"I've learned a lot since I saw you.\" They love that. Honesty deepens an already-warm rapport.",
          "zh": "“上次见你之后我学了好多。”他们很受用。坦诚让本就温暖的关系更深了。"
        },
        "effects": {
          "empathy": 4,
          "confidence": 3,
          "reputation": 2
        }
      }
    ],
    "minSemester": 7
  },
  {
    "id": "adv_mobile_clinic_day",
    "title": {
      "en": "The Mobile Clinic Pulls Up",
      "zh": "流动诊所开进村"
    },
    "stage": [
      "advanced"
    ],
    "tags": [
      "community",
      "publicImpact"
    ],
    "weight": 11,
    "text": {
      "en": "The mobile clinic parks at a community center two hours from campus, and the sign-up sheet is already full before you've finished your coffee. There are more mouths than chairs, and the day stretches long.",
      "zh": "流动诊所停在离学校两小时车程的社区中心，你咖啡还没喝完，预约单就满了。需要看的人比椅子多，今天注定是漫长的一天。"
    },
    "choices": [
      {
        "id": "see_everyone",
        "text": {
          "en": "Squeeze in every last patient",
          "zh": "硬塞下每一个病人"
        },
        "resultText": {
          "en": "You finish at dusk, exhausted but full of stories, and a grandmother insists you take her homemade dumplings.",
          "zh": "你忙到天黑，累得不行，却满载故事，一位奶奶非要塞给你一盒自家包的饺子。"
        },
        "effects": {
          "publicImpact": 12,
          "reputation": 6,
          "stamina": -10,
          "stress": 6,
          "mood": 5
        }
      },
      {
        "id": "pace_quality",
        "text": {
          "en": "Cap the list, do each one well",
          "zh": "限号，把每个都做好"
        },
        "resultText": {
          "en": "Fewer patients, better dentistry, and you leave with energy to spare, though you keep thinking about the names you couldn't reach.",
          "zh": "看的人少了，但每一颗牙都做得扎实，你还有余力，只是一直惦记着没排上号的名字。"
        },
        "effects": {
          "clinicalSense": 6,
          "publicImpact": 6,
          "stamina": -3,
          "mood": 2
        }
      },
      {
        "id": "train_locals",
        "text": {
          "en": "Teach two volunteers to triage",
          "zh": "教两个志愿者做初筛"
        },
        "resultText": {
          "en": "You move slower today but leave behind people who can keep helping after the van drives off.",
          "zh": "今天慢了点，但你留下了两个能在车开走后继续帮忙的人。"
        },
        "effects": {
          "publicImpact": 10,
          "empathy": 5,
          "knowledge": -2,
          "stamina": -5
        }
      }
    ],
    "minSemester": 9
  },
  {
    "id": "adv_underserved_outreach",
    "title": {
      "en": "Where the Nearest Dentist Is Far",
      "zh": "最近的牙医也很远"
    },
    "stage": [
      "advanced"
    ],
    "tags": [
      "community",
      "publicImpact"
    ],
    "weight": 10,
    "text": {
      "en": "Your rotation sends you to a town where the nearest clinic is a ninety-minute bus ride away. Half your patients haven't seen a dentist since before you started high school.",
      "zh": "轮转把你派到一个小镇，最近的诊所坐公交也要一个半小时。你一半的病人上次看牙时，你还没上高中。"
    },
    "choices": [
      {
        "id": "prevention_talk",
        "text": {
          "en": "Run a free prevention workshop",
          "zh": "办一场免费预防讲座"
        },
        "resultText": {
          "en": "Thirty people show up, kids included, and you realize a toothbrush demo lands harder than any lecture you've sat through.",
          "zh": "来了三十个人，还有小孩，你发现一个刷牙示范比你听过的任何 lecture 都管用。"
        },
        "effects": {
          "publicImpact": 11,
          "empathy": 6,
          "stamina": -5,
          "confidence": 4
        }
      },
      {
        "id": "extra_chairtime",
        "text": {
          "en": "Stay late seeing urgent cases",
          "zh": "留下来加班看急诊"
        },
        "resultText": {
          "en": "You handle real pain that's been waiting months, and your hands are steadier for it, even if your back disagrees.",
          "zh": "你处理了拖了几个月的真实疼痛，手更稳了，虽然你的腰表示不同意。"
        },
        "effects": {
          "clinicalSense": 8,
          "publicImpact": 7,
          "stamina": -9,
          "stress": 4
        }
      },
      {
        "id": "rest_for_tomorrow",
        "text": {
          "en": "Pace yourself for the whole week",
          "zh": "留着力气过完整周"
        },
        "resultText": {
          "en": "You head back to the guesthouse early; the tooth can wait, your nervous system cannot, and tomorrow you're sharper.",
          "zh": "你早点回了招待所——牙可以等，你的神经系统不能等，第二天你状态明显好多了。"
        },
        "effects": {
          "stress": -8,
          "stamina": 5,
          "publicImpact": 2,
          "mood": 4
        }
      }
    ],
    "minSemester": 9,
    "condition": {
      "minStats": {
        "empathy": 40
      }
    }
  },
  {
    "id": "adv_board_exam_grind",
    "title": {
      "en": "Eighty Tabs and One Board Exam",
      "zh": "八十个标签页和一场 board"
    },
    "stage": [
      "advanced"
    ],
    "tags": [
      "career",
      "research"
    ],
    "weight": 12,
    "text": {
      "en": "The board exam is six weeks out and your browser has eighty tabs open, none of which you remember opening. The whole syllabus is suddenly both review and total novelty.",
      "zh": "board 还有六周，你的浏览器开了八十个标签页，没一个记得是什么时候开的。整本考纲突然既是复习又是全新内容。"
    },
    "choices": [
      {
        "id": "all_in_cram",
        "text": {
          "en": "Lock in for a marathon week",
          "zh": "拼一个魔鬼复习周"
        },
        "resultText": {
          "en": "Your recall sharpens fast, but by Friday you're quoting flashcards in your sleep and your partner gently hides your laptop.",
          "zh": "你的记忆迅速变强，但到周五你睡觉都在背 flashcard，{partner} 默默把你的笔记本电脑藏了起来。"
        },
        "effects": {
          "knowledge": 12,
          "stress": 9,
          "stamina": -8
        }
      },
      {
        "id": "study_group",
        "text": {
          "en": "Form a small study group",
          "zh": "组个小复习组"
        },
        "resultText": {
          "en": "Explaining out loud catches gaps you'd never have noticed, and the snacks rotation keeps morale weirdly high.",
          "zh": "讲出声反而暴露了你自己都没发现的漏洞，而且轮流带零食让大家士气莫名地高。"
        },
        "effects": {
          "knowledge": 8,
          "confidence": 5,
          "mood": 4,
          "stress": -2
        }
      },
      {
        "id": "structured_plan",
        "text": {
          "en": "Build a calm six-week schedule",
          "zh": "排一个从容的六周计划"
        },
        "resultText": {
          "en": "Suspiciously mature, surprisingly effective: you cover less per day but actually retain it, and you still sleep.",
          "zh": "成熟得有点可疑，效果却出奇地好：每天看得不多，但是真记住了，而且还睡得着。"
        },
        "effects": {
          "knowledge": 7,
          "stress": -5,
          "confidence": 4,
          "stamina": 2
        }
      },
      {
        "id": "one_day_off",
        "text": {
          "en": "Take a guilt-free day off first",
          "zh": "先心安理得地休一天"
        },
        "resultText": {
          "en": "You do absolutely nothing useful and come back genuinely able to think again, which turns out to be the point.",
          "zh": "你一整天什么正事都没干，回来后脑子真的能转了——原来这才是重点。"
        },
        "effects": {
          "stress": -10,
          "stamina": 8,
          "knowledge": -2,
          "mood": 6
        }
      }
    ],
    "minSemester": 10,
    "condition": {
      "maxStats": {
        "stress": 80
      }
    }
  },
  {
    "id": "adv_residency_or_job",
    "title": {
      "en": "Residency or a Real Paycheck",
      "zh": "读住院医还是去上班"
    },
    "stage": [
      "advanced"
    ],
    "tags": [
      "career",
      "research"
    ],
    "weight": 11,
    "text": {
      "en": "Two envelopes sit on your desk: a residency offer that means three more lean years, and a job that means rent paid and a normal weekend. Both feel right on alternate days.",
      "zh": "桌上摆着两个信封：一个住院医 offer，意味着再苦三年；一个工作 offer，意味着付得起房租、过得上正常周末。两个在不同的日子里都觉得对。"
    },
    "choices": [
      {
        "id": "take_residency",
        "text": {
          "en": "Commit to the residency",
          "zh": "去读住院医"
        },
        "resultText": {
          "en": "Lean years ahead, but you'll come out doing the work you actually daydream about. {partner} just asks for one decent vacation a year.",
          "zh": "未来几年会很苦，但你最终能做你真正向往的工作。{partner} 只要求一年来一次像样的旅行。"
        },
        "effects": {
          "knowledge": 8,
          "clinicalSense": 6,
          "money": -8,
          "stress": 5,
          "confidence": 4
        }
      },
      {
        "id": "take_job",
        "text": {
          "en": "Sign the job offer",
          "zh": "签那份工作"
        },
        "resultText": {
          "en": "You'll have weekends and a couch you can afford; the prestige itch fades faster than your seniors warned you it would.",
          "zh": "你会有周末，还有买得起的沙发；那种对头衔的痒，消退得比学长警告的快得多。"
        },
        "effects": {
          "money": 10,
          "stress": -6,
          "mood": 5,
          "reputation": -2,
          "knowledge": -2
        }
      },
      {
        "id": "ask_mentor",
        "text": {
          "en": "Talk it through with a mentor",
          "zh": "找导师聊一聊"
        },
        "resultText": {
          "en": "She doesn't tell you what to do, but the right questions make the noise quieter, and you sleep on it with a clearer head.",
          "zh": "她没替你做决定，但几个对的问题让脑子里的杂音小了，你揣着清醒的脑袋睡了一觉。"
        },
        "effects": {
          "confidence": 5,
          "stress": -4,
          "empathy": 3
        }
      }
    ],
    "minSemester": 10
  },
  {
    "id": "adv_choosing_specialty",
    "title": {
      "en": "Which Door to Walk Through",
      "zh": "走哪一扇门"
    },
    "stage": [
      "advanced"
    ],
    "tags": [
      "career",
      "research"
    ],
    "weight": 10,
    "text": {
      "en": "Everyone keeps asking what you'll specialize in, as if it's a personality you forgot to pick. You like three different things and your future self refuses to text back.",
      "zh": "所有人都在问你要选哪个专业，好像那是一个你忘了挑的性格。你喜欢三个不同的方向，而未来的你死活不回消息。"
    },
    "choices": [
      {
        "id": "follow_skill",
        "text": {
          "en": "Chase what your hands love",
          "zh": "选你的手最爱的那个"
        },
        "resultText": {
          "en": "You pick the discipline where you lose track of time at the chair; the money may follow later, the joy is here now.",
          "zh": "你选了那个让你在椅旁忘记时间的方向；钱也许以后会来，快乐现在就在。"
        },
        "effects": {
          "handSkill": 8,
          "confidence": 6,
          "money": -3,
          "mood": 5
        }
      },
      {
        "id": "follow_research",
        "text": {
          "en": "Lean toward the research-heavy path",
          "zh": "倾向研究多的那条路"
        },
        "resultText": {
          "en": "More papers, more questions that don't have answers yet, and a quiet thrill at being the one who asks them.",
          "zh": "更多 paper，更多还没有答案的问题，以及一种当那个提问者的、安静的兴奋。"
        },
        "effects": {
          "research": 10,
          "knowledge": 6,
          "stress": 4,
          "reputation": 3
        }
      },
      {
        "id": "follow_people",
        "text": {
          "en": "Pick the people-facing specialty",
          "zh": "选最贴近人的专业"
        },
        "resultText": {
          "en": "You realize the part you'll never get tired of is the talking, the calming, the small human repair.",
          "zh": "你意识到自己永远不会厌倦的，是说话、安抚、那一点点人与人之间的修补。"
        },
        "effects": {
          "empathy": 9,
          "clinicalSense": 4,
          "confidence": 4,
          "reputation": 2
        }
      },
      {
        "id": "stay_undecided",
        "text": {
          "en": "Give yourself one more year",
          "zh": "再给自己一年"
        },
        "resultText": {
          "en": "You decide not to decide yet, and the panic loosens; some doors stay open longer than the rumors claim.",
          "zh": "你决定先不决定，焦虑松开了些——有些门开着的时间，比传言说的久。"
        },
        "effects": {
          "stress": -6,
          "knowledge": 3,
          "reputation": -2,
          "mood": 3
        }
      }
    ],
    "minSemester": 9
  },
  {
    "id": "adv_mentoring_a_junior",
    "title": {
      "en": "The Nervous First-Year at Your Elbow",
      "zh": "黏在你身边的紧张新生"
    },
    "stage": [
      "advanced"
    ],
    "tags": [
      "community",
      "reputation"
    ],
    "weight": 10,
    "text": {
      "en": "A first-year shadows you for the week, hands shaking, asking the exact questions you once did. You can feel how far you've come just by how calm you sound.",
      "zh": "一个一年级新生跟了你一周，手抖着，问的全是你当年问过的问题。光听自己说话有多稳，你就知道走了多远。"
    },
    "choices": [
      {
        "id": "deep_teach",
        "text": {
          "en": "Slow down and really teach",
          "zh": "放慢节奏好好教"
        },
        "resultText": {
          "en": "Your own clinic flow gets slower, but watching the panic leave their face is its own strange paycheck.",
          "zh": "你自己的看诊节奏慢了，但看着对方脸上的慌乱褪去，是一种奇怪的、值得的回报。"
        },
        "effects": {
          "empathy": 8,
          "reputation": 6,
          "clinicalSense": -2,
          "mood": 5
        }
      },
      {
        "id": "honest_story",
        "text": {
          "en": "Tell them about your worst week",
          "zh": "跟 ta 讲你最惨的一周"
        },
        "resultText": {
          "en": "You admit you cried in a supply closet in year one; they exhale like they've been holding it for months.",
          "zh": "你坦白一年级时在器材间哭过；对方长舒一口气，像憋了好几个月。"
        },
        "effects": {
          "empathy": 7,
          "confidence": 4,
          "mood": 4
        }
      },
      {
        "id": "stay_focused",
        "text": {
          "en": "Keep your own cases on track",
          "zh": "先把自己的病例顾好"
        },
        "resultText": {
          "en": "You answer questions between patients but protect your day; the junior survives, and so does your schedule.",
          "zh": "你在看诊间隙回答问题，但守住了自己的节奏；新生活下来了，你的日程也活下来了。"
        },
        "effects": {
          "clinicalSense": 5,
          "knowledge": 3,
          "reputation": -1,
          "stress": -2
        }
      }
    ],
    "minSemester": 9
  },
  {
    "id": "adv_leadership_moment",
    "title": {
      "en": "Someone Has to Say It",
      "zh": "总得有人开口"
    },
    "stage": [
      "advanced"
    ],
    "tags": [
      "reputation",
      "career"
    ],
    "weight": 9,
    "text": {
      "en": "The clinic's broken sterilizer has been 'on the list' for a month, and at the staff meeting everyone goes quiet. You're senior enough now that your voice would actually carry.",
      "zh": "诊所那台坏掉的消毒器已经被列入待修一个月了，员工会上所有人都沉默着。你现在资历够了，开口是真的有分量的。"
    },
    "choices": [
      {
        "id": "speak_up",
        "text": {
          "en": "Raise it, clearly and calmly",
          "zh": "冷静而清楚地提出来"
        },
        "resultText": {
          "en": "It's uncomfortable for ninety seconds, then the fix gets scheduled; a few juniors quietly thank you in the hall.",
          "zh": "尴尬了九十秒，然后维修排上了日程；几个学弟学妹在走廊里悄悄谢了你。"
        },
        "effects": {
          "reputation": 9,
          "confidence": 6,
          "stress": 4
        }
      },
      {
        "id": "private_note",
        "text": {
          "en": "Email the supervisor privately",
          "zh": "私下给主管发邮件"
        },
        "resultText": {
          "en": "Less heroic, just as effective; the problem moves without anyone losing face, which is its own kind of skill.",
          "zh": "没那么英雄主义，却一样有效；问题解决了，谁的面子都没丢——这本身也是一种能力。"
        },
        "effects": {
          "reputation": 5,
          "confidence": 3,
          "empathy": 3
        }
      },
      {
        "id": "let_it_slide",
        "text": {
          "en": "Stay out of it for now",
          "zh": "暂时不掺和"
        },
        "resultText": {
          "en": "You keep your head down; the sterilizer stays broken another week, and the silence sits a little heavier on you.",
          "zh": "你选择低调；消毒器又坏了一周，那份沉默压在你身上重了一点。"
        },
        "effects": {
          "stress": -3,
          "reputation": -4,
          "mood": -2
        }
      }
    ],
    "minSemester": 10
  },
  {
    "id": "adv_graduation_prep",
    "title": {
      "en": "Cap, Gown, and a Long To-Do List",
      "zh": "学位帽、袍子和一长串待办"
    },
    "stage": [
      "advanced"
    ],
    "tags": [
      "career",
      "community"
    ],
    "weight": 9,
    "text": {
      "en": "Graduation is three weeks away and the logistics are absurd: final sign-offs, a gown that doesn't fit, and family asking for the exact ceremony time you don't have yet.",
      "zh": "毕业还有三周，杂事多得离谱：最后的签字、不合身的袍子，还有家里人追问你自己都还不知道的典礼具体时间。"
    },
    "choices": [
      {
        "id": "handle_logistics",
        "text": {
          "en": "Knock out the whole checklist",
          "zh": "一口气清掉清单"
        },
        "resultText": {
          "en": "You spend a brutal day on forms and tailoring, then sleep like the dead, finally able to feel that this is real.",
          "zh": "你花了痛苦的一天处理表格和改衣服，然后睡得像块石头，终于能感觉到这一切是真的了。"
        },
        "effects": {
          "stress": 5,
          "stamina": -6,
          "mood": 6,
          "confidence": 3
        }
      },
      {
        "id": "celebrate_classmates",
        "text": {
          "en": "Grab dinner with your cohort",
          "zh": "和同届的人吃顿饭"
        },
        "resultText": {
          "en": "The forms can wait one night; you laugh about year one until midnight and remember why you survived it together.",
          "zh": "表格可以等一晚；你们笑着聊一年级的糗事到半夜，想起当初是怎么一起熬过来的。"
        },
        "effects": {
          "mood": 8,
          "stress": -6,
          "love": 2,
          "stamina": -2
        }
      },
      {
        "id": "bring_family_in",
        "text": {
          "en": "Plan it around your family",
          "zh": "围着家人安排一切"
        },
        "resultText": {
          "en": "You sort out their travel and seats first; logistics get messier for you, but their faces in the crowd will be worth it.",
          "zh": "你先把他们的车票和座位安排好；你这边更乱了，但典礼上人群里他们的脸，会值得的。"
        },
        "effects": {
          "empathy": 6,
          "mood": 5,
          "stress": 4,
          "stamina": -3
        }
      }
    ],
    "minSemester": 10
  },
  {
    "id": "adv_how_far_youve_come",
    "title": {
      "en": "The Drawer of Old Casts",
      "zh": "装着旧模型的抽屉"
    },
    "stage": [
      "advanced"
    ],
    "tags": [
      "career",
      "research"
    ],
    "weight": 8,
    "text": {
      "en": "Cleaning out your locker, you find your first-ever wax-up, lumpy and proud, next to last month's work. The gap between them stops you cold for a second.",
      "zh": "清理柜子时，你翻出了人生第一个蜡型，歪歪扭扭却很自豪，旁边是上个月的作品。两者之间的差距让你愣了一下。"
    },
    "choices": [
      {
        "id": "keep_the_cast",
        "text": {
          "en": "Keep the lumpy first one",
          "zh": "留下那个歪歪的处女作"
        },
        "resultText": {
          "en": "You wrap it in a paper towel and pocket it; on hard days, proof you've already done the impossible thing once.",
          "zh": "你用纸巾把它包好揣进口袋；难熬的日子里，它是你早就做成过不可能之事的证据。"
        },
        "effects": {
          "confidence": 7,
          "mood": 6,
          "stress": -3
        }
      },
      {
        "id": "show_partner",
        "text": {
          "en": "Text a photo to {partner}",
          "zh": "拍照发给 {partner}"
        },
        "resultText": {
          "en": "{partner} replies 'honestly iconic' and you laugh; being seen across the whole arc of this feels better than any grade.",
          "zh": "{partner} 回了句\"说真的有点帅\"，你笑了；被人见证了这一整段路，比任何分数都让人安心。"
        },
        "effects": {
          "love": 6,
          "mood": 7,
          "stress": -4
        }
      },
      {
        "id": "write_reflection",
        "text": {
          "en": "Write down what changed",
          "zh": "写下到底变了什么"
        },
        "resultText": {
          "en": "You journal for an hour, and naming the growth makes it solid; turns out reflection is its own quiet form of study.",
          "zh": "你写了一小时日记，把成长说清楚之后它就成形了；原来反思也是一种安静的学习。"
        },
        "effects": {
          "research": 4,
          "confidence": 5,
          "knowledge": 3,
          "stress": -2
        }
      }
    ],
    "minSemester": 10,
    "condition": {
      "minStats": {
        "confidence": 45
      }
    }
  },
  {
    "id": "adv_giving_back",
    "title": {
      "en": "Paying the Ladder Forward",
      "zh": "把梯子传下去"
    },
    "stage": [
      "advanced"
    ],
    "tags": [
      "community",
      "publicImpact"
    ],
    "weight": 10,
    "text": {
      "en": "A scholarship fund that once covered your instruments asks if you'd like to give a little time or money back, now that you're almost on the other side. You remember exactly how much it mattered.",
      "zh": "当年帮你出过器械费的助学金，问你现在快\"上岸\"了，愿不愿意回馈一点时间或金钱。你太清楚那笔钱当时有多重要了。"
    },
    "choices": [
      {
        "id": "donate_money",
        "text": {
          "en": "Pledge a small monthly gift",
          "zh": "认捐一笔小额月捐"
        },
        "resultText": {
          "en": "It's not much on a new-grad budget, but it's automatic now, quietly buying some future student their first set of burs.",
          "zh": "对刚毕业的预算来说不算多，但已经设成自动扣款了，悄悄替将来某个学生买下 ta 的第一套钻针。"
        },
        "effects": {
          "publicImpact": 8,
          "money": -5,
          "mood": 5
        }
      },
      {
        "id": "volunteer_time",
        "text": {
          "en": "Mentor next year's recipients",
          "zh": "去带下一届的受助学生"
        },
        "resultText": {
          "en": "You sign up to advise three incoming students; your calendar groans, but their gratitude is embarrassingly fuel-like.",
          "zh": "你报名带三个新生；你的日程表叫苦不迭，但他们的感激让人不好意思地充满干劲。"
        },
        "effects": {
          "publicImpact": 9,
          "empathy": 6,
          "stamina": -4,
          "reputation": 4
        }
      },
      {
        "id": "share_story",
        "text": {
          "en": "Speak at their welcome event",
          "zh": "在迎新会上讲两句"
        },
        "resultText": {
          "en": "You tell a room of nervous newcomers it gets better and you mean it; a few of them will remember this for years.",
          "zh": "你对着一屋子紧张的新人说\"会好起来的\"，而且是认真的；其中几个会记好多年。"
        },
        "effects": {
          "publicImpact": 7,
          "confidence": 5,
          "reputation": 3,
          "stress": 2
        }
      }
    ],
    "minSemester": 10
  },
  {
    "id": "love_late_night_call",
    "title": {
      "en": "The Right Call at the Wrong Hour",
      "zh": "深夜里刚好接到的电话"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "support",
      "stress"
    ],
    "weight": 11,
    "text": {
      "en": "It is way too late, your brain has 80 tabs open, and your phone lights up: {partner} calling, just to hear how you're holding up.",
      "zh": "夜已经太深，脑子里开着 80 个 tab，手机突然亮了——是 {partner}，就想听听你还撑不撑得住。"
    },
    "choices": [
      {
        "id": "pick_up",
        "text": {
          "en": "Pick up and actually talk",
          "zh": "接起来，好好聊聊"
        },
        "resultText": {
          "en": "Twenty minutes of {partner}'s nonsense and your shoulders finally drop. The notes will survive without you.",
          "zh": "{partner} 胡说八道二十分钟，你的肩膀终于塌了下来。笔记没你也不会跑。"
        },
        "effects": {
          "love": 8,
          "mood": 7,
          "stress": -9,
          "knowledge": -2
        }
      },
      {
        "id": "quick_goodnight",
        "text": {
          "en": "Quick goodnight, back to studying",
          "zh": "道个晚安，继续复习"
        },
        "resultText": {
          "en": "You keep it short and get a bit more done, but you can hear {partner} miss you through the phone.",
          "zh": "你长话短说多看了一点，可电话那头 {partner} 的想念你也听得出来。"
        },
        "effects": {
          "knowledge": 4,
          "love": 2,
          "mood": -1,
          "stress": 2
        }
      },
      {
        "id": "silent",
        "text": {
          "en": "Let it ring, you're in the zone",
          "zh": "让它响，你正在状态里"
        },
        "resultText": {
          "en": "You finish the section, then feel a small guilty pang at the missed-call notification glowing back at you.",
          "zh": "你啃完这一节，再看到那条未接来电的提示，心里轻轻咯噔了一下。"
        },
        "effects": {
          "knowledge": 6,
          "love": -3,
          "mood": -3,
          "stress": 1
        }
      }
    ],
    "condition": {
      "maxStats": {
        "mood": 60
      }
    }
  },
  {
    "id": "love_snack_delivery",
    "title": {
      "en": "Emergency Snack Drop",
      "zh": "紧急投喂零食"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "support",
      "rest"
    ],
    "weight": 10,
    "text": {
      "en": "{partner} has ambushed your study spot with a suspicious paper bag and the energy of someone who is very proud of themselves.",
      "zh": "{partner} 拎着一个可疑纸袋突袭了你的自习角落，一脸 '我太机智了' 的得意。"
    },
    "choices": [
      {
        "id": "take_break",
        "text": {
          "en": "Take a proper snack break together",
          "zh": "正经地一起吃顿零食"
        },
        "resultText": {
          "en": "Warm snacks, dumb jokes, ten real minutes of not being a student. You go back lighter.",
          "zh": "热乎的零食、傻乎乎的笑话、十分钟真正不当学生的时间。回去时整个人都轻了。"
        },
        "effects": {
          "mood": 8,
          "love": 7,
          "stress": -7,
          "stamina": 3
        }
      },
      {
        "id": "eat_and_study",
        "text": {
          "en": "Eat at your desk, keep grinding",
          "zh": "边吃边在桌前继续啃"
        },
        "resultText": {
          "en": "You snack one-handed and flip flashcards with the other. Efficient, slightly crumb-covered, a little sad.",
          "zh": "一手抓零食一手翻卡片。效率是有了，碎屑也有了，就是有点心酸。"
        },
        "effects": {
          "knowledge": 5,
          "love": 3,
          "mood": 2,
          "stress": -2
        }
      },
      {
        "id": "share_walk",
        "text": {
          "en": "Walk {partner} home, then return",
          "zh": "送 {partner} 回去，再回来"
        },
        "resultText": {
          "en": "A slow walk and fresh air cost you study time but reset your whole nervous system.",
          "zh": "慢慢走一段、吹吹风，花掉了复习时间，却把整个神经系统都重启了。"
        },
        "effects": {
          "love": 6,
          "mood": 6,
          "stress": -6,
          "stamina": -2,
          "knowledge": -3
        }
      }
    ]
  },
  {
    "id": "love_long_distance_logistics",
    "title": {
      "en": "Long-Distance Calendar Tetris",
      "zh": "异地的日历俄罗斯方块"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "support",
      "planning"
    ],
    "weight": 9,
    "text": {
      "en": "You and {partner} are in different cities, two calendars that refuse to agree, trying to find one weekend that works.",
      "zh": "你和 {partner} 在两座城市，两份死活对不上的日历，正努力凑出一个都行的周末。"
    },
    "choices": [
      {
        "id": "book_visit",
        "text": {
          "en": "Book the trip even if money's tight",
          "zh": "钱紧也先把车票订了"
        },
        "resultText": {
          "en": "The ticket pings into your inbox and suddenly the whole month has a finish line worth running toward.",
          "zh": "车票确认信息一进邮箱，整个月突然有了一个值得冲的终点。"
        },
        "effects": {
          "love": 9,
          "mood": 7,
          "stress": -5,
          "money": -8
        }
      },
      {
        "id": "video_compromise",
        "text": {
          "en": "Settle for a long video-call night",
          "zh": "退一步，约个视频长夜"
        },
        "resultText": {
          "en": "Two screens, two cheap dinners, one shared movie out of sync by three seconds. It counts.",
          "zh": "两块屏幕、两份廉价晚饭、一部差了三秒的电影。这也算约会。"
        },
        "effects": {
          "love": 5,
          "mood": 4,
          "stress": -3,
          "money": -1
        }
      },
      {
        "id": "postpone",
        "text": {
          "en": "Push it back until exams clear",
          "zh": "推到考试结束再说"
        },
        "resultText": {
          "en": "Sensible for your grades, quietly heavy for both of you. {partner} understands, which somehow makes it worse.",
          "zh": "对成绩很理智，对你俩都有点闷。{partner} 表示理解，反而更让你心里发酸。"
        },
        "effects": {
          "knowledge": 6,
          "love": -2,
          "mood": -3,
          "stress": 2
        }
      }
    ]
  },
  {
    "id": "love_tiny_budget_date",
    "title": {
      "en": "A Date on a Student Budget",
      "zh": "学生预算的迷你约会"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "support",
      "rest"
    ],
    "weight": 10,
    "text": {
      "en": "{partner} proposes a date with a budget roughly the size of a vending-machine coffee. Challenge accepted.",
      "zh": "{partner} 提议来场约会，预算大概等于自动贩卖机一杯咖啡。挑战接受。"
    },
    "choices": [
      {
        "id": "park_picnic",
        "text": {
          "en": "Grocery-store picnic in the park",
          "zh": "超市采购，公园野餐"
        },
        "resultText": {
          "en": "Bread, two snacks, one bench, zero stress. Easily the best three dollars of the semester.",
          "zh": "面包、两份小零食、一条长椅、零压力。绝对是这学期花得最值的几块钱。"
        },
        "effects": {
          "mood": 9,
          "love": 8,
          "stress": -8,
          "money": -2
        }
      },
      {
        "id": "study_date",
        "text": {
          "en": "Turn it into a cozy study date",
          "zh": "改成温馨自习约会"
        },
        "resultText": {
          "en": "You both read in comfortable silence, knees touching under the table. Productive and quietly lovely.",
          "zh": "你俩在舒服的沉默里各看各的，桌下膝盖轻轻挨着。又高产又默默地甜。"
        },
        "effects": {
          "knowledge": 5,
          "love": 4,
          "mood": 3,
          "stress": -3
        }
      },
      {
        "id": "splurge_little",
        "text": {
          "en": "Splurge on one nice dessert to share",
          "zh": "奢侈一次，合吃一份好甜点"
        },
        "resultText": {
          "en": "One fancy slice, two forks, an embarrassing amount of joy. Worth blowing the budget.",
          "zh": "一块讲究的甜点、两把叉子、过分多的快乐。超预算也认了。"
        },
        "effects": {
          "love": 7,
          "mood": 7,
          "stress": -5,
          "money": -5
        }
      }
    ]
  },
  {
    "id": "love_guilty_for_busy",
    "title": {
      "en": "Sorry I've Been a Ghost",
      "zh": "抱歉我最近像消失了"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "support",
      "stress"
    ],
    "weight": 10,
    "text": {
      "en": "You catch yourself feeling guilty for being so buried lately. {partner} hasn't complained once, which somehow makes you feel guiltier.",
      "zh": "你突然觉得最近埋头太久、有点亏欠。{partner} 一句没抱怨，反而让你更过意不去。"
    },
    "choices": [
      {
        "id": "honest_text",
        "text": {
          "en": "Send an honest, soft text about it",
          "zh": "发条坦白又温柔的消息"
        },
        "resultText": {
          "en": "{partner} replies that loving a busy person is not a hardship, it's just timing. Your chest unknots.",
          "zh": "{partner} 回你：爱一个忙人不是受苦，只是时机问题。你胸口那个结松开了。"
        },
        "effects": {
          "love": 8,
          "mood": 7,
          "stress": -6
        }
      },
      {
        "id": "overcompensate",
        "text": {
          "en": "Plan an elaborate make-up day",
          "zh": "策划一个隆重的补偿日"
        },
        "resultText": {
          "en": "Ambitious plans, real money, real fun, but you both know presence beats production value.",
          "zh": "计划宏大、真金白银、也真的开心，可你俩都明白：人在场，比排场重要。"
        },
        "effects": {
          "love": 5,
          "mood": 4,
          "stress": 2,
          "money": -7
        }
      },
      {
        "id": "bottle_it",
        "text": {
          "en": "Say nothing, just power through",
          "zh": "啥也不说，硬扛过去"
        },
        "resultText": {
          "en": "You bury it under more flashcards. The guilt doesn't leave; it just files itself away for later.",
          "zh": "你用更多卡片把它埋了。愧疚没走，只是给自己存了个档，留着以后再说。"
        },
        "effects": {
          "knowledge": 5,
          "love": -2,
          "mood": -4,
          "stress": 4
        }
      }
    ],
    "condition": {
      "maxStats": {
        "mood": 60
      }
    }
  },
  {
    "id": "love_go_to_sleep",
    "title": {
      "en": "The Tooth Can Wait, Your Brain Cannot",
      "zh": "牙能等，你的脑子不能"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "support",
      "rest"
    ],
    "weight": 11,
    "text": {
      "en": "It is 1 a.m. {partner} texts: 'the tooth can wait, your nervous system cannot. go to sleep.'",
      "zh": "凌晨一点，{partner} 发来：'牙能等，你的神经系统不能。去睡觉。'"
    },
    "choices": [
      {
        "id": "obey",
        "text": {
          "en": "Actually listen and go to bed",
          "zh": "真的听话，去睡了"
        },
        "resultText": {
          "en": "You close the laptop mid-sentence. Tomorrow-you will write a thank-you note to past-you.",
          "zh": "你在句子写一半时合上电脑。明天的你会给今天的你写封感谢信。"
        },
        "effects": {
          "stamina": 9,
          "mood": 6,
          "stress": -8,
          "love": 5,
          "knowledge": -2
        }
      },
      {
        "id": "one_more_hour",
        "text": {
          "en": "Negotiate 'just one more hour'",
          "zh": "讨价还价 '就再一小时'"
        },
        "resultText": {
          "en": "One hour becomes ninety minutes. You learn a little more and sleep a little worse.",
          "zh": "一小时拖成了九十分钟。多学了一点，也睡得差了一点。"
        },
        "effects": {
          "knowledge": 4,
          "stamina": -3,
          "stress": 1,
          "love": 1
        }
      },
      {
        "id": "send_selfie",
        "text": {
          "en": "Send a tragic study selfie back",
          "zh": "回一张悲壮的学习自拍"
        },
        "resultText": {
          "en": "{partner} replies with three crying-laughing faces and a firm 'BED. NOW.' You comply, grinning.",
          "zh": "{partner} 回了三个笑哭，外加坚定的 '上。床。现。在。' 你笑着照办了。"
        },
        "effects": {
          "love": 6,
          "mood": 5,
          "stress": -5,
          "stamina": 4
        }
      }
    ],
    "condition": {
      "maxStats": {
        "mood": 60
      }
    }
  },
  {
    "id": "love_celebrate_small_win",
    "title": {
      "en": "A Win Worth a Tiny Party",
      "zh": "值得开个小派对的胜利"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "support",
      "confidence"
    ],
    "weight": 10,
    "text": {
      "en": "You passed the thing, or nailed one tricky procedure, and {partner} insists this absolutely requires celebrating.",
      "zh": "你过了那个考核，或者搞定了一个棘手操作，{partner} 坚持这绝对值得庆祝一下。"
    },
    "choices": [
      {
        "id": "celebrate",
        "text": {
          "en": "Let {partner} make a fuss",
          "zh": "让 {partner} 大张旗鼓一回"
        },
        "resultText": {
          "en": "A goofy little toast and genuine pride in {partner}'s eyes. You let yourself feel competent for once.",
          "zh": "一句傻气的祝酒词，加上 {partner} 眼里真心的骄傲。你难得允许自己觉得 '我挺行的'。"
        },
        "effects": {
          "confidence": 7,
          "mood": 8,
          "love": 7,
          "stress": -5,
          "money": -3
        }
      },
      {
        "id": "downplay",
        "text": {
          "en": "Shrug it off, it's not a big deal",
          "zh": "摆摆手，没什么大不了"
        },
        "resultText": {
          "en": "{partner} gently disagrees and celebrates anyway, but you keep half the joy locked in modesty.",
          "zh": "{partner} 温柔地不同意，照样庆祝，可你把一半的开心锁在了谦虚里。"
        },
        "effects": {
          "confidence": 2,
          "love": 3,
          "mood": 2
        }
      },
      {
        "id": "back_to_work",
        "text": {
          "en": "Toast fast, next exam looms",
          "zh": "速干一杯，下个考试在逼近"
        },
        "resultText": {
          "en": "Five minutes of celebration, then back to the grind. The momentum stays; the warmth fades quickly.",
          "zh": "庆祝五分钟，回去接着卷。势头留下了，暖意散得快了点。"
        },
        "effects": {
          "knowledge": 5,
          "confidence": 3,
          "stress": 2,
          "love": 1
        }
      }
    ]
  },
  {
    "id": "love_small_misunderstanding",
    "title": {
      "en": "A Misread Text, Quietly Fixed",
      "zh": "一条会错意的消息，悄悄理顺"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "support",
      "stress"
    ],
    "weight": 9,
    "text": {
      "en": "A tired one-word reply from you landed wrong, and {partner} seems a little off. It's small, but it's sitting there.",
      "zh": "你累到只回了一个字，结果被误会了，{partner} 好像有点不对劲。事不大，但就那么悬着。"
    },
    "choices": [
      {
        "id": "talk_it_out",
        "text": {
          "en": "Call and clear it up kindly",
          "zh": "打个电话，好好说开"
        },
        "resultText": {
          "en": "Two minutes of honesty: you were just fried, not cold. {partner} laughs, relieved, and so are you.",
          "zh": "两分钟坦白：你只是累瘫了，不是冷淡。{partner} 松口气笑了，你也是。"
        },
        "effects": {
          "love": 8,
          "mood": 6,
          "stress": -6,
          "knowledge": -1
        }
      },
      {
        "id": "send_meme",
        "text": {
          "en": "Defuse it with a dumb meme",
          "zh": "甩个沙雕表情包化解"
        },
        "resultText": {
          "en": "The meme works instantly, but the real conversation stays politely postponed for another day.",
          "zh": "表情包当场奏效，可那场真正的对话还是被礼貌地往后挪了。"
        },
        "effects": {
          "love": 4,
          "mood": 4,
          "stress": -2
        }
      },
      {
        "id": "assume_fine",
        "text": {
          "en": "Assume it'll blow over on its own",
          "zh": "觉得过两天自己就好了"
        },
        "resultText": {
          "en": "It probably will, but you both carry a low hum of awkwardness through the evening.",
          "zh": "大概是会好，可一整晚你俩都背着一丝低低的别扭。"
        },
        "effects": {
          "knowledge": 3,
          "love": -3,
          "mood": -3,
          "stress": 3
        }
      }
    ],
    "condition": {
      "maxStats": {
        "mood": 60
      }
    }
  },
  {
    "id": "love_let_yourself_be_supported",
    "title": {
      "en": "Letting Someone Carry a Tab for You",
      "zh": "让别人替你扛一个 tab"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "support",
      "rest"
    ],
    "weight": 10,
    "text": {
      "en": "You are visibly running on fumes, and {partner} offers to handle dinner, errands, everything, so you can breathe. Accepting feels weirdly hard.",
      "zh": "你明显已经在用爱发电了，{partner} 主动包揽晚饭、跑腿、一切，让你喘口气。可接受这份好意竟然莫名地难。"
    },
    "choices": [
      {
        "id": "accept",
        "text": {
          "en": "Accept, and just say thank you",
          "zh": "接受，然后好好说声谢谢"
        },
        "resultText": {
          "en": "You let yourself be taken care of for one evening. Turns out, you don't have to earn rest. Suspiciously mature.",
          "zh": "你允许自己被照顾了一晚。原来休息不用 '挣'。这操作意外地成熟。"
        },
        "effects": {
          "stamina": 7,
          "mood": 8,
          "stress": -9,
          "love": 7
        }
      },
      {
        "id": "split",
        "text": {
          "en": "Accept half, insist on doing the rest",
          "zh": "接受一半，剩下硬要自己来"
        },
        "resultText": {
          "en": "A reasonable compromise that helps a bit, though {partner} side-eyes you for still doing the dishes.",
          "zh": "一个合理的折中，确实缓了点，不过 {partner} 还是斜眼看你那个非要洗碗的样子。"
        },
        "effects": {
          "stamina": 3,
          "mood": 4,
          "stress": -4,
          "love": 4
        }
      },
      {
        "id": "decline",
        "text": {
          "en": "Politely decline, you've got it",
          "zh": "礼貌拒绝，你能搞定"
        },
        "resultText": {
          "en": "You handle it all yourself like always. Independent, technically fine, and quietly more tired than you admit.",
          "zh": "你像往常一样全自己扛了。独立、勉强算行，只是比你承认的更累一点。"
        },
        "effects": {
          "stamina": -3,
          "confidence": 2,
          "stress": 3,
          "love": -1
        }
      }
    ],
    "condition": {
      "maxStats": {
        "mood": 60
      }
    }
  },
  {
    "id": "love_losing_fight_tiny_tooth",
    "title": {
      "en": "I Am Losing a Fight With a Tiny Tooth",
      "zh": "我正在输给一颗小小的牙"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "support",
      "stress"
    ],
    "weight": 11,
    "text": {
      "en": "Sim lab is humbling you. You draft a dramatic text to {partner}: 'send help, I am losing a fight with a tiny tooth.'",
      "zh": "sim lab 把你按在地上摩擦。你给 {partner} 打了条戏精消息：'快来救我，我正在输给一颗小小的牙。'"
    },
    "choices": [
      {
        "id": "send_it",
        "text": {
          "en": "Send the dramatic text",
          "zh": "把这条戏精消息发出去"
        },
        "resultText": {
          "en": "{partner} replies: 'believe in the tooth's eventual defeat, soldier.' You laugh, breathe, and your hands steady.",
          "zh": "{partner} 回：'相信这颗牙终将落败，战士。' 你笑出声、喘口气，手也稳了。"
        },
        "effects": {
          "love": 7,
          "mood": 8,
          "stress": -7,
          "handSkill": 2
        }
      },
      {
        "id": "vent_long",
        "text": {
          "en": "Full voice-memo meltdown rant",
          "zh": "录段语音，彻底崩溃吐槽"
        },
        "resultText": {
          "en": "You unload two minutes of despair; {partner} listens to all of it. Cathartic, if mildly unhinged.",
          "zh": "你倾倒了两分钟的绝望，{partner} 全程听完。很解压，就是有点癫。"
        },
        "effects": {
          "love": 5,
          "mood": 5,
          "stress": -5,
          "stamina": -2
        }
      },
      {
        "id": "tough_it_out",
        "text": {
          "en": "Delete it, just try again quietly",
          "zh": "删掉，默默再练一次"
        },
        "resultText": {
          "en": "You reset and repeat the drill. The skill creeps up a notch, but no one talked you off the ledge.",
          "zh": "你重置好再练一遍。手感悄悄涨了一格，只是没人把你从崩溃边缘劝下来。"
        },
        "effects": {
          "handSkill": 5,
          "stress": 3,
          "mood": -2
        }
      }
    ]
  },
  {
    "id": "well_burnout_warning",
    "title": {
      "en": "The Low-Battery Warning",
      "zh": "电量告急提醒"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "wellness",
      "crisis"
    ],
    "weight": 11,
    "text": {
      "en": "You've been running like a browser with 80 tabs open, and the fan is screaming. Everything still works, technically, but you can feel the whole system getting warm.",
      "zh": "你最近像开了 80 个标签页的浏览器，风扇嗡嗡狂转。东西勉强还能跑，但你能感觉到整个系统都在发烫。"
    },
    "choices": [
      {
        "id": "well_burnout_close_tabs",
        "text": {
          "en": "Close some tabs and breathe",
          "zh": "关掉几个标签页，喘口气"
        },
        "resultText": {
          "en": "You cut your to-do list in half and go to bed early. Tomorrow-you sends a thank-you note.",
          "zh": "你把待办清单砍掉一半，早早睡了。明天的你给今天的你发来感谢信。"
        },
        "effects": {
          "stress": -10,
          "stamina": 8,
          "mood": 6,
          "knowledge": -2
        }
      },
      {
        "id": "well_burnout_push",
        "text": {
          "en": "Push through, sleep is for graduates",
          "zh": "硬撑，等毕业再睡"
        },
        "resultText": {
          "en": "You squeeze out a few more hours of studying. The notes blur together and your patience does too.",
          "zh": "你又硬挤出几个小时复习。笔记糊成一团，耐心也一起糊了。"
        },
        "effects": {
          "knowledge": 4,
          "stress": 10,
          "stamina": -8,
          "mood": -5
        }
      },
      {
        "id": "well_burnout_walk",
        "text": {
          "en": "Take a short walk outside",
          "zh": "出门走一小圈"
        },
        "resultText": {
          "en": "Fresh air, no agenda. Your brain quietly reboots and the fan stops screaming.",
          "zh": "新鲜空气，没有任务。脑子悄悄重启，风扇终于不叫了。"
        },
        "effects": {
          "stress": -7,
          "stamina": 4,
          "mood": 5
        }
      }
    ],
    "condition": {
      "maxStats": {
        "mood": 30
      }
    }
  },
  {
    "id": "well_cant_sleep",
    "title": {
      "en": "2 A.M. Ceiling Inspection",
      "zh": "凌晨两点检查天花板"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "wellness",
      "crisis"
    ],
    "weight": 10,
    "text": {
      "en": "It's 2 a.m. and your brain is hosting an unscheduled review session on every embarrassing thing you've ever done. The ceiling has no answers, but you keep checking.",
      "zh": "凌晨两点，你的大脑临时召开了一场复盘大会，主题是你这辈子所有的尴尬时刻。天花板给不出答案，你却一直盯着它看。"
    },
    "choices": [
      {
        "id": "well_sleep_winddown",
        "text": {
          "en": "Phone down, boring podcast on",
          "zh": "放下手机，听个无聊播客"
        },
        "resultText": {
          "en": "You stop scrolling and let a dull voice talk about soil for ten minutes. You're out before it gets to clay.",
          "zh": "你不刷手机了，听一个无聊的声音讲了十分钟土壤。还没讲到黏土你就睡着了。"
        },
        "effects": {
          "stress": -8,
          "stamina": 7,
          "mood": 4
        }
      },
      {
        "id": "well_sleep_study",
        "text": {
          "en": "Might as well study then",
          "zh": "睡不着不如复习"
        },
        "resultText": {
          "en": "You learn three facts and lose two hours of sleep. Math says this was a bad trade.",
          "zh": "你学到了三个知识点，损失了两小时睡眠。算下来这笔买卖很亏。"
        },
        "effects": {
          "knowledge": 3,
          "stress": 6,
          "stamina": -9
        }
      },
      {
        "id": "well_sleep_tea",
        "text": {
          "en": "Warm drink, lights low",
          "zh": "热饮一杯，把灯调暗"
        },
        "resultText": {
          "en": "Something warm, no screens, low light. The 2 a.m. review session is adjourned without a vote.",
          "zh": "来点热的，不看屏幕，灯光放暗。凌晨的复盘大会无人表决，自动散会。"
        },
        "effects": {
          "stress": -6,
          "stamina": 5,
          "mood": 3
        }
      },
      {
        "id": "well_sleep_text",
        "text": {
          "en": "Text {partner} you can't sleep",
          "zh": "给{partner}发消息说睡不着"
        },
        "resultText": {
          "en": "{partner} replies with a single sleepy thumbs-up and a typo'd 'goodnihgt'. Somehow it helps.",
          "zh": "{partner}回了个睡眼惺忪的赞，还把'晚安'打成了'晚安安'。莫名其妙地，你就安心了。"
        },
        "effects": {
          "stress": -7,
          "mood": 6,
          "love": 4,
          "stamina": 3
        }
      }
    ],
    "condition": {
      "minStats": {
        "stress": 70
      }
    }
  },
  {
    "id": "well_imposter_syndrome",
    "title": {
      "en": "The Fraud Squad Meeting",
      "zh": "冒牌者协会例会"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "wellness",
      "crisis"
    ],
    "weight": 10,
    "text": {
      "en": "A small voice insists everyone else got into dental school on merit and you got in by clerical error. The voice is very confident for someone with no evidence.",
      "zh": "脑子里有个小声音坚称，别人考上牙学院靠的是实力，而你纯属系统出 bug 录错了。这声音明明没证据，却特别自信。"
    },
    "choices": [
      {
        "id": "well_imposter_evidence",
        "text": {
          "en": "List things you actually got right",
          "zh": "列一列你真做对的事"
        },
        "resultText": {
          "en": "You write down three things you nailed this week. Turns out the clerical-error theory has holes.",
          "zh": "你写下本周做成的三件事。结果发现'系统录错'这个理论漏洞百出。"
        },
        "effects": {
          "confidence": 8,
          "mood": 5,
          "stress": -4
        }
      },
      {
        "id": "well_imposter_spiral",
        "text": {
          "en": "Reread your worst exam to confirm",
          "zh": "重看最烂的那次考卷确认一下"
        },
        "resultText": {
          "en": "You go looking for proof you're a fraud and, shockingly, find some. The voice high-fives itself.",
          "zh": "你专门去找自己是冒牌货的证据，居然真找到了。那个小声音得意地给自己鼓掌。"
        },
        "effects": {
          "confidence": -7,
          "mood": -6,
          "stress": 8
        }
      },
      {
        "id": "well_imposter_talk",
        "text": {
          "en": "Tell a classmate the secret thought",
          "zh": "把这个秘密想法告诉同学"
        },
        "resultText": {
          "en": "Your classmate whispers 'wait, you too?!' Turns out the whole cohort is in the Fraud Squad.",
          "zh": "同学小声说'啊你也是？！'原来整个年级都是冒牌者协会会员。"
        },
        "effects": {
          "confidence": 6,
          "mood": 6,
          "reputation": 2,
          "stress": -5
        }
      }
    ],
    "condition": {
      "maxStats": {
        "confidence": 30
      }
    }
  },
  {
    "id": "well_comparison_spiral",
    "title": {
      "en": "The Scroll of Comparison",
      "zh": "比较的无底洞"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "wellness",
      "crisis"
    ],
    "weight": 10,
    "text": {
      "en": "Everyone online is publishing papers, prepping flawless crowns, and apparently sleeping eight hours. You are eating cereal over the sink, comparing your blooper reel to their highlight reel.",
      "zh": "网上每个人都在发论文、做完美牙冠，还顺便睡满八小时。而你站在水池边吃麦片，拿自己的 NG 花絮去比别人的高光集锦。"
    },
    "choices": [
      {
        "id": "well_compare_logoff",
        "text": {
          "en": "Log off, run your own race",
          "zh": "下线，跑自己的赛道"
        },
        "resultText": {
          "en": "You close the app and finish your cereal in peace. Your race has exactly one runner and that's the point.",
          "zh": "你关掉 app，安安静静吃完麦片。你的赛道只有一个选手，这正是重点。"
        },
        "effects": {
          "stress": -8,
          "mood": 7,
          "confidence": 4
        }
      },
      {
        "id": "well_compare_chase",
        "text": {
          "en": "Try to match all of them at once",
          "zh": "试图一口气追平所有人"
        },
        "resultText": {
          "en": "You start five new ambitious projects at midnight. By 1 a.m. you've finished zero and feel worse.",
          "zh": "你半夜雄心勃勃地同时开了五个新项目。到凌晨一点，一个没完成，心情更差了。"
        },
        "effects": {
          "stress": 10,
          "stamina": -7,
          "mood": -6,
          "knowledge": 2
        }
      },
      {
        "id": "well_compare_one_thing",
        "text": {
          "en": "Pick one tiny real goal for tomorrow",
          "zh": "给明天定一个超小的真目标"
        },
        "resultText": {
          "en": "You write down one doable thing for tomorrow. Small, specific, suspiciously mature, surprisingly effective.",
          "zh": "你给明天写下一件做得到的小事。又小又具体，意外地成熟，效果好得出奇。"
        },
        "effects": {
          "mood": 5,
          "confidence": 5,
          "stress": -4,
          "knowledge": 2
        }
      }
    ],
    "condition": {
      "maxStats": {
        "mood": 35
      }
    }
  },
  {
    "id": "well_skipped_meals",
    "title": {
      "en": "Running on Coffee and Vibes",
      "zh": "全靠咖啡和氛围运行"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "wellness",
      "crisis"
    ],
    "weight": 10,
    "text": {
      "en": "You realize your last real meal was a granola bar at an hour you'd rather not name. Your stomach files a formal complaint mid-lecture.",
      "zh": "你猛然想起，上一顿正经饭是一根能量棒，吃的时间点你都不好意思说。讲座讲到一半，你的胃正式提交了投诉。"
    },
    "choices": [
      {
        "id": "well_meal_real_food",
        "text": {
          "en": "Go eat an actual meal",
          "zh": "去吃一顿正经饭"
        },
        "resultText": {
          "en": "Warm food, sitting down, no notes. Your brain comes back online with a friendly ping.",
          "zh": "热乎的饭，坐下来吃，不看笔记。脑子'叮'一声友好地重新上线了。"
        },
        "effects": {
          "stamina": 9,
          "mood": 6,
          "stress": -5,
          "money": -3
        }
      },
      {
        "id": "well_meal_coffee",
        "text": {
          "en": "Just get another coffee",
          "zh": "再来一杯咖啡顶着"
        },
        "resultText": {
          "en": "Cup number four arrives. You're now vibrating at a frequency only dogs can study with.",
          "zh": "第四杯咖啡到位。你现在以一种只有狗能跟着复习的频率在抖。"
        },
        "effects": {
          "stamina": -3,
          "stress": 6,
          "mood": -2,
          "money": -2
        }
      },
      {
        "id": "well_meal_snack_share",
        "text": {
          "en": "Split snacks with a study buddy",
          "zh": "和学伴分享点零食"
        },
        "resultText": {
          "en": "You trade half a sandwich for half of theirs and a much-needed laugh. Calories and friendship, restored.",
          "zh": "你用半个三明治换了对方半个，外加一阵急需的大笑。热量和友谊，双双回血。"
        },
        "effects": {
          "stamina": 6,
          "mood": 5,
          "reputation": 2,
          "stress": -3
        }
      }
    ],
    "condition": {
      "maxStats": {
        "stamina": 30
      }
    }
  },
  {
    "id": "well_preexam_anxiety",
    "title": {
      "en": "The Night-Before Jitters",
      "zh": "考前一夜的心跳"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "wellness",
      "crisis"
    ],
    "weight": 11,
    "text": {
      "en": "The exam is tomorrow and your heart is auditioning for a drum solo. You know the material; your nervous system did not get the memo.",
      "zh": "明天就考试了，你的心脏正在试镜一段架子鼓 solo。知识你都会了，可你的神经系统没收到这条通知。"
    },
    "choices": [
      {
        "id": "well_exam_breathe",
        "text": {
          "en": "Do a slow breathing round, then sleep",
          "zh": "做几轮慢呼吸，然后睡觉"
        },
        "resultText": {
          "en": "Four slow breaths, lights off. The drum solo fades to a calm steady beat. The tooth can wait; your nervous system cannot.",
          "zh": "四次缓慢呼吸，关灯。架子鼓 solo 渐渐变成平稳的心跳。牙可以等，你的神经系统不能等。"
        },
        "effects": {
          "stress": -9,
          "stamina": 6,
          "confidence": 4,
          "mood": 4
        }
      },
      {
        "id": "well_exam_cram",
        "text": {
          "en": "Cram the whole syllabus one more time",
          "zh": "把整本大纲再啃一遍"
        },
        "resultText": {
          "en": "You re-read everything at panic speed and absorb almost none of it. Now you're tired AND jittery.",
          "zh": "你以恐慌的速度把所有东西又过了一遍，几乎啥也没进脑子。现在你又累又抖。"
        },
        "effects": {
          "knowledge": 3,
          "stress": 9,
          "stamina": -8,
          "confidence": -3
        }
      },
      {
        "id": "well_exam_light_review",
        "text": {
          "en": "Skim your one-page cheat-summary",
          "zh": "扫一遍自己的一页纸总结"
        },
        "resultText": {
          "en": "You glance over the highlights you already made, nod, and call it. Confident enough, rested enough.",
          "zh": "你扫一眼自己早就划好的重点，点点头，收工。自信够了，休息也够了。"
        },
        "effects": {
          "knowledge": 2,
          "confidence": 5,
          "stress": -4,
          "stamina": 2
        }
      },
      {
        "id": "well_exam_partner_quiz",
        "text": {
          "en": "Let {partner} quiz you for ten minutes",
          "zh": "让{partner}考你十分钟"
        },
        "resultText": {
          "en": "{partner} reads questions in a dramatic game-show voice and gets every dental term hilariously wrong. You laugh, you remember, you relax.",
          "zh": "{partner}用夸张的综艺主持人语气念题，每个牙科术语都念得离谱搞笑。你笑了，记住了，也放松了。"
        },
        "effects": {
          "stress": -6,
          "confidence": 5,
          "mood": 6,
          "love": 4,
          "knowledge": 2
        }
      }
    ],
    "condition": {
      "minStats": {
        "stress": 65
      }
    }
  },
  {
    "id": "well_recovery_day",
    "title": {
      "en": "The 'I Have Nothing Left' Day",
      "zh": "'我真的没电了'的一天"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "wellness",
      "crisis"
    ],
    "weight": 10,
    "text": {
      "en": "You wake up and the tank reads empty. Not lazy-empty, actually-empty. Your body is gently filing for one day of mercy.",
      "zh": "你一觉醒来，发现油箱见底了。不是偷懒的那种空，是真的空。你的身体正温柔地申请放它一天假。"
    },
    "choices": [
      {
        "id": "well_recover_rest",
        "text": {
          "en": "Take the recovery day, guilt-free",
          "zh": "心安理得地休一天"
        },
        "resultText": {
          "en": "You rest on purpose, not by accident. By evening the tank reads a hopeful quarter-full.",
          "zh": "你是有意休息，不是不小心垮掉。到傍晚，油箱回到了充满希望的四分之一格。"
        },
        "effects": {
          "stamina": 12,
          "stress": -8,
          "mood": 7,
          "knowledge": -2
        }
      },
      {
        "id": "well_recover_force",
        "text": {
          "en": "Force a full study day anyway",
          "zh": "还是逼自己学满一整天"
        },
        "resultText": {
          "en": "You drag yourself through the day at 20% efficiency and end up needing two recovery days instead.",
          "zh": "你拖着自己以 20% 的效率熬过一天，结果反而欠下了两天的恢复假。"
        },
        "effects": {
          "knowledge": 2,
          "stamina": -9,
          "stress": 9,
          "mood": -6
        }
      },
      {
        "id": "well_recover_half",
        "text": {
          "en": "Do one easy task, then truly stop",
          "zh": "做一件轻松小事，然后彻底收工"
        },
        "resultText": {
          "en": "You handle one gentle thing, feel a little accomplished, then close the laptop for real. Balanced and humane.",
          "zh": "你搞定一件不费劲的小事，有点成就感，然后真的合上电脑。既平衡又人道。"
        },
        "effects": {
          "stamina": 7,
          "mood": 5,
          "stress": -5,
          "knowledge": 1
        }
      }
    ],
    "condition": {
      "maxStats": {
        "stamina": 25
      }
    }
  },
  {
    "id": "well_talk_to_counselor",
    "title": {
      "en": "Talking to Someone Who Gets It",
      "zh": "找个懂你的人聊聊"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "wellness",
      "crisis"
    ],
    "weight": 10,
    "text": {
      "en": "There's a counselor on campus who has heard 'I'm fine' said in that exact tired voice a thousand times. A friend nudges you to actually book the appointment.",
      "zh": "校园里有位辅导员，听过一千遍用那种疲惫语气说出的'我没事'。一个朋友轻轻推了你一把，让你真的去预约。"
    },
    "choices": [
      {
        "id": "well_counselor_go",
        "text": {
          "en": "Book it and actually go",
          "zh": "预约，并且真的去"
        },
        "resultText": {
          "en": "You say the quiet stuff out loud to someone trained to listen. Nothing magic, just lighter shoulders walking out.",
          "zh": "你把憋在心里的话，对一个受过训练的倾听者说了出来。没什么魔法，只是走出门时肩膀轻了不少。"
        },
        "effects": {
          "stress": -10,
          "mood": 8,
          "confidence": 4
        }
      },
      {
        "id": "well_counselor_later",
        "text": {
          "en": "Tell yourself you'll go 'later'",
          "zh": "告诉自己'以后'再去"
        },
        "resultText": {
          "en": "You file it under Later, the folder where good intentions go to nap. The feeling stays put.",
          "zh": "你把它归进'以后再说'文件夹——那是好意去打盹的地方。那股情绪原地没动。"
        },
        "effects": {
          "stress": 4,
          "mood": -3
        }
      },
      {
        "id": "well_counselor_friend",
        "text": {
          "en": "Talk to a trusted friend first",
          "zh": "先找个信得过的朋友聊聊"
        },
        "resultText": {
          "en": "A long honest chat with a friend over bad cafeteria tea. Less clinical, still real, genuinely helps.",
          "zh": "和朋友就着难喝的食堂奶茶聊了好久，全是真心话。没那么专业，但很真实，确实管用。"
        },
        "effects": {
          "stress": -7,
          "mood": 6,
          "reputation": 2
        }
      }
    ],
    "condition": {
      "maxStats": {
        "mood": 30
      }
    }
  },
  {
    "id": "well_perspective_reset",
    "title": {
      "en": "Zooming Out",
      "zh": "把镜头拉远一点"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "wellness",
      "crisis"
    ],
    "weight": 9,
    "text": {
      "en": "One bad lab session has somehow become 'I will never be a good dentist and also probably bad at everything.' The catastrophe machine is running overtime again.",
      "zh": "一次失手的 sim lab，不知怎么就升级成了'我永远当不好牙医，而且大概干啥都不行'。灾难放大机又在加班了。"
    },
    "choices": [
      {
        "id": "well_perspective_zoom",
        "text": {
          "en": "Ask: will this matter in a year?",
          "zh": "问自己：一年后这还重要吗？"
        },
        "resultText": {
          "en": "You zoom out. One wobbly afternoon does not define a career. The catastrophe machine powers down.",
          "zh": "你把镜头拉远。一个手抖的下午，定义不了一整个职业生涯。灾难放大机自动关机。"
        },
        "effects": {
          "confidence": 6,
          "stress": -7,
          "mood": 6
        }
      },
      {
        "id": "well_perspective_dwell",
        "text": {
          "en": "Replay the mistake on loop",
          "zh": "把失误循环播放"
        },
        "resultText": {
          "en": "You watch the highlight (lowlight?) reel forty times. Spoiler: it does not improve with rewatching.",
          "zh": "你把那段'高光'(低谷？)集锦看了四十遍。剧透：重看四十遍也不会变好。"
        },
        "effects": {
          "confidence": -6,
          "stress": 8,
          "mood": -5
        }
      },
      {
        "id": "well_perspective_data",
        "text": {
          "en": "Count how many things went fine today",
          "zh": "数数今天有多少事是顺的"
        },
        "resultText": {
          "en": "You tally the day honestly: one rough lab, eleven ordinary fine things. The ratio is reassuring.",
          "zh": "你诚实地把一天盘了盘：一次手抖的 lab，十一件普普通通搞定的事。这个比例还挺安慰人。"
        },
        "effects": {
          "confidence": 5,
          "mood": 4,
          "stress": -4,
          "clinicalSense": 2
        }
      }
    ],
    "condition": {
      "maxStats": {
        "confidence": 35
      }
    }
  },
  {
    "id": "well_recovery_week",
    "title": {
      "en": "Permission to Rest, Granted",
      "zh": "已批准：你可以休息了"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "wellness",
      "crisis"
    ],
    "weight": 100,
    "text": {
      "en": "Your body has stopped asking nicely. This is the part of the story where you take a real recovery week, and no, you don't have to earn it first.",
      "zh": "你的身体已经不再客气地请求了。故事走到了这一段：你要真正休一个恢复周——不用，你不需要先'配得上'它。"
    },
    "choices": [
      {
        "id": "well_rweek_accept",
        "text": {
          "en": "Accept the recovery week fully",
          "zh": "踏踏实实接受这个恢复周"
        },
        "resultText": {
          "en": "You sleep, eat, walk, and let the textbooks gather a little honest dust. You come back actually able to think again.",
          "zh": "你睡觉、吃饭、散步，让课本踏踏实实落点灰。回来时，你真的又能好好思考了。"
        },
        "effects": {
          "stamina": 15,
          "stress": -12,
          "mood": 10,
          "confidence": 4,
          "knowledge": -3
        }
      },
      {
        "id": "well_rweek_sneak",
        "text": {
          "en": "Sneak in 'just a little' studying",
          "zh": "偷偷'就学一点点'"
        },
        "resultText": {
          "en": "Your 'little' study session quietly eats the whole week. The rest you needed remains theoretical.",
          "zh": "你那'一点点'复习悄悄吞掉了整整一周。你真正需要的休息，依然停留在理论层面。"
        },
        "effects": {
          "knowledge": 3,
          "stamina": -4,
          "stress": 6,
          "mood": -4
        }
      },
      {
        "id": "well_rweek_gentle",
        "text": {
          "en": "Rest mostly, plan softly for next week",
          "zh": "主要休息，顺手轻轻规划下周"
        },
        "resultText": {
          "en": "You rest for real and spend twenty calm minutes sketching next week. Recovered and quietly ready.",
          "zh": "你真正休息，再花二十分钟平静地勾画下周的安排。既恢复了，又悄悄做好了准备。"
        },
        "effects": {
          "stamina": 11,
          "stress": -8,
          "mood": 7,
          "confidence": 3
        }
      }
    ],
    "condition": {
      "maxStats": {
        "stamina": 15
      }
    }
  },
  {
    "id": "fun_actually_good_coffee",
    "title": {
      "en": "Suspiciously Good Coffee",
      "zh": "好喝得离谱的咖啡"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "funny",
      "random"
    ],
    "weight": 10,
    "text": {
      "en": "The new cart outside the library is selling a latte that smells like it was made by someone who actually cares. There's a line, but it moves fast.",
      "zh": "图书馆门口新来的咖啡车，那杯拿铁闻起来像是有人真的用心做的。排队的人不少，但队伍走得很快。"
    },
    "choices": [
      {
        "id": "buy_the_good_one",
        "text": {
          "en": "Buy the fancy latte",
          "zh": "买那杯精致拿铁"
        },
        "resultText": {
          "en": "Worth every cent. You float through the next two lectures.",
          "zh": "每一分钱都值。接下来两节 lecture 你都飘着上的。"
        },
        "effects": {
          "mood": 6,
          "stamina": 4,
          "money": -5
        }
      },
      {
        "id": "drip_coffee",
        "text": {
          "en": "Get the cheap drip instead",
          "zh": "改买便宜的美式"
        },
        "resultText": {
          "en": "Fine. Caffeinated. The dream of the good latte lingers.",
          "zh": "还行，咖啡因到位了。但那杯好拿铁的梦还在心里晃。"
        },
        "effects": {
          "stamina": 3,
          "money": -1,
          "mood": 1
        }
      },
      {
        "id": "skip_line",
        "text": {
          "en": "Skip it, you're already late",
          "zh": "算了，你已经迟到了"
        },
        "resultText": {
          "en": "You make it to class on time, smelling everyone else's coffee with great sadness.",
          "zh": "你准时进了教室，闻着同学们的咖啡，心里有点酸。"
        },
        "effects": {
          "stress": -2,
          "mood": -1
        }
      }
    ]
  },
  {
    "id": "fun_vending_machine_thief",
    "title": {
      "en": "The Vending Machine Has Tasted Money",
      "zh": "贩卖机尝过钱的味道了"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "funny",
      "random"
    ],
    "weight": 9,
    "text": {
      "en": "You insert your last bill, press B4 for the granola bar, and the spiral turns... 95% of the way. The bar dangles, taunting you.",
      "zh": "你塞进最后一张钱，按 B4 想买能量棒，螺旋转了……95%。能量棒就那么吊着，嘲笑你。"
    },
    "choices": [
      {
        "id": "buy_again",
        "text": {
          "en": "Feed it another bill to knock both down",
          "zh": "再塞一张，把两根都顶下来"
        },
        "resultText": {
          "en": "Two bars drop. You are now rich in granola, poor in cash. Worth it.",
          "zh": "两根都掉下来了。你现在能量棒首富，现金赤贫。值了。"
        },
        "effects": {
          "stamina": 4,
          "money": -3,
          "mood": 3
        }
      },
      {
        "id": "gentle_shake",
        "text": {
          "en": "Gently rock the machine",
          "zh": "轻轻摇一摇机器"
        },
        "resultText": {
          "en": "It surrenders the bar without crushing you. A small, dignified victory.",
          "zh": "机器投降了，能量棒掉下来还没砸到你。一场体面的小胜利。"
        },
        "effects": {
          "mood": 4,
          "stamina": 2
        }
      },
      {
        "id": "walk_away",
        "text": {
          "en": "Accept the loss and walk away",
          "zh": "认栽走人"
        },
        "resultText": {
          "en": "A stranger later frees your bar and eats it. The circle of vending life.",
          "zh": "后来有个陌生人把你的能量棒解救出来吃了。贩卖机生态的循环。"
        },
        "effects": {
          "money": -2,
          "stress": 2,
          "mood": -1
        }
      }
    ]
  },
  {
    "id": "fun_lost_id_badge",
    "title": {
      "en": "Badge Not Found",
      "zh": "门卡失踪记"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "funny",
      "random"
    ],
    "weight": 10,
    "text": {
      "en": "Your ID badge has vanished. You stand at the locked clinic door doing the full-body pocket pat that everyone recognizes and no one respects.",
      "zh": "你的门卡不见了。你站在锁着的 clinic 门口，做着大家都认得、却没人尊重的全身摸口袋动作。"
    },
    "choices": [
      {
        "id": "retrace_steps",
        "text": {
          "en": "Retrace your morning",
          "zh": "回想一早上的路线"
        },
        "resultText": {
          "en": "It was in the sim lab, clipped to a typodont. Mystery solved, dignity intact.",
          "zh": "原来卡在 sim lab，夹在仿真头模上。谜底揭开，尊严尚存。"
        },
        "effects": {
          "stress": -2,
          "mood": 3,
          "stamina": -1
        }
      },
      {
        "id": "tailgate_in",
        "text": {
          "en": "Politely follow someone in",
          "zh": "礼貌地跟着别人进去"
        },
        "resultText": {
          "en": "You get in, but spend the day badgeless and nervous about every door.",
          "zh": "你进去了，但一整天没卡，对每扇门都心虚。"
        },
        "effects": {
          "stress": 3,
          "mood": -1
        }
      },
      {
        "id": "get_temp_badge",
        "text": {
          "en": "Go get a temporary badge",
          "zh": "去办一张临时卡"
        },
        "resultText": {
          "en": "The front desk gives you a hilariously bad photo on a temp pass. You keep it forever.",
          "zh": "前台给你办了张临时卡，照片丑得离谱。你决定永久收藏它。"
        },
        "effects": {
          "mood": 2,
          "stamina": -2,
          "stress": 1
        }
      }
    ]
  },
  {
    "id": "fun_glove_fashion",
    "title": {
      "en": "Glove Couture",
      "zh": "手套高定时装"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "funny",
      "random"
    ],
    "weight": 8,
    "text": {
      "en": "The supply room is out of your usual gloves. The only size left makes your hands look like cartoon balloons, and your classmates have noticed.",
      "zh": "库房没有你常用的手套了。只剩下的尺码让你的手看起来像卡通气球，同学们已经注意到了。"
    },
    "choices": [
      {
        "id": "own_the_look",
        "text": {
          "en": "Own it, strut the hallway",
          "zh": "豁出去，走廊上走个秀"
        },
        "resultText": {
          "en": "You commit so hard it becomes a vibe. Two people ask where to get the look.",
          "zh": "你演得太投入，反而成了一种 vibe。两个人还来问你这造型哪买的。"
        },
        "effects": {
          "mood": 5,
          "confidence": 3,
          "reputation": 1
        }
      },
      {
        "id": "hunt_other_room",
        "text": {
          "en": "Hunt down better gloves",
          "zh": "去别的房间找合适的手套"
        },
        "resultText": {
          "en": "You find your size two floors up, slightly winded but properly dressed.",
          "zh": "你在楼上两层找到了对的尺码，喘着气但穿戴整齐。"
        },
        "effects": {
          "stamina": -3,
          "stress": -1,
          "mood": 1
        }
      },
      {
        "id": "just_wear_them",
        "text": {
          "en": "Just wear the balloon gloves",
          "zh": "就戴气球手套了"
        },
        "resultText": {
          "en": "Your fine motor work suffers a little, but the lab gets a good laugh.",
          "zh": "你的精细操作受了点影响，但实验室笑得很开心。"
        },
        "effects": {
          "handSkill": -2,
          "mood": 2
        }
      }
    ]
  },
  {
    "id": "fun_group_chat_chaos",
    "title": {
      "en": "147 Unread Messages",
      "zh": "147 条未读"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "funny",
      "random"
    ],
    "weight": 11,
    "text": {
      "en": "You glance at your phone after one lecture. The class group chat has 147 unread, started by 'is the quiz today??' and devolved into meme warfare.",
      "zh": "一节 lecture 后你瞥了眼手机。班级群 147 条未读，起因是一句\"今天有小测吗？？\"，最后演变成表情包大战。"
    },
    "choices": [
      {
        "id": "read_all",
        "text": {
          "en": "Scroll the whole saga",
          "zh": "把整段史诗刷完"
        },
        "resultText": {
          "en": "Twenty minutes gone, but you laughed and learned the quiz is next week. Net positive.",
          "zh": "二十分钟没了，但你笑了，还知道小测是下周。算正收益。"
        },
        "effects": {
          "mood": 4,
          "stamina": -2,
          "stress": -1
        }
      },
      {
        "id": "just_answer",
        "text": {
          "en": "Answer the actual question and mute",
          "zh": "回答正事然后免打扰"
        },
        "resultText": {
          "en": "You drop the answer, mute the chat, and feel suspiciously mature.",
          "zh": "你扔下答案，把群设了免打扰，感觉自己成熟得有点可疑。"
        },
        "effects": {
          "stress": -3,
          "knowledge": 1,
          "mood": 1
        }
      },
      {
        "id": "post_meme",
        "text": {
          "en": "Add one perfect meme",
          "zh": "贴一张完美表情包"
        },
        "resultText": {
          "en": "Your meme gets eleven reactions. You contributed nothing useful and everything emotionally.",
          "zh": "你的表情包收获十一个回应。实用价值为零，情绪价值拉满。"
        },
        "effects": {
          "mood": 5,
          "reputation": 2,
          "stamina": -1
        }
      },
      {
        "id": "ignore_it",
        "text": {
          "en": "Ignore it entirely",
          "zh": "完全无视"
        },
        "resultText": {
          "en": "You stay focused and miss the funniest day in chat history. A worthy trade.",
          "zh": "你保持了专注，错过了群聊史上最好笑的一天。值得的取舍。"
        },
        "effects": {
          "knowledge": 2,
          "mood": -1,
          "stress": -1
        }
      }
    ]
  },
  {
    "id": "fun_tooth_meme",
    "title": {
      "en": "A Tooth Meme For The Ages",
      "zh": "传世级牙齿表情包"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "funny",
      "random"
    ],
    "weight": 9,
    "text": {
      "en": "Mid-study, inspiration strikes: a meme so perfectly capturing the pain of memorizing every cusp and groove. Your thumb hovers over 'post'.",
      "zh": "复习到一半，灵感降临：一张表情包，完美概括了背下每个牙尖牙沟的痛苦。你的拇指悬在\"发布\"上。"
    },
    "choices": [
      {
        "id": "post_to_class",
        "text": {
          "en": "Post it to the class",
          "zh": "发到班群"
        },
        "resultText": {
          "en": "Instant legend. People quote it for weeks. You are now The Meme Person.",
          "zh": "瞬间封神，大家引用了好几周。你现在是\"那个表情包大佬\"。"
        },
        "effects": {
          "mood": 5,
          "reputation": 3,
          "stamina": -1
        }
      },
      {
        "id": "show_partner",
        "text": {
          "en": "Just send it to {partner}",
          "zh": "只发给 {partner}"
        },
        "resultText": {
          "en": "{partner} replies with three crying-laughing faces and 'frame this'. Cozy little win.",
          "zh": "{partner} 回了三个笑哭，外加一句\"这个得裱起来\"。温馨的小确幸。"
        },
        "effects": {
          "mood": 5,
          "love": 3
        }
      },
      {
        "id": "back_to_study",
        "text": {
          "en": "Save it, get back to studying",
          "zh": "存着，回去复习"
        },
        "resultText": {
          "en": "Discipline! You actually learn the cusps. The meme waits patiently in drafts.",
          "zh": "自律！你真把牙尖背下来了。表情包在草稿箱里乖乖等着。"
        },
        "effects": {
          "knowledge": 4,
          "mood": 1,
          "stress": 1
        }
      }
    ]
  },
  {
    "id": "fun_mystery_fridge_food",
    "title": {
      "en": "Fridge Archaeology",
      "zh": "冰箱考古学"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "funny",
      "random"
    ],
    "weight": 8,
    "text": {
      "en": "The shared fridge contains a container labeled only 'DO NOT' — the rest of the tape has fallen off. It has been there, by your estimate, since the dawn of time.",
      "zh": "公用冰箱里有个盒子，标签只剩\"请勿\"两个字——剩下的胶带掉了。据你估计，它从盘古开天就在那儿了。"
    },
    "choices": [
      {
        "id": "investigate",
        "text": {
          "en": "Bravely investigate",
          "zh": "勇敢地一探究竟"
        },
        "resultText": {
          "en": "It's just very old rice. You toss it and become a quiet hero of the breakroom.",
          "zh": "其实只是放很久的米饭。你扔了它，成了休息室里无名的英雄。"
        },
        "effects": {
          "reputation": 2,
          "mood": 2,
          "stress": 1
        }
      },
      {
        "id": "leave_it",
        "text": {
          "en": "Respect the 'DO NOT'",
          "zh": "尊重那句\"请勿\""
        },
        "resultText": {
          "en": "You make your own lunch space elsewhere. The container lives to haunt another day.",
          "zh": "你在别处给午饭找了块地。那个盒子又活过了一天，继续作祟。"
        },
        "effects": {
          "stress": -1,
          "mood": 1
        }
      },
      {
        "id": "label_it",
        "text": {
          "en": "Add a passive-aggressive sticky note",
          "zh": "贴张阴阳怪气的便利贴"
        },
        "resultText": {
          "en": "Your note sparks a three-day comment war on the fridge. Riveting drama, zero calories.",
          "zh": "你的便利贴在冰箱上引发了三天的留言大战。精彩绝伦，零卡路里。"
        },
        "effects": {
          "mood": 3,
          "stress": -1
        }
      }
    ]
  },
  {
    "id": "fun_autocorrect_disaster",
    "title": {
      "en": "Autocorrect Has Betrayed You",
      "zh": "自动纠错背刺了你"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "funny",
      "random"
    ],
    "weight": 10,
    "text": {
      "en": "You meant to text 'running late, sorry!' to your study partner. Autocorrect sent 'running latte, sorry!' Now everyone in the group thinks coffee is on the way.",
      "zh": "你本想给学习搭子发\"快迟到了，抱歉！\"。自动纠错发成了\"快奶茶了，抱歉！\"现在全组都以为有奶茶来了。"
    },
    "choices": [
      {
        "id": "lean_in",
        "text": {
          "en": "Actually bring lattes",
          "zh": "干脆真带奶茶来"
        },
        "resultText": {
          "en": "You arrive with a drink tray and instantly become the group's favorite person.",
          "zh": "你端着饮料托盘出现，当场成了全组最受欢迎的人。"
        },
        "effects": {
          "reputation": 3,
          "mood": 4,
          "money": -6
        }
      },
      {
        "id": "explain",
        "text": {
          "en": "Explain the typo",
          "zh": "解释这个错字"
        },
        "resultText": {
          "en": "Mild disappointment all around, but it becomes a running joke for a month.",
          "zh": "大家轻微失望，但这事成了一个月的梗。"
        },
        "effects": {
          "mood": 2,
          "stress": -1
        }
      },
      {
        "id": "ignore",
        "text": {
          "en": "Say nothing and hope",
          "zh": "啥也不说，听天由命"
        },
        "resultText": {
          "en": "Three people show up expecting drinks. You learn to proofread the hard way.",
          "zh": "三个人空手赴约，满心期待。你用惨痛的方式学会了检查文字。"
        },
        "effects": {
          "stress": 3,
          "mood": -1,
          "reputation": -1
        }
      }
    ]
  },
  {
    "id": "fun_parking_saga",
    "title": {
      "en": "The Parking Saga",
      "zh": "停车史诗"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "funny",
      "random"
    ],
    "weight": 9,
    "text": {
      "en": "The lot is full. You've circled four times. A spot opens, you signal, and a tiny hatchback materializes from another dimension to take it.",
      "zh": "停车场满了。你已经绕了四圈。一个车位空出来，你打了灯，结果一辆小两厢从异次元冒出来抢走了。"
    },
    "choices": [
      {
        "id": "far_lot",
        "text": {
          "en": "Park in the far lot and walk",
          "zh": "停远场然后走过去"
        },
        "resultText": {
          "en": "A brisk walk later, you arrive early, calm, and weirdly proud of your step count.",
          "zh": "快走一段后，你早到了，心情平静，还莫名为步数感到骄傲。"
        },
        "effects": {
          "stamina": -2,
          "stress": -2,
          "mood": 2
        }
      },
      {
        "id": "pay_garage",
        "text": {
          "en": "Pay for the garage",
          "zh": "花钱进车库"
        },
        "resultText": {
          "en": "Money spent, sanity saved. The covered spot feels like luxury.",
          "zh": "花了钱，保住了理智。有顶的车位感觉像奢侈品。"
        },
        "effects": {
          "money": -4,
          "stress": -1,
          "mood": 1
        }
      },
      {
        "id": "keep_circling",
        "text": {
          "en": "Keep circling on principle",
          "zh": "本着原则继续绕"
        },
        "resultText": {
          "en": "Twenty minutes later you win a spot through sheer spite. Late, but victorious.",
          "zh": "二十分钟后你纯靠一口气抢到了车位。迟到了，但赢了。"
        },
        "effects": {
          "stress": 3,
          "mood": 1,
          "stamina": -1
        }
      }
    ]
  },
  {
    "id": "fun_found_five_dollars",
    "title": {
      "en": "Found Five Dollars",
      "zh": "捡到五块钱"
    },
    "stage": [
      "any"
    ],
    "tags": [
      "funny",
      "random"
    ],
    "weight": 8,
    "text": {
      "en": "Reaching into your white coat pocket for a pen, you find a folded five-dollar bill you have no memory of. Past-you left a gift.",
      "zh": "你伸手到白大褂口袋里摸笔，摸出一张折好的五块钱，完全不记得是怎么来的。过去的你留了份礼物。"
    },
    "choices": [
      {
        "id": "treat_yourself",
        "text": {
          "en": "Treat yourself to a snack",
          "zh": "给自己买点零食"
        },
        "resultText": {
          "en": "Free-feeling snack money tastes the best. You thank past-you sincerely.",
          "zh": "意外之财买的零食最香。你真心感谢了过去的自己。"
        },
        "effects": {
          "mood": 4,
          "stamina": 3,
          "money": -3
        }
      },
      {
        "id": "treat_partner",
        "text": {
          "en": "Save it to surprise {partner}",
          "zh": "留着给 {partner} 个惊喜"
        },
        "resultText": {
          "en": "You grab {partner} a little something. The look on their face was worth far more than five.",
          "zh": "你给 {partner} 带了点小东西。对方的表情远比五块钱值钱。"
        },
        "effects": {
          "mood": 3,
          "love": 4,
          "money": -4
        }
      },
      {
        "id": "save_it",
        "text": {
          "en": "Just keep it",
          "zh": "就先留着"
        },
        "resultText": {
          "en": "You pocket it again for future-you. The cycle of fiver continues.",
          "zh": "你又把它塞回口袋，留给未来的自己。五块钱的循环继续。"
        },
        "effects": {
          "mood": 2,
          "money": 1
        }
      }
    ]
  }
];
