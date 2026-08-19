# Dental School Life Sim V2 — implementation decisions

This file records choices where `DESIGN_V2.md` intentionally leaves an
implementation detail open. The frozen design remains authoritative.

## 2026-08-12 — P0 foundation

- **Node path on this SCC login node.** The prompt's
  `/share/pkg.8/nodejs/20.12.2/ins.0/install/bin` path does not exist here. The
  verified installation is `/share/pkg.8/nodejs/20.12.2/install/bin` (Node
  20.12.2, npm 10.5.0). All phase receipts use the verified path.
- **V2 stat storage.** `focus` and `standing` live in `state.stats`, alongside
  the existing stats, so data-defined effects, conditions, and modifier hooks
  have one generic path. `debt` remains a top-level state value because its
  0–400 range and finance accrual do not use the ordinary 0–100 stat clamp.
  No value is duplicated as an alias.
- **P0 sweep size.** "At least 40 runs per strategy across all difficulties" is
  implemented conservatively as 40 seeds for each of 10 strategies on each of
  3 difficulties (1,200 primary runs), plus identical replays for G10.
- **Phase-gated assertions.** The harness registers all G1–G12 from the start,
  but only activates gates whose systems exist in the current phase. A deferred
  gate is reported with its target phase and cannot be mistaken for a pass.
- **Deterministic run metadata.** Gameplay state uses deterministic transition
  metadata rather than wall-clock writes. Real save time, if needed by the UI,
  belongs to the storage envelope and is not allowed to perturb G10.
- **Deterministic calendar epoch.** Every run begins at the same fixed epoch;
  only the transition counter advances gameplay timestamps. The seed controls
  gameplay randomness, not calendar metadata.
- **Modifier composition.** Same-target action multipliers multiply, additions
  sum, and the result rounds once. Broad hooks affect positive gains only;
  stat-specific hooks may intentionally alter signed costs or penalties. NPC
  modifier sources are their authored flag ids, independent of roster owner.
- **Run deck authority.** A fresh V2 run starts with all current V1 card ids so
  P0 preserves play, while weekly draws already filter through `runDeck` for
  later deck-building additions and removals.
- **V1 save preservation.** V2 writes to a new save key, reads the V1 key as a
  migration fallback, and leaves the original V1 payload recoverable. Future
  save versions are refused with a bilingual message instead of being cast or
  discarded.
- **Save validation is fail-closed.** Only exact V1 (`1.0.0`) payloads enter the
  migration path. Current V2 payloads must pass a complete runtime shape check;
  missing, malformed, unsupported-old, and future versions never reach the
  engine. Valid legacy values are preserved, invalid snapshots are sanitized,
  and unknown legacy keys remain recoverable in the migrated object.
- **Modifier composition.** Multipliers compose as a product and additions as a
  sum against the original delta, with one final rounding step. Broad action
  hooks affect positive gains only; a hook must name a stat explicitly to alter
  a cost or penalty. This makes modifier order irrelevant.
- **CI boundary.** The Pages build runs the content validator, migration
  fixtures, and quick deterministic sweep before the production build. The full
  1,200-run balance sweep remains the required local phase receipt.

## 2026-08-12 — P1 balance core

- **Boss difficulty ramp.** `DESIGN_V2.md` requires a boss ramp but leaves its
  formula open. Boss breakdown data now includes a named deterministic
  `semesterRamp = -min(8, 0.75 * (semesterId - 1))`. It starts at zero, reaches
  only -7.5 by the current semester 11 finale (and caps at -8), so later checks
  tighten gradually without outweighing a core stat, wellness, or the seeded
  boss roll. Keeping it as a named breakdown term enables the full player-facing
  roll breakdown scheduled for P10; P1's existing boss panel still shows only
  the aggregate preview.
