/**
 * Match engine for Truco Argentino
 * Supports 1v1, 2v2, and 3v3 formats
 */

import { createShuffledDeck, deal } from "../cards/deck";
import { Player, createPlayer, removeCardFromHand, addCardsToHand, clearHand } from "./player";
import { Team, createTeam, addPoints } from "./team";
import { TurnManager, createTurnManager, createTurnOrder } from "./turnManager";
import { CardPlay, RoundResult, resolveRound, determineMatchWinner } from "./round";
import { TrucoState } from "../truco/trucoState";

export interface MatchConfig {
  teams: Array<{
    id: string;
    playerIds: string[];
    name?: string;
  }>;
  pointsToWin?: number;
}

export interface MatchState {
  players: Player[];
  teams: Team[];
  currentRound: number;
  roundResults: RoundResult[];
  playsInCurrentRound: CardPlay[];
  turnManager: TurnManager;
  trucoState: TrucoState;
  isFinished: boolean;
}

export class Match {
  private players: Player[];
  private teams: Team[];
  private turnManager: TurnManager;
  private currentRound: number;
  private roundResults: RoundResult[];
  private playsInCurrentRound: CardPlay[];
  private trucoState: TrucoState;
  private pointsToWin: number;
  private isFinished: boolean;

  constructor(config: MatchConfig) {
    this.validateConfig(config);

    // Initialize teams
    this.teams = config.teams.map(t => createTeam(t.id, t.playerIds, t.name));

    // Initialize players
    this.players = [];
    for (const team of config.teams) {
      for (const playerId of team.playerIds) {
        this.players.push(createPlayer(playerId, team.id));
      }
    }

    // Create turn order
    const teamAssignments = new Map<string, string>();
    for (const player of this.players) {
      teamAssignments.set(player.id, player.teamId);
    }

    const turnOrder = createTurnOrder(
      this.players.map(p => p.id),
      teamAssignments
    );

    this.turnManager = createTurnManager(turnOrder);

    // Initialize match state
    this.currentRound = 0;
    this.roundResults = [];
    this.playsInCurrentRound = [];
    this.trucoState = TrucoState.NORMAL;
    this.pointsToWin = config.pointsToWin || 30;
    this.isFinished = false;

    // Deal initial cards
    this.dealCards();
  }

  /**
   * Validates match configuration
   */
  private validateConfig(config: MatchConfig): void {
    if (config.teams.length < 2) {
      throw new Error("Match requires at least 2 teams");
    }

    if (config.teams.length > 2) {
      throw new Error("Match supports maximum 2 teams");
    }

    const totalPlayers = config.teams.reduce((sum, t) => sum + t.playerIds.length, 0);

    if (totalPlayers < 2 || totalPlayers > 6) {
      throw new Error("Match requires 2-6 players");
    }

    // Validate team sizes are equal
    const teamSizes = config.teams.map(t => t.playerIds.length);
    const firstSize = teamSizes[0];

    if (!teamSizes.every(size => size === firstSize)) {
      throw new Error("All teams must have the same number of players");
    }
  }

  /**
   * Deals cards to all players
   */
  private dealCards(): void {
    const deck = createShuffledDeck();
    const hands = deal(deck, this.players.length, 3);

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      const hand = hands[i];
      if (player && hand) {
        clearHand(player);
        addCardsToHand(player, hand);
      }
    }
  }

  /**
   * Plays a card for a player
   */
  play(playerId: string, cardId: string): void {
    if (this.isFinished) {
      throw new Error("Match is already finished");
    }

    // Validate it's player's turn
    if (this.turnManager.current() !== playerId) {
      throw new Error(`Not player ${playerId}'s turn`);
    }

    // Find player
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    // Remove card from hand
    const card = removeCardFromHand(player, cardId);
    if (!card) {
      throw new Error(`Card ${cardId} not found in player's hand`);
    }

    // Record play
    this.playsInCurrentRound.push({
      playerId,
      card,
      teamId: player.teamId
    });

    // Move to next turn
    this.turnManager.next();

    // Check if round is complete
    if (this.playsInCurrentRound.length === this.players.length) {
      this.finishRound();
    }
  }

  /**
   * Finishes the current round
   */
  private finishRound(): void {
    // Resolve round
    const result = resolveRound(this.playsInCurrentRound);
    this.roundResults.push(result);

    // Clear plays for next round
    this.playsInCurrentRound = [];
    this.currentRound++;

    // Check if hand is finished (3 rounds played or clear winner)
    const handWinner = determineMatchWinner(this.roundResults);

    if (handWinner || this.roundResults.length >= 3) {
      this.finishHand(handWinner);
    }
  }

  /**
   * Finishes the current hand and awards points
   */
  private finishHand(winnerTeamId: string | null): void {
    if (winnerTeamId) {
      const team = this.teams.find(t => t.id === winnerTeamId);
      if (team) {
        // Award points based on truco state
        const points = this.trucoState;
        addPoints(team, points);
      }
    }

    // Check if match is won
    const matchWinner = this.teams.find(t => t.score >= this.pointsToWin);
    if (matchWinner) {
      this.isFinished = true;
      return;
    }

    // Start new hand
    this.startNewHand();
  }

  /**
   * Starts a new hand
   */
  private startNewHand(): void {
    this.currentRound = 0;
    this.roundResults = [];
    this.playsInCurrentRound = [];
    this.trucoState = TrucoState.NORMAL;
    this.dealCards();
    this.turnManager.reset();
  }

  /**
   * Gets current match state
   */
  getState(): MatchState {
    return {
      players: this.players,
      teams: this.teams,
      currentRound: this.currentRound,
      roundResults: this.roundResults,
      playsInCurrentRound: this.playsInCurrentRound,
      turnManager: this.turnManager,
      trucoState: this.trucoState,
      isFinished: this.isFinished
    };
  }

  /**
   * Gets the current player
   */
  getCurrentPlayer(): Player | undefined {
    const currentId = this.turnManager.current();
    return this.players.find(p => p.id === currentId);
  }

  /**
   * Gets a player by ID
   */
  getPlayer(playerId: string): Player | undefined {
    return this.players.find(p => p.id === playerId);
  }

  /**
   * Gets a team by ID
   */
  getTeam(teamId: string): Team | undefined {
    return this.teams.find(t => t.id === teamId);
  }

  /**
   * Checks if match is finished
   */
  isMatchFinished(): boolean {
    return this.isFinished;
  }

  /**
   * Gets the winner of the match
   */
  getWinner(): Team | null {
    if (!this.isFinished) {
      return null;
    }

    const winner = this.teams.find(t => t.score >= this.pointsToWin);
    return winner || null;
  }

  /**
   * Gets current round number
   */
  getCurrentRound(): number {
    return this.currentRound;
  }

  /**
   * Gets all teams
   */
  getTeams(): Team[] {
    return this.teams;
  }

  /**
   * Gets all players
   */
  getPlayers(): Player[] {
    return this.players;
  }
}
