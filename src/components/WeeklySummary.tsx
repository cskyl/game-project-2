import { diffStats, WARNING_MESSAGES } from "../game/balance";
import { currentSemester } from "../game/selectors";
import { fmt, useLang } from "../i18n";
import type { GameState } from "../game/types";
import { EffectChips } from "./EffectChips";

export function WeeklySummary({
  state,
  onContinue,
}: {
  state: GameState;
  onContinue: () => void;
}) {
  const { t, ui } = useLang();
  const changes = diffStats(state.weekStartStats, state.stats);
  const sem = currentSemester(state);
  const hasChanges = Object.keys(changes).length > 0;

  return (
    <div className="panel summary fade-in">
      <h2>{ui.weeklySummary}</h2>
      <p className="summary-sub">
        {t(sem.name)} · {fmt(ui.weekOf, { n: state.weekInSemester })}
      </p>

      <section className="summary-section">
        <h3>{ui.changesThisWeek}</h3>
        {hasChanges ? (
          <EffectChips effects={changes} />
        ) : (
          <p className="muted">{ui.noChanges}</p>
        )}
      </section>

      {state.weekWarnings.length > 0 && (
        <section className="summary-section warnings">
          <h3>{ui.warnings}</h3>
          <ul className="warn-list">
            {state.weekWarnings.map((w) =>
              WARNING_MESSAGES[w] ? (
                <li key={w} className={"warn-item warn-" + w}>
                  {t(WARNING_MESSAGES[w])}
                </li>
              ) : null,
            )}
          </ul>
        </section>
      )}

      <div className="summary-progress">
        <span className="muted">{ui.semesterProgress}</span>
        <div className="week-dots" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className={"week-dot" + (i < state.weekInSemester ? " on" : "")} />
          ))}
        </div>
      </div>

      <button className="btn primary big" onClick={onContinue}>
        {ui.continueButton}
      </button>
    </div>
  );
}