- **Soft-cap integer rounding.** The design fixes each multiplier and requires a
  minimum actual gain of +1, but does not name the integer rounding rule.
  Diminished positive gains use `max(1, floor(scaledDelta * multiplier))`.
  Flooring makes each band an actual reduction instead of allowing half-point
  rounding to repeatedly inflate multi-action weeks; negative effects remain
  unchanged, exactly as required by §4.2.
  **Superseded 2026-08-13 — see the post-review corrections below.** The rule
  was implemented exactly as §4.2 specified it; §4.2 itself was wrong.
- **Dynamic weakest-skill action.** Repeating `ask_help` previously farmed its
  +4 weakest-skill branch several times in one week, allowing a nominally broad
  action to raise all three drift skills while bypassing their opportunity
  cost. It now grants +3 to the weakest core skill with no actual positive gain
  yet that week; after each core skill has gained, further uses retain the
  authored social/resource effects but grant no more skill. This uses the
  authoritative `weekGains` ledger and keeps the effect visible in the ordinary
  action pipeline.
- **Good-mood threshold reward.** The existing mood ≥70 weekly +1 previously
  targeted `confidence`, a soft-capped career skill. Because every +1 must stay
  +1 under §4.2, this passively added 22 confidence in the measured max-CR run.
  It now restores +1 `focus`, the resource stat for mental sharpness. The same
  visible threshold remains beneficial without silently saturating a career
  skill.
- **Action block costs and tuning.** The inherited one-AP training buttons let
  the broad and chaos bots buy too many positive skill deltas before the exact
  +1 floor could matter. P1 therefore makes the authored training blocks
  (`review_lecture`, `deep_study`, `sim_lab`, `quick_drill`, `clinic_prep`,
  `patient_comm`, and `research`) cost 3 AP, while recovery remains 2 AP and
  social support remains 1–2 AP. This is an explicit, visible opportunity cost
  in the action data, not a hidden post-effect penalty. The small positive
  payloads were also tuned down modestly, and `patient_comm` now records its
  honest concentration cost (stress +2, mood −1). The resulting sweep remains
  playable and keeps specialization meaningful without changing the §4.2
  positive-gain floor.
- **Interim ending specialization.** Before the P3–P7 systems can provide
  publications, case logs, finance outcomes, and Match flags, P1 build endings
  use explicit specialization gaps as well as minimums. For example, the
  researcher build caps `clinicalRecord`, steady hands caps knowledge, and the
  patient-centered build caps research and public impact. This prevents the
  generic all-high build from swallowing specialist identities and keeps
  `balanced_dentist` a real fallback. Re-evaluate these interim gap thresholds
  against the richer system records when P7 activates the career endings.
- **Health-crisis producer boundary.** Existing crisis-tagged events are broad
  burnout warnings and recovery opportunities; none honestly represents the
  distinct health crisis named by the priority-95 ending. The `health_crisis`
  flag therefore remains a declared P6 producer for a forced illness/injury
  outcome rather than being attached retroactively to a generic wellness event.

## 2026-08-12 — P2 content contracts

- **Semester-12 transition boss.** §5.11 says the semester-12 boss is replaced
  by the Match decision screen, while P2 still needs one boss per semester for
  a playable, validated calendar. P2 therefore adds a gentle graduation
  capstone review as a temporary semester-12 boss. P7 must replace that boss
  resolution with Match while preserving the capstone text as an optional
  graduation interstitial; it is not intended to compete with Match scoring.
- **Break action granularity.** Each break track exposes exactly three
  repeatable, meaningful action payloads. The engine may take one action per
  turn for three turns; the data does not prescribe an order, so players can
  pursue a coherent track rather than solve a hidden mini-puzzle.
- **Break availability.** The four ordinary break tracks are available after
  semesters 2, 5, and 8 as §3.3 specifies. Only Board Prep Camp is restricted
  to the break after semester 8 (immediately before semester 9).
- **Elective availability.** The frozen design does not specify a minimum
  offer-pool size or early-semester introductory electives. Research selective
  and teaching assistantship are therefore available from D1 Autumn (with
  gentle, low-stakes hooks), ensuring every semester can draw three distinct
  eligible offers without silently falling back to ineligible content.
