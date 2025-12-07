/**
 * Truco state management
 */

export enum TrucoState {
  NORMAL = 1,
  TRUCO = 2,
  RETRUCO = 3,
  VALE4 = 4
}

/**
 * Gets the next truco state
 * @throws Error if already at maximum state
 */
export function nextTrucoState(currentState: TrucoState): TrucoState {
  switch (currentState) {
    case TrucoState.NORMAL:
      return TrucoState.TRUCO;
    case TrucoState.TRUCO:
      return TrucoState.RETRUCO;
    case TrucoState.RETRUCO:
      return TrucoState.VALE4;
    case TrucoState.VALE4:
      throw new Error("Already at maximum truco state (Vale 4)");
    default:
      throw new Error(`Invalid truco state: ${currentState}`);
  }
}

/**
 * Checks if truco can be raised
 */
export function canRaise(currentState: TrucoState): boolean {
  return currentState !== TrucoState.VALE4;
}

/**
 * Gets the point value for the current truco state
 */
export function getTrucoPoints(state: TrucoState): number {
  return state;
}

/**
 * Gets the name of the truco state
 */
export function getTrucoStateName(state: TrucoState): string {
  switch (state) {
    case TrucoState.NORMAL:
      return "Normal";
    case TrucoState.TRUCO:
      return "Truco";
    case TrucoState.RETRUCO:
      return "Retruco";
    case TrucoState.VALE4:
      return "Vale 4";
    default:
      return "Unknown";
  }
}
