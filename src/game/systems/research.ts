import {
  RESEARCH_EVENTS_BY_ID,
  RESEARCH_LABS_BY_ID,
  RESEARCH_LABS,
  RESEARCH_PROJECTS_BY_ID,
  RESEARCH_PROJECT_TEMPLATES,
  type ProjectTemplate,
  type ResearchEventTemplate,
} from "../../data/research";
import { BREAK_TRACKS_BY_ID } from "../../data/breaks";
import { evaluateCondition, getStat } from "../balance";
import { BREAK_ACTIONS_PER_CHAPTER } from "../constants";
import { collectHooks, sumHookAdds } from "../modifiers";
import { nextRandom, randomInt, weightedPickState } from "../rng";
import type {
  GameState,
  LocalizedText,
  ProjectPhase,
  ResearchActivity,
  ResearchProject,
  ResearchReviewOutcome,
  ResearchRollBreakdown,
  ResearchVenue,
} from "../types";
import { applyEffects, transitionState } from "./state";

const TERMINAL_PHASES = new Set<ProjectPhase>([
  "accepted",
  "rejected",
  "abandoned",
]);
const WORK_PHASES = new Set<ProjectPhase>([
  "idea",
  "pilot",
  "irb",
  "collection",
  "analysis",
  "writing",
  "revision",
]);
const NEXT_PHASE: Partial<Record<ProjectPhase, ProjectPhase>> = {
  idea: "pilot",
  pilot: "irb",
  irb: "collection",
  collection: "analysis",
  analysis: "writing",
  writing: "submitted",
  revision: "submitted",
};
const MAX_ACTIVITY = 120;
const MAX_POSTERS = 2;

