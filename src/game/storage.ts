import { ACHIEVEMENTS_KEY, LANG_KEY, LEGACY_SAVE_KEY, SAVE_KEY } from "./constants";
import { parseAndMigrateSave } from "./migration";
import type { SaveLoadResult } from "./migration";
import type { GameState, Lang, LocalizedText } from "./types";

// ---------------------------------------------------------------------------
// Game save (localStorage)
// ---------------------------------------------------------------------------

const NO_SAVE_NOTICE: LocalizedText = {
  en: "No saved run was found.",
  zh: "没有找到可继续的存档。",
};

export function loadGameResult(): SaveLoadResult {
  try {
    const raw = localStorage.getItem(SAVE_KEY) ?? localStorage.getItem(LEGACY_SAVE_KEY);
    if (!raw) return { ok: false, reason: "malformed", message: NO_SAVE_NOTICE };
    return parseAndMigrateSave(raw);
  } catch {
    return { ok: false, reason: "malformed", message: NO_SAVE_NOTICE };
  }
}

export function loadGame(): GameState | null {
  const result = loadGameResult();
  return result.ok ? result.state : null;
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(LEGACY_SAVE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasSave(): boolean {
  try {
    return !!(localStorage.getItem(SAVE_KEY) ?? localStorage.getItem(LEGACY_SAVE_KEY));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Language preference
// ---------------------------------------------------------------------------

export function loadLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (v === "en" || v === "zh") return v;
  } catch {
    /* ignore */
  }
  // Default to Chinese if the browser prefers it, otherwise English.
  try {
    if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("zh")) {
      return "zh";
    }
  } catch {
    /* ignore */
  }
  return "en";
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Achievements collection (persists across playthroughs)
// ---------------------------------------------------------------------------

export function loadAchievements(): string[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function mergeAchievements(ids: string[]): string[] {
  const merged = Array.from(new Set([...loadAchievements(), ...ids]));
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
  return merged;
}
