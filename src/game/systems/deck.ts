import { CARDS } from "../../data/cards";
import { CARDS_DRAWN_PER_WEEK } from "../constants";
import { weightedPickState } from "../rng";
import { evaluateCondition } from "../balance";
import type { GameState, LifeCard, Semester } from "../types";

/** Seeded, without-replacement weekly draw. */
export function drawWeeklyCards(
  state: GameState,
  semesterId: number,
  stage: Semester["stage"],
): [string[], GameState] {
  const runDeck = new Set(state.runDeck);
  const eligible = CARDS.filter(
    (card) =>
      runDeck.has(card.id) &&
      (card.stage.includes("any") || card.stage.includes(stage)) &&
      evaluateCondition(
        state.stats,
        state.flags,
        semesterId,
        card.requirements,
      ),
  );
  const rarityWeight = (card: LifeCard) =>
    card.rarity === "common" ? 6 : card.rarity === "rare" ? 3 : 1;
  const pool = [...eligible];
  const picked: string[] = [];
  let next = state;

  for (
    let index = 0;
    index < CARDS_DRAWN_PER_WEEK && pool.length > 0;
    index += 1
  ) {
    const [card, randomState] = weightedPickState(next, pool, rarityWeight);
    next = randomState;
    if (!card) break;
    picked.push(card.id);
    pool.splice(pool.indexOf(card), 1);
  }

  return [picked, next];
}
