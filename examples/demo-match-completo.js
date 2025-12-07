/**
 * Demo de un Match Completo con Envido y Truco
 * Ejecutar con: node examples/demo-match-completo.js
 */

const {
  Match,
  calculateEnvido,
  createEnvidoManager,
  hasFlor,
  calculateFlor
} = require('../dist/index.js');

console.log('🎮 ============================================');
console.log('   DEMO: Match Completo de Truco');
console.log('============================================\n');

// Crear match 1v1
const match = new Match({
  teams: [
    { id: 'team1', playerIds: ['Juan'], name: 'Juan' },
    { id: 'team2', playerIds: ['Pedro'], name: 'Pedro' }
  ],
  pointsToWin: 15
});

console.log('🎯 Match: Juan vs Pedro');
console.log('   Primera a 15 puntos\n');

// Obtener estado inicial
const state = match.getState();
const players = state.players;

console.log('🃏 MANO INICIAL:\n');

// Mostrar manos y envido de cada jugador
players.forEach(player => {
  console.log(`${player.id}:`);
  player.hand.forEach(card => {
    console.log(`  🂠 ${card.value} de ${card.suit}`);
  });

  // Calcular envido
  const envido = calculateEnvido(player.hand);
  console.log(`  📊 Envido: ${envido.score} pts`);

  // Verificar flor
  if (hasFlor(player.hand)) {
    const flor = calculateFlor(player.hand);
    console.log(`  🌸 ¡FLOR! ${flor.score} pts`);
  }

  console.log('');
});

// Simular canto de Envido
console.log('💬 CANTOS:\n');

const envidoManager = createEnvidoManager();

console.log('Juan: "¡ENVIDO!"');
envidoManager.callEnvido();

console.log('Pedro: "¡REAL ENVIDO!"');
envidoManager.callRealEnvido();

console.log('Juan: "¡QUIERO!"\n');
envidoManager.accept();

const pointsAtStake = envidoManager.getPointsAtStake(15, 0);
console.log(`💰 Puntos en juego: ${pointsAtStake}\n`);

// Comparar envido
const juan = players.find(p => p.id === 'Juan');
const pedro = players.find(p => p.id === 'Pedro');

const juanEnvido = calculateEnvido(juan.hand);
const pedroEnvido = calculateEnvido(pedro.hand);

console.log('📊 RESULTADO DEL ENVIDO:\n');
console.log(`Juan muestra: ${juanEnvido.score} (${juanEnvido.cards.map(c => c.value + ' ' + c.suit).join(', ')})`);
console.log(`Pedro muestra: ${pedroEnvido.score} (${pedroEnvido.cards.map(c => c.value + ' ' + c.suit).join(', ')})`);

let currentScores = { Juan: 0, Pedro: 0 };

if (juanEnvido.score > pedroEnvido.score) {
  console.log(`\n✅ ¡Juan gana el envido! +${pointsAtStake} puntos\n`);
  currentScores.Juan += pointsAtStake;
} else if (pedroEnvido.score > juanEnvido.score) {
  console.log(`\n✅ ¡Pedro gana el envido! +${pointsAtStake} puntos\n`);
  currentScores.Pedro += pointsAtStake;
} else {
  console.log(`\n⚖️  ¡Empate en envido! Gana la mano\n`);
}

console.log('📊 Marcador actual:');
console.log(`   Juan: ${currentScores.Juan} pts`);
console.log(`   Pedro: ${currentScores.Pedro} pts\n`);

// Simular jugada de las cartas
console.log('🎴 JUGANDO LAS CARTAS:\n');

console.log('=== RONDA 1 ===');
let roundNum = 0;

while (!match.isMatchFinished() && roundNum < 3) {
  const currentPlayer = match.getCurrentPlayer();

  if (currentPlayer && currentPlayer.hand.length > 0) {
    const card = currentPlayer.hand[0];
    console.log(`${currentPlayer.id} juega: ${card.value} de ${card.suit}`);

    match.play(currentPlayer.id, card.id);

    // Verificar si terminó la ronda
    const newState = match.getState();
    if (newState.playsInCurrentRound.length === 0 && newState.roundResults.length > roundNum) {
      roundNum++;
      const lastResult = newState.roundResults[newState.roundResults.length - 1];

      if (lastResult.isTie) {
        console.log('⚖️  ¡Parda!\n');
      } else {
        const winnerTeam = newState.teams.find(t => t.id === lastResult.winnerTeamId);
        console.log(`✅ Gana ${winnerTeam?.name} con ${lastResult.winningCard?.value} de ${lastResult.winningCard?.suit}\n`);
      }

      if (roundNum < 3 && !match.isMatchFinished()) {
        console.log(`=== RONDA ${roundNum + 1} ===`);
      }
    }
  }
}

// Resultado final de la mano
const finalState = match.getState();
const finalTeams = finalState.teams;

console.log('\n📊 RESULTADO DE LA MANO:\n');

finalTeams.forEach(team => {
  console.log(`${team.name}: ${team.score} puntos`);
});

console.log('\n' + '='.repeat(50));

if (match.isMatchFinished()) {
  const winner = match.getWinner();
  console.log(`\n🏆 ¡¡${winner?.name?.toUpperCase()} GANA LA PARTIDA!!\n`);
} else {
  console.log('\nMano terminada. La partida continúa...\n');
  console.log('💡 Para jugar más manos, se repartirían nuevas cartas');
  console.log('   y se continuaría hasta que alguien llegue a 15 puntos.\n');
}

console.log('============================================\n');
console.log('📖 Este es un ejemplo simplificado.');
console.log('   En un juego real, los jugadores:');
console.log('   - Deciden cuándo cantar envido/truco');
console.log('   - Eligen qué carta jugar estratégicamente');
console.log('   - Pueden rechazar cantos');
console.log('   - Tienen más interacción\n');
