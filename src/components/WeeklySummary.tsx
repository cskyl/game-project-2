import { diffStats, WARNING_MESSAGES } from "../game/balance";
import { currentSemester } from "../game/selectors";
import { V2_UI_TEXT } from "../data/uiText";
import { WEEKS_PER_SEMESTER } from "../game/constants";
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
  const driftEntries = state.log.filter(
    (entry) =>
      entry.kind === "drift" &&
      entry.semesterId === state.semesterIndex + 1 &&
      entry.weekInSemester === state.weekInSemester,
  );

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

      {driftEntries.length > 0 && (
        <section className="summary-section drift-summary">
          <h3>{t(V2_UI_TEXT.skillDriftHeading)}</h3>
          <p className="muted">{t(V2_UI_TEXT.skillDriftExplanation)}</p>
          {driftEntries.map((entry) =>
            entry.effects ? (
              <EffectChips key={entry.id} effects={entry.effects} />
            ) : null,
          )}
        </section>
      )}

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
          {Array.from({ length: WEEKS_PER_SEMESTER }).map((_, i) => (
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