const RESEARCH_INTEREST_TITLE: LocalizedText = {
  en: "Research interest",
  zh: "科研兴趣",
};
const LAB_OFFER_TITLE: LocalizedText = {
  en: "A lab door opens",
  zh: "实验室的门打开了",
};
const LAB_OFFER_TEXT: LocalizedText = {
  en: "Your questions have become specific enough that Dr. Reyes offers a real lab conversation. The dashboard shows every lab whose requirements you meet.",
  zh: "你的问题已经具体到值得认真聊一聊了。Reyes 博士向你发出实验室邀请；仪表盘会列出所有符合条件的方向。",
};
const LAB_WORK_TITLE: LocalizedText = {
  en: "Lab work queued",
  zh: "科研工作已排入本周",
};
const LAB_WORK_TEXT: LocalizedText = {
  en: "The effort is banked for this week's research tick and will move the selected project after skill drift.",
  zh: "这份投入会留到本周科研结算，并在技能回落之后推进当前选中的项目。",
};
const SUMMER_RESEARCH_TITLE: LocalizedText = {
  en: "Full-time summer lab block",
  zh: "暑期全职科研时段",
};
const SUMMER_RESEARCH_TEXT: LocalizedText = {
  en: "The full-time block deepens lab trust. When a working project is selected, it also becomes concentrated progress through the same phase and quality clock as school-week work.",
  zh: "这段全职投入会加深实验室信任；若已选中可推进的项目，也会通过与学期内相同的阶段和质量时钟转化为集中进度。",
};
const PHASE_TITLE: LocalizedText = {
  en: "Project phase advanced",
  zh: "项目阶段推进",
};
const PHASE_TEXT: LocalizedText = {
  en: "A careful handoff moves the project forward. Its quality changes with the project's real drivers and the active modifier registry.",
  zh: "一次认真交接让项目进入下一阶段。项目质量会根据真正的驱动能力和当前生效的修正项变化。",
};
const STEADY_TITLE: LocalizedText = {
  en: "The project clock stays steady",
  zh: "项目本周平稳推进",
};
const STEADY_TEXT: LocalizedText = {
  en: "No setback fired this week. The risk roll is recorded here so the randomness is never hidden.",
  zh: "本周没有触发波折。风险掷骰记录在这里，随机性不会被藏起来。",
};
const JOINED_TEXT: LocalizedText = {
  en: "You choose a research home. The commitment now adds its visible intensity cost every school week.",
  zh: "你选定了科研归属。从现在起，每个上课周都会明确承担这个实验室的强度成本。",
};
const STARTED_TEXT: LocalizedText = {
  en: "The question has an owner, a notebook, and a first honest next step.",
  zh: "这个问题现在有了负责人、记录本，以及诚实的第一步。",
};
const RESUBMIT_TITLE: LocalizedText = {
  en: "Resubmitted one rung lower",
  zh: "降一级重新投稿",
};
const RESUBMIT_TEXT: LocalizedText = {
  en: "Rejection was a route change, not a dead end. The project takes a visible quality penalty and returns to review.",
  zh: "拒稿只是路线变化，不是死路。项目承担明确的质量损失，然后重新进入评审。",
};
const ABANDON_TITLE: LocalizedText = {
  en: "Project set down with care",
  zh: "认真放下这个项目",
};
const ABANDON_TEXT: LocalizedText = {
  en: "Not every good question belongs in this season. The record stays; the project stops consuming your attention.",
  zh: "不是每个好问题都适合现在完成。记录会留下，项目也不再继续占用你的注意力。",
};
const ACCEPT_TITLE: LocalizedText = {
  en: "Accepted",
  zh: "接收",
};
const ACCEPT_TEXT: LocalizedText = {
  en: "The manuscript finds a home. The payoff is applied now, and a first-author publication unlocks Dr. Reyes's letter.",
  zh: "稿件找到了归宿。成果回报现在结算；第一作者论文也会解锁 Reyes 博士的推荐信。",
};
const POSTER_TITLE: LocalizedText = {
  en: "Poster presentation",
  zh: "海报展示",
};
const POSTER_PRESENTATION_TEXT: LocalizedText = {
  en: "The first submission also becomes a poster: one figure, one bounded claim, and a room full of useful questions before the manuscript decision.",
  zh: "第一次投稿也带来一次海报展示：一张图、一个边界清楚的结论，以及在稿件决定之前满屋子有用的问题。",
};
const POSTER_TEXT: LocalizedText = {
  en: "The work earns a poster slot: a real output and a useful conversation, though not a publication.",
  zh: "这项工作获得了海报展示机会：是真实成果，也带来有价值的交流，但不计作论文发表。",
};
const POSTER_CAP_TITLE: LocalizedText = {
  en: "Internal lab presentation",
  zh: "内部组会汇报",
};
const POSTER_CAP_TEXT: LocalizedText = {
  en: "Both symposium poster slots are already used, so this project closes with an internal lab presentation—not another poster, publication, or letter.",
  zh: "两次学术会议海报名额已经用完，因此这个项目以内部组会汇报收尾；不会新增海报、论文或推荐信。",
};
const REVIEW_TITLES: Record<ResearchReviewOutcome, LocalizedText> = {
  accepted: { en: "Reviewer decision: accept", zh: "评审决定：接收" },
  minor_revision: { en: "Reviewer decision: minor revision", zh: "评审决定：小修" },
  major_revision: { en: "Reviewer decision: major revision", zh: "评审决定：大修" },
  rejected: { en: "Reviewer decision: reject", zh: "评审决定：拒稿" },
};
const REVIEW_TEXT: Record<ResearchReviewOutcome, LocalizedText> = {
  accepted: { en: "The reviewers accept the bounded claim the evidence can support.", zh: "评审接受了证据真正能够支持的、边界清楚的结论。" },
  minor_revision: { en: "The core holds. A focused revision can make the evidence easier to trust.", zh: "核心结论站得住。一次聚焦的小修会让证据更容易被信任。" },
  major_revision: { en: "The paper needs substantial rework, but the question is still worth answering.", zh: "论文需要大幅修改，但这个问题仍然值得回答。" },
  rejected: { en: "This venue says no. The project stays resubmittable at a lower rung.", zh: "这个期刊说了不。项目仍可降一级重新投稿。" },
};

function clamp(value: number, low = 0, high = 100): number {
  return Math.max(low, Math.min(high, Math.round(value)));
}

function replaceProject(state: GameState, project: ResearchProject): GameState {
  return transitionState(state, {
    research: {
      ...state.research,
      projects: state.research.projects.map((entry) =>
        entry.id === project.id ? project : entry,
      ),
    },
  });
}