- **Registry reset seam.** Elective hooks register at module load and expose
  `registerElectiveModifiers()` so deterministic harnesses that reset the
  central registry can restore data-defined hooks without duplicating engine
  conditionals.
- **Break system handoff.** The externship's case-log entry payoff is reserved
  for the P4 case system; P2 applies its clinical/public-impact payload and
  keeps the player-facing copy honest until P4 can append a real case-log
  record. Rest data marks `clearsSleepDebtOnCompletion`; the P2 calendar owns
  applying that resource reset when the break system is wired end to end.
- **Sixty-week balance carry-forward.** Moving from the inherited 44-week run
  to the frozen 60-week calendar exposed `ask_help` as a two-AP hybrid training
  action: it could raise an untrained core skill while also adding mood and
  reputation, undercutting the visible three-AP training blocks over sixteen
  additional weeks. Its cost is now three AP. The effect, weekly eligibility,
  and the §4.2 positive-gain floor are unchanged.
- **Work-break tradeoff.** A three-turn Work and Save chapter now pays
  14/12/6 money, with one point of hand skill on the assisting shift, while
  each turn applies the advertised `knowledge: -2` drift. This remains a large
  immediate financial fork without making two work breaks simultaneously fund
  the whole run and preserve a generalist maximum-readiness build.
- **Interim operator threshold.** Until P6 introduces debt, interest, rent, and
  real income hooks, ordinary V1 event flows leave graduation money clustered
  near the current 200 cap. The interim `operator_owner` build ending therefore
  requires 190 money rather than 150. P6 must retune this against debt and work
  outcomes; this is not the P7 Match gate for private practice.
- **Forward UI seams.** P2 shows an honest standard-term fallback because P8
  has not yet authored semester modifiers; P8 owns replacing the count-only
  active state with each modifier's bilingual name, explanation, and hook
  effects in the persistent strip. P10 still owns the frozen single-column
  mobile sticky AP/stat header. P2 does implement the functional §8.3 stat
  threshold ticks and fully localizes every current modifier-hook description.

## 2026-08-12 — P3 research content contracts

- **Four-lab topology.** The frozen design names Reyes as the research-access
  NPC but does not prescribe four additional PI characters. The four P3 labs
  are therefore distinct groups inside Reyes's interdisciplinary collaborative:
  biomaterials, clinical outcomes, community oral health, and digital dentistry.
  This keeps every `piNpcId` linked to the frozen P5 roster while giving each lab
  its own intensity, prestige, entry profile, and concrete project slate.
- **Research event boundary.** The 24 authored setback/lucky events live in the
  research registry rather than the generic 95-event pool. They are referenced
  explicitly by project templates and filtered by project phase, so a research
  roll cannot suppress an unrelated life event unless the research system
  actually selects it. The schema has no choice array; P3 therefore authors
  setbacks as visible, bounded project mutations rather than pretending the
  player can choose away contamination, missing follow-up, or peer review.
- **Failing honestly still builds skill.** Several setbacks pair lost progress
  or quality with a small research/knowledge/empathy gain. This is deliberate
  failing-forward, not a cancellation of the cost: the project clock and mood or
  stress still show what happened, while careful error detection remains worth
  learning from.
- **Phase duration records.** Every project supplies all eleven `ProjectPhase`
  keys. Active phases have positive expected weeks; accepted, rejected, and
  abandoned are terminal and therefore use zero. Quality-driver weights are
  unique per stat and sum to exactly one, which the content validator now
  enforces alongside exact roster counts and orphan-free event producers.
- **Recruitment seam before P5.** P3 records the lab invitation as a bilingual,
  visible research-dashboard activity once `reputationInLab >= 30` and
  `knowledge >= 45`; the eligible lab list also applies each lab's authored
  requirements. P5 owns presenting that same invitation through Reyes's NPC arc
  without changing these thresholds or duplicating the source of truth.
