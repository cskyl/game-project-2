# V2 phase gate receipts

Each phase entry records only measured checks from the committed phase boundary.
Deferred gates are not counted as passes.

## P0 — deterministic foundation

**Status:** green on `v2/p0-rng` at commit `b95263f`.

- Landed: state-threaded seeded PRNG; seed entry/display; deterministic transition
  metadata and log ids; V2 state defaults; central modifier registry API; V1→V2
  migration with recoverable legacy key and bilingual notice; typed future-save
  refusal; content validator; 10-bot seeded harness; thin 481-line engine.
- **G3 PASS:** 1,200/1,200 primary runs completed across 10 bots, 40 seeds,
  and 3 difficulties; all traces stayed below the 20,000-step guard. Median was
  477 decisions; maximum was 594.
- **G10 PASS:** all 1,200 runs replayed from the same seed and exact input trace
  to a byte-identical final state (1,200/1,200).
- **G11 PASS:** strict TypeScript + Vite production build clean; no
  `Math.random`, `any`, or `@ts-ignore` in `src/game/`; `engine.ts` 481 lines;
  content validator checked 976 bilingual values and all current registries,
  with 0 errors and one documented seed/generated shadow warning.
- **G12 PASS:** representative V1 fixture preserved legacy stats, flags, event
  history, boss history, and logs while filling all V2 defaults; malformed and
  future-version saves were refused without overwrite.
- Sweep diagnostics (not P0 gates): 91/95 events covered (95.8%); six V1 endings
  reached; `careerReadiness` mean 90.4, SD 10.5, max 100; largest ending 41.2%;
  exploiter action share 100%. These measured failures are P1/P6 tuning inputs,
  not deferred work mislabeled as green.
- Deferred by frozen phase plan: G1/G2 to P1; G9 to P2; G5 to P3; G7/G8 to
  P6; G6/full G1 to P7; G4 to P9.

## P1 — specialization-aware balance core

**Status:** green on `v2/p1-balance`.

- Landed: exact §4.2 soft caps after difficulty scaling; visible stage-aware
  skill drift; 7/6/5 AP curve with semester-4/8 milestones and low-stamina
  penalty; bounded monotonic boss ramp; explicit authored training-block
  opportunity costs; priority restructure and the complete 24-ending
  bilingual roster.
- Foundation assertions passed for modifier composition, every soft-cap band,
  the +1 gain floor, unchanged negative/resource effects, drift stage/floor/gain
  suppression, every AP boundary, and the boss-ramp start/monotonicity/cap
  invariants.
- **G1 interim PASS (strict interpretation):** 10 distinct endings reached in
  1,200 runs; the largest share was `steady_hands`, 230/1,200 = **19.2%**, below
  the full gate's 25% ceiling. The remaining distribution was default 16.1%,
  operator 12.3%, burnout 11.1%, patient-centered 9.9%, research 9.0%,
  community 8.7%, loved 7.8%, balanced 5.1%, and teacher 0.8%.
- **G2 PASS:** graduation `careerReadiness` mean **71.945** (required 62–78),
  population SD **11.644** (required ≥8), and maximum **93** (required <95).
  The maximum run was hands-max/easy/seed `3532674298`, with CR components
  69/100/99/96/100.
- **G11 PASS:** strict TypeScript + Vite build clean; validator checked 1,026
  bilingual values and current registries with **0 errors**. Its 15 warnings are
  explicit later-phase producers (P6 health/finance, P7 Match) plus the
  documented generated-event shadow.
- Stability receipts: all 1,200 primaries terminated under the 20,000-step
  guard and all 1,200 exact input replays produced byte-identical final states.
  Event coverage was 94/95 (98.9%); median trace length was 440 decisions.
- Deferred by the frozen phase plan: P1 requires 10 endings, while the full
  ≥14-ending G1 waits for P7 career systems; G8 remains P6 despite the measured
  min-max dominant-action diagnostic; the final unreachable-event requirement
  remains P9 content-fill work.

## P2 — twelve-term calendar and consequential breaks

**Status:** green on `v2/p2-calendar`.

- Landed: **12 semesters × 5 planning weeks**, explicit semester-open decisions,
  seeded three-offer elective drafts from the 14-item bilingual registry, and
  three break chapters after semesters 2/5/8 with exactly three player actions
  each. New bilingual semester-open and break UIs expose term focus, requirements,
  modifier effects, break payoffs/costs, and turn progress; P8's modifier layer
  has an honest standard-term fallback rather than invented content.