function appendActivity(
  state: GameState,
  activity: Omit<ResearchActivity, "id" | "semesterId" | "weekInSemester">,
): GameState {
  const id = `research_${state.rngSeed.toString(36)}_${(
    state.transitionCounter + 1
  ).toString(36)}`;
  const entry: ResearchActivity = {
    ...activity,
    id,
    semesterId: state.semesterIndex + 1,
    weekInSemester: state.weekInSemester,
  };
  return transitionState(state, {
    research: {
      ...state.research,
      activity: [...state.research.activity, entry].slice(-MAX_ACTIVITY),
    },
  });
}

function currentProject(state: GameState): ResearchProject | undefined {
  return state.research.projects.find(
    (project) => project.id === state.research.activeProjectId,
  );
}

function availableLabs(state: GameState, reputationInLab: number): string[] {
  if (state.semesterIndex + 1 < 2 || reputationInLab < 30 || state.stats.knowledge < 45) {
    return [];
  }
  return RESEARCH_LABS.filter((lab) =>
    evaluateCondition(state.stats, state.flags, state.semesterIndex + 1, lab.requirements),
  ).map((lab) => lab.id);
}

/** Additional stateful action gate used by the generic action menu. */
export function isResearchActionAvailable(
  state: GameState,
  actionId: string,
): boolean {
  if (actionId === "research_interest") {
    return state.semesterIndex + 1 >= 2 && !state.research.labId;
  }
  if (actionId !== "lab_work") return true;
  const project = currentProject(state);
  return Boolean(
    state.research.labId &&
      project &&
      WORK_PHASES.has(project.phase) &&
      project.stallWeeksRemaining <= 0 &&
      state.research.researchPoints < 100,
  );
}

function phaseEffort(state: GameState, project: ResearchProject): number {
  const template = RESEARCH_PROJECTS_BY_ID[project.templateId];
  if (!template) return 0;
  const expectedWeeks = Math.max(1, template.phaseWeeks[project.phase]);
  const capability =
    0.55 +
    state.stats.research / 200 +
    state.stats.focus / 400 +
    state.research.reputationInLab / 400;
  return clamp((100 / expectedWeeks) * capability, 8, 55);
}

/** Apply the research-state half of the two authored weekly actions. */
export function applyResearchActionState(
  state: GameState,
  actionId: string,
): GameState {
  if (actionId === "research_interest") {
    if (!isResearchActionAvailable(state, actionId)) return state;
    const reputationInLab = clamp(state.research.reputationInLab + 8);
    const offers = availableLabs(state, reputationInLab);
    const newOffer = offers.some((id) => !state.research.labOffers.includes(id));
    let next = transitionState(state, {
      research: {
        ...state.research,
        reputationInLab,
        labOffers: offers,
      },
    });
    next = appendActivity(next, {
      kind: "phase",
      title: RESEARCH_INTEREST_TITLE,
      text: {
        en: "You ask a narrower question and listen closely to the answer.",
        zh: "你提出了一个更具体的问题，也认真听完了回答。",
      },
      effects: { reputationInLab: 8 },
    });
    if (newOffer) {
      next = appendActivity(next, {
        kind: "offer",
        title: LAB_OFFER_TITLE,
        text: LAB_OFFER_TEXT,
      });
    }
    return next;
  }
  if (actionId !== "lab_work" || !isResearchActionAvailable(state, actionId)) {
    return state;
  }
  const project = currentProject(state);
  if (!project) return state;
  const effort = Math.min(
    phaseEffort(state, project),
    100 - state.research.researchPoints,
  );
  let next = transitionState(state, {
    research: {
      ...state.research,
      researchPoints: clamp(state.research.researchPoints + effort),
    },
  });
  next = appendActivity(next, {
    kind: "phase",
    projectId: project.id,
    title: LAB_WORK_TITLE,
    text: LAB_WORK_TEXT,
    effects: { researchPoints: effort },
  });
  return next;
}

export function openResearchDashboardState(state: GameState): GameState {
  if (state.screen !== "planning") return state;
  return transitionState(state, { screen: "researchDashboard" });
}

export function closeResearchDashboardState(state: GameState): GameState {
  if (state.screen !== "researchDashboard") return state;
  return transitionState(state, { screen: "planning" });
}