- **Research action conversion.** `research_interest` costs 1 AP and grants 8
  lab-reputation points. `lab_work` costs 2 AP and queues
  `clamp((100 / expectedPhaseWeeks) * (0.55 + research/200 + focus/400 +
  reputationInLab/400), 8, 55)` progress for the active project. Queued work is
  consumed by the authoritative research tick after drift; every joined lab
  also applies its visible 1–3 weekly stress commitment.
- **Research-dashboard verb boundary.** Ordinary actions, cards, and week-end
  resolution are planning-screen verbs; `research_interest` and `lab_work` are
  dashboard verbs. Both the selectors/status display and engine enforce the
  same finite-state boundary. Queued project effort locks starting, selecting,
  abandoning, and resubmitting until the weekly research tick consumes it, so
  work cannot be reassigned after the AP has been spent.
- **Project identity rather than an arbitrary cap.** The frozen design does not
  prescribe a maximum active or completed project count, so P3 adds no hidden
  max-two rule. Each of the ten authored templates can be started only once,
  preventing duplicate-template publication farming while allowing the player
  to choose how many distinct questions to carry.
- **Risk, stalls, and review clocks.** Project risk and reviewer draws consume
  only the state-threaded RNG. Authored stalls decrement before new risks fire,
  so a two-week stall blocks exactly the next two planning weeks. Initial and
  resubmission review clocks are seeded draws of 2–4 weeks; rejection remains
  recoverable by moving down one venue with an explicit eight-point quality
  cost.
- **Active-project risk scope.** Authored weekly risk belongs only to the
  selected project. Parked projects do not generate parallel setbacks; a
  selected submission may still draw a submission/reviewer-authored event while
  its ordinary 2–4 week review clock runs. This prevents a player from starting
  every template to manufacture ten independent weekly lotteries while keeping
  the frozen submitted-phase event producers live.
- **Summer Research pipeline.** Every valid action in the `summer_research`
  break adds 4 visible lab-reputation points; before joining, crossing the same
  30-reputation plus 45-knowledge threshold exposes the ordinary lab offers.
  With a selected, unstalled working project, it additionally adds 38 visible
  progress and uses the ordinary phase/quality transition function. Invalid or
  merely prefix-matching action ids are strict no-ops. The ordinary break stat
  payload still applies, so the three-turn fork remains a real full-time
  research block and can carry a manuscript into submission.
- **IRB repeat semantics.** The authored IRB clarification sets `repeatPhase`:
  both phase progress and `weeksInPhase` reset to zero. It does not rewind the
  project to an earlier phase, and its visible quality/knowledge gains remain;
  rework is costly without pretending careful clarification taught nothing.
- **Poster/publication distinction.** A non-poster project's first submission
  earns one explicitly logged poster presentation; resubmission cannot duplicate
  it. A poster-only venue earns its poster on acceptance. The visible poster
  ledger is capped at two per run, and only a real ledger increase emits a
  poster effect; later submissions do not invent a third presentation. Regional,
  specialty, and top acceptances additionally create a first-author publication
  and grant `reyes_letter`. This makes the focused 1–2 publication / 1–2 poster
  tuning target measurable without treating a poster as a journal paper or
  imposing an undocumented project-count cap. If a poster-only project resolves
  after both slots are used, its visible outcome is truthfully labeled an
  internal lab presentation and grants no poster, publication, or letter.
- **Research-output compatibility seam.** P3 payoffs still raise the existing
  `research` stat used by the P0 condition evaluator, while canonical
  publications and posters live in `ResearchState`. P7's Match implementation
  must compute its weighted research-output term from those canonical ledgers
  (and future grants), not infer counts back from the research stat.

## 2026-08-13 — post-review corrections (main agent)

Findings from an independent review of the P0–P3 work, with the full 1,200-run
sweep reproduced locally first. Every phase receipt in `PHASE_REPORTS.md` was
confirmed accurate before any change was made.