- Calendar invariants passed in every run: all 60 unique semester/week pairs,
  12 valid and duplicate-free three-offer drafts, one selected elective per
  semester, and one valid track plus exactly three actions in each of the three
  breaks. Invalid/unoffered electives and invalid/unavailable break inputs were
  strict no-ops. A selected elective was also verified to activate its central
  registry hook after test isolation reset.
- **G3 PASS:** 1,200/1,200 primary runs completed across 10 bots, 40 seeds, and
  three difficulties under the 20,000-step guard; the longest trace was 910
  player decisions.
- **G9 interim PASS:** median run length was **629.5 decisions** (required ≥250
  for P2; the final gate is ≥350).
- **G10 PASS:** all 1,200 exact input replays produced byte-identical final
  states (1,200/1,200), including elective drafts and break transitions.
- Preserved P1 gates stayed green after the longer calendar: 10 endings were
  reached; the largest was `operator_owner`, **259/1,200 = 21.58%** (≤25%).
  Graduation `careerReadiness` mean was **73.403**, population SD **10.907**,
  and maximum **93**. The maximum run was hands-max/easy/seed `3214545082`.
- **G11/G12 PASS:** strict TypeScript + Vite production build was clean; the
  content validator checked 1,187 bilingual values with 0 errors (15 explicit
  later-phase/shadow warnings); V1 migration and future/malformed refusal
  fixtures passed. Static render smoke produced all 12 screens in both EN and
  ZH, including both new P2 screens.
- Sweep diagnostics beyond P2's gate: event coverage was 92/95 (96.8%); the
  min-max action-share failure remains correctly deferred to P6/G8. Full
  ≥14-ending G1 remains P7 work, and final content coverage remains P9 work.

## P3 — parallel research career

**Status:** green on `v2/p3-research`.

- Landed the complete research loop: four labs, ten bilingual project
  templates, 24 authored setbacks/lucky breaks, 1-AP recruitment, 2-AP lab
  work, phase-by-phase progress and quality, seeded project risk, visible
  stalls, 2–4-week peer review, revision/rejection/resubmission, posters,
  first-author publications, lab trust, and Reyes-letter payoff. Seeded
  rolls and authored outcomes are recorded in attributed dashboard activity;
  P2's Summer Research break now advances the selected project through this
  same phase/submission/poster pipeline rather than acting as a disconnected stat bump.
- The bilingual dashboard exposes recruitment requirements and locked reasons,
  lab identity/intensity/prestige, project phase/progress/quality/risk/review
  clock, active-project selection, publication/poster output, and an
  expandable arithmetic breakdown for quality/risk/review rolls. Static render
  smoke exercised both recruitment and active/review states in EN and ZH.
- **G5 PASS:** over 1,200 runs, the research-focused bot earned at least one
  accepted publication in **120/120 = 100.0%** of runs (required ≥60%);
  balanced earned one in **0/120 = 0.0%** (required ≤20%); clinical-only earned
  one in **0/240 = 0.0%** (required ≤5%). Focused runs produced 1–2 papers
  (116 produced two; 4 produced one); poster counts were also 1–2
  (119 produced two; 1 produced one), with mean **1.992**, within the authored
  output target.
- Opportunity cost stayed visible: focused mean `clinicalRecord` was **54.40**
  versus clinical-only **95.26** (−40.86). No run reached 3+ publications, so
  the explicit 3+-paper clinical-cost assertion had no violating run.
- Earlier gates remained green: **G1 interim** 10 endings, maximum
  `operator_owner` **23.9%**; **G2** `careerReadiness` mean **74.346**, population
  SD **10.921**, max **93**; **G3** 1,200/1,200 runs terminated; **G9 interim**
  median **662.5** decisions; **G10** all 1,200 exact input replays were
  byte-identical; **G12** migration fixtures passed.
- **G11 PASS:** strict TypeScript + Vite build clean; validator checked 1,375
  bilingual values and the research reference graph with 0 errors (15 declared
  later-phase/shadow warnings); `engine.ts` remained a 593-line orchestrator; render
  smoke produced all 14 states in both languages.
- Deferred by the frozen phase plan: patient/sim-lab clinical records are P4;
  G8 action-share tuning is P6; the full ≥14-ending G1 and Match are P7; final
  ≥90% authored-event coverage is P9. The P3 harness nevertheless reports
  generic and research-event coverage separately for later content tuning
  (17/24 authored research events fired in the final full P3 sweep).