export function joinResearchLabState(state: GameState, labId: string): GameState {
  if (
    state.screen !== "researchDashboard" ||
    state.research.labId ||
    !state.research.labOffers.includes(labId)
  ) {
    return state;
  }
  const lab = RESEARCH_LABS_BY_ID[labId];
  if (!lab) return state;
  const flags = Array.from(new Set([...state.flags, ...lab.perks]));
  let next = transitionState(state, {
    flags,
    research: {
      ...state.research,
      labId,
      labOffers: [],
    },
  });
  return appendActivity(next, {
    kind: "lab_joined",
    title: lab.name,
    text: JOINED_TEXT,
  });
}

function driverScore(state: GameState, template: ProjectTemplate): number {
  const totalWeight = template.qualityDrivers.reduce(
    (sum, driver) => sum + driver.weight,
    0,
  );
  if (totalWeight <= 0) return 0;
  return template.qualityDrivers.reduce(
    (sum, driver) => sum + getStat(state.stats, driver.stat) * driver.weight,
    0,
  ) / totalWeight;
}

export function startResearchProjectState(
  state: GameState,
  templateId: string,
): GameState {
  if (
    state.screen !== "researchDashboard" ||
    !state.research.labId ||
    state.research.researchPoints > 0
  ) {
    return state;
  }
  const template = RESEARCH_PROJECTS_BY_ID[templateId];
  const lab = RESEARCH_LABS_BY_ID[state.research.labId];
  if (
    !template ||
    !lab ||
    template.labId !== lab.id ||
    state.research.projects.some((project) => project.templateId === template.id)
  ) {
    return state;
  }
  const projectId = `project_${template.id}_${(
    state.transitionCounter + 1
  ).toString(36)}`;
  const initialQuality = clamp(driverScore(state, template) * 0.7 + lab.prestige * 0.25);
  const project: ResearchProject = {
    id: projectId,
    templateId: template.id,
    title: template.title,
    phase: "idea",
    progress: 0,
    quality: initialQuality,
    weeksInPhase: 0,
    risk: template.baseRisk,
    stallWeeksRemaining: 0,
    submissionCount: 0,
    resubmissions: 0,
    posterPresented: false,
  };
  let next = transitionState(state, {
    research: {
      ...state.research,
      projects: [...state.research.projects, project],
      activeProjectId: project.id,
    },
  });
  next = appendActivity(next, {
    kind: "project_started",
    projectId: project.id,
    title: template.title,
    text: STARTED_TEXT,
    effects: { quality: initialQuality },
  });
  return next;
}

export function selectActiveResearchProjectState(
  state: GameState,
  projectId: string,
): GameState {
  if (state.screen !== "researchDashboard" || state.research.researchPoints > 0) {
    return state;
  }
  const project = state.research.projects.find((entry) => entry.id === projectId);
  if (!project || !WORK_PHASES.has(project.phase)) return state;
  return transitionState(state, {
    research: { ...state.research, activeProjectId: project.id },
  });
}

function venueForQuality(quality: number): ResearchVenue {
  if (quality >= 78) return "top";
  if (quality >= 60) return "specialty";
  if (quality >= 42) return "regional";
  return "poster";
}

function lowerVenue(venue: ResearchVenue | undefined): ResearchVenue {
  if (venue === "top") return "specialty";
  if (venue === "specialty") return "regional";
  return "poster";
}

function withReviewClock(
  state: GameState,
  project: ResearchProject,
  venue: ResearchVenue,
): [ResearchProject, GameState] {
  const [weeks, randomState] = randomInt(state, 2, 4);
  return [
    {
      ...project,
      phase: "submitted",
      progress: 0,
      weeksInPhase: 0,
      venue,
      reviewRoundsLeft: weeks,
      submissionCount: project.submissionCount + 1,
      lastReviewOutcome: undefined,
    },
    randomState,
  ];
}

function qualityDelta(
  state: GameState,
  project: ResearchProject,
  template: ProjectTemplate,
): [number, ResearchRollBreakdown, GameState] {
  const base = Math.round((driverScore(state, template) - 45) / 10) + 2;
  const [random, randomState] = randomInt(state, -3, 5);
  const modifiers = sumHookAdds(collectHooks(state), "projectQuality");
  const total = base + random + modifiers;
  return [
    total,
    { kind: "quality", base, random, modifiers, total, outcome: project.phase },
    randomState,
  ];
}

