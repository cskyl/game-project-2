// Headless engine smoke test: auto-play full games with several strategies and
// assert the loop terminates at an ending with valid stats. Bundled by esbuild.
import { ACTIONS } from "../src/data/actions";
import { EVENTS } from "../src/data/events";
import { ENDINGS } from "../src/data/endings";
import { CARDS } from "../src/data/cards";
import {
  actionStatus,
  advanceAfterBoss,
  chooseAction,
  continueAfterEvent,
  continueAfterWeeklySummary,
  finishWeek,
  newGame,
  playCard,
  resolveBoss,
  resolveEventChoice,
} from "../src/game/engine";
import { getEnding, getPendingEvent } from "../src/game/selectors";
import type { Difficulty, GameState } from "../src/game/types";

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error("ASSERT FAILED: " + msg);
}

function pickAction(state: GameState, prefs: string[]): string | undefined {
  for (const id of prefs) {
    const a = ACTIONS.find((x) => x.id === id);
    if (a && actionStatus(a, state).usable) return id;
  }
  for (const a of ACTIONS) if (actionStatus(a, state).usable) return a.id;
  return undefined;
}

function checkStats(s: GameState, label: string) {
  for (const [k, v] of Object.entries(s.stats)) {
    assert(Number.isFinite(v), `${label}: ${k} is not finite (${v})`);
    if (k === "money") assert(v >= -50 && v <= 200, `${label}: money out of range (${v})`);
    else assert(v >= 0 && v <= 100, `${label}: ${k} out of range (${v})`);
  }
}

function play(difficulty: Difficulty, prefs: string[], label: string) {
  let s = newGame(difficulty, "Tester");
  let guard = 0;
  let eventsSeen = 0;
  let bossesSeen = 0;
  while (s.screen !== "ending" && guard++ < 5000) {
    checkStats(s, label);
    switch (s.screen) {
      case "planning": {
        while (s.actionPointsRemaining > 0) {
          const id = pickAction(s, prefs);
          if (!id) break;
          const before = s.actionPointsRemaining;
          s = chooseAction(s, id);
          if (s.actionPointsRemaining >= before) break; // safety: no progress
        }
        // play a card if available
        if (s.weeklyCards.length > 0) s = playCard(s, s.weeklyCards[0]);
        s = finishWeek(s);
        break;
      }
      case "event": {
        if (s.pendingChoiceId) {
          s = continueAfterEvent(s);
        } else {
          const ev = getPendingEvent(s);
          if (!ev) {
            s = continueAfterEvent(s);
          } else {
            eventsSeen++;
            s = resolveEventChoice(s, ev.choices[0].id);
          }
        }
        break;
      }
      case "weeklySummary":
        s = continueAfterWeeklySummary(s);
        break;
      case "boss": {
        if (s.lastBossResult) {
          s = advanceAfterBoss(s);
        } else {
          bossesSeen++;
          s = resolveBoss(s);
        }
        break;
      }
      default:
        throw new Error("Unknown screen: " + s.screen);
    }
  }
  assert(s.screen === "ending", `${label}: did not reach ending (guard=${guard})`);
  assert(s.semesterIndex === 10, `${label}: ended on wrong semester (${s.semesterIndex})`);
  assert(bossesSeen === 11, `${label}: expected 11 bosses, saw ${bossesSeen}`);
  const ending = getEnding(s);
  assert(ending && ending.id, `${label}: no ending resolved`);
  checkStats(s, label + ":final");
  console.log(
    `  ${label.padEnd(22)} -> ending="${ending.id}"  bosses=${bossesSeen}  events=${eventsSeen}  ` +
      `CR=${Math.round((s.stats.knowledge + s.stats.handSkill + s.stats.clinicalSense + s.stats.empathy + s.stats.confidence) / 5)}`,
  );
  return ending.id;
}

// top-level await is fine in ESM bundle
console.log(`Content: ${EVENTS.length} events, ${CARDS.length} cards, ${ENDINGS.length} endings, ${ACTIONS.length} actions`);
assert(EVENTS.length >= 90, "expected >= 90 events");
assert(new Set(EVENTS.map((e) => e.id)).size === EVENTS.length, "duplicate event ids");
assert(new Set(CARDS.map((c) => c.id)).size === CARDS.length, "duplicate card ids");

console.log("Playthroughs:");
const endings = new Set<string>();
for (let i = 0; i < 3; i++) endings.add(play("normal", ["ask_help", "sleep", "relationship_time", "patient_comm", "clinic_prep", "sim_lab", "review_lecture", "community"], `balanced#${i}`));
for (let i = 0; i < 3; i++) endings.add(play("hard", ["deep_study", "research", "review_lecture", "sim_lab"], `studyonly-hard#${i}`));
for (let i = 0; i < 2; i++) endings.add(play("easy", ["relationship_time", "sleep", "small_break", "patient_comm", "community", "clinic_prep"], `selfcare-easy#${i}`));
for (let i = 0; i < 2; i++) endings.add(play("normal", ["community", "patient_comm", "clinic_prep", "ask_help", "sleep"], `community#${i}`));

console.log(`\nDistinct endings reached: ${[...endings].join(", ")}`);
console.log("SMOKE OK");
