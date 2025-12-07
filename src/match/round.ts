/**
 * Round resolution logic
 */

import { Card } from "../cards/cards";
import { getWinningCard } from "../cards/hierarchy";

export interface CardPlay {
  playerId: string;
  card: Card;
  teamId: string;
}

export interface RoundResult {
  winnerTeamId: string | null;
  winningCard: Card | null;
  playedCards: CardPlay[];
  isTie: boolean;
}

/**
 * Resolves a round based on cards played
 * @param plays - All card plays in the round
 * @returns Round result with winner information
 */
export function resolveRound(plays: CardPlay[]): RoundResult {
  if (plays.length === 0) {
    return {
      winnerTeamId: null,
      winningCard: null,
      playedCards: [],
      isTie: false
    };
  }

  // Get all played cards
  const cards = plays.map(p => p.card);

  // Find winning card
  const winningCard = getWinningCard(cards);

  // If tie, no winner
  if (winningCard === null) {
    return {
      winnerTeamId: null,
      winningCard: null,
      playedCards: plays,
      isTie: true
    };
  }

  // Find who played the winning card
  const winningPlay = plays.find(p => p.card.id === winningCard.id);

  if (!winningPlay) {
    throw new Error("Winning card not found in plays");
  }

  return {
    winnerTeamId: winningPlay.teamId,
    winningCard,
    playedCards: plays,
    isTie: false
  };
}

/**
 * Determines the winner of a match based on multiple round results
 * Rules:
 * - Win 2 rounds = win match
 * - Win 1st round, tie 2nd = win match
 * - Tie 1st round, winner of 2nd round wins match
 */
export function determineMatchWinner(roundResults: RoundResult[]): string | null {
  if (roundResults.length === 0) {
    return null;
  }

  const roundWins = new Map<string, number>();
  let firstRoundWinner: string | null = null;

  // Count wins per team
  for (let i = 0; i < roundResults.length; i++) {
    const result = roundResults[i];
    if (!result) continue;

    if (i === 0 && !result.isTie && result.winnerTeamId) {
      firstRoundWinner = result.winnerTeamId;
    }

    if (!result.isTie && result.winnerTeamId) {
      const wins = roundWins.get(result.winnerTeamId) || 0;
      roundWins.set(result.winnerTeamId, wins + 1);
    }
  }

  // Check if any team won 2 rounds
  for (const [teamId, wins] of roundWins.entries()) {
    if (wins >= 2) {
      return teamId;
    }
  }

  // Special case: first round winner + second round tie
  const secondRound = roundResults[1];
  if (roundResults.length >= 2 && firstRoundWinner && secondRound?.isTie) {
    return firstRoundWinner;
  }

  // Special case: first round tie, second round determines winner
  const firstRound = roundResults[0];
  if (roundResults.length >= 2 && firstRound?.isTie && secondRound && !secondRound.isTie) {
    return secondRound.winnerTeamId;
  }

  // No clear winner yet
  return null;
}
