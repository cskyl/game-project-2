import type { LifeCard } from "../game/types";
import { GENERATED_CARDS } from "./cards.generated";

// Weekly "life cards": small one-time bonuses drawn each week.
export const CARDS: LifeCard[] = [...GENERATED_CARDS];

export const CARDS_BY_ID: Record<string, LifeCard> = Object.fromEntries(
  CARDS.map((c) => [c.id, c]),
);
