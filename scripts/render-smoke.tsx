// Render every screen to static HTML for both languages to catch render-time
// crashes (undefined access, bad props) that the type-checker can't see.
import { renderToStaticMarkup } from "react-dom/server";
import { createElement, type ReactNode } from "react";
import { LangContext, tr, UI, withPartner } from "../src/i18n";
import { StartScreen } from "../src/components/StartScreen";
import { GameLayout } from "../src/components/GameLayout";
import { PlanningScreen } from "../src/components/PlanningScreen";
import { ResearchDashboard } from "../src/components/ResearchDashboard";
import { SemesterOpen } from "../src/components/SemesterOpen";
import { BreakChapter } from "../src/components/BreakChapter";
import { EventPanel } from "../src/components/EventPanel";
import { WeeklySummary } from "../src/components/WeeklySummary";
import { BossPanel } from "../src/components/BossPanel";
import { EndingScreen } from "../src/components/EndingScreen";
import { ConfirmDialog } from "../src/components/ConfirmDialog";
import { BOSSES } from "../src/data/bosses";
import { EVENTS } from "../src/data/events";
import { V2_UI_TEXT } from "../src/data/uiText";
import { newGame } from "../src/game/engine";
import { getEnding } from "../src/game/selectors";
import type { Lang } from "../src/game/types";

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error("RENDER FAIL: " + msg);
}

function wrap(lang: Lang, node: ReactNode) {
  const value = {
    lang,
    setLang: () => undefined,
    t: (x?: { en: string; zh: string }) => withPartner(tr(x, lang)),
    ui: UI[lang],
  };
  return createElement(LangContext.Provider, { value }, node);
}

const noop = () => undefined;

