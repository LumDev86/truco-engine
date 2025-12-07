/**
 * Envido calculation logic
 */

import { Card } from "../cards/cards";

export interface EnvidoResult {
  score: number;
  cards: Card[];
}

/**
 * Calculates the envido score for a hand
 * Rules:
 * - Two cards of same suit: 20 + sum of values
 * - No cards of same suit: highest card value
 * - Face cards (10, 11, 12) count as 0
 */
export function calculateEnvido(hand: Card[]): EnvidoResult {
  if (hand.length === 0) {
    return { score: 0, cards: [] };
  }

  // Group cards by suit
  const cardsBySuit = new Map<string, Card[]>();

  for (const card of hand) {
    const suitCards = cardsBySuit.get(card.suit) || [];
    suitCards.push(card);
    cardsBySuit.set(card.suit, suitCards);
  }

  let bestScore = 0;
  let bestCards: Card[] = [];

  // Check each suit
  for (const cards of cardsBySuit.values()) {
    if (cards.length >= 2) {
      // Sort cards by value (descending)
      const sortedCards = [...cards].sort((a, b) => {
        const valueA = getEnvidoValue(a);
        const valueB = getEnvidoValue(b);
        return valueB - valueA;
      });

      // Take top 2 cards
      const topTwo = sortedCards.slice(0, 2);
      const score = 20 + topTwo.reduce((sum, card) => sum + getEnvidoValue(card), 0);

      if (score > bestScore) {
        bestScore = score;
        bestCards = topTwo;
      }
    }
  }

  // If no suit has 2+ cards, use highest card
  if (bestScore === 0) {
    const highestCard = hand.reduce((best, card) => {
      const bestValue = getEnvidoValue(best);
      const cardValue = getEnvidoValue(card);
      return cardValue > bestValue ? card : best;
    });

    bestScore = getEnvidoValue(highestCard);
    bestCards = [highestCard];
  }

  return { score: bestScore, cards: bestCards };
}

/**
 * Gets the envido value of a card
 * Face cards (10, 11, 12) = 0
 * Other cards = their face value
 */
export function getEnvidoValue(card: Card): number {
  return card.value >= 10 ? 0 : card.value;
}

/**
 * Calculates the best envido score for a team
 * Returns the highest score among all team members
 */
export function calculateTeamEnvido(hands: Card[][]): EnvidoResult {
  if (hands.length === 0) {
    return { score: 0, cards: [] };
  }

  let bestResult: EnvidoResult = { score: 0, cards: [] };

  for (const hand of hands) {
    const result = calculateEnvido(hand);
    if (result.score > bestResult.score) {
      bestResult = result;
    }
  }

  return bestResult;
}

/**
 * Compares two envido results
 * @returns positive if result1 wins, negative if result2 wins, 0 if tie
 */
export function compareEnvido(result1: EnvidoResult, result2: EnvidoResult): number {
  return result1.score - result2.score;
}
