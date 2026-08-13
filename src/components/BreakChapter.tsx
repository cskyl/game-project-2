import { BREAK_TRACKS, type BreakTrack } from "../data/breaks";
import { V2_UI_TEXT } from "../data/uiText";
import { evaluateCondition } from "../game/balance";
import { BREAK_ACTIONS_PER_CHAPTER } from "../game/constants";
import type { GameState } from "../game/types";
import { fmt, useLang } from "../i18n";
import { EffectChips } from "./EffectChips";

function availableTracks(state: GameState): BreakTrack[] {
  const afterSemester = state.semesterIndex + 1;
  return BREAK_TRACKS.filter(
    (track) =>
      track.availableAfterSemesters.includes(afterSemester) &&
      evaluateCondition(
        state.stats,
        state.flags,
        afterSemester,
        track.eligibility,
      ),
  );
}

export function BreakChapter({
  state,
  onChooseTrack,
  onTakeAction,
}: {
  state: GameState;
  onChooseTrack: (trackId: string) => void;
  onTakeAction: (actionId: string) => void;
}) {
  const { t } = useLang();
  const tracks = availableTracks(state);
  const selected = state.pendingBreakId
    ? BREAK_TRACKS.find((track) => track.id === state.pendingBreakId)
    : undefined;
  const remaining = BREAK_ACTIONS_PER_CHAPTER - state.breakTurn;

  return (
    <div className="panel break-chapter fade-in">
      <span className="panel-kicker">{t(V2_UI_TEXT.breakKicker)}</span>
      <p className="break-semester-label">
        {fmt(t(V2_UI_TEXT.breakAfterSemester), { n: state.semesterIndex + 1 })}
      </p>

      {!selected ? (
        <>
          <h2>{t(V2_UI_TEXT.breakHeading)}</h2>
          <p className="muted">{t(V2_UI_TEXT.breakIntro)}</p>
          <div className="break-track-grid">
            {tracks.map((track) => (
              <article className="break-track-card" key={track.id}>
                <h3>{t(track.name)}</h3>
                <p>{t(track.description)}</p>
                <dl className="break-tradeoff">
                  <div>
                    <dt>{t(V2_UI_TEXT.payoff)}</dt>
                    <dd>{t(track.payoff)}</dd>
                  </div>
                  <div>
                    <dt>{t(V2_UI_TEXT.cost)}</dt>
                    <dd>{t(track.cost)}</dd>
                  </div>
                </dl>
                <button
                  className="btn primary"
                  type="button"
                  onClick={() => onChooseTrack(track.id)}
                >
                  {t(V2_UI_TEXT.chooseTrack)}
                </button>
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <header className="break-action-head">
            <div>
              <span className="muted small">{t(V2_UI_TEXT.breakTrackChosen)}</span>
              <h2>{t(selected.name)}</h2>
              <p>{t(selected.description)}</p>
            </div>
            <div
              className="break-progress"
              role="status"
              aria-label={fmt(t(V2_UI_TEXT.breakTurn), { n: state.breakTurn + 1 })}
            >
              <strong>{fmt(t(V2_UI_TEXT.breakTurn), { n: state.breakTurn + 1 })}</strong>
              <div className="break-turn-dots" aria-hidden="true">
                {Array.from({ length: BREAK_ACTIONS_PER_CHAPTER }).map((_, index) => (
                  <span key={index} className={`break-turn-dot${index < state.breakTurn ? " done" : index === state.breakTurn ? " current" : ""}`} />
                ))}
              </div>
              <span className="muted small">
                {fmt(t(V2_UI_TEXT.breakTurnsRemaining), { n: remaining })}
              </span>
            </div>
          </header>
          <div className="break-action-grid">
            {selected.actions.map((action) => (
              <article className="break-action-card" key={action.id}>
                <h3>{t(action.title)}</h3>
                <p>{t(action.description)}</p>
                <EffectChips effects={action.effects} compact />
                <button
                  className="btn primary"
                  type="button"
                  onClick={() => onTakeAction(action.id)}
                >
                  {t(V2_UI_TEXT.chooseBreakAction)}
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
