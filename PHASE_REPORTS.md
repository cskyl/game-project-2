# V2 phase gate receipts

Each phase entry records only measured checks from the committed phase boundary.
Deferred gates are not counted as passes.

## P0 — deterministic foundation

**Status:** green on `v2/p0-rng` (commit pending final review).

- Landed: state-threaded seeded PRNG; seed entry/display; deterministic transition
  metadata and log ids; V2 state defaults; central modifier registry API; V1→V2
  migration with recoverable legacy key and bilingual notice; typed future-save
  refusal; content validator; 10-bot seeded harness; thin 473-line engine.
- **G3 PASS:** 1,200/1,200 primary runs completed across 10 bots, 40 seeds,
  and 3 difficulties; all traces stayed below the 20,000-step guard. Median was
  477 decisions; maximum was 594.
- **G10 PASS:** all 1,200 runs replayed from the same seed and exact input trace
  to a byte-identical final state (1,200/1,200).
- **G11 PASS:** strict TypeScript + Vite production build clean; no
  `Math.random`, `any`, or `@ts-ignore` in `src/game/`; `engine.ts` 473 lines;
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