function advancePhase(
  state: GameState,
  project: ResearchProject,
): GameState {
  const template = RESEARCH_PROJECTS_BY_ID[project.templateId];
  const nextPhase = NEXT_PHASE[project.phase];
  if (!template || !nextPhase) return state;
  const [delta, roll, randomState] = qualityDelta(state, project, template);
  const isFirstSubmission = nextPhase === "submitted" && project.submissionCount === 0;
  let advanced: ResearchProject = {
    ...project,
    phase: nextPhase,
    progress: Math.max(0, project.progress - 100),
    quality: clamp(project.quality + delta),
    weeksInPhase: 0,
  };
  let next = randomState;
  if (nextPhase === "submitted") {
    [advanced, next] = withReviewClock(
      next,
      advanced,
      advanced.venue ?? venueForQuality(advanced.quality),
    );
  }
  next = replaceProject(next, advanced);
  next = appendActivity(next, {
    kind: "phase",
    projectId: project.id,
    title: PHASE_TITLE,
    text: PHASE_TEXT,
    effects: { quality: delta },
    roll: { ...roll, outcome: nextPhase },
  });
  if (
    isFirstSubmission &&
    advanced.venue !== "poster" &&
    !advanced.posterPresented &&
    next.research.posters < MAX_POSTERS
  ) {
    advanced = { ...advanced, posterPresented: true };
    next = replaceProject(next, advanced);
    next = transitionState(next, {
      research: {
        ...next.research,
        posters: Math.min(MAX_POSTERS, next.research.posters + 1),
      },
    });
    next = appendActivity(next, {
      kind: "poster",
      projectId: project.id,
      title: POSTER_TITLE,
      text: POSTER_PRESENTATION_TEXT,
      effects: { posters: 1 },
    });
  }
  return next;
}

function applyAuthoredEvent(
  state: GameState,
  project: ResearchProject,
  event: ResearchEventTemplate,
  roll: ResearchRollBreakdown,
): GameState {
  const effect = event.effects;
  const changed: ResearchProject = {
    ...project,
    progress: clamp(
      effect.repeatPhase ? 0 : project.progress + (effect.progress ?? 0),
    ),
    weeksInPhase: effect.repeatPhase ? 0 : project.weeksInPhase,
    quality: clamp(project.quality + (effect.quality ?? 0)),
    stallWeeksRemaining: Math.max(
      project.stallWeeksRemaining,
      Math.max(0, effect.stallWeeks ?? 0),
    ),
  };
  let next = replaceProject(state, changed);
  const researchPoints = clamp(
    next.research.researchPoints + (effect.researchPoints ?? 0),
  );
  const reputationInLab = clamp(
    next.research.reputationInLab + (effect.reputationInLab ?? 0),
  );
  next = transitionState(next, {
    research: { ...next.research, researchPoints, reputationInLab },
  });
  if (effect.stats && Object.keys(effect.stats).length > 0) {
    next = applyEffects(next, effect.stats, {
      scale: true,
      log: true,
      kind: "system",
      text: event.title,
    });
  }
  next = appendActivity(next, {
    kind: "event",
    eventId: event.id,
    projectId: project.id,
    title: event.title,
    text: event.text,
    effects: {
      ...(effect.stats ?? {}),
      progress: effect.progress,
      quality: effect.quality,
      researchPoints: effect.researchPoints,
      reputationInLab: effect.reputationInLab,
      stallWeeks: effect.stallWeeks,
    },
    roll,
  });
  const eventProject = next.research.projects.find(
    (entry) => entry.id === project.id,
  );
  return eventProject && WORK_PHASES.has(eventProject.phase) && eventProject.progress >= 100
    ? advancePhase(next, eventProject)
    : next;
}

