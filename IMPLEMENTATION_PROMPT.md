# Implementation prompt

Paste everything below the line.

---

Implement **V2 of the Dental School Life Sim**, a bilingual (EN + 中文) browser
life sim about getting through dental school. The design is frozen; build it.

**Repo:** `/projectnb/ivc-ml/tianle/audio_mllm/game-project-2`
(`github.com/cskyl/game-project-2`, default branch `main`, live at
https://cskyl.github.io/game-project-2/). v1 ships and works — extend it, don't
rewrite it.

**Read `DESIGN_V2.md` in the repo root, in full, before writing any code.** It is
the single source of truth and contains everything: the v1 defect diagnosis (§1),
the balance model (§4), all 12 systems with their state and data schemas (§5),
the randomness/replayability architecture (§6), content targets (§7), UI spec
(§8), module map and modifier registry (§9), the 12 measurable acceptance gates
(§10), and the P0–P11 phase plan (§11). If this prompt and `DESIGN_V2.md`
disagree, the doc wins.

**Environment** (BU SCC login node — node is not on the default PATH):

```bash
export PATH=/share/pkg.8/nodejs/20.12.2/install/bin:/share/pkg.8/gh/2.47.0/install/bin:$PATH
cd /projectnb/ivc-ml/tianle/audio_mllm/game-project-2 && npm install
npm run build     # tsc + vite — must stay clean
npx esbuild scripts/smoke.mts --bundle --platform=node --format=esm --outfile=scripts/smoke.bundle.mjs && node scripts/smoke.bundle.mjs
```

No GPU, no qsub — this is pure local Node/TypeScript. Temp files go in the
scratch dir, not the repo.

**Work through §11's phases in order, P0 → P11.** P0 (seeded RNG, modifier
registry, state shape, save migration, upgraded smoke harness) and P1 (soft caps,
skill drift, AP curve, boss ramp, ending priority restructure) are load-bearing —
do not reorder them, and do not author bulk content before P1's gate is green.

**A phase is done when:** `npm run build` is clean; the seeded sweep passes that
phase's gates from §10 **as assertions in the harness**, not manual checks; the
content validator is clean; and the work is committed on a feature branch. Run
the sweep after every phase, not just at the end.

**Hard constraints** (full list in §0 — these are not negotiable):
bilingual `LocalizedText` everywhere with Chinese as co-primary; static site, no
backend or network calls; content data-driven under `src/data/` only;
`src/data/personalization.ts` and the `{partner}` token stay swappable and the
tone stays warm; no `any` in `src/game/`; `engine.ts` stays under ~600 lines with
systems in `src/game/systems/*`; all 60+ content modifiers go through the single
registry in §9.3.

**Git:** feature branches (`v2/p0-rng`, …), never commit to `main`, never
force-push. Commits end with
`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. **Do not push `main` or
deploy without explicit approval** — pushing `main` republishes the live site.
Open a PR and report it.

**Judgment:** keep the game playable at every commit; match v1's existing style
and voice; when the design is silent on a detail, decide like a careful game
designer, log it in `DESIGN_NOTES.md`, and keep moving. Stop and ask only for a
real contradiction in the design, an unachievable gate, or anything that would
break a §0 constraint. Report per phase: what landed, which gates passed with
what numbers, what you deferred and why.

Correctness and the gates come first; the §7 content volume is the target after
that. Start with P0.