- **The §4.2 positive-gain floor was a design defect, not an implementation
  one.** `max(1, floor(delta * multiplier))` guaranteed a whole point on every
  positive touch, so for the 147 of 218 authored positive deltas that are ≤5
  (67.4%) the 0.5 / 0.3 / 0.15 bands all collapsed to the same +1: a delta of 3
  delivered exactly one point at 75, 85 and 95 alike. §4.2 now specifies a
  banked fractional remainder (`GameState.softCapCarry`, per stat, in `[0, 1)`),
  so each band is applied exactly over repeated touches while gains still never
  stop. The harness asserts the bands are *strictly* ordered over ten repeated
  touches, which the old floor fails.
- **Saturation is a content problem once the formula is right.** Attributing
  every positive `confidence` delta across full runs showed ~33 grants per run
  arriving entirely from cards (48 touches / 3 runs), events (31) and bosses
  (20) — none of them a player choice. The stat therefore climbs through the
  cheap low bands and pins at 100 regardless of the top band, so no additional
  band was invented to paper over it. G13 measures per-stat saturation and
  records `confidence` as explicit debt owned by P9 content tuning.
- **G13 ratchets in both directions.** A newly saturating stat fails the gate,
  and a listed stat that stops saturating also fails, forcing its entry to be
  deleted. The debt list can only shrink, and it is printed on every sweep.
- **G14 is measured per bot, not pooled.** G1 bounds the ending distribution
  across all bots together and passed at 23.1% while `hands-max` reached
  `steady_hands` in 120 of 120 runs. Pooled variety cannot answer the
  replayability question, so per-bot concentration is now reported every sweep
  and gated at 60% from P8, which owns run variance.
- **Week lifecycle extracted before P4, not at the 600-line cap.** `engine.ts`
  stood at 593 of its 600-line budget with nine phases of systems still to
  land. `systems/week.ts`, `systems/boss.ts` and `systems/achievements.ts` now
  own the week, the semester check, and awards; the calendar owns the
  `currentSemester` / `currentSemesterId` / `isFinalSemester` cursors; and
  `engine.ts` is a 239-line facade of run creation, player verbs, and
  re-exports. The refactor is behaviour-preserving: the full sweep reproduces
  every pre-refactor figure exactly, including the ending distribution, CR
  mean/SD/max, median decisions, and 1,200/1,200 byte-identical replays.
- **Save cursors are range-validated, not merely finite.** `isV2State` accepted
  any finite `semesterIndex`, so a stored `semesterIndex: 999` loaded and then
  threw the first time a screen read `SEMESTERS[semesterIndex]`. Both cursors
  are now range-checked, and `migrateV1` clamps them because its result is
  returned without passing through the strict validator. Found by the codex
  adversarial pass.
- **`softCapCarry` hydrates rather than bumping the save version.** A save
  written before the ledger has no banked fractions, which is exactly an empty
  ledger — a zero default, not a guess. This follows the existing in-development
  V2 hydration path used for the P1/P2/P3 fields. A structurally invalid ledger
  (out of `[0, 1)`, or keyed by a non-stat) is still refused.

## 2026-08-19 — CI portability

- **Harness bundles must not use absolute machine paths.** The npm scripts wrote
  their esbuild output to `/scratch/$USER/dsls-v2`, which exists on the SCC
  login node and nowhere else. The first push to `main` that actually exercised
  them failed in 19s on `mkdir: cannot create directory '/scratch'`. They now
  write to `node_modules/.cache/dsls-v2`: always writable, already ignored, and
  identical on a workstation, an HPC login node, and a CI runner. Local runs are
  unaffected. The earlier "CI boundary" note above described intent that had
  never actually executed — CI had only ever built V1, which has no harness.
- **`esbuild` is now a declared devDependency.** Every harness script invokes it,
  but it was only present as a hoisted transitive dependency of Vite. That works
  today and would break silently the day Vite changes how it vendors esbuild,
  taking the whole test suite with it.
