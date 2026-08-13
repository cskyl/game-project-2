// Render every screen to static HTML for both languages to catch render-time
// crashes (undefined access, bad props) that the type-checker can't see.
import { renderToStaticMarkup } from "react-dom/server";
import { createElement, type ReactNode } from "react";
import { LangContext, tr, UI, withPartner } from "../src/i18n";
import { StartScreen } from "../src/components/StartScreen";
import { GameLayout } from "../src/components/GameLayout";
import { PlanningScreen } from "../src/components/PlanningScreen";
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
  }
  console.log(`  ${lang}: rendered ${Object.keys(screens).length} screens OK`);
}

console.log("RENDER SMOKE OK");
