/**
 * Official Truco Argentino card hierarchy
 */

import { Card } from "./cards";

/**
 * Card ranking structure
 */
interface CardRanking {
  value: number;
  suit: string | null; // null means any suit
  rank: number;
}

/**
 * Official hierarchy (highest to lowest)
 * Rank 1 = strongest
 */
const HIERARCHY: CardRanking[] = [
  // Strongest cards
  { value: 1, suit: "espada", rank: 1 },
  { value: 1, suit: "basto", rank: 2 },
  { value: 7, suit: "espada", rank: 3 },
  { value: 7, suit: "oro", rank: 4 },

  // Threes (all suits equal)
  { value: 3, suit: null, rank: 5 },

  // Twos (all suits equal)
  { value: 2, suit: null, rank: 6 },

  // Ones copa and oro
  { value: 1, suit: "copa", rank: 7 },
  { value: 1, suit: "oro", rank: 7 },

  // Face cards
  { value: 12, suit: null, rank: 8 },
  { value: 11, suit: null, rank: 9 },
  { value: 10, suit: null, rank: 10 },

  // Remaining sevens
  { value: 7, suit: "copa", rank: 11 },
  { value: 7, suit: "basto", rank: 11 },

  // Low cards
  { value: 6, suit: null, rank: 12 },
  { value: 5, suit: null, rank: 13 },
  { value: 4, suit: null, rank: 14 }
];

/**
 * Gets the rank of a card (lower number = stronger)
 */
export function getCardRank(card: Card): number {
  const ranking = HIERARCHY.find(
    h => h.value === card.value && (h.suit === null || h.suit === card.suit)
  );

  if (!ranking) {
    throw new Error(`Card not found in hierarchy: ${card.value} de ${card.suit}`);
  }

  return ranking.rank;
}

/**
 * Compares two cards
 * @returns positive if card1 wins, negative if card2 wins, 0 if tie
 */
export function compareCards(card1: Card, card2: Card): number {
  const rank1 = getCardRank(card1);
  const rank2 = getCardRank(card2);

  // Lower rank = stronger card
  return rank2 - rank1;
}

/**
 * Determines the winning card from an array of cards
 * @returns The strongest card, or null if there's a tie
 */
export function getWinningCard(cards: Card[]): Card | null {
  if (cards.length === 0) {
    return null;
  }

  const firstCard = cards[0];
  if (cards.length === 1 && firstCard) {
    return firstCard;
  }

  if (!firstCard) {
    return null;
  }

  let winner = firstCard;
  let hasTie = false;

  for (let i = 1; i < cards.length; i++) {
    const currentCard = cards[i];
    if (!currentCard) continue;

    const comparison = compareCards(winner, currentCard);

    if (comparison < 0) {
      // Current card is stronger
      winner = currentCard;
      hasTie = false;
    } else if (comparison === 0) {
      // Tie detected
      hasTie = true;
    }
  }

  return hasTie ? null : winner;
}

/**
 * Checks if card1 beats card2
 */
export function beats(card1: Card, card2: Card): boolean {
  return compareCards(card1, card2) > 0;
}
