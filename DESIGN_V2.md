# Dental School Life Sim — V2 Design Bible

**Status:** design frozen for implementation. This document is the single source
of truth for the V2 build. An implementing agent should be able to build the
entire game from this document plus the existing v1 codebase.

**Scope of V2:** turn a ~25-minute clicker into a **2–4 hour, systems-rich,
highly replayable life sim** with a real research career, real clinical
decision-making, run-to-run variance, and meta-progression across runs.

---

## Table of contents

0. [Non-negotiables](#0-non-negotiables)
1. [Current state audit (v1)](#1-current-state-audit-v1)
2. [Design goals and target experience](#2-design-goals-and-target-experience)
3. [Core loop v2](#3-core-loop-v2)
4. [Stat, economy and progression model](#4-stat-economy-and-progression-model)
5. [Systems](#5-systems)
   - 5.1 Research system
   - 5.2 Patient case system
   - 5.3 Sim-lab practical system
   - 5.4 NPC relationship system
   - 5.5 Finance system
   - 5.6 Perk system
   - 5.7 Equipment system
   - 5.8 Wellness and body system
   - 5.9 Rotation and elective system
   - 5.10 Leadership and community system
   - 5.11 Boards and the Match
   - 5.12 Class standing and reputation
6. [Randomness and replayability architecture](#6-randomness-and-replayability-architecture)
7. [Content plan](#7-content-plan)
8. [UI/UX and visual spec](#8-uiux-and-visual-spec)
9. [Technical architecture](#9-technical-architecture)
10. [Balance targets and acceptance gates](#10-balance-targets-and-acceptance-gates)
11. [Phase plan](#11-phase-plan)
12. [Risks and non-goals](#12-risks-and-non-goals)

---

## 0. Non-negotiables

These constraints are inherited from v1 and must not be broken.

1. **Bilingual, always.** Every player-facing string is a `LocalizedText`
   (`{ en: string; zh: string }`). No exceptions, including new systems, tooltips,
   error states, and achievement names. Chinese is not a translation afterthought
   — it is co-primary and must read naturally, not machine-translated.
2. **Static site, no backend.** Vite + React 18 + TypeScript + plain CSS. No
   server, no login, no external asset host, no analytics. Deploys to GitHub
   Pages from `dist/`.
3. **Data-driven content.** Adding events, cases, cards, NPCs, projects, or
   endings must require editing `src/data/*` only — never the engine.
4. **Personalization respected.** `src/data/personalization.ts` retargets the
   game to a different person. The `{partner}` token is replaced at render time.
   Relationship content stays warm, funny, and supportive — never possessive,
   never guilt-tripping. School flavor (OSU / Postle Hall) stays swappable.
5. **Tone.** Affectionate, funny, honest about how hard dental school is. No
   ending is a punishment; burnout endings are framed as a warning and a care
   message, never a failure screen.
6. **Not a medical authority.** Clinical content should be *plausible and
   educational*, but the game keeps its existing disclaimer: a fictionalized game,
   not a curriculum or a clinical reference.
7. **Type-safe.** `npm run build` runs `tsc` first. No `any` in new engine code,
   no `@ts-ignore` to get past the gate.

---

## 1. Current state audit (v1)

Measured, not guessed. Baseline commit `29475e3`, smoke sweep = 10 playthroughs
across 4 strategies.

**Content:** 95 events, 12 life cards, 8 endings, 14 actions, 11 bosses,
11 semesters × 4 weeks = 44 weeks. Build clean, smoke green.

**Two structural defects:**

1. **Ending priority inversion.** `balanced_dentist` (priority 80, thresholds
   60/60/60/60/mood 50) outranks every specialist ending — `academic_research`
   (72), `community_care` (71), `patient_centered` (70), `steady_hands` (69).
   Any competent build clears the generic bar first, so specialist endings are
   dead content. **Only 3 of 8 endings were reachable.** The generic ending must
   be the fallback, not the winner.

2. **No opportunity cost.** Each core stat rises linearly to its own cap of 100,
   so "a bit of everything" strictly dominates. `careerReadiness` (mean of five
   core stats) saturated at **100** for balanced and community strategies. There
   is no reason to specialize and no late-game pressure.

**Three softer problems:**

3. **Shallow verbs.** Every week is "spend 6 AP on stat-increment buttons." The
   only decision texture comes from random events the player did not choose.
4. **No run-to-run variance.** Same 11 semesters, same bosses, same order, same
   action list, every run. Randomness is confined to which events roll.
5. **`Math.random()` everywhere.** Runs are not reproducible, so balance cannot
   be measured reliably and seeds cannot be shared.

V2 addresses all five.

---

## 2. Design goals and target experience

### 2.1 Session math

| quantity | v1 | v2 target |
| --- | --- | --- |
| weeks per run | 44 | 62 (12 semesters + 3 break chapters) |
| meaningful decisions per week | ~3 (AP spends) | 6–10 (AP, cards, case/lab steps, project moves, elective picks) |
| median run length | ~25 min | **2.5–4 h** |
| runs before content exhaustion | ~2 | 8–12 |

Session length comes from **decision density and system interaction**, not from
padding: no longer weeks, no grind walls, no artificial timers.

### 2.2 The experience we are aiming for

- **Every week is a real tradeoff.** AP is scarce; soft caps mean you cannot
  have everything; drift means you cannot bank a stat and forget it.
- **Two careers running in parallel.** Clinical competence and a research
  career, each with its own pipeline, each competing for the same hours. This is
  the central tension of the game.
- **Randomness that changes strategy, not just numbers.** Your archetype, your
  NPC roster, your semester modifiers, and your elective offers differ every run,
  so the *plan* changes, not just the dice.
- **Legible systems.** The player can always see why something happened. Every
  roll shows its breakdown. No hidden math.
- **Warmth under the systems.** It is still a game about a person you love
  getting through dental school. The systems must never crowd out the voice.

---

## 3. Core loop v2

### 3.1 Time structure

```
Run
└── 12 Semesters (D1 Autumn … D4 Spring + Graduation)
    ├── Semester open:  modifier reveal → elective/rotation draft → goals
    ├── 5 Weeks
    │   ├── Planning     — spend AP on actions (7–9 AP)
    │   ├── Cards        — draw 3 from run deck, play up to 2
    │   ├── Systems tick — research project moves, case or sim-lab may fire
    │   ├── Event        — one weighted random event
    │   └── Weekly summary — deltas, warnings, drift, log
    └── Semester close: boss check → results → perk point → interstitial
└── 3 Break chapters (after semesters 2, 5, 8) — distinct rules, see §3.3
└── Finale: Boards → Match → Ending
```

12 semesters × 5 weeks = 60 weeks, plus 3 break chapters ≈ 62 turns of play.

### 3.2 Week resolution order (authoritative)

The implementing agent must follow this exact order — several systems depend on
it:

1. `startWeek` — refresh AP, snapshot stats, reset `weekGains`, draw cards,
   apply semester-modifier week hooks.
2. Player spends AP on actions (any order, any number).
3. Player plays 0–2 cards (can be interleaved with step 2).
4. Player ends the week → `finishWeek`:
   1. apply **threshold effects** (stress/mood/stamina/money bands)
   2. apply **skill drift** for untrained skills
   3. advance **research project** clock (§5.1)
   4. accrue **finance** (loan interest, stipend, rent) (§5.5)
   5. roll **wellness** hazards (§5.8)
   6. roll for a **patient case** (clinical stages) or **sim-lab practical**
      (preclinical stages) — at most one per week
   7. if no mini-game fired, roll a **random event**
   8. show **weekly summary**
5. If `weekInSemester === WEEKS_PER_SEMESTER` → semester close (boss), else
   `startWeek` for the next week.

### 3.3 Break chapters

After semesters 2, 5, and 8, the player picks **one** break track. Each is a
3-turn mini-chapter with its own action set and its own payoff curve.

| track | flavor | payoff | cost |
| --- | --- | --- | --- |
| Summer research | full-time in Dr. Reyes's lab | large research progress, `reyes` affinity, possible publication | no money, mild stress |
| Externship | community clinic away rotation | clinicalSense + publicImpact + case log entries | stamina, money cost |
| Work and save | dental assistant / barista shifts | money, small handSkill | knowledge drift, mood risk |
| Rest and reset | actually take the break | mood, stamina, love, stress purge | opportunity cost of everything above |
| Board prep camp | (only before semester 9) | knowledge, `inbde_ready` flag | mood, money |

Break tracks are where run identity gets decided. They must feel like real
forks, not filler.

---

## 4. Stat, economy and progression model

### 4.1 Stats

Existing 13 stats stay: `knowledge`, `handSkill`, `clinicalSense`, `empathy`,
`stamina`, `confidence`, `reputation`, `mood`, `stress`, `love`, `research`,
`publicImpact`, `money`.

**New stats:**

| stat | range | meaning |
| --- | --- | --- |
| `focus` | 0–100 | mental sharpness; consumed by heavy cognitive work, restored by sleep/rest; gates study efficiency |
| `debt` | 0–400 | student loan principal in "k units"; accrues interest, drives an ending |
| `standing` | 0–100 | faculty/class standing; distinct from public `reputation` |

**New derived values:** `wellness` and `careerReadiness` and `lifeBalance` stay;
add `researchOutput` (weighted publications + posters + grants) and
`clinicalRecord` (weighted case-log outcomes).

### 4.2 Soft caps (diminishing returns) — the central balance fix

Applied to **skill stats only**: `knowledge`, `handSkill`, `clinicalSense`,
`empathy`, `confidence`, `reputation`, `research`, `publicImpact`, `standing`.
**Not** applied to `mood`, `stamina`, `stress`, `focus`, `love`, `money`, `debt`
— those are resources and must stay responsive.

Positive deltas are multiplied by a factor of the stat's **current** value:

| current value | multiplier |
| --- | --- |
| < 55 | 1.00 |
| 55–69 | 0.75 |
| 70–79 | 0.50 |
| 80–89 | 0.30 |
| ≥ 90 | 0.15 |

Applied **after** difficulty scaling, inside the effect pipeline. Negative
deltas unaffected.

**Diminished fractions are banked, not rounded up.** State carries a per-stat
remainder in `[0, 1)`; each positive delta adds `delta × multiplier` to the
remainder and delivers `floor()` of the result. So a stat in the 0.15 band with
a +3 authored delta gains a point roughly every second touch instead of on
every touch, and gains still never stop entirely.

> The ledger is not decoration — it is the whole mechanism. An earlier version
> of this rule said "a raw positive delta ≥1 always yields at least +1". That
> floor silently destroyed the soft cap: **67% of authored positive deltas on
> soft-capped stats are ≤5**, and for those the 0.5 / 0.3 / 0.15 bands all
> collapse to the same +1. A +3 gain delivered exactly one point at 75, at 85,
> and at 95 alike — a flat ratchet, not diminishing returns. Any future change
> here must keep the bands *strictly* ordered over repeated touches; the harness
> asserts exactly that.

**Consequence:** in 60 weeks you can push roughly two stats past 85, or four to
~70. Specialization becomes the dominant strategy — which is the point.

**The formula is necessary but not sufficient.** A stat with enough incidental
authored sources still saturates no matter how correct the bands are, because it
climbs through the cheap low bands before the expensive ones ever apply. That is
a *content-volume* problem and must be fixed in the content, not by inventing
more bands. G13 (§10) measures it per stat so it cannot hide.

### 4.3 Skill drift ("use it or lose it")

At week end, each of `knowledge`, `handSkill`, `clinicalSense` that received **no
positive delta that week** decays by 1 (2 in `clinical`/`advanced` stages), with
a floor of 40. Tracked via a per-week `weekGains` accumulator reset in
`startWeek`. Drift is shown explicitly in the weekly summary — never silent.

### 4.4 Action points

AP per week: 7 (easy) / 6 (normal) / 5 (hard), **+1 at semester 4, +1 at
semester 8** (you get better at this), **−1 while `stamina < 20`** (your body
takes the AP whether you like it or not).

### 4.5 Perk points

One perk point per semester close (2 for a `great` boss outcome). Spent in the
perk tree (§5.6). This is the run's build-defining currency.

---

## 5. Systems

Each system below specifies: **purpose → state → data schema → flow → tuning →
acceptance**. The implementing agent should treat each as an independently
testable module.

---

### 5.1 Research system

**Purpose.** The parallel career. Gives the run a second, slower clock with its
own risk profile, and makes the `academic` and `omfs`/`ortho` tracks reachable.
This is the biggest new system and the one that carries the most replay value.

**State.**

```ts
type ResearchState = {
  labId?: string;             // joined lab, undefined until recruited
  researchPoints: number;     // 0–100, "unspent effort" pool
  projects: Project[];        // active + completed
  publications: Publication[];
  posters: number;
  grantsWon: string[];
  reputationInLab: number;    // 0–100, PI's opinion of you
};

type ProjectPhase =
  | "idea" | "pilot" | "irb" | "collection"
  | "analysis" | "writing" | "submitted" | "revision"
  | "accepted" | "rejected" | "abandoned";

type Project = {
  id: string;
  templateId: string;         // from src/data/research.ts
  title: LocalizedText;
  phase: ProjectPhase;
  progress: number;           // 0–100 within the current phase
  quality: number;            // 0–100, determines venue tier + accept odds
  weeksInPhase: number;
  risk: number;               // 0–1, chance of a setback event per week
  venue?: "poster" | "regional" | "specialty" | "top";
  reviewRoundsLeft?: number;
};
```

**Data schema** (`src/data/research.ts`):

```ts
type LabTemplate = {
  id: string;
  name: LocalizedText;
  piNpcId: string;            // links to an NPC (usually "reyes")
  field: LocalizedText;       // "biomaterials" | "craniofacial genetics" | ...
  intensity: number;          // 1–3, weekly stress and time demanded
  prestige: number;           // 0–100, multiplies publication value
  requirements: EventCondition;
  perks: string[];            // flags granted on joining
};

type ProjectTemplate = {
  id: string;
  labId: string;
  title: LocalizedText;
  description: LocalizedText;
  baseRisk: number;
  phaseWeeks: Record<ProjectPhase, number>;   // expected weeks per phase
  qualityDrivers: Array<{ stat: ConditionStatKey; weight: number }>;
  setbackEvents: string[];    // event ids that can fire during this project
  payoff: { research: number; reputation: number; standing: number; money?: number };
};
```

**Flow.**

1. **Recruitment.** From semester 2, a `research_interest` action (1 AP) builds
   `reputationInLab` toward a PI. At `reputationInLab ≥ 30` and `knowledge ≥ 45`,
   an arc event offers a lab. Joining is a commitment: it adds a recurring
   weekly stress cost equal to `lab.intensity`.
2. **Project pipeline.** Each phase advances by spending the `lab_work` action
   (2 AP) which converts AP into `progress` scaled by `research` stat, `focus`,
   and `reputationInLab`. When `progress ≥ 100`, the phase advances and
   `progress` resets. Each phase transition rolls a **quality delta** from
   `qualityDrivers`.
3. **Randomness.** Every week a project is active, roll `risk` for a setback:
   failed replication (progress −40), a scooped result (quality −25, morale hit),
   an equipment breakdown (2-week stall), IRB revision (phase repeat), or a
   lucky break (quality +20). These are authored events, not silent numbers.
4. **Submission and review.** At `submitted`, the venue is chosen from `quality`.
   Review takes 2–4 weeks, then rolls: accept / minor revision / major revision /
   reject. Rejection is not terminal — resubmit at a lower venue with a quality
   penalty. **Reviewer draw is random per submission**, so identical projects can
   land differently across runs. This is deliberate.
5. **Payoff.** Publications raise `research`, `standing`, `reputation`, feed
   `researchOutput`, unlock the `reyes_letter` flag at 1+ first-author accept,
   and are the hard gate for the `academic` track and a soft gate for `ortho`
   and `omfs`.

**Tuning.** A focused researcher should land **1–2 publications and 1–2 posters**
in a run; a clinical-focused player who dabbles should land 0–1 posters. Never
let research be free — every research week is a week not in the sim lab, and the
drift rule will show it.

**Acceptance.** In a 40-run sweep: research-focused strategy reaches ≥1 accepted
publication in ≥60% of runs; balanced strategy in ≤20%; clinical-only in ≤5%.
No run can reach 3+ publications without a visible cost in `clinicalRecord`.

---

### 5.2 Patient case system

**Purpose.** Make clinic a decision, not a stat button. This is where the game
earns its dental-school identity.

**When.** Stages `clinical` / `advanced` (semester ≥ 7). In `finishWeek` step
4.6, fires with p=0.55, or guaranteed if the player spent AP on a clinic-tagged
action. At most one case per week; a case suppresses the random event.

**Data schema** (`src/data/cases.ts`):

```ts
type CaseOption = {
  id: string;
  text: LocalizedText;
  quality: "best" | "ok" | "poor";     // +2 / +1 / −1 to step score
  requires?: EventCondition;            // gated; shown locked with its requirement
  feedback: LocalizedText;              // the teaching moment
  effects?: StatBlock;
};

type PatientCase = {
  id: string;
  patient: { name: LocalizedText; age: number; chiefComplaint: LocalizedText };
  stage: Array<Stage | "any">;
  minSemester?: number;
  difficulty: number;                   // 0–20, subtracted from execution roll
  steps: CaseStep[];                    // 3 steps: history → diagnosis → plan
  execution: Array<{ stat: ConditionStatKey; weight: number }>;
  outcomes: Record<"excellent" | "good" | "rough" | "bad",
                   { text: LocalizedText; effects: StatBlock }>;
  tags: string[];                       // "endo" | "perio" | "pedo" | "surgery" | ...
};
```

**Flow.** history-taking → diagnosis → treatment plan, each a genuine clinical
decision with a defensible best answer and *plausible* wrong answers (never
strawmen). Then the execution roll:

```
score = Σ(stat × weight) + stepScore × 5 − difficulty + rand(−8, 8)
        + 6 if jordan_ally + perk modifiers
excellent ≥ 78 | good ≥ 58 | rough ≥ 40 | bad otherwise
```

Outcomes move `reputation`, `confidence`, `clinicalSense`, `empathy`, `stress`,
`standing`, and `money` (clinic production), and append to
`caseLog: Array<{ caseId, outcome, tags }>`. The case log feeds the Match score,
`clinicalRecord`, and two endings.

**Content.** 18–22 cases with real substance: reversible vs. irreversible
pulpitis, caries risk assessment, perio staging and grading, RCT vs. extraction,
pediatric behavior management, the anxious patient, a medically complex patient
(anticoagulant / bisphosphonate / uncontrolled diabetes), a failing crown margin,
avulsion emergency, oral-lesion referral, denture adjustment expectations,
a patient who cannot afford the ideal plan (this one has no "best" answer — it
has an honest one). Case tags gate specialty-track bonuses.

**Acceptance.** Every case terminates; gated options never soft-lock a case;
across 40 runs each case fires at least twice and no case fires more than 8×.

---

### 5.3 Sim-lab practical system

**Purpose.** The preclinical counterpart to patient cases (semesters 3–6), so
the first half of the game has its own mini-game instead of waiting for clinic.

**Flow.** A 3-stage precision exercise (e.g. Class II prep): for each stage the
player picks an approach — *fast / careful / textbook* — with a success band
determined by `handSkill`, `focus`, `stamina`, and equipment (§5.7). Each stage
returns `over-prepped / ideal / under-prepped`. Three ideals = a faculty
commendation (`standing` + perk point). Failures cost `confidence` but grant
`handSkill` (you learn from it) — failing forward is deliberate.

**Data:** `src/data/simlab.ts`, 10–12 exercises tied to semester.

**Acceptance.** Fires in preclinical weeks with p=0.5; never in clinical stages;
mutually exclusive with patient cases.

---

### 5.4 NPC relationship system

**Purpose.** Make the social layer mechanical, and make each run's cast
different.

**State.**

```ts
npcs: Record<NpcId, { affinity: number; arcStage: number; flags: string[] }>
```

**Roster.** Author **10 NPCs**; each run draws **4** (plus `partner`, always
present). This is a major source of run variance.

| id | who | mechanical identity |
| --- | --- | --- |
| `mika` | classmate, study partner | study efficiency, co-author |
| `reyes` | faculty mentor / PI | research access, letter |
| `jordan` | clinic assistant | clinic action efficiency |
| `priya` | overachieving rival | pressure: raises your ceiling, costs mood |
| `sam` | upperclassman | shortcuts, warnings, board tips |
| `dr_okafor` | tough clinical faculty | brutal early, huge standing payoff |
| `lena` | non-dental friend | reality anchor, mood/stress purge |
| `theo` | lab tech | equipment access, sim-lab bonuses |
| `nadia` | community-clinic coordinator | publicImpact pipeline |
| `chris` | struggling classmate | asks for your time; helping costs AP, pays empathy + a late payoff |
| `partner` | `{partner}` | alias of the `love` stat; always in the run |

`partner.affinity` is a **read/write alias of `love`** — one source of truth.

**Arcs.** Each NPC has a 4-stage arc gated on affinity (25 / 50 / 75) and
semester. Each stage is an authored event granting a flag. Flags have **passive
mechanical effects** — this is what makes NPCs matter:

- `jordan_ally` → clinic-tagged effects ×1.15
- `mika_study_group` → study-tagged knowledge +2
- `reyes_letter` → research actions +2; large Match bonus
- `theo_workshop` → sim-lab practicals +1 stage tolerance
- `priya_rivalry` → +10% to all skill gains, −2 mood per week
- `lena_anchor` → weekly stress −2
- `chris_repaid` → a one-time clinical save in D4

**Actions.** 4 new NPC actions competing for the same AP: `study_with_<npc>`,
`office_hours`, `help_out`, `hang_out`.

**Acceptance.** Across 40 runs, each of the 10 NPCs appears in 30–50% of runs;
at least 2 arcs complete in a typical run; no arc can complete before semester 3.

---

### 5.5 Finance system

**Purpose.** A real second resource with a real ending attached. Dental school
debt is one of the defining facts of the profession and the game should say so.

**State.** `money` (liquid, −50…400), `debt` (0–400k), `monthlyBurn`.

**Mechanics.**
- Tuition posts at each semester open: `debt += 40` (in k).
- Interest accrues weekly: `debt += debt × 0.0012` (≈6.5%/yr) — visible in the
  weekly summary, never silent.
- Living costs: `money -= 4` per week, modified by housing choice (a one-time
  semester-1 decision: dorm / apartment / live with roommates / stay with family).
- Income sources: part-time work action, break-chapter work track, clinic
  production from cases (D3+), scholarships (achievement-gated), grants (§5.1).
- Equipment purchases (§5.7) and elective fees are money sinks.
- `money < 0` → weekly `stress +2` and a `debt` conversion at −50.

**Endings hook.** `debt > 300` at graduation with low `money` gates the
"Owing the Future" ending; `debt < 150` with a scholarship gates "Free to
Choose", which materially widens the Match track options.

**Acceptance.** A player who never works and never wins a scholarship ends with
`debt` in 280–360; a work-focused player 180–250. Neither path is unplayable.

---

### 5.6 Perk system

**Purpose.** Build identity. Converts semester success into permanent, visible
character definition, and gives long runs a sense of accumulating power.

**Structure.** A 4-branch tree, 5 perks per branch, 2 tiers deep. Perk points
from semester closes (12–16 per run) buy roughly 8–10 perks — so no run gets
the whole tree.

| branch | theme | example perks |
| --- | --- | --- |
| Clinician | hands and chairside | *Steady Grip* (sim-lab stage tolerance +1), *Chairside Calm* (case rolls +5 when stress > 60), *Fast Hands* (clinic actions cost 1 less AP once per week) |
| Scholar | knowledge and research | *Deep Reader* (study soft-cap band shifts +5), *Methodologist* (project quality rolls +8), *Night Owl* (convert 10 stamina → 10 focus, weekly) |
| Human | wellness and people | *Boundaries* (stress threshold band +5), *Real Friend* (affinity gains ×1.3), *Recovery* (rest actions +50%) |
| Operator | money, standing, systems | *Hustle* (work income ×1.4), *Politics* (standing gains +2), *Scheduler* (+1 AP every third week) |

Perks are pure passive modifiers registered in one place so the engine applies
them uniformly (see §9.3).

**Acceptance.** No perk is strictly dominant; each branch has at least one perk
that a sweep shows changes strategy (measurably shifts which endings are reached).

---

### 5.7 Equipment system

**Purpose.** A money sink that converts finance into capability, and a source of
small run-defining choices.

Items (one-time purchases, `src/data/equipment.ts`): loupes (sim-lab + case
precision), a better handpiece (handSkill gains +15%), ergonomic stool (reduces
weekly stamina drain), a good coffee setup (focus +5/week), a used car (unlocks
the community-clinic and externship actions, removes a travel penalty), noise
cancelling headphones (study efficiency), a decent mattress (stamina recovery).

Each has a price, a semester availability, and one visible passive effect. 8–10
items; a run can afford 3–4.

---

### 5.8 Wellness and body system

**Purpose.** Make the human cost mechanical without being punitive. This is the
system that carries the game's actual message.

- **Sleep debt.** Accumulates when weekly stamina spend exceeds recovery; at
  thresholds it caps `focus`, then starts eating `mood`.
- **RSI / neck-and-back risk.** Rises with sim-lab and clinic volume, reduced by
  the ergonomic stool and by rest actions. At high risk, an injury event can
  force a 2-week `handSkill` penalty. Telegraphed for 2 weeks first — never a
  surprise punishment.
- **Illness.** Seasonal risk (a `flu_season` semester modifier raises it), higher
  with low wellness. Costs a week of reduced AP.
- **Recovery.** A `real_rest` action and the Rest break-chapter fully clear sleep
  debt; they are strong on purpose.

**Acceptance.** A player who ignores wellness entirely hits at least one forced
event by semester 8 in ≥80% of runs, but is never soft-locked.

---

### 5.9 Rotation and elective system

At each semester open, the player is offered **3 of ~14** electives/rotations
(randomized, filtered by stage and prerequisites) and picks one. Each grants a
semester-long modifier and gates content:

Oral surgery rotation, pediatric rotation, orthodontics selective, community
outreach block, hospital dentistry, dental materials seminar, teaching assistant,
practice-management course, implant selective, research selective, sedation
selective, special-needs clinic, geriatric rotation, emergency clinic.

Effects: bias the case draw toward matching tags, shift stat gain rates, unlock
specific events and Match-track bonuses.

**Acceptance.** Elective choice measurably shifts case-tag distribution and the
competitiveness of at least one Match track.

---

### 5.10 Leadership and community system

Opt-in track: student government (ASDA), outreach trips, tutoring, a student
research symposium, a free-clinic organizing role. Costs AP; pays `publicImpact`,
`standing`, `reputation`, network flags, and gates the public-health track and
the community endings. One leadership role at a time; switching costs a
semester.

---

### 5.11 Boards and the Match

**INBDE** — special boss at the end of semester 7. Hard `knowledge` gate.
`great` → `inbde_strong`; `struggle` → `inbde_retake` (costs stress, subtracts
from the Match, never blocks progression).

**CDCA / clinical licensure exam** — semester 11, weighted on `handSkill`,
`clinicalSense`, and `clinicalRecord`.

**The Match** — semester 12's boss is replaced by a career decision screen. The
player applies to up to **3 ranked tracks**; each is scored independently.

| track | drivers | competitiveness |
| --- | --- | --- |
| `omfs` | knowledge, stamina, research, `inbde_strong` | brutal |
| `ortho` | handSkill, reputation, research, `reyes_letter` | very high |
| `pedo` | empathy, handSkill, pedo case log | high |
| `endo` | handSkill, clinicalSense, endo case log | high |
| `perio` | clinicalSense, empathy | medium |
| `prostho` | handSkill, knowledge | medium |
| `oral_path` | knowledge, research | medium |
| `public_health` | publicImpact, empathy, leadership | medium |
| `academic` | research, publications, `reyes_letter`, `mika_coauthor` | medium |
| `gpr_aegd` | careerReadiness | accessible |
| `private_practice` | money, confidence, reputation | accessible |
| `associate_then_own` | money, standing, low debt | accessible |

```
score = Σ(driver × weight)
      + 8×(excellent cases) + 3×(good cases) − 5×(bad cases)
      + 12×(first-author publications) + 4×(posters)
      + 10 if reyes_letter + 5 if inbde_strong − 8 if inbde_retake
      + elective/leadership bonuses
      − track.competitiveness
accepted ≥ 65 | waitlisted ≥ 50 | rejected otherwise
```

Rejection routes warmly to `gpr_aegd` or private practice — never a dead end.
Result flags (`match_<track>_<result>`) feed the career-track endings.

---

### 5.12 Class standing and reputation

`standing` (faculty view) and `reputation` (peer/public view) are separate and
sometimes in tension: the elective that impresses faculty can cost you with
classmates, and vice versa. Certain events force the choice explicitly. Class
rank is displayed as a band (top 10% / upper third / middle / lower third), not a
number, and is derived from `standing`, boss history, and `clinicalRecord`.

---

## 6. Randomness and replayability architecture

### 6.1 Seeded RNG (required, do this first)

Replace every `Math.random()` with a **seeded PRNG stored in game state**
(mulberry32 or xorshift128). Requirements:

- `GameState.rngSeed: number` and `GameState.rngCursor: number`, both saved.
- All randomness goes through `nextRandom(state)` which returns
  `[value, nextState]` or an equivalent mutation-free pattern.
- Same seed + same inputs ⇒ identical run. **This is what makes balance
  measurable and the smoke sweep meaningful.**
- Display the seed on the start and ending screens; allow entering a seed.

This is a prerequisite for everything in §10 and must land in Phase 1.

### 6.2 Starting archetype draft

At run start the player is offered **3 of 12** archetypes (seeded draw). Each
gives stat skews, a unique starting perk, one exclusive action, and 2–3
exclusive events.

Former dental assistant, biology PhD dropout, first-gen student, army veteran,
career changer at 34, art-school hands, competitive gamer (reflexes, sleep debt),
international student (language + visa pressure), parent of a toddler, athlete,
lab-rat undergrad researcher, the one who got in off the waitlist.

### 6.3 Semester modifiers

At each semester open, draw **1–2 of ~20** modifiers (seeded). Examples:
faculty shortage (fewer office hours, more self-study), curriculum overhaul
(all study efficiency −15% for a semester), clinic renovation (case rate down,
sim-lab up), flu season (illness risk ×2), budget cuts (equipment prices +30%),
accreditation visit (standing swings amplified), a beloved professor retires
(one-off event chain), a viral TikTok about your school (reputation volatility),
new digital scanner rollout (handSkill actions retrained), heat wave, research
funding windfall, a classmate crisis.

Modifiers are visible at semester open with a clear explanation. They change
strategy for that semester — that is their job.

### 6.4 Randomized draws per run

- NPC roster: 4 of 10
- Elective offers: 3 of 14 per semester
- Case draw: weighted by elective tags, no repeats until the pool cycles
- Boss variants: each semester's boss has 2–3 authored variants with different
  stat weights, drawn per run
- Life card deck: a **run deck** the player adds to (see 6.5)

### 6.5 Deck-building for life cards

Cards become a per-run deck. Start with 8 basic cards; boss `great` outcomes,
achievements, and certain events **add** cards to the run deck; some events let
you **remove** a card. Deck size 8→20 over a run. Card rarity affects draw
weight. This gives the weekly draw a growth arc instead of a static pool.

### 6.6 Meta-progression across runs

Persisted separately in `localStorage` (`dsls.meta.v1`), never in the run save:

- **Unlocks:** archetypes 4–12, elective 10–14, 3 advanced Match tracks, and a
  hard difficulty modifier are unlocked by achievements across runs.
- **Alumni wall:** every completed run records name, archetype, ending, seed,
  key stats. Displayed on the start screen.
- **Challenge runs:** unlocked seeded scenarios with fixed modifiers and a
  target ending ("graduate debt-free", "publish 3 papers", "never miss a rest
  week"), each with its own achievement.

Meta-progression must never make a fresh player's first run feel gated — the
core game is fully playable from run 1; unlocks add *variety*, not *power*.

---

## 7. Content plan

| item | v1 | v2 target |
| --- | --- | --- |
| events | 95 | **260** |
| patient cases | 0 | 20 |
| sim-lab exercises | 0 | 12 |
| research project templates | 0 | 10 (across 4 labs) |
| research setback/lucky events | 0 | 24 |
| NPCs | 0 (implicit) | 10 + partner, 4 arc stages each = 44 arc events |
| life cards | 12 | 40 |
| endings | 8 | **24** |
| actions | 14 | 30 |
| perks | 0 | 20 |
| equipment | 0 | 9 |
| archetypes | 0 | 12 |
| semester modifiers | 0 | 20 |
| electives | 0 | 14 |
| achievements | 6 | 40 |

### 7.1 Authoring standards

- **Bilingual, natural in both.** Chinese must read like it was written in
  Chinese. Keep the existing voice: wry, warm, specific.
- **Specificity beats generality.** "Postle Hall's third-floor sim lab at 11pm"
  beats "the lab". Real details: typodonts, articulators, loupes, rubber dam,
  the smell of eugenol, the 8am amalgam quiz, Tuesday clinic.
- **Choices have defensible reasoning.** Every event choice should be a
  position someone could actually hold. No obviously-correct options.
- **No cruelty.** The game can be hard; it is never mean about the player's
  choices, and never moralizes about rest, money, or relationships.
- **Partner content** uses `{partner}` and stays supportive. Never possessive,
  never a source of guilt, never an obstacle to the career.

### 7.2 Ending roster (24)

Priority bands — **specific always beats generic** (this fixes the v1 defect):

| band | priority | count | notes |
| --- | --- | --- | --- |
| state override | 95 | 2 | burnout (tightened: requires `wellness < 35`), health crisis |
| career track | 88–92 | 12 | one per Match track, text varies by accepted/waitlisted |
| specialist build | 78–86 | 6 | researcher, community, patient-whisperer, steady-hands, operator/owner, teacher |
| relationship / finance | 60–70 | 2 | loved-and-grounded, owing-the-future |
| balanced | 50 | 1 | `balanced_dentist`, now the good fallback |
| default | 0 | 1 | `graduation_default` |

---

## 8. UI/UX and visual spec

### 8.1 Screens

Existing: start, planning, event, weekly summary, boss, ending.
**New:** semester open (modifier + elective draft), case, sim-lab practical,
research lab dashboard, perk tree, match/career, break chapter, alumni wall,
seed entry.

### 8.2 Visual direction

Warm clinic-adjacent, not sterile. A restrained palette (one accent, one warm
neutral, one alert), consistent elevation and radius scale, generous whitespace,
type scale with real hierarchy. **Light and dark themes both fully supported**
via CSS custom properties in `src/styles/variables.css`.

### 8.3 Legibility requirements (these are functional, not decorative)

- **Stat bars show the engine's actual threshold bands** as tick marks (stress
  70 / critical, mood 20 / 40 / 70, stamina 25, focus 30). The player should be
  able to read the mechanics off the bar.
- **Every roll shows its breakdown** — boss score, case execution, Match score,
  publication acceptance. Expandable "how was this computed" panel with the real
  numbers. No hidden math anywhere.
- **Deltas are always attributed.** The weekly summary groups changes by source
  (actions / cards / thresholds / drift / systems / events), not one lump sum.
- **Locked options show their requirement**, never just "locked".
- **Semester modifiers and active perks/equipment are always visible** in a
  persistent status strip.

### 8.4 Motion and responsiveness

Screen transitions, count-up on scores, delta animations in the summary; all
gated behind `prefers-reduced-motion`. Single column below 720px with a sticky
AP/stat header. Full keyboard navigation; visible focus rings; ARIA labels on
every interactive control.

---

## 9. Technical architecture

### 9.1 Module map (target)

```
src/
  game/
    rng.ts              NEW  seeded PRNG, all randomness flows through here
    types.ts            EXTEND
    constants.ts        EXTEND
    balance.ts          EXTEND  soft caps, drift, thresholds
    modifiers.ts        NEW  central perk/equipment/flag modifier registry
    engine.ts           REFACTOR → run creation + player verbs + public surface
    systems/
      week.ts           NEW  week lifecycle (start / finish / event / rollover)
      boss.ts           NEW  semester checks, ending selection, advance
      achievements.ts   NEW
      research.ts       NEW
      cases.ts          NEW
      simlab.ts         NEW
      npcs.ts           NEW
      finance.ts        NEW
      wellness.ts       NEW
      perks.ts          NEW
      electives.ts      NEW
      match.ts          NEW
      deck.ts           NEW
    migration.ts        NEW  v1 → v2 save migration
    meta.ts             NEW  cross-run persistence
    selectors.ts        EXTEND
    storage.ts          EXTEND
  data/
    (existing) + research.ts, cases.ts, simlab.ts, npcs.ts, perks.ts,
    equipment.ts, archetypes.ts, semesterModifiers.ts, electives.ts,
    matchTracks.ts, labs.ts
  components/
    (existing) + SemesterOpen, CaseScreen, SimLabScreen, ResearchDashboard,
    PerkTree, MatchScreen, BreakChapter, AlumniWall, RollBreakdown, NpcPanel
```

**`engine.ts` must not grow past ~600 lines.** It owns run creation and the
player verbs and re-exports the public surface; systems own their own logic and
expose `tick(state) → state` style functions. Nine phases still have systems to
land, so treat 400 lines as the point to extract another system rather than
waiting for the hard cap.

### 9.2 State shape

`GameState` gains: `rngSeed`, `rngCursor`, `softCapCarry`, `archetypeId`, `npcs`, `research`,
`caseLog`, `simLabLog`, `perks`, `equipment`, `debt`, `focus`, `standing`,
`sleepDebt`, `injuryRisk`, `activeElective`, `semesterModifiers`, `runDeck`,
`leadershipRole`, `breakChoices`, `matchApplications`, `weekGains`,
`pendingCaseId`, `pendingSimLabId`, `pendingBreakId`.

### 9.3 Modifier registry (important)

Perks, equipment, NPC flags, semester modifiers, electives, and archetypes all
modify the same handful of things. Do **not** scatter `if (flag) x *= 1.15`
through the codebase. Implement one registry:

```ts
type ModifierSource = { id: string; kind: "perk" | "equipment" | "npc" | "semester" | "elective" | "archetype" };
type ModifierHook =
  | { on: "actionEffects"; tag?: string; stat?: StatKey; mult?: number; add?: number }
  | { on: "apPerWeek"; add: number }
  | { on: "softCapBand"; stat: StatKey; shift: number }
  | { on: "caseRoll" | "bossRoll" | "simLabRoll" | "projectQuality"; add: number }
  | { on: "weeklyThreshold"; stat: StatKey; add: number }
  | { on: "affinityGain"; mult: number }
  | { on: "income" | "expense"; mult: number };

function collectModifiers(state: GameState): ModifierHook[];
function applyHooks(hooks: ModifierHook[], ctx: …): …;
```

Every system asks the registry. This keeps 60+ content-defined modifiers from
turning the engine into spaghetti, and makes balance sweeps possible.

### 9.4 Save compatibility

`SAVE_VERSION` → `"2.0.0"`. `migration.ts` upgrades v1 saves by filling new
fields with defaults and telling the player what happened in a one-time notice.
Never silently discard a save. Unknown future versions → refuse to load and
offer to start fresh, rather than crash.

### 9.5 Testing harness (expand substantially)

`scripts/smoke.mts` grows into a real balance harness:

- **Strategy bots:** ≥10 (balanced, study-max, hands-max, research-max,
  clinic-max, social, wellness, money, chaos/random, min-max exploiter).
- **Sweep:** ≥40 runs per strategy across all difficulties, seeded and
  reproducible.
- **Reports:** ending distribution, mean/σ per stat at graduation, Match results,
  publication counts, debt distribution, achievement unlock rates, case-fire
  counts, event coverage (which authored events never fired), NPC arc completion
  rates, run length in decisions.
- **Assertions:** every gate in §10 is an assertion that fails the build.
- Add `npm run smoke` and `npm run balance` scripts.

**Content validators** (`content-gen/validate.mjs`, run in CI): every
`LocalizedText` has non-empty `en` and `zh`; every referenced id exists (events,
cases, perks, NPCs, endings, tracks); no duplicate ids; every event is reachable
by at least one stage/semester combination; every ending's condition is
satisfiable; no orphaned flags (a flag required somewhere is granted nowhere).

---

## 10. Balance targets and acceptance gates

These are **assertions in the harness**, not aspirations. A phase is not done
until its gates pass.

| # | gate |
| --- | --- |
| G1 | ≥14 of 24 endings reached across the sweep; **no ending exceeds 25%** of runs |
| G2 | `careerReadiness` at graduation: mean 62–78, σ ≥ 8, **max < 95** across all strategies |
| G3 | Every strategy bot completes a run; no crashes, no soft-locks, no infinite loops (guard < 20000 steps) |
| G4 | ≥90% of authored events fire at least once across the sweep; report the dead ones by id |
| G5 | Research: focused ≥1 publication in ≥60% of runs; clinical-only ≤5% |
| G6 | Match: each of the 12 tracks is accepted by at least one strategy; no track accepted by >40% of runs |
| G7 | Debt at graduation: 150–380 across strategies; a work-focused run beats a non-working run by ≥60 |
| G8 | No single action is used in >25% of all AP spends by any bot (no dominant button) |
| G9 | Median run length ≥ 350 player decisions |
| G10 | Same seed + same inputs ⇒ byte-identical final state (determinism) |
| G11 | `npm run build` clean (tsc strict, no `any` in `src/game/`), content validator clean |
| G12 | Save migration: a v1 save loads into v2 without data loss and without crash |
| G13 | **No unrecorded stat saturation.** For every soft-capped stat: graduation mean < 92 and the share of runs pinned at ≥99 is ≤25%. Stats already saturating when the gate landed sit in an explicit debt list naming the phase that owns the fix; the gate fails both on a *new* saturating stat and on a listed stat that stops saturating, so the list can only shrink |
| G14 | **Per-playstyle ending variety.** No single ending accounts for >60% of any one strategy bot's runs. G1 bounds the *pooled* distribution, which passes even when each playstyle lands on one fixed ending every run — the aggregate cannot see replayability, so it is measured per bot. Owned by P8 |

---

## 11. Phase plan

Each phase ends with a **commit on a feature branch** and a passing gate. Do not
start a phase before its predecessor's gate is green.

| phase | scope | gate |
| --- | --- | --- |
| **P0** | Seeded RNG (§6.1), modifier registry skeleton (§9.3), state shape extension, save migration, smoke harness upgrade to a seeded sweep | G3, G10, G11, G12 |
| **P1** | Balance core: soft caps, drift, AP curve, boss ramp, **ending priority restructure** + the 24-ending roster (text can be first-pass) | G1 (≥10 endings interim), G2, G11 |
| **P2** | Time restructure: 12 semesters × 5 weeks, semester-open screen, break chapters, elective draft | G3, G9 (interim ≥250) |
| **P3** | Research system end-to-end (§5.1) + labs/projects data + 24 setback events + research dashboard UI | G5, G11 |
| **P4** | Patient cases (§5.2) + 20 cases + case UI; sim-lab (§5.3) + 12 exercises + UI | G3, G4 (cases), G11 |
| **P5** | NPCs (§5.4): 10 NPCs, 44 arc events, roster draw, NPC actions and panel | G3, NPC gates in §5.4 |
| **P6** | Finance (§5.5), perks (§5.6), equipment (§5.7), wellness (§5.8), leadership (§5.10) | G7, G8, G11 |
| **P7** | Boards + Match (§5.11) + career-track endings + class standing (§5.12) | G6, G1 (full) |
| **P8** | Randomness layer: archetypes, semester modifiers, boss variants, deck-building, meta-progression, alumni wall, challenge runs | G1, G4, G10, **G14** |
| **P9** | Content fill to §7 targets; content validator; full bilingual pass; **clear the G13 saturation debt** (a stat that saturates does so because too many authored sources grant it for free) | G4 (≥90%), **G13 with an empty debt list**, validator clean |
| **P10** | Visual/UX pass (§8), accessibility, mobile, motion | manual render smoke, a11y check |
| **P11** | Full balance sweep and tuning; all gates G1–G14 green; deploy to Pages | all gates |

**Sequencing note.** P0 and P1 are load-bearing — every later phase depends on
seeded RNG, the modifier registry, and the balance model. Do not reorder them,
and do not start authoring bulk content before P1's gate is green, or the
content will be tuned against the wrong curve.

---

## 12. Risks and non-goals

**Risks**

- *Engine sprawl.* Mitigated by §9.1 (systems own their logic) and the 600-line
  cap on `engine.ts`. If `engine.ts` grows past that, stop and refactor.
- *Content debt.* 260 events × 2 languages is the single biggest cost. Author in
  batches by system, validate each batch, and never let generated content skip
  the validator.
- *Balance drift as systems land.* Mitigated by running the seeded sweep after
  every phase, not only at the end.
- *Scope creep into an RPG.* The game is a life sim about a specific experience.
  Any system that does not serve "getting through dental school as a whole
  person" is out.
- *Mini-game fatigue.* Cases and sim-lab must stay under ~90 seconds each and
  must be skippable via a "let it ride" auto-resolve for players who want the
  macro game.

**Non-goals**

- No backend, accounts, multiplayer, or leaderboards.
- No real-time or twitch mechanics.
- No microtransactions, ads, or dark patterns.
- No claim to clinical accuracy sufficient for study use.
- No art asset pipeline — CSS/SVG only.
