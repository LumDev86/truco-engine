/**
 * Card types and utilities for Spanish deck
 */

export type Suit = "espada" | "basto" | "oro" | "copa";

export interface Card {
  value: number;
  suit: Suit;
  id: string;
}

/**
 * Valid card values in Spanish deck
 */
export const VALID_VALUES = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

/**
 * All possible suits
 */
export const SUITS: Suit[] = ["espada", "basto", "oro", "copa"];

/**
 * Creates a card with a unique identifier
 */
export function createCard(value: number, suit: Suit): Card {
  if (!VALID_VALUES.includes(value)) {
    throw new Error(`Invalid card value: ${value}`);
  }

  return {
    value,
    suit,
    id: `${value}-${suit}`
  };
}

/**
 * Formats a card for display
 */
export function formatCard(card: Card): string {
  return `${card.value} de ${card.suit}`;
}
