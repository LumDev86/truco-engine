/**
 * Team management
 */

import { Player } from "./player";

export interface Team {
  id: string;
  playerIds: string[];
  score: number;
  name?: string;
}

/**
 * Creates a new team
 */
export function createTeam(id: string, playerIds: string[], name?: string): Team {
  return {
    id,
    playerIds,
    score: 0,
    name
  };
}

/**
 * Adds points to a team
 */
export function addPoints(team: Team, points: number): void {
  team.score += points;
}

/**
 * Gets players belonging to a team
 */
export function getTeamPlayers(team: Team, allPlayers: Player[]): Player[] {
  return allPlayers.filter(player => team.playerIds.includes(player.id));
}

/**
 * Checks if a player belongs to a team
 */
export function isPlayerInTeam(team: Team, playerId: string): boolean {
  return team.playerIds.includes(playerId);
}

/**
 * Gets team member count
 */
export function getTeamSize(team: Team): number {
  return team.playerIds.length;
}
