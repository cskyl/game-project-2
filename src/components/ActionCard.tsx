import { fmt, useLang } from "../i18n";
import type { ActionStatus } from "../game/engine";
import type { Action } from "../game/types";
import { EffectChips } from "./EffectChips";

export function ActionCard({
  action,
  status,
  onClick,
}: {
  action: Action;
  status: ActionStatus;
  onClick: () => void;
}) {
  const { t, ui } = useLang();
  const disabled = !status.usable;
  let reason = "";
  if (!status.unlocked) {
    reason = status.unlockSemester
      ? fmt(ui.lockedSemester, { n: status.unlockSemester })
      : ui.locked;
  } else if (!status.enoughAp) {
    reason = ui.notEnoughAp;
  } else if (!status.enoughMoney) {
    reason = fmt(ui.needMoney, { n: action.moneyCost ?? 0 });
  }

  return (
    <button
      className={"action-card" + (disabled ? " disabled" : "")}
      onClick={onClick}
      disabled={disabled}
      aria-label={t(action.title)}
    >
      <div className="action-head">
        <span className="action-title">{t(action.title)}</span>
        <span className="ap-badge">
          {action.cost} {ui.ap}
        </span>
      </div>
      <p className="action-desc">{t(action.description)}</p>
      <EffectChips effects={action.effects} compact />
      {action.moneyCost ? (
        <p className="action-cost">
          {ui.spend} ${action.moneyCost}
        </p>
      ) : null}
      {reason ? <p className="action-reason">{reason}</p> : null}
    </button>
  );
}
