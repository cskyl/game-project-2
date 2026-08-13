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