function tickProjectRisk(state: GameState, projectId: string): GameState {
  const project = state.research.projects.find((entry) => entry.id === projectId);
  if (
    !project ||
    state.research.activeProjectId !== project.id ||
    TERMINAL_PHASES.has(project.phase) ||
    project.stallWeeksRemaining > 0
  ) {
    return state;
  }
  const template = RESEARCH_PROJECTS_BY_ID[project.templateId];
  if (!template) return state;
  const candidates = template.setbackEvents
    .map((id) => RESEARCH_EVENTS_BY_ID[id])
    .filter(
      (event): event is ResearchEventTemplate =>
        Boolean(event && event.phases.includes(project.phase)),
    );
  if (candidates.length === 0) return state;
  const [raw, randomState] = nextRandom(state);
  const triggered = raw < project.risk;
  const roll: ResearchRollBreakdown = {
    kind: "risk",
    base: Math.round(project.risk * 100),
    random: Math.round(raw * 100),
    modifiers: 0,
    total: Math.round(raw * 100),
    outcome: triggered ? "triggered" : "steady",
  };
  if (!triggered) {
    return appendActivity(randomState, {
      kind: "risk",
      projectId: project.id,
      title: STEADY_TITLE,
      text: STEADY_TEXT,
      roll,
    });
  }
  const [event, pickedState] = weightedPickState(
    randomState,
    candidates,
    (candidate) => (candidate.kind === "lucky" ? 0.45 : 1),
  );
  return event ? applyAuthoredEvent(pickedState, project, event, roll) : pickedState;
}

function reviewOutcome(total: number): ResearchReviewOutcome {
  if (total >= 5) return "accepted";
  if (total >= -3) return "minor_revision";
  if (total >= -12) return "major_revision";
  return "rejected";
}

function acceptProject(
  state: GameState,
  project: ResearchProject,
  roll: ResearchRollBreakdown,
): GameState {
  const template = RESEARCH_PROJECTS_BY_ID[project.templateId];
  if (!template || !project.venue) return state;
  const accepted: ResearchProject = {
    ...project,
    phase: "accepted",
    reviewRoundsLeft: undefined,
    posterPresented: true,
    lastReviewOutcome: "accepted",
  };
  let next = replaceProject(state, accepted);
  const isPoster = project.venue === "poster";
  const publications = isPoster
    ? next.research.publications
    : [
        ...next.research.publications,
        {
          id: `publication_${project.id}_${project.submissionCount}`,
          projectId: project.id,
          title: project.title,
          venue: project.venue,
          firstAuthor: true,
          quality: project.quality,
        },
      ];
  // A poster-only venue pays its presentation output on acceptance. Other
  // venues already earned one visible poster at their first submission.
  const posterGain = isPoster &&
    !project.posterPresented &&
    next.research.posters < MAX_POSTERS
    ? 1
    : 0;
  const posters = Math.min(MAX_POSTERS, next.research.posters + posterGain);
  const flags = isPoster
    ? next.flags
    : Array.from(new Set([...next.flags, "reyes_letter"]));
  next = transitionState(next, {
    flags,
    research: {
      ...next.research,
      publications,
      posters,
      reputationInLab: clamp(next.research.reputationInLab + 6),
      activeProjectId:
        next.research.activeProjectId === project.id
          ? undefined
          : next.research.activeProjectId,
    },
  });
  next = applyEffects(next, template.payoff, {
    scale: true,
    log: true,
    kind: "system",
    text: isPoster ? project.title : ACCEPT_TITLE,
  });
  return appendActivity(next, {
    kind: "accepted",
    projectId: project.id,
    title: isPoster
      ? posterGain > 0
        ? project.title
        : POSTER_CAP_TITLE
      : ACCEPT_TITLE,
    text: isPoster
      ? posterGain > 0
        ? POSTER_TEXT
        : POSTER_CAP_TEXT
      : ACCEPT_TEXT,
    effects: posterGain > 0 ? { posters: posterGain } : undefined,
    roll,
  });
}

