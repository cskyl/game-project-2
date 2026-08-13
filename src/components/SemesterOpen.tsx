import { ELECTIVES, type Elective } from "../data/electives";
import { SEMESTERS } from "../data/semesters";
import { V2_UI_TEXT } from "../data/uiText";
import type { ModifierHook } from "../game/modifiers";
import type { GameState, Stage } from "../game/types";
import { STAT_LABELS, fmt, useLang } from "../i18n";

const STAGE_TEXT: Record<Stage | "any", keyof typeof V2_UI_TEXT> = {
  early: "stageEarly",
  preclinical: "stagePreclinical",
  transition: "stageTransition",
  clinical: "stageClinical",
  advanced: "stageAdvanced",
  any: "stageAny",
};

const TAG_TEXT: Record<string, keyof typeof V2_UI_TEXT> = {
  study: "tagStudy",
  clinic: "tagClinic",
  lab: "tagLab",
  community: "tagCommunity",
  work: "tagWork",
};

function signed(value: number): string {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function electiveRequirement(elective: Elective, t: ReturnType<typeof useLang>["t"]): string {
  const semester =
    elective.minSemester === elective.maxSemester
      ? fmt(t(V2_UI_TEXT.semesterOnly), { n: elective.minSemester })
      : fmt(t(V2_UI_TEXT.semesterRange), {
          min: elective.minSemester,
          max: elective.maxSemester,
        });
  const stages = elective.stage
    .map((stage) => t(V2_UI_TEXT[STAGE_TEXT[stage]]))
    .join(" · ");
  return `${semester} · ${stages}`;
}

function hookDescription(
  hook: ModifierHook,
  t: ReturnType<typeof useLang>["t"],
): string {
  switch (hook.on) {
    case "actionEffects": {
      const tag = hook.tag ? t(V2_UI_TEXT[TAG_TEXT[hook.tag] ?? "tagStudy"]) : "";
      const values = [
        hook.mult !== undefined ? `×${hook.mult}` : "",
        hook.add !== undefined ? signed(hook.add) : "",
      ].filter(Boolean).join(" ");
      if (hook.stat) {
        return fmt(t(V2_UI_TEXT.actionGainEffect), {
          stat: t(STAT_LABELS[hook.stat]),
          tag,
          value: values,
        });
      }
      return fmt(t(V2_UI_TEXT.actionGeneralEffect), { tag, value: values });
    }
    case "caseRoll":
      return fmt(t(V2_UI_TEXT.rollEffect), {
        system: t(V2_UI_TEXT.systemCase),
        value: signed(hook.add),
      });
    case "projectQuality":
      return fmt(t(V2_UI_TEXT.rollEffect), {
        system: t(V2_UI_TEXT.systemProject),
        value: signed(hook.add),
      });
    case "bossRoll":
      return fmt(t(V2_UI_TEXT.rollEffect), {
        system: t(V2_UI_TEXT.systemBoss),
        value: signed(hook.add),
      });
    case "simLabRoll":
      return fmt(t(V2_UI_TEXT.rollEffect), {
        system: t(V2_UI_TEXT.systemSimLab),
        value: signed(hook.add),
      });
    case "softCapBand":
      return fmt(t(V2_UI_TEXT.softCapEffect), {
        stat: t(STAT_LABELS[hook.stat]),
        value: signed(hook.shift),
      });
    case "income":
      return fmt(t(V2_UI_TEXT.economyEffect), {
        system: t(V2_UI_TEXT.systemIncome),
        value: hook.mult,
      });
    case "expense":
      return fmt(t(V2_UI_TEXT.economyEffect), {
        system: t(V2_UI_TEXT.systemExpense),
        value: hook.mult,
      });
    case "weeklyThreshold":
      return fmt(t(V2_UI_TEXT.weeklyEffect), {
        stat: t(STAT_LABELS[hook.stat]),
        value: signed(hook.add),
      });
    case "affinityGain":
      return fmt(t(V2_UI_TEXT.affinityEffect), { value: hook.mult });
    case "apPerWeek":
      return fmt(t(V2_UI_TEXT.apEffect), { value: signed(hook.add) });
  }
}

export function SemesterOpen({
  state,
  onChoose,
  onBegin,
}: {
  state: GameState;
  onChoose: (electiveId: string) => void;
  onBegin: () => void;
}) {
  const { t } = useLang();
  const semester = SEMESTERS[state.semesterIndex] ?? SEMESTERS[0];
  const offers = state.electiveOffers
    .map((id) => ELECTIVES.find((elective) => elective.id === id))
    .filter((elective): elective is Elective => Boolean(elective));
  const hasChoice = Boolean(
    state.activeElective && state.electiveOffers.includes(state.activeElective),
  );

  return (
    <div className="panel semester-open fade-in">
      <span className="panel-kicker">{t(V2_UI_TEXT.semesterOpenKicker)}</span>
      <header className="semester-open-hero">
        <div>
          <h2>{t(semester.name)}</h2>
          <p className="semester-theme">{t(semester.theme)}</p>
        </div>
        <span className="semester-number" aria-label={`${state.semesterIndex + 1}/${SEMESTERS.length}`}>
          {state.semesterIndex + 1}/{SEMESTERS.length}
        </span>
      </header>
      <h3>{t(V2_UI_TEXT.semesterOpenHeading)}</h3>
      <p className="muted">{t(V2_UI_TEXT.semesterOpenIntro)}</p>

      <div className="semester-preview-grid">
        <section className="term-condition-card" aria-labelledby="term-condition-heading">
          <h3 id="term-condition-heading">{t(V2_UI_TEXT.termConditions)}</h3>
          <strong>
            {state.semesterModifiers.length === 0
              ? t(V2_UI_TEXT.standardTermTitle)
              : fmt(t(V2_UI_TEXT.activeModifierCount), {
                  n: state.semesterModifiers.length,
                })}
          </strong>
          <p>
            {state.semesterModifiers.length === 0
              ? t(V2_UI_TEXT.standardTermBody)
              : fmt(t(V2_UI_TEXT.activeModifierCount), {
                  n: state.semesterModifiers.length,
                })}
          </p>
        </section>
        <section className="term-focus-card" aria-labelledby="term-focus-heading">
          <h3 id="term-focus-heading">{t(V2_UI_TEXT.semesterGoals)}</h3>
          <ul className="focus-list">
            {semester.focus.map((stat) => (
              <li key={stat}>{t(STAT_LABELS[stat])}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="elective-draft" aria-labelledby="elective-draft-heading">
        <h3 id="elective-draft-heading">{t(V2_UI_TEXT.electiveDraft)}</h3>
        <div className="elective-grid">
          {offers.map((elective) => {
            const selected = state.activeElective === elective.id;
            return (
              <article
                key={elective.id}
                className={`elective-card${selected ? " selected" : ""}`}
              >
                <div className="elective-card-head">
                  <h4>{t(elective.name)}</h4>
                  {selected && (
                    <span className="selected-badge">{t(V2_UI_TEXT.selectedElective)}</span>
                  )}
                </div>
                <p>{t(elective.description)}</p>
                <div className="elective-detail">
                  <strong>{t(V2_UI_TEXT.electiveRequirements)}</strong>
                  <span>{electiveRequirement(elective, t)}</span>
                  <span className="requirements-met">✓ {t(V2_UI_TEXT.requirementsMet)}</span>
                </div>
                <div className="elective-detail">
                  <strong>{t(V2_UI_TEXT.electiveEffects)}</strong>
                  <ul>
                    {elective.hooks.map((hook, index) => (
                      <li key={`${elective.id}-hook-${index}`}>
                        {hookDescription(hook, t)}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`btn ${selected ? "ghost" : "primary"}`}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChoose(elective.id)}
                >
                  {selected
                    ? t(V2_UI_TEXT.selectedElective)
                    : t(V2_UI_TEXT.selectElective)}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="semester-open-footer">
        {!hasChoice && <p className="muted">{t(V2_UI_TEXT.chooseBeforeBeginning)}</p>}
        <button className="btn primary big" type="button" disabled={!hasChoice} onClick={onBegin}>
          {t(V2_UI_TEXT.beginSemester)}
        </button>
      </footer>
    </div>
  );
}
