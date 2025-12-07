/**
 * Truco game logic
 */

import { TrucoState, nextTrucoState, canRaise, getTrucoPoints } from "./trucoState";

export interface TrucoAction {
  type: "raise" | "accept" | "reject";
  newState?: TrucoState;
}

export interface TrucoManager {
  currentState: TrucoState;
  raise(): TrucoState;
  accept(): void;
  reject(): void;
  getPoints(): number;
  canRaise(): boolean;
}

/**
 * Creates a new Truco manager
 */
export function createTrucoManager(): TrucoManager {
  let currentState: TrucoState = TrucoState.NORMAL;

  return {
    get currentState() {
      return currentState;
    },

    raise(): TrucoState {
      if (!canRaise(currentState)) {
        throw new Error("Cannot raise truco beyond Vale 4");
      }

      currentState = nextTrucoState(currentState);
      return currentState;
    },

    accept(): void {
      // Accepting confirms the current state
      // No state change needed
    },

    reject(): void {
      // Rejecting ends the round
      // Points are awarded based on previous state
    },

    getPoints(): number {
      return getTrucoPoints(currentState);
    },

    canRaise(): boolean {
      return canRaise(currentState);
    }
  };
}

/**
 * Calculates points awarded when truco is rejected
 * Points awarded = previous state value
 */
export function getRejectionPoints(stateWhenRejected: TrucoState): number {
  switch (stateWhenRejected) {
    case TrucoState.NORMAL:
      return 1; // No truco was called
    case TrucoState.TRUCO:
      return 1; // Rejecting truco gives 1 point
    case TrucoState.RETRUCO:
      return 2; // Rejecting retruco gives 2 points
    case TrucoState.VALE4:
      return 3; // Rejecting vale4 gives 3 points
    default:
      return 1;
  }
}

/**
 * Calculates points awarded when round is won
 */
export function getWinPoints(state: TrucoState): number {
  return getTrucoPoints(state);
}
