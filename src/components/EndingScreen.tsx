import { useState } from "react";
import { ACHIEVEMENTS } from "../data/achievements";
import {
  careerReadiness,
  hardestSemester,
  lifeBalance,
  strongestStats,
  wellness,
} from "../game/selectors";
import {
  CAREER_STATS,
  LIFE_STATS,
  LONGTERM_STATS,
  STAT_LABELS,
  useLang,
} from "../i18n";
import type { Ending, GameState } from "../game/types";

export function EndingScreen({
  ending,
  state,
  onRestart,
}: {
  ending: Ending;
  state: GameState;
  onRestart: () => void;
}) {
  const { t, ui, lang } = useLang();
  const [copied, setCopied] = useState(false);

  const strong = strongestStats(state).map((s) => t(STAT_LABELS[s]));
  const hardest = hardestSemester(state);
  const unlocked = ACHIEVEMENTS.filter((a) =>
    state.unlockedAchievements.includes(a.id),
  );

  const buildSummary = (): string => {
    const L = lang === "zh";
    const lines = [
      L ? "牙学院生活模拟器 · 总结" : "Dental School Life Sim — Summary",
      "",
      `${ui.endingTitle}: ${t(ending.title)} — ${t(ending.subtitle)}`,
      `${ui.strongestStats}: ${strong.join(", ")}`,
      hardest ? `${ui.hardestSemester}: ${hardest}` : "",
      `${t(STAT_LABELS.careerReadiness)}: ${careerReadiness(state)}  ·  ${t(
        STAT_LABELS.wellness,
      )}: ${wellness(state)}  ·  ${t(STAT_LABELS.lifeBalance)}: ${lifeBalance(state)}`,
      unlocked.length
        ? `${ui.achievementsUnlocked}: ${unlocked.map((a) => t(a.title)).join(", ")}`
        : "",
      "",
      t(ending.text),
    ];
    return lines.filter((l) => l !== "").join("\n");
  };

  const copy = async () => {
    const text = buildSummary();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback: temporary textarea
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      } catch {
        /* ignore */
      }
    }
  };

  const statGrid = [...CAREER_STATS, ...LIFE_STATS, ...LONGTERM_STATS];

  return (
    <div className="ending-screen fade-in">
      <div className="ending-card">
        <span className="panel-kicker">{ui.endingTitle}</span>
        <h1 className="ending-title">{t(ending.title)}</h1>
        <p className="ending-subtitle">{t(ending.subtitle)}</p>
        <p className="ending-text">{t(ending.text)}</p>

        <div className="ending-highlights">
          <div className="hl">
            <span className="hl-label">{ui.strongestStats}</span>
            <span className="hl-value">{strong.join(" · ")}</span>
          </div>
          {hardest && (
            <div className="hl">
              <span className="hl-label">{ui.hardestSemester}</span>
              <span className="hl-value">{hardest}</span>
            </div>
          )}
        </div>

        <section className="ending-stats">
          <h3>{ui.finalStats}</h3>
          <div className="final-grid">
            {statGrid.map((s) => (
              <div key={s} className="final-stat">
                <span className="final-stat-label">{t(STAT_LABELS[s])}</span>
                <span className="final-stat-value">{state.stats[s]}</span>
              </div>
            ))}
            <div className="final-stat derived">
              <span className="final-stat-label">{t(STAT_LABELS.careerReadiness)}</span>
              <span className="final-stat-value">{careerReadiness(state)}</span>
            </div>
            <div className="final-stat derived">
              <span className="final-stat-label">{t(STAT_LABELS.wellness)}</span>
              <span className="final-stat-value">{wellness(state)}</span>
            </div>
            <div className="final-stat derived">
              <span className="final-stat-label">{t(STAT_LABELS.lifeBalance)}</span>
              <span className="final-stat-value">{lifeBalance(state)}</span>
            </div>
          </div>
        </section>

        {unlocked.length > 0 && (
          <section className="ending-achievements">
            <h3>{ui.achievementsUnlocked}</h3>
            <ul className="ach-list">
              {unlocked.map((a) => (
                <li key={a.id} className="ach-item">
                  <span className="ach-title">{t(a.title)}</span>
                  <span className="ach-desc">{t(a.description)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="ending-actions">
          <button className="btn ghost" onClick={copy}>
            {copied ? ui.copied : ui.exportSummary}
          </button>
          <button className="btn primary" onClick={onRestart}>
            {ui.playAgain}
          </button>
        </div>
      </div>
    </div>
  );
}
