import { STAT_LABELS, useLang } from "../i18n";
import type { ConditionStatKey, StatBlock } from "../game/types";

const isGood = (stat: string, delta: number): boolean =>
  stat === "stress" ? delta < 0 : delta > 0;

export function EffectChips({
  effects,
  compact,
}: {
  effects: StatBlock;
  compact?: boolean;
}) {
  const { t } = useLang();
  const entries = Object.entries(effects).filter(([, v]) => v !== 0);
  if (entries.length === 0) return null;
  return (
    <ul className={"chips" + (compact ? " chips-compact" : "")}>
      {entries.map(([k, v]) => {
        const good = isGood(k, v as number);
        const sign = (v as number) > 0 ? "+" : "";
        return (
          <li key={k} className={"chip " + (good ? "chip-good" : "chip-bad")}>
            <span className="chip-label">{t(STAT_LABELS[k as ConditionStatKey])}</span>
            <span className="chip-val">
              {sign}
              {v}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
