import { useLang } from "../i18n";
import type { LogEntry } from "../game/types";
import { EffectChips } from "./EffectChips";

export function LogPanel({ log }: { log: LogEntry[] }) {
  const { t, ui } = useLang();
  const recent = log.slice(-8).reverse();
  return (
    <div className="log-panel">
      <h3 className="log-title">{ui.recentLog}</h3>
      {recent.length === 0 ? (
        <p className="muted">{ui.emptyLog}</p>
      ) : (
        <ul className="log-list">
          {recent.map((entry) => (
            <li key={entry.id} className={"log-row log-" + entry.kind}>
              <span className="log-text">{t(entry.text)}</span>
              {entry.effects ? <EffectChips effects={entry.effects} compact /> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
