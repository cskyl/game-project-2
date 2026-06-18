# Dental School Life Sim · 牙学院生活模拟器

A cozy, replayable, **bilingual (English / 中文)** browser game about getting through
dental school. Balance study, lab practice, clinic, rest, mood, money, and
relationships across **11 semesters × 4 weeks**, survive the semester checks, and
reach one of many endings. No backend, no login — it runs as a static site and
deploys straight to GitHub Pages.

> A fictionalized game inspired by dental school life. Not an official school
> product or curriculum simulator.

![tech](https://img.shields.io/badge/Vite-React-TypeScript-blue)

## Features

- 🎒 **Weekly planning** — spend action points on 14 actions (study, sim lab,
  clinic, sleep, relationship time, outreach, research, work…), each a real
  tradeoff.
- 🎲 **95+ bilingual events** with branching choices, gated by stage, semester,
  and your current stats.
- 🃏 **Life cards** — draw 3 each week, play up to 2 for one-time bonuses.
- 📈 **13 stats + 3 derived** (wellness, career readiness, life balance) with
  non-linear stress, mood, and stamina thresholds.
- 🧑‍🏫 **11 semester checks** (the "bosses") scored from your build, not pass/fail.
- 🏆 **8 endings** that reward your build — balance, empathy, hands, research,
  community, being supported… or a gentle burnout warning.
- 🌗 One-click **EN ⇄ 中文** toggle, everywhere.
- 💾 Auto-save to `localStorage`, plus a copyable run summary.
- 📱 Responsive layout (desktop, laptop, mobile).

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Build & preview

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the built dist/ locally
```

## Deploy to GitHub Pages

The Vite `base` is set to `"./"` (relative), so the build works from any path —
no repo-name config needed.

**Option A — automatic (recommended).** This repo ships a workflow at
`.github/workflows/deploy.yml`. In your repo: **Settings → Pages → Build and
deployment → Source: GitHub Actions**. Every push to `main`/`master` builds and
publishes automatically.

**Option B — manual via gh-pages branch:**

```bash
npm run deploy     # builds, then pushes dist/ to the gh-pages branch
```

Then set **Settings → Pages → Source: Deploy from a branch → `gh-pages` / root**.

## Customize / extend

Everything lives in editable data files — no engine changes needed to add content:

| What | File |
| --- | --- |
| Names & tone (partner name, default player name, school) | `src/data/personalization.ts` |
| Weekly actions | `src/data/actions.ts` |
| Random events | `src/data/events.seed.ts` (hand-tuned) and `content-gen/*.json` → `src/data/events.generated.ts` |
| Life cards | `src/data/cards.ts` / `src/data/cards.generated.ts` |
| Semester checks (bosses) | `src/data/bosses.ts` |
| Endings | `src/data/endings.ts` |
| Semesters | `src/data/semesters.ts` |
| Achievements | `src/data/achievements.ts` |
| UI strings & stat labels | `src/i18n/index.ts` |
| Colors / theme | `src/styles/variables.css` |
| Balance tuning (difficulty, thresholds) | `src/game/constants.ts`, `src/game/balance.ts` |

### Bilingual content

Every player-facing string is a `LocalizedText` object: `{ en: "...", zh: "..." }`.
Add both languages when you add content. Wherever content references the player's
partner, write the literal token `{partner}` — it is replaced at render time with
`personalization.partnerName`.

### Regenerating generated content

The bulk events/cards in `content-gen/*.json` are merged into typed TS modules by:

```bash
node content-gen/merge.mjs   # validates, sanitizes, writes src/data/*.generated.ts
```

### Engine smoke test (optional, for contributors)

```bash
npx esbuild scripts/smoke.mts --bundle --platform=node --format=esm --outfile=scripts/smoke.bundle.mjs
node scripts/smoke.bundle.mjs
```

Auto-plays full games with several strategies and asserts the loop terminates at a
valid ending with in-range stats.

## Save system

The game auto-saves to `localStorage` after every meaningful step. Use the
header **Save** / **Restart** buttons, or **Clear Save** on the start screen.
Language preference and your achievement collection persist separately.

## Project structure

```
src/
  App.tsx, main.tsx
  i18n/            bilingual UI strings, stat labels, language context
  game/            types, constants, engine, balance, selectors, storage
  data/            actions, events, bosses, endings, cards, semesters, personalization
  components/      StartScreen, GameLayout, StatsPanel, PlanningScreen,
                   EventPanel, WeeklySummary, BossPanel, EndingScreen, …
  styles/          variables.css, global.css
```

## Tech

Vite · React 18 · TypeScript · plain CSS. No game engine, no canvas — pure
state-driven UI.
