import { evaluateCondition } from "../game/balance";
import { currentSemesterId } from "../game/engine";
import { useLang } from "../i18n";
import type { GameEvent, GameState } from "../game/types";
import { EffectChips } from "./EffectChips";

export function EventPanel({
  event,
  state,
  resolvedChoiceId,
  onChoose,
  onContinue,
}: {
  event: GameEvent;
  state: GameState;
  resolvedChoiceId?: string;
  onChoose: (id: string) => void;
  onContinue: () => void;
}) {
  const { t, ui } = useLang();
  const semId = currentSemesterId(state);
  const resolved = resolvedChoiceId
    ? event.choices.find((c) => c.id === resolvedChoiceId)
    : undefined;

  return (
    <div className="panel event fade-in">
      <span className="panel-kicker">{ui.randomEvent}</span>
      <h2>{t(event.title)}</h2>
      <p className="event-text">{t(event.text)}</p>

      {!resolved ? (
        <>
          <h3 className="choose-h">{ui.chooseResponse}</h3>
          <div className="choices">
            {event.choices.map((c) => {
              const ok =
                !c.requirements ||
                evaluateCondition(state.stats, state.flags, semId, c.requirements);
              return (
                <button
                  key={c.id}
                  className="choice-btn"
                  disabled={!ok}
                  onClick={() => onChoose(c.id)}
                >
                  <span className="choice-text">{t(c.text)}</span>
                  <EffectChips effects={c.effects} compact />
                  {!ok ? <span className="muted small">{ui.needsRequirement}</span> : null}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="result fade-in">
          <p className="result-text">{t(resolved.resultText)}</p>
          <EffectChips effects={resolved.effects} />
          <button className="btn primary big" onClick={onContinue}>
            {ui.continueButton}
          </button>
        </div>
      )}
    </div>
  );
}
