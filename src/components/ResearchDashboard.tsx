import {
  RESEARCH_LABS,
  RESEARCH_LABS_BY_ID,
  RESEARCH_EVENTS_BY_ID,
  RESEARCH_PROJECT_TEMPLATES,
  type LabTemplate,
} from "../data/research";
import { V2_UI_TEXT as TEXT } from "../data/uiText";
import { evaluateCondition, getStat } from "../game/balance";
import { fmt, STAT_LABELS, useLang } from "../i18n";
import type {
  EventCondition,
  GameState,
  LocalizedText,
  ProjectPhase,
  ResearchProject,
} from "../game/types";

type Props = {
  state: GameState;
  onShowInterest: () => void;
  onJoinLab: (labId: string) => void;
  onStartProject: (templateId: string) => void;
  onSelectProject: (projectId: string) => void;
  onLabWork: () => void;
  onResubmitProject: (projectId: string) => void;
  onAbandonProject: (projectId: string) => void;
  onReturn: () => void;
};

const TERMINAL_PHASES = new Set<ProjectPhase>([
  "accepted",
  "rejected",
  "abandoned",
]);

function percent(value: number): string {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

export function ResearchDashboard({
  state,
  onShowInterest,
  onJoinLab,
  onStartProject,
  onSelectProject,
  onLabWork,
  onResubmitProject,
  onAbandonProject,
  onReturn,
}: Props) {
  const { t } = useLang();
  const semesterId = state.semesterIndex + 1;
  const lab = state.research.labId
    ? RESEARCH_LABS_BY_ID[state.research.labId]
    : undefined;
  const activeProjects = state.research.projects.filter(
    (project) => !TERMINAL_PHASES.has(project.phase),
  );
  const completedProjects = state.research.projects.filter((project) =>
    TERMINAL_PHASES.has(project.phase),
  );
  const availableProjects = lab
    ? RESEARCH_PROJECT_TEMPLATES.filter((project) => project.labId === lab.id)
    : [];
  const researchActivity = state.research.activity.slice(-6).reverse();
  const hasQueuedEffort = state.research.researchPoints > 0;

  const phaseLabel = (phase: ProjectPhase) =>
    t(
      {
        idea: TEXT.projectPhaseIdea,
        pilot: TEXT.projectPhasePilot,
        irb: TEXT.projectPhaseIrb,
        collection: TEXT.projectPhaseCollection,
        analysis: TEXT.projectPhaseAnalysis,
        writing: TEXT.projectPhaseWriting,
        submitted: TEXT.projectPhaseSubmitted,
        revision: TEXT.projectPhaseRevision,
        accepted: TEXT.projectPhaseAccepted,
        rejected: TEXT.projectPhaseRejected,
        abandoned: TEXT.projectPhaseAbandoned,
      }[phase],
    );
  const rollOutcomeLabel = (outcome: string): string => {
    const labels: Record<string, LocalizedText> = {
      idea: TEXT.projectPhaseIdea,
      pilot: TEXT.projectPhasePilot,
      irb: TEXT.projectPhaseIrb,
      collection: TEXT.projectPhaseCollection,
      analysis: TEXT.projectPhaseAnalysis,
      writing: TEXT.projectPhaseWriting,
      submitted: TEXT.projectPhaseSubmitted,
      revision: TEXT.projectPhaseRevision,
      accepted: TEXT.rollAccepted,
      minor_revision: TEXT.rollMinorRevision,
      major_revision: TEXT.rollMajorRevision,
      rejected: TEXT.rollRejected,
      triggered: TEXT.rollTriggered,
      steady: TEXT.rollSteady,
    };
    return t(labels[outcome] ?? TEXT.rollRecorded);
  };

  return (
    <section className="panel research-dashboard fade-in" aria-labelledby="research-dashboard-title">
      <header className="research-dashboard-head">
        <div>
          <span className="panel-kicker">{t(TEXT.researchDashboardKicker)}</span>
          <h2 id="research-dashboard-title">{t(TEXT.researchDashboardHeading)}</h2>
          <p className="research-dashboard-intro">{t(TEXT.researchDashboardIntro)}</p>
        </div>
        <nav className="research-dashboard-nav" aria-label={t(TEXT.returnToWeek)}>
          <button className="btn ghost" type="button" onClick={onReturn}>
            {t(TEXT.returnToWeek)}
          </button>
        </nav>
      </header>

      <div className="research-metrics" aria-label={t(TEXT.researchOutcomes)}>
        <Metric label={t(TEXT.labReputation)} value={`${Math.round(state.research.reputationInLab)}/100`} />
        <Metric label={t(TEXT.researchPoints)} value={Math.round(state.research.researchPoints)} />
        <Metric label={t(TEXT.publications)} value={state.research.publications.length} />
        <Metric label={t(TEXT.posters)} value={state.research.posters} />
      </div>

      {!lab ? (
        <section className="research-section" aria-labelledby="lab-recruitment-title">
          <div className="research-section-head">
            <div>
              <h3 id="lab-recruitment-title">{t(TEXT.labRecruitment)}</h3>
              <p>{t(TEXT.labRecruitmentIntro)}</p>
            </div>
            <button
              className="btn primary"
              type="button"
              disabled={semesterId < 2 || state.actionPointsRemaining < 1}
              onClick={onShowInterest}
              aria-describedby="research-interest-requirement"
            >
              {t(TEXT.showResearchInterest)}
            </button>
          </div>
          <p id="research-interest-requirement" className="muted small">
            {semesterId < 2
              ? fmt(t(TEXT.requirementSemester), { n: 2 })
              : state.actionPointsRemaining < 1
                ? t(TEXT.requirementOneAp)
                : t(TEXT.requirementsMet)}
          </p>
          <div className="research-lab-grid">
            {RESEARCH_LABS.map((candidate) => (
              <LabCard
                key={candidate.id}
                lab={candidate}
                state={state}
                offered={state.research.labOffers.includes(candidate.id)}
                onJoin={() => onJoinLab(candidate.id)}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="research-section" aria-labelledby="joined-lab-title">
          <div className="research-section-head">
            <h3 id="joined-lab-title">{t(TEXT.joinedLab)}</h3>
          </div>
          <div className="research-lab-card active">
            <div className="research-card-head">
              <div>
                <h4>{t(lab.name)}</h4>
                <p className="research-card-subtitle">{t(lab.field)}</p>
              </div>
              <span className="research-badge good">{t(TEXT.labJoined)}</span>
            </div>
            <p className="research-card-description">{t(lab.description)}</p>
            <LabDetails lab={lab} />
          </div>
        </section>
      )}

      <section className="research-section" aria-labelledby="active-projects-title">
        <div className="research-section-head">
          <h3 id="active-projects-title">{t(TEXT.activeProjects)}</h3>
          <p>{activeProjects.length}</p>
        </div>
        {activeProjects.length > 0 ? (
          <div className="research-project-grid">
            {activeProjects.map((project) => (
              <ActiveProjectCard
                key={project.id}
                project={project}
                phaseLabel={phaseLabel(project.phase)}
                canWork={
                  state.actionPointsRemaining >= 2 &&
                  project.stallWeeksRemaining <= 0
                }
                hasEnoughAp={state.actionPointsRemaining >= 2}
                hasQueuedEffort={hasQueuedEffort}
                isSelected={state.research.activeProjectId === project.id}
                onSelect={() => onSelectProject(project.id)}
                onWork={onLabWork}
                onAbandon={() => onAbandonProject(project.id)}
              />
            ))}
          </div>
        ) : (
          <p className="research-empty">{t(TEXT.noActiveProjects)}</p>
        )}
      </section>

      {lab && (
        <section className="research-section" aria-labelledby="available-projects-title">
          <div className="research-section-head">
            <h3 id="available-projects-title">{t(TEXT.availableProjects)}</h3>
            <p>{availableProjects.length}</p>
          </div>
          <div className="research-project-grid">
            {availableProjects.map((template) => {
              const alreadyStarted = state.research.projects.some(
                (project) => project.templateId === template.id,
              );
              return (
                <article
                  className={`research-project-card${alreadyStarted ? " locked" : ""}`}
                  key={template.id}
                >
                  <div className="research-card-head">
                    <h4>{t(template.title)}</h4>
                    <span className="research-badge">{Math.round(template.baseRisk * 100)}% {t(TEXT.projectRisk)}</span>
                  </div>
                  <p className="research-card-description">{t(template.description)}</p>
                  <div className="research-card-actions">
                    <button
                      className="btn primary small"
                      type="button"
                      disabled={alreadyStarted || hasQueuedEffort}
                      onClick={() => onStartProject(template.id)}
                    >
                      {t(TEXT.startProject)}
                    </button>
                    {alreadyStarted && (
                      <p className="research-lock-reason">
                        {t(TEXT.projectAlreadyAttempted)}
                      </p>
                    )}
                    {!alreadyStarted && hasQueuedEffort && (
                      <p className="research-lock-reason">
                        {t(TEXT.queuedResearchEffort)}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="research-section" aria-labelledby="research-outcomes-title">
        <div className="research-section-head">
          <h3 id="research-outcomes-title">{t(TEXT.researchOutcomes)}</h3>
          <p>
            {t(TEXT.posters)} {state.research.posters} · {t(TEXT.grants)} {state.research.grantsWon.length}
          </p>
        </div>
        {state.research.publications.length > 0 ? (
          <ul className="research-publication-list">
            {state.research.publications.map((publication) => (
              <li className="research-publication" key={publication.id}>
                <div>
                  <strong>{t(publication.title)}</strong>
                  <span>
                    {t(
                      {
                        poster: TEXT.venuePoster,
                        regional: TEXT.venueRegional,
                        specialty: TEXT.venueSpecialty,
                        top: TEXT.venueTop,
                      }[publication.venue],
                    )}
                    {publication.firstAuthor ? ` · ${t(TEXT.firstAuthor)}` : ""}
                  </span>
                </div>
                <span>{t(TEXT.projectQuality)} {Math.round(publication.quality)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="research-empty">{t(TEXT.noPublications)}</p>
        )}
      </section>

      {completedProjects.length > 0 && (
        <section className="research-section" aria-labelledby="completed-projects-title">
          <div className="research-section-head">
            <h3 id="completed-projects-title">{t(TEXT.completedProjects)}</h3>
          </div>
          <div className="research-project-grid">
            {completedProjects.map((project) => (
              <article className="research-project-card" key={project.id}>
                <div className="research-card-head">
                  <h4>{t(project.title)}</h4>
                  <span className={`research-badge ${project.phase === "accepted" ? "good" : "warn"}`}>
                    {phaseLabel(project.phase)}
                  </span>
                </div>
                <ProjectNumbers project={project} />
                {project.phase === "rejected" && (
                  <div className="research-card-actions">
                    <button
                      className="btn primary small"
                      type="button"
                      disabled={hasQueuedEffort}
                      onClick={() => onResubmitProject(project.id)}
                    >
                      {t(TEXT.resubmitProject)}
                    </button>
                    {hasQueuedEffort && (
                      <p className="research-lock-reason">{t(TEXT.queuedResearchEffort)}</p>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="research-section" aria-labelledby="research-activity-title">
        <div className="research-section-head">
          <div>
            <h3 id="research-activity-title">{t(TEXT.researchActivity)}</h3>
            <p>{t(TEXT.researchActivityIntro)}</p>
          </div>
        </div>
        {researchActivity.length > 0 ? (
          <ol className="research-activity-list">
            {researchActivity.map((activity) => {
              const authoredEvent = activity.eventId
                ? RESEARCH_EVENTS_BY_ID[activity.eventId]
                : undefined;
              const sourceLabel =
                activity.kind === "review" || activity.kind === "accepted"
                  ? t(TEXT.researchReviewOutcome)
                  : activity.kind === "poster"
                    ? t(TEXT.posterPresentation)
                  : activity.kind === "risk"
                    ? t(TEXT.researchRiskRoll)
                  : authoredEvent?.kind === "setback"
                    ? t(TEXT.researchSetback)
                    : authoredEvent?.kind === "lucky"
                      ? t(TEXT.researchLuckyBreak)
                      : t(TEXT.researchActivity);
              const activityClass =
                activity.kind === "review" || activity.kind === "accepted"
                  ? "review"
                  : activity.kind === "poster"
                    ? "poster"
                  : authoredEvent?.kind === "setback"
                    ? "setback"
                    : authoredEvent?.kind === "lucky"
                      ? "lucky"
                      : "neutral";
              return (
                <li className={`research-activity ${activityClass}`} key={activity.id}>
                  <div>
                    <strong>{t(activity.title)}</strong>
                    <p>{t(activity.text)}</p>
                    {activity.roll && (
                      <details className="research-roll-breakdown">
                        <summary>{t(TEXT.rollBreakdown)}</summary>
                        <dl>
                          <div>
                            <dt>{t(activity.roll.kind === "risk" ? TEXT.rollTriggerThreshold : TEXT.rollBase)}</dt>
                            <dd>{activity.roll.base}{activity.roll.kind === "risk" ? "%" : ""}</dd>
                          </div>
                          <div>
                            <dt>{t(TEXT.rollRandom)}</dt>
                            <dd>{activity.roll.random}{activity.roll.kind === "risk" ? "%" : ""}</dd>
                          </div>
                          {activity.roll.kind !== "risk" && (
                            <>
                              <div><dt>{t(TEXT.rollModifiers)}</dt><dd>{activity.roll.modifiers}</dd></div>
                              <div><dt>{t(TEXT.rollTotal)}</dt><dd>{activity.roll.total}</dd></div>
                            </>
                          )}
                          <div><dt>{t(TEXT.rollOutcome)}</dt><dd>{rollOutcomeLabel(activity.roll.outcome)}</dd></div>
                        </dl>
                      </details>
                    )}
                    {activity.effects && (
                      <ResearchEffectList effects={activity.effects} />
                    )}
                  </div>
                  <span>
                    {sourceLabel} · {fmt(t(TEXT.semesterWeekShort), {
                      semester: activity.semesterId,
                      week: activity.weekInSemester,
                    })}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="research-empty">{t(TEXT.noResearchActivity)}</p>
        )}
      </section>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="research-metric">
      <span className="research-metric-label">{label}</span>
      <strong className="research-metric-value">{value}</strong>
    </div>
  );
}

function LabDetails({ lab }: { lab: LabTemplate }) {
  const { t } = useLang();
  return (
    <ul className="research-detail-list">
      <li><strong>{t(TEXT.principalInvestigator)}</strong>{t(TEXT.drReyes)}</li>
      <li><strong>{t(TEXT.labIntensity)}</strong>{lab.intensity}/3</li>
      <li><strong>{t(TEXT.labPrestige)}</strong>{Math.round(lab.prestige)}/100</li>
      <li><strong>{t(TEXT.researchField)}</strong>{t(lab.field)}</li>
    </ul>
  );
}

function LabCard({
  lab,
  state,
  offered,
  onJoin,
}: {
  lab: LabTemplate;
  state: GameState;
  offered: boolean;
  onJoin: () => void;
}) {
  const { t, lang } = useLang();
  const requirements = describeRequirements(lab.requirements, state, lang);
  if ((lab.requirements.minStats?.knowledge ?? 0) < 45) {
    requirements.push({
      text: `${STAT_LABELS.knowledge[lang]} ≥ 45`,
      met: state.stats.knowledge >= 45,
    });
  }
  const trustMet = state.research.reputationInLab >= 30;
  const contentRequirementsMet = evaluateCondition(
    state.stats,
    state.flags,
    state.semesterIndex + 1,
    lab.requirements,
  );
  const unlocked =
    offered && trustMet && state.stats.knowledge >= 45 && contentRequirementsMet;
  const firstMissing = [
    ...requirements.filter((item) => !item.met).map((item) => item.text),
    ...(trustMet ? [] : [fmt(t(TEXT.requirementLabReputation), { n: 30 })]),
    ...(offered ? [] : [t(TEXT.requirementLabOffer)]),
  ][0];
  return (
    <article className={`research-lab-card${unlocked ? "" : " locked"}`}>
      <div className="research-card-head">
        <div>
          <h4>{t(lab.name)}</h4>
          <p className="research-card-subtitle">{t(lab.field)}</p>
        </div>
        <span className={`research-badge ${unlocked ? "good" : "warn"}`}>
          {unlocked ? t(TEXT.requirementsMet) : t(TEXT.requirementNotMet)}
        </span>
      </div>
      <p className="research-card-description">{t(lab.description)}</p>
      <LabDetails lab={lab} />
      <strong className="small muted">{t(TEXT.requirements)}</strong>
      <ul className="research-requirements">
        {requirements.map((requirement) => (
          <li
            className={`research-requirement${requirement.met ? " met" : ""}`}
            key={requirement.text}
          >
            {requirement.text}
          </li>
        ))}
        <li className={`research-requirement${trustMet ? " met" : ""}`}>
          {fmt(t(TEXT.requirementLabReputation), { n: 30 })}
        </li>
        <li className={`research-requirement${offered ? " met" : ""}`}>
          {t(TEXT.requirementLabOffer)}
        </li>
      </ul>
      <div className="research-card-actions">
        <button className="btn primary small" type="button" disabled={!unlocked} onClick={onJoin}>
          {t(TEXT.joinLab)}
        </button>
        {!unlocked && firstMissing && (
          <p className="research-lock-reason">
            {fmt(t(TEXT.lockedBecause), { reason: firstMissing })}
          </p>
        )}
      </div>
    </article>
  );
}

function ActiveProjectCard({
  project,
  phaseLabel,
  canWork,
  hasEnoughAp,
  hasQueuedEffort,
  isSelected,
  onSelect,
  onWork,
  onAbandon,
}: {
  project: ResearchProject;
  phaseLabel: string;
  canWork: boolean;
  hasEnoughAp: boolean;
  hasQueuedEffort: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onWork: () => void;
  onAbandon: () => void;
}) {
  const { t } = useLang();
  const inReview = project.phase === "submitted";
  return (
    <article className="research-project-card active">
      <div className="research-card-head">
        <h4>{t(project.title)}</h4>
        <div className="research-badge-stack">
          <span className="research-badge">{phaseLabel}</span>
          {isSelected && <span className="research-badge good">{t(TEXT.selectedProject)}</span>}
        </div>
      </div>
      <div>
        <div className="research-progress-labels">
          <span>{t(TEXT.projectProgress)}</span>
          <strong>{percent(project.progress)}</strong>
        </div>
        <div
          className="research-progress-track"
          role="progressbar"
          aria-label={t(TEXT.projectProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.max(0, Math.min(100, Math.round(project.progress)))}
        >
          <div className="research-progress-fill" style={{ width: percent(project.progress) }} />
        </div>
      </div>
      <ProjectNumbers project={project} />
      <p className="research-card-description">
        <strong>{t(TEXT.reviewClock)}: </strong>
        {inReview
          ? project.reviewRoundsLeft !== undefined
            ? fmt(t(TEXT.weeksRemaining), { n: project.reviewRoundsLeft })
            : t(TEXT.awaitingReview)
          : t(TEXT.projectAtRest)}
      </p>
      <div className="research-card-actions">
        {!isSelected && !inReview && (
          <button
            className="btn ghost small"
            type="button"
            disabled={hasQueuedEffort}
            onClick={onSelect}
          >
            {t(TEXT.selectProject)}
          </button>
        )}
        <button
          className="btn primary small"
          type="button"
          disabled={!canWork || inReview || !isSelected}
          onClick={onWork}
        >
          {t(TEXT.workOnProject)}
        </button>
        {!hasEnoughAp && !inReview && (
          <p className="research-lock-reason">
            {t(TEXT.requirementTwoAp)}
          </p>
        )}
        {!isSelected && hasEnoughAp && !inReview && !hasQueuedEffort && (
          <p className="research-lock-reason">{t(TEXT.requirementSelectProject)}</p>
        )}
        {project.stallWeeksRemaining > 0 && (
          <p className="research-lock-reason">
            {fmt(t(TEXT.projectStalled), { n: project.stallWeeksRemaining })}
          </p>
        )}
        {hasQueuedEffort && (
          <p className="research-lock-reason">{t(TEXT.queuedResearchEffort)}</p>
        )}
        <button
          className="btn link small"
          type="button"
          disabled={hasQueuedEffort}
          onClick={onAbandon}
        >
          {t(TEXT.abandonProject)}
        </button>
      </div>
    </article>
  );
}

function ProjectNumbers({ project }: { project: ResearchProject }) {
  const { t } = useLang();
  return (
    <div className="research-project-numbers">
      <div className="research-project-number"><span>{t(TEXT.projectQuality)}</span><strong>{Math.round(project.quality)}/100</strong></div>
      <div className="research-project-number"><span>{t(TEXT.projectRisk)}</span><strong>{Math.round(project.risk * 100)}%</strong></div>
      <div className="research-project-number"><span>{t(TEXT.projectPhase)}</span><strong>{fmt(t(TEXT.phaseWeekCount), { n: project.weeksInPhase })}</strong></div>
    </div>
  );
}

type ResearchActivityEffects = NonNullable<
  GameState["research"]["activity"][number]["effects"]
>;

function ResearchEffectList({ effects }: { effects: ResearchActivityEffects }) {
  const { t } = useLang();
  const systemLabels: Record<string, LocalizedText> = {
    progress: TEXT.effectProgress,
    quality: TEXT.effectQuality,
    researchPoints: TEXT.effectResearchPoints,
    reputationInLab: TEXT.effectLabReputation,
    stallWeeks: TEXT.effectStallWeeks,
    posters: TEXT.effectPosters,
  };
  const values = Object.entries(effects).filter(
    (entry): entry is [string, number] =>
      typeof entry[1] === "number" && entry[1] !== 0,
  );
  if (values.length === 0) return null;
  return (
    <ul
      className="chips chips-compact research-effect-list"
      aria-label={t(TEXT.changesThisResearchActivity)}
    >
      {values.map(([key, value]) => {
        const label =
          systemLabels[key] ??
          STAT_LABELS[key as keyof typeof STAT_LABELS];
        const isBad =
          key === "stallWeeks" ||
          (key === "stress" ? value > 0 : value < 0);
        return (
          <li
            className={`chip ${isBad ? "chip-bad" : "chip-good"}`}
            key={key}
          >
            <span className="chip-label">
              {label ? t(label) : t(TEXT.researchActivity)}
            </span>
            <span className="chip-val">
              {value > 0 ? "+" : ""}{value}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function describeRequirements(
  requirements: EventCondition,
  state: GameState,
  lang: "en" | "zh",
): Array<{ text: string; met: boolean }> {
  const output: Array<{ text: string; met: boolean }> = [];
  if (requirements.minSemester !== undefined) {
    output.push({
      text: fmt(TEXT.requirementSemester[lang], { n: requirements.minSemester }),
      met: state.semesterIndex + 1 >= requirements.minSemester,
    });
  }
  for (const [key, threshold] of Object.entries(requirements.minStats ?? {})) {
    const stat = key as keyof typeof STAT_LABELS;
    output.push({
      text: `${STAT_LABELS[stat][lang]} ≥ ${threshold}`,
      met: getStat(state.stats, stat) >= (threshold ?? 0),
    });
  }
  for (const flag of requirements.requiredFlags ?? []) {
    output.push({
      text: fmt(TEXT.requirementFlag[lang], { flag }),
      met: state.flags.includes(flag),
    });
  }
  return output;
}
