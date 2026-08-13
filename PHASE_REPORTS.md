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
