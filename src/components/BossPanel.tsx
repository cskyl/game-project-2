import { bossReadiness } from "../game/engine";
import { STAT_LABELS, useLang } from "../i18n";
import type { Boss, BossOutcomeKey, BossResult, GameState } from "../game/types";
import { EffectChips } from "./EffectChips";
import { StatBar, type Severity } from "./StatBar";
import type { UIStrings } from "../i18n";

const outcomeLabel = (ui: UIStrings, o: BossOutcomeKey): string =>
  o === "great"
    ? ui.outcomeGreat
    : o === "pass"
      ? ui.outcomePass
      : o === "barely"
        ? ui.outcomeBarely
        : ui.outcomeStruggle;

const readinessSeverity = (v: number): Severity =>
  v >= 75 ? "good" : v >= 55 ? "normal" : v >= 40 ? "warn" : "danger";

export function BossPanel({
  boss,
  state,
  result,
  isFinal,
  onBegin,
  onContinue,
}: {
  boss: Boss;
  state: GameState;
  result?: BossResult;
  isFinal: boolean;
  onBegin: () => void;
  onContinue: () => void;
}) {
  const { t, ui } = useLang();
  const readiness = bossReadiness(boss, state);

  return (
    <div className="panel boss fade-in">
      <span className="panel-kicker">{ui.semesterCheck}</span>
      <h2>{t(boss.title)}</h2>
      <p className="event-text">{t(boss.description)}</p>

      {!result ? (
        <>
          <section className="summary-section">
            <h3>{ui.whatItChecks}</h3>
            <ul className="req-list">
              {boss.requiredStats.map((r) => (
                <li key={r.stat}>
                  <span>{t(STAT_LABELS[r.stat])}</span>
                  <span className="muted">{Math.round(r.weight * 100)}%</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="summary-section">
            <h3>{ui.yourReadiness}</h3>
            <StatBar
              label={ui.yourReadiness}
              value={readiness}
              severity={readinessSeverity(readiness)}
            />
          </section>
          <button className="btn primary big" onClick={onBegin}>
            {ui.beginCheck}
          </button>
        </>
      ) : (
        <div className="result fade-in">
          <div className={"boss-outcome outcome-" + result.outcome}>
            {outcomeLabel(ui, result.outcome)}
          </div>
          <p className="result-text">{t(boss.outcomes[result.outcome].text)}</p>
          <EffectChips effects={boss.outcomes[result.outcome].effects} />
          <button className="btn primary big" onClick={onContinue}>
            {isFinal ? ui.toEnding : ui.toNextSemester}
          </button>
        </div>
      )}
    </div>
  );
}
