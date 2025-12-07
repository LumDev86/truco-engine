/**
 * Example: Envido Betting System
 * Demonstrates how to use Envido, Real Envido, and Falta Envido
 */

import {
  createEnvidoManager,
  EnvidoBet,
  calculateEnvido,
  createCard
} from '../index';

console.log('🎴 Envido Betting System Example\n');

// Create envido manager
const envidoManager = createEnvidoManager();

console.log('=== Scenario 1: Simple Envido ===');
console.log('Player 1 calls: Envido');
envidoManager.callEnvido();
console.log('Current bets:', envidoManager.bets.map(b => EnvidoBet[b]));
console.log('Points at stake (if accepted):', envidoManager.getPointsAtStake(30, 20)); // 2 points
console.log('');

console.log('Player 2 raises: Real Envido');
envidoManager.callRealEnvido();
console.log('Current bets:', envidoManager.bets.map(b => EnvidoBet[b]));
console.log('Points at stake (if accepted):', envidoManager.getPointsAtStake(30, 20)); // 2 + 3 = 5 points
console.log('');

// Player accepts
console.log('Player 1 accepts!');
envidoManager.accept();

// Calculate envido scores
const player1Hand = [
  createCard(7, 'espada'),
  createCard(6, 'espada'),
  createCard(2, 'oro')
];

const player2Hand = [
  createCard(5, 'copa'),
  createCard(4, 'copa'),
  createCard(1, 'basto')
];

const player1Envido = calculateEnvido(player1Hand);
const player2Envido = calculateEnvido(player2Hand);

console.log(`Player 1 envido: ${player1Envido.score} (${player1Envido.cards.map(c => `${c.value} ${c.suit}`).join(', ')})`);
console.log(`Player 2 envido: ${player2Envido.score} (${player2Envido.cards.map(c => `${c.value} ${c.suit}`).join(', ')})`);

if (player1Envido.score > player2Envido.score) {
  console.log(`✅ Player 1 wins 5 points!`);
} else {
  console.log(`✅ Player 2 wins 5 points!`);
}

console.log('\n=== Scenario 2: Falta Envido ===');
envidoManager.reset();

console.log('Current match score: Player 1: 25pts, Player 2: 20pts');
console.log('Player 1 calls: Envido');
envidoManager.callEnvido();

console.log('Player 2 raises: FALTA ENVIDO!');
envidoManager.callFaltaEnvido();

const pointsToWin = 30;
const player1Score = 25;
const pointsNeeded = pointsToWin - player1Score;

console.log(`Points at stake: ${pointsNeeded} (points needed for Player 1 to win)`);
console.log('This is a high-risk bet!');
console.log('');

console.log('=== Scenario 3: Envido Rejection ===');
envidoManager.reset();

console.log('Player 1 calls: Envido');
envidoManager.callEnvido();

console.log('Player 2 calls: Real Envido');
envidoManager.callRealEnvido();

console.log('Player 1 rejects (no quiero)');
const rejectionPoints = envidoManager.reject();
console.log(`Player 2 wins ${rejectionPoints} points by rejection`);
console.log('');

console.log('=== Available Bets ===');
const newManager = createEnvidoManager();

console.log('Can call Envido?', newManager.canCall(EnvidoBet.ENVIDO)); // true
console.log('Can call Real Envido?', newManager.canCall(EnvidoBet.REAL_ENVIDO)); // false (need Envido first)
console.log('Can call Falta Envido?', newManager.canCall(EnvidoBet.FALTA_ENVIDO)); // true

newManager.callEnvido();
console.log('\nAfter calling Envido:');
console.log('Can call Envido again?', newManager.canCall(EnvidoBet.ENVIDO)); // false
console.log('Can call Real Envido?', newManager.canCall(EnvidoBet.REAL_ENVIDO)); // true
console.log('Can call Falta Envido?', newManager.canCall(EnvidoBet.FALTA_ENVIDO)); // true

console.log('\n🎯 Summary of Envido Bets:');
console.log('- Envido: 2 points');
console.log('- Envido + Real Envido: 5 points total');
console.log('- Falta Envido: Points needed to win the match');
console.log('- Rejection awards points based on accumulated bets');
