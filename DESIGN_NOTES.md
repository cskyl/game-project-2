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
