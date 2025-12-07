/**
 * Envido betting system management
 * Handles: Envido, Real Envido, Falta Envido
 */

export enum EnvidoBet {
  NONE = 0,
  ENVIDO = 2,
  REAL_ENVIDO = 3,
  FALTA_ENVIDO = -1 // Special: points needed to win
}

export interface EnvidoState {
  currentBets: EnvidoBet[];
  isActive: boolean;
  canRaise: boolean;
}

/**
 * Calculates total points at stake for envido bets
 * @param bets - Array of envido bets made
 * @param pointsToWin - Total points needed to win the match
 * @param winnerCurrentScore - Current score of the team that would win
 * @returns Total points at stake
 */
export function calculateEnvidoPoints(
  bets: EnvidoBet[],
  pointsToWin: number = 30,
  winnerCurrentScore: number = 0
): number {
  if (bets.length === 0) {
    return 0;
  }

  let totalPoints = 0;
  let hasFaltaEnvido = false;

  for (const bet of bets) {
    if (bet === EnvidoBet.FALTA_ENVIDO) {
      hasFaltaEnvido = true;
    } else {
      totalPoints += bet;
    }
  }

  // If Falta Envido is called, calculate points needed to win
  if (hasFaltaEnvido) {
    const pointsNeeded = pointsToWin - winnerCurrentScore;
    return pointsNeeded;
  }

  // Base envido is always counted
  // When envido is called, it's worth 2 points
  // Additional bets add their values
  return totalPoints > 0 ? totalPoints : 0;
}

/**
 * Gets the sequence value for accumulated envido bets
 * Envido: 2
 * Envido + Real Envido: 2 + 3 = 5
 * Envido + Real Envido + Falta Envido: Falta (variable)
 */
export function getEnvidoSequenceValue(bets: EnvidoBet[]): number {
  let total = 0;

  for (const bet of bets) {
    if (bet === EnvidoBet.FALTA_ENVIDO) {
      return -1; // Indicates Falta Envido (variable points)
    }
    total += bet;
  }

  return total;
}

/**
 * Validates if a bet can be made given current state
 */
export function canMakeEnvidoBet(
  currentBets: EnvidoBet[],
  newBet: EnvidoBet
): boolean {
  // Can't bet if Falta Envido already called
  if (currentBets.includes(EnvidoBet.FALTA_ENVIDO)) {
    return false;
  }

  // Can't call the same bet twice
  if (currentBets.includes(newBet)) {
    return false;
  }

  // Falta Envido can be called anytime
  if (newBet === EnvidoBet.FALTA_ENVIDO) {
    return true;
  }

  // Real Envido can be called if Envido was called first
  if (newBet === EnvidoBet.REAL_ENVIDO) {
    return currentBets.includes(EnvidoBet.ENVIDO);
  }

  // Envido can always be called first
  if (newBet === EnvidoBet.ENVIDO) {
    return currentBets.length === 0;
  }

  return false;
}

/**
 * Gets the name of an envido bet
 */
export function getEnvidoBetName(bet: EnvidoBet): string {
  switch (bet) {
    case EnvidoBet.NONE:
      return "None";
    case EnvidoBet.ENVIDO:
      return "Envido";
    case EnvidoBet.REAL_ENVIDO:
      return "Real Envido";
    case EnvidoBet.FALTA_ENVIDO:
      return "Falta Envido";
    default:
      return "Unknown";
  }
}

/**
 * Creates an envido manager for a match
 */
export interface EnvidoManager {
  bets: EnvidoBet[];
  callEnvido(): void;
  callRealEnvido(): void;
  callFaltaEnvido(): void;
  accept(): number; // Returns points at stake
  reject(): number; // Returns points awarded for rejection
  getPointsAtStake(pointsToWin: number, winnerScore: number): number;
  canCall(bet: EnvidoBet): boolean;
  isActive(): boolean;
  reset(): void;
}

export function createEnvidoManager(): EnvidoManager {
  let bets: EnvidoBet[] = [];
  let active = false;

  return {
    get bets() {
      return [...bets];
    },

    callEnvido(): void {
      if (canMakeEnvidoBet(bets, EnvidoBet.ENVIDO)) {
        bets.push(EnvidoBet.ENVIDO);
        active = true;
      } else {
        throw new Error("Cannot call Envido in current state");
      }
    },

    callRealEnvido(): void {
      if (canMakeEnvidoBet(bets, EnvidoBet.REAL_ENVIDO)) {
        bets.push(EnvidoBet.REAL_ENVIDO);
        active = true;
      } else {
        throw new Error("Cannot call Real Envido in current state");
      }
    },

    callFaltaEnvido(): void {
      if (canMakeEnvidoBet(bets, EnvidoBet.FALTA_ENVIDO)) {
        bets.push(EnvidoBet.FALTA_ENVIDO);
        active = true;
      } else {
        throw new Error("Cannot call Falta Envido in current state");
      }
    },

    accept(): number {
      if (!active) {
        throw new Error("No active envido bet");
      }
      // Points will be calculated when winner is determined
      return 0;
    },

    reject(): number {
      if (!active) {
        throw new Error("No active envido bet");
      }

      // When rejected, award points based on last bet before rejection
      let points = 1; // Default if only envido was called

      if (bets.length > 0) {
        // Award accumulated points up to the last bet
        const lastBet = bets[bets.length - 1];

        if (lastBet === EnvidoBet.ENVIDO) {
          points = 1;
        } else if (lastBet === EnvidoBet.REAL_ENVIDO) {
          points = 1 + EnvidoBet.ENVIDO; // 1 + 2 = 3
        } else if (lastBet === EnvidoBet.FALTA_ENVIDO) {
          points = 1 + getEnvidoSequenceValue(bets.slice(0, -1));
        }
      }

      active = false;
      return points;
    },

    getPointsAtStake(pointsToWin: number, winnerScore: number): number {
      if (!active) {
        return 0;
      }
      return calculateEnvidoPoints(bets, pointsToWin, winnerScore);
    },

    canCall(bet: EnvidoBet): boolean {
      return canMakeEnvidoBet(bets, bet);
    },

    isActive(): boolean {
      return active;
    },

    reset(): void {
      bets = [];
      active = false;
    }
  };
}
