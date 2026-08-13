import type { LocalizedText } from "../game/types";

/** Player-facing V2 system chrome; kept bilingual at the value level. */
export const V2_UI_TEXT = {
  seedLabel: { en: "Run seed", zh: "本局种子" },
  seedPlaceholder: {
    en: "Number or shareable phrase",
    zh: "数字或可分享的短语",
  },
  seedHint: {
    en: "Use the same seed and choices to replay the same run.",
    zh: "使用同一种子并做出相同选择，就能重现同一局。",
  },
} satisfies Record<string, LocalizedText>;