function resolveReview(state: GameState, projectId: string): GameState {
  const project = state.research.projects.find((entry) => entry.id === projectId);
  if (!project || project.phase !== "submitted" || !project.venue) return state;
  const lab = state.research.labId
    ? RESEARCH_LABS_BY_ID[state.research.labId]
    : undefined;
  const threshold: Record<ResearchVenue, number> = {
    poster: 25,
    regional: 43,
    specialty: 60,
    top: 76,
  };
  const base = Math.round(
    project.quality - threshold[project.venue] + ((lab?.prestige ?? 70) - 70) * 0.08,
  );
  const [random, randomState] = randomInt(state, -18, 18);
  const modifiers = sumHookAdds(collectHooks(state), "projectQuality");
  const total = base + random + modifiers;
  const outcome = reviewOutcome(total);
  const roll: ResearchRollBreakdown = {
    kind: "review",
    base,
    random,
    modifiers,
    total,
    outcome,
  };
  let next = randomState;
  if (outcome === "accepted") return acceptProject(next, project, roll);

  const changed: ResearchProject = outcome === "rejected"
    ? {
        ...project,
        phase: "rejected",
        reviewRoundsLeft: undefined,
        lastReviewOutcome: outcome,
      }
    : {
        ...project,
        phase: "revision",
        progress: outcome === "minor_revision" ? 50 : 0,
        weeksInPhase: 0,
        reviewRoundsLeft: undefined,
        lastReviewOutcome: outcome,
      };
  next = replaceProject(next, changed);
  if (outcome === "rejected" && next.research.activeProjectId === project.id) {
    next = transitionState(next, {
      research: { ...next.research, activeProjectId: undefined },
    });
  }
  return appendActivity(next, {
    kind: "review",
    projectId: project.id,
    title: REVIEW_TITLES[outcome],
    text: REVIEW_TEXT[outcome],
    roll,
  });
}

function tickSubmittedProjects(state: GameState): GameState {
  let next = state;
  const ids = state.research.projects
    .filter((project) => project.phase === "submitted")
    .map((project) => project.id);
  for (const id of ids) {
    const project = next.research.projects.find((entry) => entry.id === id);
    if (!project || project.phase !== "submitted") continue;
    const rounds = project.reviewRoundsLeft ?? 0;
    if (rounds <= 1) {
      next = resolveReview(next, id);
    } else {
      next = replaceProject(next, {
        ...project,
        reviewRoundsLeft: rounds - 1,
        weeksInPhase: project.weeksInPhase + 1,
      });
    }
  }
  return next;
}

function tickStallsAndWeeks(state: GameState): GameState {
  const projects = state.research.projects.map((project) => {
    if (TERMINAL_PHASES.has(project.phase)) return project;
    return {
      ...project,
      weeksInPhase: project.phase === "submitted"
        ? project.weeksInPhase
        : project.weeksInPhase + 1,
      stallWeeksRemaining: Math.max(0, project.stallWeeksRemaining - 1),
    };
  });
  return transitionState(state, {
    research: { ...state.research, projects },
  });
}

function spendQueuedEffort(state: GameState): GameState {
  const project = currentProject(state);
  if (
    !project ||
    !WORK_PHASES.has(project.phase) ||
    project.stallWeeksRemaining > 0 ||
    state.research.researchPoints <= 0
  ) {
    return state;
  }
  const spent = state.research.researchPoints;
  const progressed: ResearchProject = {
    ...project,
    progress: clamp(project.progress + spent),
  };
  let next = transitionState(state, {
    research: {
      ...state.research,
      researchPoints: 0,
      projects: state.research.projects.map((entry) =>
        entry.id === project.id ? progressed : entry,
      ),
    },
  });
  if (progressed.progress >= 100) next = advancePhase(next, progressed);
  return next;
}

/**
 * §3.2 step 4.3. Runs after drift and before finance/wellness/cases/events.
 * All randomness is state-threaded; every risk/review outcome is attributed.
 */
export function tickResearch(state: GameState): GameState {
  if (!state.research.labId) return state;
  const lab = RESEARCH_LABS_BY_ID[state.research.labId];
  if (!lab) return state;
  let next = applyEffects(state, { stress: lab.intensity }, {
    scale: false,
    log: true,
    kind: "system",
    text: lab.name,
  });
  // Decrement only stalls that existed at the start of this tick. A newly
  // authored two-week stall therefore blocks exactly the next two planning
  // weeks rather than being shortened immediately after it fires.
  next = tickStallsAndWeeks(next);
  // Existing submissions age before new lab work can create a submission, so
  // a freshly submitted project always receives its full seeded 2–4 weeks.
  next = tickSubmittedProjects(next);
  next = spendQueuedEffort(next);
  const riskIds = next.research.projects
    .filter(
      (project) =>
        project.id === next.research.activeProjectId &&
        !TERMINAL_PHASES.has(project.phase),
    )
    .map((project) => project.id);
  for (const id of riskIds) next = tickProjectRisk(next, id);
  return next;
}

