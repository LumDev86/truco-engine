/**
 * Flor calculation logic
 */

import { Card } from "../cards/cards";
import { getEnvidoValue } from "./envido";

export interface FlorResult {
  score: number;
  cards: Card[];
  suit: string;
}

/**
 * Checks if a hand has flor (3 cards of the same suit)
 */
export function hasFlor(hand: Card[]): boolean {
  if (hand.length < 3) {
    return false;
  }

  // Count cards by suit
  const suitCounts = new Map<string, number>();

  for (const card of hand) {
    suitCounts.set(card.suit, (suitCounts.get(card.suit) || 0) + 1);
  }

  // Check if any suit has 3 cards
  for (const count of suitCounts.values()) {
    if (count >= 3) {
      return true;
    }
  }

  return false;
}

/**
 * Calculates the flor score for a hand
 * Rules:
 * - Must have 3 cards of the same suit
 * - Score = 20 + sum of all 3 cards (face cards = 0)
 * @returns FlorResult if flor exists, null otherwise
 */
export function calculateFlor(hand: Card[]): FlorResult | null {
  if (!hasFlor(hand)) {
    return null;
  }

  // Group cards by suit
  const cardsBySuit = new Map<string, Card[]>();

  for (const card of hand) {
    const suitCards = cardsBySuit.get(card.suit) || [];
    suitCards.push(card);
    cardsBySuit.set(card.suit, suitCards);
  }

  // Find the suit with 3 cards
  for (const [suit, cards] of cardsBySuit.entries()) {
    if (cards.length >= 3) {
      // Take all 3 cards
      const florCards = cards.slice(0, 3);
      const score = 20 + florCards.reduce((sum, card) => sum + getEnvidoValue(card), 0);

      return {
        score,
        cards: florCards,
        suit
      };
    }
  }

  return null;
}

/**
 * Calculates the best flor score for a team
 * @returns Best FlorResult among team members, or null if no one has flor
 */
export function calculateTeamFlor(hands: Card[][]): FlorResult | null {
  if (hands.length === 0) {
    return null;
  }

  let bestFlor: FlorResult | null = null;

  for (const hand of hands) {
    const flor = calculateFlor(hand);

    if (flor !== null) {
      if (bestFlor === null || flor.score > bestFlor.score) {
        bestFlor = flor;
      }
    }
  }

  return bestFlor;
}

/**
 * Compares two flor results
 * @returns positive if flor1 wins, negative if flor2 wins, 0 if tie
 */
export function compareFlor(flor1: FlorResult | null, flor2: FlorResult | null): number {
  if (flor1 === null && flor2 === null) {
    return 0;
  }

  if (flor1 === null) {
    return -1;
  }

  if (flor2 === null) {
    return 1;
  }

  return flor1.score - flor2.score;
}
