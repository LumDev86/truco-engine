/**
 * Example: Basic 1v1 Match
 * This example demonstrates a simple 1v1 Truco match
 */

import { Match, MatchConfig, calculateEnvido, hasFlor } from '../index';

// Create a 1v1 match configuration
const config: MatchConfig = {
  teams: [
    { id: 'team1', playerIds: ['alice'], name: 'Alice' },
    { id: 'team2', playerIds: ['bob'], name: 'Bob' }
  ],
  pointsToWin: 15 // First to 15 points wins
};

// Initialize the match
const match = new Match(config);

console.log('🎮 Starting Truco 1v1 Match!\n');

// Show initial hands and envido scores
const players = match.getPlayers();
players.forEach(player => {
  console.log(`${player.id}'s hand:`);
  player.hand.forEach(card => {
    console.log(`  - ${card.value} de ${card.suit}`);
  });

  const envido = calculateEnvido(player.hand);
  console.log(`  Envido: ${envido.score}`);

  if (hasFlor(player.hand)) {
    console.log(`  🌸 Has FLOR!`);
  }
  console.log('');
});

// Play a complete hand (3 rounds)
let roundCount = 0;
while (!match.isMatchFinished() && roundCount < 3) {
  const currentPlayer = match.getCurrentPlayer();

  if (currentPlayer && currentPlayer.hand.length > 0) {
    // Play the first card in hand
    const card = currentPlayer.hand[0];
    console.log(`${currentPlayer.id} plays: ${card.value} de ${card.suit}`);
    match.play(currentPlayer.id, card.id);

    // Check if round finished
    const state = match.getState();
    if (state.playsInCurrentRound.length === 0 && state.roundResults.length > roundCount) {
      roundCount++;
      const lastResult = state.roundResults[state.roundResults.length - 1];

      if (lastResult.isTie) {
        console.log('⚖️  Round tied!\n');
      } else {
        console.log(`✅ ${lastResult.winnerTeamId} wins the round!\n`);
      }
    }
  }
}

// Show final scores
console.log('\n📊 Final Scores:');
const teams = match.getTeams();
teams.forEach(team => {
  console.log(`${team.name}: ${team.score} points`);
});

if (match.isMatchFinished()) {
  const winner = match.getWinner();
  console.log(`\n🏆 Winner: ${winner?.name}!`);
} else {
  console.log('\n(Hand finished, match continues...)');
}
