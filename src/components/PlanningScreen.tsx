import { MAX_CARDS_PLAYED_PER_WEEK, DIFFICULTY } from "../game/constants";
import { actionStatus } from "../game/engine";
import { getActions, getDrawnCards } from "../game/selectors";
import { useLang } from "../i18n";
import type { GameState } from "../game/types";
import { ActionCard } from "./ActionCard";
import { EffectChips } from "./EffectChips";

export function PlanningScreen({
  state,
  onAction,
  onPlayCard,
  onFinishWeek,
}: {
  state: GameState;
  onAction: (id: string) => void;
  onPlayCard: (id: string) => void;
  onFinishWeek: () => void;
}) {
  const { t, ui } = useLang();
  const actions = getActions();
  const cards = getDrawnCards(state);
  const totalAp = DIFFICULTY[state.difficulty].actionPoints;
  const cardsLeft = MAX_CARDS_PLAYED_PER_WEEK - state.cardsPlayedThisWeek;

  return (
    <div className="panel planning fade-in">
      <div className="planning-head">
        <h2>{ui.weeklyPlanning}</h2>
        <div className="ap-tracker" aria-label={`${ui.apRemaining}: ${state.actionPointsRemaining}/${totalAp}`}>
          <span className="ap-label">{ui.apRemaining}</span>
          <span className="ap-dots">
            {Array.from({ length: totalAp }).map((_, i) => (
              <span
                key={i}
                className={"ap-dot" + (i < state.actionPointsRemaining ? " on" : "")}
              />
            ))}
          </span>
          <span className="ap-count">
            {state.actionPointsRemaining}/{totalAp}
          </span>
        </div>
      </div>

      <div className="action-grid">
        {actions.map((a) => (
          <ActionCard
            key={a.id}
            action={a}
            status={actionStatus(a, state)}
            onClick={() => onAction(a.id)}
          />
        ))}
      </div>

      {cards.length > 0 && (
        <section className="cards-section">
          <h3>
            {ui.lifeCards} <span className="muted small">{ui.cardsHint}</span>
          </h3>
          <div className="card-row">
            {cards.map((c) => (
              <div key={c.id} className={"life-card rarity-" + c.rarity}>
                <div className="life-card-head">
                  <span className="life-card-title">{t(c.title)}</span>
                  <span className="rarity-tag">{c.rarity}</span>
                </div>
                <p className="life-card-text">{t(c.text)}</p>
                <EffectChips effects={c.effects} compact />
                <button
                  className="btn small primary"
                  disabled={cardsLeft <= 0}
                  onClick={() => onPlayCard(c.id)}
                >
                  {ui.playCard}
                </button>
              </div>
            ))}
          </div>
          {cardsLeft <= 0 && <p className="muted small">{ui.cardsPlayedOut}</p>}
        </section>
      )}

      <div className="planning-foot">
        <button className="btn primary big" onClick={onFinishWeek}>
          {ui.finishWeek}
        </button>
      </div>
    </div>
  );
}
