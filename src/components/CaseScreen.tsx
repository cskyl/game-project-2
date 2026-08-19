import { CASES_BY_ID } from "../data/cases";
import { caseRollBreakdown, isCaseOptionAvailable } from "../game/systems/cases";
import { STAT_LABELS, useLang } from "../i18n";
import type { ConditionStatKey, GameState } from "../game/types";
import { EffectChips } from "./EffectChips";

/**
 * Three decisions, then one execution roll. Every option the player could not
 * take is still shown, with the requirement that locked it — a case should
 * teach what you were missing, not hide it.
 */
export function CaseScreen({
  state,
  onChoose,
  onContinue,
}: {
  state: GameState;
  onChoose: (optionId: string) => void;
  onContinue: () => void;
}) {
  const { t, ui } = useLang();
  const progress = state.caseProgress;
  const patientCase = progress ? CASES_BY_ID[progress.caseId] : undefined;
  if (!progress || !patientCase) return null;

  const resolved = progress.outcome !== undefined;
  const step = patientCase.steps[progress.stepIndex];
  const outcome = progress.outcome
    ? patientCase.outcomes[progress.outcome]
    : undefined;

  return (
    <div className="panel case fade-in">
      <span className="panel-kicker">{ui.patientCase}</span>
      <div className="case-patient">
        <h2>{t(patientCase.patient.name)}</h2>
        <p className="case-complaint">{t(patientCase.patient.chiefComplaint)}</p>
      </div>

      <ol className="case-steps" aria-label={ui.caseProgress}>
        {patientCase.steps.map((entry, index) => (
          <li
            key={entry.id}
            className={
              index < progress.stepIndex
                ? "done"
                : index === progress.stepIndex && !resolved
                  ? "active"
                  : ""
            }
          >
            {ui.caseStepKind[entry.kind]}
          </li>
        ))}
        <li className={resolved ? "done" : ""}>{ui.caseStepKind.execution}</li>
      </ol>

      {/* Recap of what has already been decided, with the teaching feedback. */}
      {progress.choices.length > 0 && (
        <div className="case-recap">
          {progress.choices.map((choiceId, index) => {
            const past = patientCase.steps[index];
            const option = past?.options.find((entry) => entry.id === choiceId);
            if (!past || !option) return null;
            return (
              <div key={past.id} className={`case-recap-row quality-${option.quality}`}>
                <span className="case-recap-kind">{ui.caseStepKind[past.kind]}</span>
                <p className="case-recap-choice">{t(option.text)}</p>
                <p className="case-feedback">{t(option.feedback)}</p>
              </div>
            );
          })}
        </div>
      )}

      {!resolved && step && (
        <div className="case-step">
          <p className="case-prompt">{t(step.prompt)}</p>
          <div className="case-options">
            {step.options.map((option) => {
              const available = isCaseOptionAvailable(option, state);
              return (
                <button
                  key={option.id}
                  className="case-option"
                  disabled={!available}
                  onClick={() => onChoose(option.id)}
                >
                  <span className="case-option-text">{t(option.text)}</span>
                  {!available && option.requires?.minStats && (
                    <span className="case-option-lock">
                      {ui.needsRequirement}
                      {": "}
                      {Object.entries(option.requires.minStats)
                        .map(([stat, min]) => {
                          const label = STAT_LABELS[stat as ConditionStatKey];
                          return `${label ? t(label) : stat} ${min}+`;
                        })
                        .join(", ")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {resolved && outcome && progress.roll && (
        <div className={`case-outcome outcome-${progress.outcome}`}>
          <h3>{ui.caseOutcome[progress.outcome!]}</h3>
          <p>{t(outcome.text)}</p>
          <EffectChips effects={outcome.effects} />
          <details className="roll-breakdown">
            <summary>{ui.howComputed}</summary>
            <ul>
              <li>
                {ui.caseRoll.skill}: {progress.roll.weighted.toFixed(1)}
              </li>
              <li>
                {ui.caseRoll.decisions}: {progress.roll.stepBonus >= 0 ? "+" : ""}
                {progress.roll.stepBonus}
              </li>
              <li>
                {ui.caseRoll.difficulty}: −{progress.roll.difficulty}
              </li>
              {progress.roll.modifier !== 0 && (
                <li>
                  {ui.caseRoll.modifier}: {progress.roll.modifier >= 0 ? "+" : ""}
                  {progress.roll.modifier}
                </li>
              )}
              <li>
                {ui.caseRoll.chance}: {progress.roll.roll >= 0 ? "+" : ""}
                {progress.roll.roll}
              </li>
              <li className="roll-total">
                {ui.caseRoll.total}: {progress.roll.total}
              </li>
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

/** Exported for the render smoke, which needs a deterministic preview roll. */
export const previewCaseRoll = caseRollBreakdown;
