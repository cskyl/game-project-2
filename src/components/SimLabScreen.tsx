import { SIM_LAB_BY_ID } from "../data/simlab";
import { useLang } from "../i18n";
import type { GameState, SimLabApproach } from "../game/types";
import { EffectChips } from "./EffectChips";

const APPROACHES: SimLabApproach[] = ["fast", "careful", "textbook"];

/**
 * Three stages, each graded on signed error. The feedback names *which
 * direction* you were wrong in, because "over-prepared" and "under-prepared"
 * are different mistakes with different fixes.
 */
export function SimLabScreen({
  state,
  onChoose,
  onContinue,
}: {
  state: GameState;
  onChoose: (approach: SimLabApproach) => void;
  onContinue: () => void;
}) {
  const { t, ui } = useLang();
  const progress = state.simLabProgress;
  const exercise = progress ? SIM_LAB_BY_ID[progress.exerciseId] : undefined;
  if (!progress || !exercise) return null;

  const finished = progress.result !== undefined;
  const stage = exercise.stages[progress.stageIndex];
  const outcome = progress.result ? exercise.outcomes[progress.result] : undefined;

  return (
    <div className="panel simlab fade-in">
      <span className="panel-kicker">{ui.simLab}</span>
      <h2>{t(exercise.title)}</h2>
      <p className="simlab-description">{t(exercise.description)}</p>

      <ol className="simlab-stages" aria-label={ui.caseProgress}>
        {exercise.stages.map((entry, index) => {
          const result = progress.results[index];
          return (
            <li key={entry.id} className={result ? `done ${result}` : index === progress.stageIndex ? "active" : ""}>
              {result ? ui.simLabStageOutcome[result] : `${index + 1}`}
            </li>
          );
        })}
      </ol>

      {progress.results.length > 0 && (
        <div className="simlab-recap">
          {progress.results.map((result, index) => {
            const past = exercise.stages[index];
            if (!past) return null;
            return (
              <div key={past.id} className={`simlab-recap-row ${result}`}>
                <span className="simlab-recap-kind">
                  {t(past.prompt)}
                  {" · "}
                  {ui.simLabApproach[progress.approaches[index]]}
                </span>
                <p className="simlab-feedback">{t(past.feedback[result])}</p>
              </div>
            );
          })}
        </div>
      )}

      {!finished && stage && (
        <div className="simlab-step">
          <p className="simlab-prompt">{t(stage.prompt)}</p>
          <div className="simlab-options">
            {APPROACHES.map((approach) => (
              <button
                key={approach}
                className={`simlab-option approach-${approach}`}
                onClick={() => onChoose(approach)}
              >
                <span className="simlab-option-title">{ui.simLabApproach[approach]}</span>
                <span className="simlab-option-hint">{ui.simLabApproachHint[approach]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {finished && outcome && (
        <div className={`simlab-outcome outcome-${progress.result}`}>
          <h3>{ui.simLabResult[progress.result!]}</h3>
          <p>{t(outcome.text)}</p>
          <EffectChips effects={outcome.effects} />
          <details className="roll-breakdown">
            <summary>{ui.howComputed}</summary>
            <ul>
              {progress.errors.map((error, index) => (
                <li key={index}>
                  {index + 1}. {ui.simLabApproach[progress.approaches[index]]} →{" "}
                  {error > 0 ? "+" : ""}
                  {error} ({ui.simLabStageOutcome[progress.results[index]]})
                </li>
              ))}
              <li className="roll-total">{ui.simLabIdealBand}</li>
            </ul>
          </details>
          <button className="primary" onClick={onContinue}>
            {ui.continueButton}
          </button>
        </div>
      )}
    </div>
  );
}
