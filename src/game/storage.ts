import { ACHIEVEMENTS_KEY, LANG_KEY, SAVE_KEY } from "./constants";
import type { GameState, Lang } from "./types";

// ---------------------------------------------------------------------------
// Game save (localStorage)
// ---------------------------------------------------------------------------

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as GameState;
    if (!data || typeof data !== "object" || !data.stats) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasSave(): boolean {
  try {
    return !!localStorage.getItem(SAVE_KEY);
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
