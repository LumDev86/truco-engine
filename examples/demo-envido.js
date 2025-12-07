/**
 * Demo ejecutable del sistema de Envido
 * Ejecutar con: node examples/demo-envido.js
 */

const {
  createEnvidoManager,
  calculateEnvido,
  createCard,
  EnvidoBet
} = require('../dist/index.js');

console.log('🎴 ============================================');
console.log('   DEMO: Sistema de Cantos de Envido');
console.log('============================================\n');

// ========================================
// ESCENARIO 1: Envido Simple
// ========================================
console.log('📌 ESCENARIO 1: Envido Simple\n');

const manager1 = createEnvidoManager();

console.log('Player 1: "ENVIDO!"');
manager1.callEnvido();
console.log(`  ↳ Puntos en juego: ${manager1.getPointsAtStake(30, 0)}\n`);

console.log('Player 2: "QUIERO!" (acepta)\n');
manager1.accept();

// Crear manos de ejemplo
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

const p1Envido = calculateEnvido(player1Hand);
const p2Envido = calculateEnvido(player2Hand);

console.log('Cartas Player 1:');
player1Hand.forEach(c => console.log(`  - ${c.value} de ${c.suit}`));
console.log(`  ENVIDO: ${p1Envido.score} pts\n`);

console.log('Cartas Player 2:');
player2Hand.forEach(c => console.log(`  - ${c.value} de ${c.suit}`));
console.log(`  ENVIDO: ${p2Envido.score} pts\n`);

if (p1Envido.score > p2Envido.score) {
  console.log(`✅ GANA Player 1 con ${p1Envido.score} pts`);
  console.log(`   Se lleva 2 puntos!\n`);
} else {
  console.log(`✅ GANA Player 2 con ${p2Envido.score} pts`);
  console.log(`   Se lleva 2 puntos!\n`);
}

// ========================================
// ESCENARIO 2: Envido + Real Envido
// ========================================
console.log('\n📌 ESCENARIO 2: Envido + Real Envido\n');

const manager2 = createEnvidoManager();

console.log('Player 1: "ENVIDO!"');
manager2.callEnvido();
console.log(`  ↳ Puntos en juego: ${manager2.getPointsAtStake(30, 0)}\n`);

console.log('Player 2: "REAL ENVIDO!" (sube la apuesta)');
manager2.callRealEnvido();
console.log(`  ↳ Puntos en juego: ${manager2.getPointsAtStake(30, 0)}\n`);

console.log('Player 1: "QUIERO!" (acepta)\n');
manager2.accept();

// Crear nuevas manos
const p1Hand2 = [
  createCard(6, 'oro'),
  createCard(5, 'oro'),
  createCard(1, 'espada')
];

const p2Hand2 = [
  createCard(7, 'basto'),
  createCard(4, 'basto'),
  createCard(2, 'copa')
];

const p1Env2 = calculateEnvido(p1Hand2);
const p2Env2 = calculateEnvido(p2Hand2);

console.log('Cartas Player 1:');
p1Hand2.forEach(c => console.log(`  - ${c.value} de ${c.suit}`));
console.log(`  ENVIDO: ${p1Env2.score} pts\n`);

console.log('Cartas Player 2:');
p2Hand2.forEach(c => console.log(`  - ${c.value} de ${c.suit}`));
console.log(`  ENVIDO: ${p2Env2.score} pts\n`);

if (p1Env2.score > p2Env2.score) {
  console.log(`✅ GANA Player 1 con ${p1Env2.score} pts`);
  console.log(`   Se lleva 5 puntos! (Envido + Real Envido)\n`);
} else {
  console.log(`✅ GANA Player 2 con ${p2Env2.score} pts`);
  console.log(`   Se lleva 5 puntos! (Envido + Real Envido)\n`);
}

// ========================================
// ESCENARIO 3: Falta Envido
// ========================================
console.log('\n📌 ESCENARIO 3: Falta Envido (Alto Riesgo!)\n');

