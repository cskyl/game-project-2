import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BossPanel } from "./components/BossPanel";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { EndingScreen } from "./components/EndingScreen";
import { EventPanel } from "./components/EventPanel";
import { GameLayout } from "./components/GameLayout";
import { PlanningScreen } from "./components/PlanningScreen";
import { StartScreen } from "./components/StartScreen";
import { WeeklySummary } from "./components/WeeklySummary";
import { BOSSES } from "./data/bosses";
import {
  advanceAfterBoss,
  chooseAction,
  continueAfterEvent,
  continueAfterWeeklySummary,
  finishWeek,
  isFinalSemester,
  newGame,
  playCard,
  resolveBoss,
  resolveEventChoice,
} from "./game/engine";
import { getEnding, getPendingEvent } from "./game/selectors";
import {
  clearSave,
  hasSave,
  loadGame,
  loadLang,
  mergeAchievements,
  saveGame,
  saveLang,
} from "./game/storage";
import { LangContext, tr, UI, withPartner } from "./i18n";
import type { Difficulty, GameState, Lang, LocalizedText } from "./game/types";

export default function App() {
  const [lang, setLangState] = useState<Lang>(() => loadLang());
  const [game, setGame] = useState<GameState | null>(null);
  const [saveExists, setSaveExists] = useState<boolean>(() => hasSave());
  const [saved, setSaved] = useState(false);
  const [dialog, setDialog] = useState<null | "restart" | "clear">(null);

  const setLang = (l: Lang) => {
    setLangState(l);
    saveLang(l);
  };

  const ctx = useMemo(
    () => ({
      lang,
      setLang,
      t: (x?: LocalizedText) => withPartner(tr(x, lang)),
      ui: UI[lang],
    }),
    [lang],
  );

  // Persist the game and the global achievement collection whenever state moves.
  useEffect(() => {
    if (game) {
      saveGame(game);
      setSaveExists(true);
      if (game.unlockedAchievements.length) mergeAchievements(game.unlockedAchievements);
    }
  }, [game]);

  const apply = (fn: (s: GameState) => GameState) =>
    setGame((g) => (g ? fn(g) : g));

  const handleStart = (difficulty: Difficulty, name: string) =>
    setGame(newGame(difficulty, name));

  const handleContinue = () => {
    const loaded = loadGame();
    if (loaded) setGame(loaded);
  };

  const handleSaveClick = () => {
    if (!game) return;
    saveGame(game);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const confirmRestart = () => {
    clearSave();
    setSaveExists(false);
    setGame(null);
    setDialog(null);
  };

  const confirmClear = () => {
    clearSave();
    setSaveExists(false);
    setDialog(null);
  };

  const restartFromEnding = () => {
    clearSave();
    setSaveExists(false);
    setGame(null);
  };

  let body: ReactNode;

  if (!game) {
    body = (
      <StartScreen
        hasSave={saveExists}
        onStart={handleStart}
        onContinue={handleContinue}
        onClearSave={() => setDialog("clear")}
      />
    );
  } else if (game.screen === "ending") {
    body = (
      <EndingScreen ending={getEnding(game)} state={game} onRestart={restartFromEnding} />
    );
  } else {
    const pendingEvent = getPendingEvent(game);
    const pendingBoss = game.pendingBossId
      ? BOSSES.find((b) => b.id === game.pendingBossId)
      : undefined;

    body = (
      <GameLayout
        state={game}
        saved={saved}
        onSave={handleSaveClick}
        onRestart={() => setDialog("restart")}
      >
        {game.screen === "planning" && (
          <PlanningScreen
            state={game}
            onAction={(id) => apply((s) => chooseAction(s, id))}
            onPlayCard={(id) => apply((s) => playCard(s, id))}
            onFinishWeek={() => apply(finishWeek)}
          />
        )}

        {game.screen === "event" &&
          (pendingEvent ? (
            <EventPanel
              event={pendingEvent}
              state={game}
              resolvedChoiceId={game.pendingChoiceId}
              onChoose={(id) => apply((s) => resolveEventChoice(s, id))}
              onContinue={() => apply(continueAfterEvent)}
            />
          ) : (
            <WeeklySummary state={game} onContinue={() => apply(continueAfterWeeklySummary)} />
          ))}

        {game.screen === "weeklySummary" && (
          <WeeklySummary state={game} onContinue={() => apply(continueAfterWeeklySummary)} />
        )}

        {game.screen === "boss" &&
          (pendingBoss ? (
            <BossPanel
              boss={pendingBoss}
              state={game}
              result={game.lastBossResult}
              isFinal={isFinalSemester(game)}
              onBegin={() => apply(resolveBoss)}
              onContinue={() => apply(advanceAfterBoss)}
            />
          ) : (
            <div className="panel fade-in">
              <button className="btn primary big" onClick={() => apply(advanceAfterBoss)}>
                {ctx.ui.continueButton}
              </button>
            </div>
          ))}
      </GameLayout>
    );
  }

  return (
    <LangContext.Provider value={ctx}>
      {body}
      <ConfirmDialog
        open={dialog === "restart"}
        title={ctx.ui.restartTitle}
        body={ctx.ui.restartBody}
        confirmLabel={ctx.ui.restart}
        danger
        onConfirm={confirmRestart}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === "clear"}
        title={ctx.ui.clearTitle}
        body={ctx.ui.clearBody}
        confirmLabel={ctx.ui.clearSave}
        danger
        onConfirm={confirmClear}
        onCancel={() => setDialog(null)}
      />
    </LangContext.Provider>
  );
}
