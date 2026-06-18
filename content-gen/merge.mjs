// Validate + sanitize generated JSON content and emit typed TS data modules.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const out = join(root, "src", "data");

const STAGES = new Set(["early", "preclinical", "transition", "clinical", "advanced", "any"]);
const STATS = new Set([
  "knowledge", "handSkill", "clinicalSense", "empathy", "stamina", "confidence",
  "reputation", "mood", "stress", "love", "research", "publicImpact", "money",
]);
const COND_STATS = new Set([...STATS, "wellness", "careerReadiness", "lifeBalance"]);
const RARITY = new Set(["common", "rare", "epic"]);

const warnings = [];
const warn = (m) => warnings.push(m);

const isLT = (x) => x && typeof x === "object" && typeof x.en === "string" && typeof x.zh === "string";

function cleanEffects(eff, ctx) {
  const out = {};
  if (!eff || typeof eff !== "object") return out;
  for (const [k, v] of Object.entries(eff)) {
    if (!STATS.has(k)) { warn(`${ctx}: dropped invalid effect key "${k}"`); continue; }
    if (typeof v !== "number" || !isFinite(v)) { warn(`${ctx}: dropped non-number effect "${k}"`); continue; }
    out[k] = Math.round(v);
  }
  return out;
}

function cleanCondition(cond, ctx) {
  if (!cond || typeof cond !== "object") return undefined;
  const res = {};
  for (const bound of ["minStats", "maxStats"]) {
    if (cond[bound] && typeof cond[bound] === "object") {
      const m = {};
      for (const [k, v] of Object.entries(cond[bound])) {
        if (COND_STATS.has(k) && typeof v === "number") m[k] = Math.round(v);
        else warn(`${ctx}: dropped condition.${bound} key "${k}"`);
      }
      if (Object.keys(m).length) res[bound] = m;
    }
  }
  for (const arr of ["requiredFlags", "forbiddenFlags"]) {
    if (Array.isArray(cond[arr])) res[arr] = cond[arr].filter((s) => typeof s === "string");
  }
  for (const num of ["minSemester", "maxSemester"]) {
    if (typeof cond[num] === "number") res[num] = Math.round(cond[num]);
  }
  return Object.keys(res).length ? res : undefined;
}

function cleanStage(stage, ctx) {
  if (!Array.isArray(stage)) return ["any"];
  const s = stage.filter((x) => STAGES.has(x));
  if (!s.length) { warn(`${ctx}: no valid stage, defaulting to any`); return ["any"]; }
  return s;
}

const seenIds = new Set();
function uniqueId(id, ctx) {
  let candidate = id;
  let i = 2;
  while (seenIds.has(candidate)) { candidate = `${id}_${i++}`; }
  if (candidate !== id) warn(`${ctx}: duplicate id "${id}" renamed to "${candidate}"`);
  seenIds.add(candidate);
  return candidate;
}

function cleanEvent(ev, file) {
  const ctx = `${file}:${ev && ev.id}`;
  if (!ev || typeof ev.id !== "string" || !isLT(ev.title) || !isLT(ev.text)) {
    warn(`${ctx}: dropped (missing id/title/text)`); return null;
  }
  const choices = (Array.isArray(ev.choices) ? ev.choices : [])
    .map((c, i) => {
      const cctx = `${ctx}#${c && c.id || i}`;
      if (!c || !isLT(c.text) || !isLT(c.resultText)) { warn(`${cctx}: dropped choice`); return null; }
      const choice = {
        id: typeof c.id === "string" ? c.id : `c${i}`,
        text: { en: c.text.en, zh: c.text.zh },
        resultText: { en: c.resultText.en, zh: c.resultText.zh },
        effects: cleanEffects(c.effects, cctx),
      };
      if (Array.isArray(c.addFlags)) choice.addFlags = c.addFlags.filter((s) => typeof s === "string");
      if (Array.isArray(c.removeFlags)) choice.removeFlags = c.removeFlags.filter((s) => typeof s === "string");
      const req = cleanCondition(c.requirements, cctx);
      if (req) choice.requirements = req;
      return choice;
    })
    .filter(Boolean);
  if (choices.length < 2) { warn(`${ctx}: dropped (fewer than 2 valid choices)`); return null; }

  const e = {
    id: uniqueId(ev.id, ctx),
    title: { en: ev.title.en, zh: ev.title.zh },
    stage: cleanStage(ev.stage, ctx),
    tags: Array.isArray(ev.tags) ? ev.tags.filter((s) => typeof s === "string") : [],
    weight: typeof ev.weight === "number" ? Math.round(ev.weight) : 8,
    text: { en: ev.text.en, zh: ev.text.zh },
    choices,
  };
  if (typeof ev.minSemester === "number") e.minSemester = Math.round(ev.minSemester);
  if (typeof ev.maxSemester === "number") e.maxSemester = Math.round(ev.maxSemester);
  const cond = cleanCondition(ev.condition, ctx);
  if (cond) e.condition = cond;
  return e;
}

function cleanCard(c, file) {
  const ctx = `${file}:${c && c.id}`;
  if (!c || typeof c.id !== "string" || !isLT(c.title) || !isLT(c.text)) {
    warn(`${ctx}: dropped card (missing fields)`); return null;
  }
  const card = {
    id: uniqueId(c.id, ctx),
    title: { en: c.title.en, zh: c.title.zh },
    rarity: RARITY.has(c.rarity) ? c.rarity : "common",
    stage: cleanStage(c.stage, ctx),
    text: { en: c.text.en, zh: c.text.zh },
    effects: cleanEffects(c.effects, ctx),
  };
  const req = cleanCondition(c.requirements, ctx);
  if (req) card.requirements = req;
  return card;
}

const eventFiles = ["early", "preclinical", "clinical", "advanced", "relationship", "crisis", "funny"];
let events = [];
for (const f of eventFiles) {
  const data = JSON.parse(readFileSync(join(here, `${f}.json`), "utf8"));
  const list = (data.events || []).map((e) => cleanEvent(e, f)).filter(Boolean);
  console.log(`${f}.json -> ${list.length} events`);
  events = events.concat(list);
}

const cardData = JSON.parse(readFileSync(join(here, "cards.json"), "utf8"));
const cards = (cardData.cards || []).map((c) => cleanCard(c, "cards")).filter(Boolean);
console.log(`cards.json -> ${cards.length} cards`);

const header = "// AUTO-GENERATED from content-gen/*.json by content-gen/merge.mjs. Do not edit by hand.\n";
writeFileSync(
  join(out, "events.generated.ts"),
  header + 'import type { GameEvent } from "../game/types";\n\n' +
    "export const GENERATED_EVENTS: GameEvent[] = " + JSON.stringify(events, null, 2) + ";\n"
);
writeFileSync(
  join(out, "cards.generated.ts"),
  header + 'import type { LifeCard } from "../game/types";\n\n' +
    "export const GENERATED_CARDS: LifeCard[] = " + JSON.stringify(cards, null, 2) + ";\n"
);

console.log(`\nTOTAL: ${events.length} events, ${cards.length} cards`);
console.log(`WARNINGS (${warnings.length}):`);
for (const w of warnings) console.log("  - " + w);
