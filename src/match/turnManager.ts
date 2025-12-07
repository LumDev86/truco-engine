/**
 * Turn management for matches
 */

export interface TurnManager {
  playerIds: string[];
  currentIndex: number;
  current(): string;
  next(): string;
  setCurrentPlayer(playerId: string): void;
  reset(): void;
}

/**
 * Creates a turn manager
 */
export function createTurnManager(playerIds: string[]): TurnManager {
  if (playerIds.length === 0) {
    throw new Error("Cannot create turn manager with no players");
  }

  let currentIndex = 0;

  return {
    playerIds: [...playerIds],

    get currentIndex() {
      return currentIndex;
    },

    current(): string {
      const player = playerIds[currentIndex];
      if (!player) {
        throw new Error("No current player found");
      }
      return player;
    },

    next(): string {
      currentIndex = (currentIndex + 1) % playerIds.length;
      const player = playerIds[currentIndex];
      if (!player) {
        throw new Error("No next player found");
      }
      return player;
    },

    setCurrentPlayer(playerId: string): void {
      const index = playerIds.indexOf(playerId);
      if (index === -1) {
        throw new Error(`Player ${playerId} not found in turn order`);
      }
      currentIndex = index;
    },

    reset(): void {
      currentIndex = 0;
    }
  };
}

/**
 * Creates turn order for a match
 * In team games, alternates between teams
 */
export function createTurnOrder(playerIds: string[], teamAssignments: Map<string, string>): string[] {
  if (teamAssignments.size === 0) {
    // No teams, use natural order
    return [...playerIds];
  }

  // Group players by team
  const teamGroups = new Map<string, string[]>();

  for (const playerId of playerIds) {
    const teamId = teamAssignments.get(playerId);
    if (!teamId) {
      continue;
    }

    const group = teamGroups.get(teamId) || [];
    group.push(playerId);
    teamGroups.set(teamId, group);
  }

  // Interleave teams
  const teams = Array.from(teamGroups.values());
  const turnOrder: string[] = [];
  let maxTeamSize = Math.max(...teams.map(t => t.length));

  for (let i = 0; i < maxTeamSize; i++) {
    for (const team of teams) {
      if (i < team.length) {
        const player = team[i];
        if (player) {
          turnOrder.push(player);
        }
      }
    }
  }

  return turnOrder;
}
