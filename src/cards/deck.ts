/**
 * Deck management for Spanish cards
 */

import { Card, SUITS, VALID_VALUES, createCard } from "./cards";

/**
 * Creates a full Spanish deck (40 cards)
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const value of VALID_VALUES) {
      deck.push(createCard(value, suit));
    }
  }

  return deck;
}

/**
 * Shuffles a deck using Fisher-Yates algorithm
 */
export function shuffle(deck: Card[]): Card[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    const swapCard = shuffled[j];
    if (temp && swapCard) {
      shuffled[i] = swapCard;
      shuffled[j] = temp;
    }
  }

  return shuffled;
}

/**
 * Deals cards to players
 * @param deck - The deck to deal from
 * @param playerCount - Number of players
 * @param cardsPerPlayer - Cards each player receives (default: 3)
 * @returns Array of hands, one per player
 */
export function deal(
  deck: Card[],
  playerCount: number,
  cardsPerPlayer: number = 3
): Card[][] {
  if (deck.length < playerCount * cardsPerPlayer) {
    throw new Error("Not enough cards in deck");
  }

  const hands: Card[][] = Array.from({ length: playerCount }, () => []);

  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let playerIndex = 0; playerIndex < playerCount; playerIndex++) {
      const card = deck[i * playerCount + playerIndex];
      const hand = hands[playerIndex];
      if (card && hand) {
        hand.push(card);
      }
    }
  }

  return hands;
}

/**
 * Creates and shuffles a new deck
 */
export function createShuffledDeck(): Card[] {
  return shuffle(createDeck());
}
