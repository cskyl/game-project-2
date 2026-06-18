// Render every screen to static HTML for both languages to catch render-time
// crashes (undefined access, bad props) that the type-checker can't see.
import { renderToStaticMarkup } from "react-dom/server";
import { createElement, type ReactNode } from "react";
import { LangContext, tr, UI, withPartner } from "../src/i18n";
import { StartScreen } from "../src/components/StartScreen";
import { GameLayout } from "../src/components/GameLayout";
import { PlanningScreen } from "../src/components/PlanningScreen";
import { EventPanel } from "../src/components/EventPanel";
import { WeeklySummary } from "../src/components/WeeklySummary";
import { BossPanel } from "../src/components/BossPanel";
import { EndingScreen } from "../src/components/EndingScreen";
import { ConfirmDialog } from "../src/components/ConfirmDialog";
import { BOSSES } from "../src/data/bosses";
import { EVENTS } from "../src/data/events";
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
      state: { ...g, weekWarnings: ["highStress", "lowMood"] },
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
  }
  console.log(`  ${lang}: rendered ${Object.keys(screens).length} screens OK`);
}

console.log("RENDER SMOKE OK");
