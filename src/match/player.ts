/**
 * Player management
 */

import { Card } from "../cards/cards";

export interface Player {
  id: string;
  teamId: string;
  hand: Card[];
  name?: string;
}

/**
 * Creates a new player
 */
export function createPlayer(id: string, teamId: string, name?: string): Player {
  return {
    id,
    teamId,
    hand: [],
    name
  };
}

/**
 * Removes a card from player's hand
 */
export function removeCardFromHand(player: Player, cardId: string): Card | null {
  const cardIndex = player.hand.findIndex(card => card.id === cardId);

  if (cardIndex === -1) {
    return null;
  }

  const [card] = player.hand.splice(cardIndex, 1);
  return card || null;
}

/**
 * Adds cards to player's hand
 */
export function addCardsToHand(player: Player, cards: Card[]): void {
  player.hand.push(...cards);
}

/**
 * Checks if player has a specific card
 */
export function hasCard(player: Player, cardId: string): boolean {
  return player.hand.some(card => card.id === cardId);
}

/**
 * Clears player's hand
 */
export function clearHand(player: Player): void {
  player.hand = [];
}
