import {
  CAREER_STATS,
  LIFE_STATS,
  LONGTERM_STATS,
  STAT_HINTS,
  STAT_LABELS,
  useLang,
} from "../i18n";
import { careerReadiness, lifeBalance, wellness } from "../game/selectors";
import type { GameState, StatKey } from "../game/types";
import { StatBar, type Severity } from "./StatBar";

function severityFor(stat: StatKey, v: number): Severity {
  switch (stat) {
    case "stress":
      return v >= 85 ? "danger" : v >= 70 ? "warn" : "normal";
    case "mood":
      return v <= 20 ? "danger" : v < 40 ? "warn" : v >= 70 ? "good" : "normal";
    case "stamina":
      return v < 25 ? "danger" : v < 40 ? "warn" : v >= 75 ? "good" : "normal";
    case "money":
      return v < 0 ? "danger" : v < 15 ? "warn" : "normal";
    default:
      return v >= 70 ? "good" : v >= 40 ? "normal" : "warn";
  }
}

const derivedSeverity = (v: number): Severity =>
  v >= 65 ? "good" : v >= 45 ? "normal" : v >= 30 ? "warn" : "danger";

export function StatsPanel({ state }: { state: GameState }) {
  const { t, ui } = useLang();

  const renderStat = (stat: StatKey) => {
    const v = state.stats[stat];
    const isMoney = stat === "money";
    return (
      <StatBar
        key={stat}
        label={t(STAT_LABELS[stat])}
        value={v}
        min={isMoney ? -50 : 0}
        max={isMoney ? 200 : 100}
        severity={severityFor(stat, v)}
        hint={t(STAT_HINTS[stat])}
      />
    );
  };

  return (
    <aside className="stats-panel">
      <details className="stats-collapse" open>
        <summary className="stats-summary">{ui.career} · {ui.life} · {ui.longTerm}</summary>

        <section className="stat-group">
          <h3>{ui.career}</h3>
          {CAREER_STATS.map(renderStat)}
        </section>

        <section className="stat-group">
          <h3>{ui.life}</h3>
          {LIFE_STATS.map(renderStat)}
        </section>

        <section className="stat-group">
          <h3>{ui.longTerm}</h3>
          {LONGTERM_STATS.map(renderStat)}
        </section>

        <section className="stat-group">
          <h3>{ui.derived}</h3>
          <StatBar
            label={t(STAT_LABELS.wellness)}
            value={wellness(state)}
            severity={derivedSeverity(wellness(state))}
          />
          <StatBar
            label={t(STAT_LABELS.careerReadiness)}
            value={careerReadiness(state)}
            severity={derivedSeverity(careerReadiness(state))}
          />
          <StatBar
            label={t(STAT_LABELS.lifeBalance)}
            value={lifeBalance(state)}
            severity={derivedSeverity(lifeBalance(state))}
          />
        </section>
      </details>
    </aside>
  );
}