export function resubmitResearchProjectState(
  state: GameState,
  projectId: string,
): GameState {
  if (state.screen !== "researchDashboard" || state.research.researchPoints > 0) {
    return state;
  }
  const project = state.research.projects.find((entry) => entry.id === projectId);
  if (!project || project.phase !== "rejected") return state;
  const penalized = {
    ...project,
    quality: clamp(project.quality - 8),
    resubmissions: project.resubmissions + 1,
  };
  const [submitted, randomState] = withReviewClock(
    state,
    penalized,
    lowerVenue(project.venue),
  );
  let next = replaceProject(randomState, submitted);
  return appendActivity(next, {
    kind: "resubmitted",
    projectId: project.id,
    title: RESUBMIT_TITLE,
    text: RESUBMIT_TEXT,
    effects: { quality: -8 },
  });
}

export function abandonResearchProjectState(
  state: GameState,
  projectId: string,
): GameState {
  if (state.screen !== "researchDashboard" || state.research.researchPoints > 0) {
    return state;
  }
  const project = state.research.projects.find((entry) => entry.id === projectId);
  if (!project || TERMINAL_PHASES.has(project.phase)) return state;
  let next = replaceProject(state, {
    ...project,
    phase: "abandoned",
    progress: 0,
    reviewRoundsLeft: undefined,
  });
  if (next.research.activeProjectId === project.id) {
    next = transitionState(next, {
      research: { ...next.research, activeProjectId: undefined },
    });
  }
  return appendActivity(next, {
    kind: "abandoned",
    projectId: project.id,
    title: ABANDON_TITLE,
    text: ABANDON_TEXT,
  });
}

/** Templates the dashboard may start without duplicating engine knowledge. */
export function availableResearchProjects(state: GameState): ProjectTemplate[] {
  return state.research.labId
    ? RESEARCH_PROJECT_TEMPLATES.filter(
        (template) => template.labId === state.research.labId,
      )
    : [];
}

/**
 * P2 break-system seam for §3.3. Each authored Summer Research action queues a
 * concentrated block on the already-selected project, then resolves through
 * the same phase/quality state machine. Without a joined lab and active
 * project the action retains its ordinary visible stat payoff only.
 */
export function applySummerResearchBreakState(
  state: GameState,
  actionId: string,
): GameState {
  if (
    state.screen !== "breakChapter" ||
    state.pendingBreakId !== "summer_research" ||
    state.breakTurn >= BREAK_ACTIONS_PER_CHAPTER ||
    !BREAK_TRACKS_BY_ID.summer_research.actions.some(
      (action) => action.id === actionId,
    )
  ) {
    return state;
  }
  const reputationGain = 4;
  const reputationInLab = clamp(
    state.research.reputationInLab + reputationGain,
  );
  const offers = state.research.labId
    ? state.research.labOffers
    : availableLabs(state, reputationInLab);
  const newOffer = offers.some((id) => !state.research.labOffers.includes(id));
  let next = transitionState(state, {
    research: {
      ...state.research,
      reputationInLab,
      labOffers: offers,
    },
  });
  next = appendActivity(next, {
    kind: "phase",
    title: SUMMER_RESEARCH_TITLE,
    text: SUMMER_RESEARCH_TEXT,
    effects: { reputationInLab: reputationGain },
  });
  if (newOffer) {
    next = appendActivity(next, {
      kind: "offer",
      title: LAB_OFFER_TITLE,
      text: LAB_OFFER_TEXT,
    });
  }
  const project = currentProject(next);
  if (
    !next.research.labId ||
    !project ||
    !WORK_PHASES.has(project.phase) ||
    project.stallWeeksRemaining > 0
  ) {
    return next;
  }
  const projectProgress = 38;
  const progressed: ResearchProject = {
    ...project,
    progress: clamp(project.progress + projectProgress),
  };
  next = transitionState(next, {
    research: {
      ...next.research,
      projects: next.research.projects.map((entry) =>
        entry.id === project.id ? progressed : entry,
      ),
    },
  });
  next = appendActivity(next, {
    kind: "phase",
    projectId: project.id,
    title: SUMMER_RESEARCH_TITLE,
    text: SUMMER_RESEARCH_TEXT,
    effects: { progress: projectProgress },
  });
  return progressed.progress >= 100 ? advancePhase(next, progressed) : next;
}
