/**
 * Truco Argentino Game Engine
 * A complete library for implementing Truco Argentino card game
 * Supports 1v1, 2v2, and 3v3 formats
 */

// Cards
export {
  Card,
  Suit,
  VALID_VALUES,
  SUITS,
  createCard,
  formatCard
} from "./src/cards/cards";

export {
  createDeck,
  shuffle,
  deal,
  createShuffledDeck
} from "./src/cards/deck";

export {
  getCardRank,
  compareCards,
  getWinningCard,
  beats
} from "./src/cards/hierarchy";

// Envido
export {
  EnvidoResult,
  calculateEnvido,
  getEnvidoValue,
  calculateTeamEnvido,
  compareEnvido
} from "./src/envido/envido";

export {
  EnvidoBet,
  EnvidoState,
  EnvidoManager,
  calculateEnvidoPoints,
  getEnvidoSequenceValue,
  canMakeEnvidoBet,
  getEnvidoBetName,
  createEnvidoManager
} from "./src/envido/envidoManager";

export {
  FlorResult,
  hasFlor,
  calculateFlor,
  calculateTeamFlor,
  compareFlor
} from "./src/envido/flor";

// Truco
export {
  TrucoState,
  nextTrucoState,
  canRaise,
  getTrucoPoints,
  getTrucoStateName
} from "./src/truco/trucoState";

export {
  TrucoAction,
  TrucoManager,
  createTrucoManager,
  getRejectionPoints,
  getWinPoints
} from "./src/truco/truco";

// Match
export {
  Player,
  createPlayer,
  removeCardFromHand,
  addCardsToHand,
  hasCard,
  clearHand
} from "./src/match/player";

export {
  Team,
  createTeam,
  addPoints,
  getTeamPlayers,
  isPlayerInTeam,
  getTeamSize
} from "./src/match/team";

export {
  TurnManager,
  createTurnManager,
  createTurnOrder
} from "./src/match/turnManager";

export {
  CardPlay,
  RoundResult,
  resolveRound,
  determineMatchWinner
} from "./src/match/round";

export {
  Match,
  MatchConfig,
  MatchState
} from "./src/match/match";
