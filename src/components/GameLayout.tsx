import type { ReactNode } from "react";
import { currentSemester } from "../game/selectors";
import { useLang } from "../i18n";
import type { GameState } from "../game/types";
import { LogPanel } from "./LogPanel";
import { StatsPanel } from "./StatsPanel";

export function GameLayout({
  state,
  saved,
  onSave,
  onRestart,
  children,
}: {
  state: GameState;
  saved: boolean;
  onSave: () => void;
  onRestart: () => void;
  children: ReactNode;
}) {
  const { t, ui, lang, setLang } = useLang();
  const sem = currentSemester(state);

  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">
          <h1 className="brand-title">{ui.appTitle}</h1>
          <p className="brand-sub">
            {t(sem.name)} · {t(sem.theme)}
          </p>
        </div>
        <div className="topbar-meta">
          <span className="pill">
            {ui.semester} {state.semesterIndex + 1}/11
          </span>
          <span className="pill">
            {ui.week} {state.weekInSemester}/4
          </span>
        </div>
        <div className="topbar-actions">
          <button
            className="btn ghost"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
          >
            {ui.langButton}
          </button>
          <button className="btn ghost" onClick={onSave}>
            {saved ? ui.saved : ui.save}
          </button>
          <button className="btn ghost danger-text" onClick={onRestart}>
            {ui.restart}
          </button>
        </div>
      </header>

      <div className="main-grid">
        <StatsPanel state={state} />
        <main className="content">{children}</main>
      </div>

      <footer className="footer">
        <LogPanel log={state.log} />
      </footer>
    </div>
  );
}