const manager3 = createEnvidoManager();

const currentScore = 25;
const pointsToWin = 30;

console.log(`Marcador actual: Player 1 tiene ${currentScore} puntos`);
console.log(`Necesita ${pointsToWin - currentScore} puntos para ganar\n`);

console.log('Player 1: "ENVIDO!"');
manager3.callEnvido();

console.log('Player 2: "FALTA ENVIDO!" 😱 (apuesta todo!)\n');
manager3.callFaltaEnvido();

const pointsAtStake = manager3.getPointsAtStake(pointsToWin, currentScore);
console.log(`⚠️  PUNTOS EN JUEGO: ${pointsAtStake} puntos`);
console.log('    (Los puntos que le faltan al ganador para ganar la partida)\n');

console.log('Player 1: "QUIERO!" (acepta el desafío)\n');

const p1Hand3 = [
  createCard(7, 'espada'),
  createCard(6, 'espada'),
  createCard(5, 'espada')
];

const p2Hand3 = [
  createCard(4, 'oro'),
  createCard(3, 'oro'),
  createCard(2, 'copa')
];

const p1Env3 = calculateEnvido(p1Hand3);
const p2Env3 = calculateEnvido(p2Hand3);

console.log('Cartas Player 1:');
p1Hand3.forEach(c => console.log(`  - ${c.value} de ${c.suit}`));
console.log(`  ENVIDO: ${p1Env3.score} pts\n`);

console.log('Cartas Player 2:');
p2Hand3.forEach(c => console.log(`  - ${c.value} de ${c.suit}`));
console.log(`  ENVIDO: ${p2Env3.score} pts\n`);

if (p1Env3.score > p2Env3.score) {
  const newScore = currentScore + pointsAtStake;
  console.log(`✅ GANA Player 1 con ${p1Env3.score} pts`);
  console.log(`   Se lleva ${pointsAtStake} puntos!`);
  console.log(`   Nuevo marcador: ${newScore} puntos`);
  if (newScore >= pointsToWin) {
    console.log(`   🏆 ¡PLAYER 1 GANA LA PARTIDA!\n`);
  }
} else {
  console.log(`✅ GANA Player 2 con ${p2Env3.score} pts`);
  console.log(`   Se lleva ${pointsAtStake} puntos!\n`);
}

// ========================================
// ESCENARIO 4: Rechazo (No Quiero)
// ========================================
console.log('\n📌 ESCENARIO 4: Rechazo de Envido\n');

const manager4 = createEnvidoManager();

console.log('Player 1: "ENVIDO!"');
manager4.callEnvido();
console.log(`  ↳ Puntos en juego: ${manager4.getPointsAtStake(30, 0)}\n`);

console.log('Player 2: "REAL ENVIDO!"');
manager4.callRealEnvido();
console.log(`  ↳ Puntos en juego: ${manager4.getPointsAtStake(30, 0)}\n`);

console.log('Player 1: "NO QUIERO!" (rechaza)\n');
const rejectionPoints = manager4.reject();

console.log(`✅ Player 2 gana ${rejectionPoints} puntos por rechazo`);
console.log('   (Sin necesidad de mostrar las cartas)\n');

// ========================================
// RESUMEN
// ========================================
console.log('\n📊 ============================================');
console.log('   RESUMEN DE CANTOS DE ENVIDO');
console.log('============================================\n');

console.log('ENVIDO:           2 puntos');
console.log('REAL ENVIDO:      3 puntos (requiere Envido primero)');
console.log('ENVIDO + REAL:    5 puntos total (acumulado)');
console.log('FALTA ENVIDO:     Puntos que faltan para ganar\n');

console.log('RECHAZO:');
console.log('  - Si rechazo Envido:        1 punto');
console.log('  - Si rechazo Real Envido:   3 puntos');
console.log('  - Si rechazo Falta Envido:  Puntos acumulados previos\n');

console.log('¡Prueba tú mismo la librería! 🎮');
console.log('============================================\n');