for (const lang of ["en", "zh"] as Lang[]) {
  const g = newGame("normal", "Tester");
  const ev = EVENTS[0];
  const boss = BOSSES[0];
  const summaryState = {
    ...g,
    weekWarnings: ["highStress", "lowMood"],
    log: [
      ...g.log,
      {
        id: "drift_fixture",
        semesterId: 1,
        weekInSemester: 1,
        text: {
          en: "Skill drift: a core skill was not trained this week.",
          zh: "技能回落：本周有一项核心能力没有得到练习。",
        },
        effects: { knowledge: -1 },
        kind: "drift" as const,
      },
    ],
  };
  const researchRecruitmentState = {
    ...g,
    screen: "researchDashboard" as const,
    semesterIndex: 1,
    stats: { ...g.stats, knowledge: 45 },
    research: {
      ...g.research,
      reputationInLab: 30,
      labOffers: ["reyes_biomaterials"],
    },
  };
  const researchActiveState = {
    ...g,
    screen: "researchDashboard" as const,
    semesterIndex: 4,
    research: {
      ...g.research,
      researchPoints: 20,
      labId: "reyes_biomaterials",
      reputationInLab: 52,
      labOffers: ["reyes_biomaterials"],
      activeProjectId: "project_fixture",
      projects: [
        {
          id: "project_fixture",
          templateId: "bond_aging_cycles",
          title: {
            en: "Bond Strength After Artificial Aging",
            zh: "人工老化后的粘接强度",
          },
          phase: "analysis" as const,
          progress: 63,
          quality: 74,
          weeksInPhase: 2,
          risk: 0.12,
          stallWeeksRemaining: 2,
          submissionCount: 0,
          resubmissions: 0,
        },
      ],
      publications: [
        {
          id: "publication_fixture",
          projectId: "accepted_fixture",
          title: { en: "A Careful Result", zh: "一个克制而可靠的结果" },
          venue: "regional" as const,
          firstAuthor: true,
          quality: 72,
        },
      ],
      posters: 1,
      activity: [
        {
          id: "research_activity_fixture",
          kind: "event" as const,
          eventId: "research_failed_replication",
          projectId: "project_fixture",
          title: { en: "The Effect Does Not Come Back", zh: "那个效应没有再次出现" },
          text: {
            en: "The replication is flat, and the honest result becomes narrower.",
            zh: "重复实验没有效应，诚实的结果也因此变得更克制。",
          },
          semesterId: 5,
          weekInSemester: 2,
        },
        {
          id: "research_review_fixture",
          kind: "review" as const,
          projectId: "project_fixture",
          title: { en: "Major revision", zh: "大修" },
          text: {
            en: "The letter is long because someone read closely.",
            zh: "信很长，是因为有人真的认真读了。",
          },
          semesterId: 5,
          weekInSemester: 3,
          roll: {
            kind: "review" as const,
            base: 58,
            random: 7,
            modifiers: 4,
            total: 69,
            outcome: "major_revision",
          },
        },
        {
          id: "research_poster_fixture",
          kind: "poster" as const,
          projectId: "project_fixture",
          title: { en: "Poster presentation", zh: "研究海报展示" },
          text: {
            en: "The project earns a visible poster presentation.",
            zh: "这个项目获得了一次公开的研究海报展示。",
          },
          semesterId: 5,
          weekInSemester: 4,
          effects: { posters: 1 },
        },
        {
          id: "research_risk_fixture",
          kind: "risk" as const,
          projectId: "project_fixture",
          title: { en: "Risk check: steady", zh: "风险检定：平稳" },
          text: {
            en: "The project stays on course this week.",
            zh: "项目本周按计划推进。",
          },
          semesterId: 5,
          weekInSemester: 5,
          roll: {
            kind: "risk" as const,
            base: 12,
            random: 47,
            modifiers: 0,
            total: 47,
            outcome: "steady",
          },
        },
      ],
    },
  };
  assert(
    researchActiveState.research.researchPoints > 0,
    `${lang}/researchActive fixture omitted queued effort`,
  );

  const screens: Record<string, ReactNode> = {
    start: createElement(StartScreen, {
      hasSave: true,
      onStart: noop,
      onContinue: noop,
      onClearSave: noop,
    }),
    planning: createElement(
      GameLayout,
      { state: g, saved: false, onSave: noop, onRestart: noop },
      createElement(PlanningScreen, {
        state: g,
        onAction: noop,
        onPlayCard: noop,
        onFinishWeek: noop,
      }),
    ),
    researchRecruitment: createElement(ResearchDashboard, {
      state: researchRecruitmentState,
      onShowInterest: noop,
      onJoinLab: noop,
      onStartProject: noop,
      onSelectProject: noop,
      onLabWork: noop,
      onResubmitProject: noop,
      onAbandonProject: noop,
      onReturn: noop,
    }),
    researchActive: createElement(ResearchDashboard, {
      state: researchActiveState,
      onShowInterest: noop,
      onJoinLab: noop,
      onStartProject: noop,
      onSelectProject: noop,
      onLabWork: noop,
      onResubmitProject: noop,
      onAbandonProject: noop,
      onReturn: noop,
    }),
    semesterOpen: createElement(SemesterOpen, {
      state: g,
      onChoose: noop,
      onBegin: noop,
    }),
    breakSelect: createElement(BreakChapter, {
      state: {
        ...g,
        screen: "breakChapter",
        semesterIndex: 1,
        pendingBreakId: undefined,
        breakTurn: 0,
      },
      onChooseTrack: noop,
      onTakeAction: noop,
    }),
    breakAction: createElement(BreakChapter, {
      state: {
        ...g,
        screen: "breakChapter",
        semesterIndex: 1,
        pendingBreakId: "rest_and_reset",
        breakTurn: 1,
      },
      onChooseTrack: noop,
      onTakeAction: noop,
    }),
    event: createElement(EventPanel, {
      event: ev,
      state: g,
      onChoose: noop,
      onContinue: noop,
    }),
    eventResolved: createElement(EventPanel, {
      event: ev,
      state: g,
      resolvedChoiceId: ev.choices[0].id,
      onChoose: noop,
      onContinue: noop,
    }),
    summary: createElement(WeeklySummary, {
      state: summaryState,
      onContinue: noop,
    }),
    bossPre: createElement(BossPanel, {
      boss,
      state: g,
      isFinal: false,
      onBegin: noop,
      onContinue: noop,
    }),
    bossResult: createElement(BossPanel, {
      boss,
      state: g,
      result: { bossId: boss.id, semesterId: 1, score: 82, outcome: "great" },
      isFinal: true,
      onBegin: noop,
      onContinue: noop,
    }),
    ending: createElement(EndingScreen, {
      ending: getEnding({ ...g, endingId: "graduation_default" }),
      state: { ...g, unlockedAchievements: ["patient_trust", "balanced_life"] },
      onRestart: noop,
    }),
    dialog: createElement(ConfirmDialog, {
      open: true,
      title: "T",
      body: "B",
      danger: true,
      onConfirm: noop,
      onCancel: noop,
    }),
  };

  for (const [name, node] of Object.entries(screens)) {
    const html = renderToStaticMarkup(wrap(lang, node));
    assert(html && html.length > 30, `${lang}/${name} produced empty output`);
    if (name === "summary") {
      assert(
        html.includes(V2_UI_TEXT.skillDriftHeading[lang]),
        `${lang}/summary omitted the explicit skill-drift section`,
      );
    }
    if (name === "planning") {
      assert(
        html.includes("statbar-threshold") &&
          html.includes(">20<") &&
          html.includes(">70<"),
        `${lang}/planning omitted the engine threshold ticks`,
      );
    }
    if (name === "semesterOpen") {
      assert(
        html.includes(V2_UI_TEXT.electiveDraft[lang]) &&
          html.includes(V2_UI_TEXT.standardTermTitle[lang]),
        `${lang}/semesterOpen omitted the elective draft or honest modifier fallback`,
      );
    }
    if (name === "breakSelect" || name === "breakAction") {
      assert(
        html.includes(V2_UI_TEXT.breakKicker[lang]),
        `${lang}/${name} omitted localized break chrome`,
      );
    }
    if (name === "researchRecruitment") {
      assert(
        html.includes(V2_UI_TEXT.labRecruitment[lang]) &&
          html.includes(V2_UI_TEXT.requirements[lang]) &&
          html.includes(V2_UI_TEXT.joinLab[lang]),
        `${lang}/researchRecruitment omitted requirements or recruitment controls`,
      );
    }
    if (name === "researchActive") {
      for (const [label, expected] of [
        ["project quality", V2_UI_TEXT.projectQuality[lang]],
        ["setback attribution", V2_UI_TEXT.researchSetback[lang]],
        ["review attribution", V2_UI_TEXT.researchReviewOutcome[lang]],
        ["roll breakdown", V2_UI_TEXT.rollBreakdown[lang]],
        ["risk threshold", V2_UI_TEXT.rollTriggerThreshold[lang]],
        ["author role", V2_UI_TEXT.firstAuthor[lang]],
        ["poster attribution", V2_UI_TEXT.posterPresentation[lang]],
        ["effect attribution", V2_UI_TEXT.changesThisResearchActivity[lang]],
        ["queued-effort lock", V2_UI_TEXT.queuedResearchEffort[lang].slice(0, 18)],
        ["stall lock", V2_UI_TEXT.projectStalled[lang].split("{")[0]],
      ] as const) {
        assert(
          html.includes(expected),
          `${lang}/researchActive omitted ${label}`,
        );
      }
    }
  }
  console.log(`  ${lang}: rendered ${Object.keys(screens).length} screens OK`);
}

console.log("RENDER SMOKE OK");
