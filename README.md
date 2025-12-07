# 🎴 Truco Engine

<div align="center">

**La librería TypeScript definitiva para implementar Truco Argentino**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![npm version](https://img.shields.io/badge/npm-1.0.0-red.svg)]()

[Características](#-características) •
[Instalación](#-instalación) •
[Inicio Rápido](#-inicio-rápido) •
[Documentación](#-documentación) •
[Ejemplos](#-ejemplos-completos) •
[API](#-api-reference)

</div>

---

## 🎯 Características

- ✅ **Baraja Española Completa** - 40 cartas con valores 1-7, 10-12
- ✅ **Jerarquía Oficial** - Implementación exacta de las reglas argentinas
- ✅ **Sistema de Envido Completo** - Envido, Real Envido y Falta Envido
- ✅ **Cálculo de Flor** - Detección y puntuación automática
- ✅ **Estados de Truco** - Normal → Truco → Retruco → Vale 4
- ✅ **Multi-Jugador** - Soporte para 1v1, 2v2 y 3v3
- ✅ **Gestión de Turnos** - Sistema automático de rotación
- ✅ **Motor de Partidas** - Engine completo con estado y validaciones
- ✅ **100% TypeScript** - Tipado completo, sin `any`
- ✅ **Arquitectura Limpia** - Modular y fácil de extender
- ✅ **Zero Dependencies** - Sin dependencias externas
- ✅ **Documentación Swagger** - OpenAPI 3.0 incluida

---

## 📦 Instalación

```bash
npm install truco-engine
```

O con yarn:

```bash
yarn add truco-engine
```

---

## 🚀 Inicio Rápido

### Match Básico 1v1

```typescript
import { Match } from 'truco-engine';

// Crear partida
const match = new Match({
  teams: [
    { id: 'team1', playerIds: ['alice'] },
    { id: 'team2', playerIds: ['bob'] }
  ],
  pointsToWin: 30
});

// Jugar una carta
match.play('alice', '1-espada');

// Ver estado
const state = match.getState();
console.log(state.teams); // Equipos y puntajes
```

### Sistema de Envido

```typescript
import { createEnvidoManager, calculateEnvido } from 'truco-engine';

// Crear manager de envido
const envido = createEnvidoManager();

// Secuencia de cantos
envido.callEnvido();        // 2 puntos
envido.callRealEnvido();    // 5 puntos total
envido.accept();             // Aceptar apuesta

// Calcular puntos de una mano
const hand = [
  { value: 7, suit: 'espada', id: '7-espada' },
  { value: 6, suit: 'espada', id: '6-espada' },
  { value: 2, suit: 'oro', id: '2-oro' }
];

const result = calculateEnvido(hand);
console.log(result.score); // 33 (20 + 7 + 6)
```

### Jerarquía de Cartas

```typescript
import { getCardRank, compareCards, getWinningCard } from 'truco-engine';

const ancho = { value: 1, suit: 'espada', id: '1-espada' };
const siete = { value: 7, suit: 'oro', id: '7-oro' };

const rank = getCardRank(ancho); // 1 (más fuerte)
const comparison = compareCards(ancho, siete); // > 0 (ancho gana)

// Determinar ganador de ronda
const cards = [ancho, siete];
const winner = getWinningCard(cards); // ancho
```

---

## 📖 Documentación

### Tabla de Contenidos

- [Módulo de Cartas](#módulo-de-cartas)
- [Sistema de Envido](#sistema-de-envido-completo)
- [Sistema de Flor](#módulo-de-flor)
- [Sistema de Truco](#módulo-de-truco)
- [Motor de Partidas](#motor-de-partidas-match-engine)
- [Ejemplos Completos](#-ejemplos-completos)
- [API Reference](#-api-reference)

---

## 🃏 Módulo de Cartas

### Crear y Manejar Mazos

```typescript
import { createDeck, shuffle, deal, createShuffledDeck } from 'truco-engine';

// Crear mazo español (40 cartas)
const deck = createDeck();

// Mezclar
const shuffled = shuffle(deck);

// O crear y mezclar en un paso
const ready = createShuffledDeck();

// Repartir cartas (3 por jugador por defecto)
const hands = deal(deck, 4); // 4 jugadores
```

### Jerarquía Oficial del Truco

```
🏆 Ranking (de mayor a menor):

1️⃣  1 de Espada      (El Ancho de Espadas)
2️⃣  1 de Basto       (El Ancho de Bastos)
3️⃣  7 de Espada
4️⃣  7 de Oro
5️⃣  3 (cualquier palo)
6️⃣  2 (cualquier palo)
7️⃣  1 de Copa / 1 de Oro
8️⃣  12 (Rey)
9️⃣  11 (Caballo)
🔟  10 (Sota)
1️⃣1️⃣  7 de Copa / 7 de Basto
1️⃣2️⃣  6
1️⃣3️⃣  5
1️⃣4️⃣  4
```

### Comparar Cartas

```typescript
import { compareCards, beats, getWinningCard } from 'truco-engine';

const card1 = { value: 1, suit: 'espada', id: '1-espada' };
const card2 = { value: 7, suit: 'oro', id: '7-oro' };

// Comparación (retorna positivo si card1 gana)
compareCards(card1, card2); // > 0

// Verificación simple
beats(card1, card2); // true

// Ganador de múltiples cartas
const winner = getWinningCard([card1, card2, ...]); // card1
// Retorna null si hay empate (parda)
```

---

## 💎 Sistema de Envido Completo

### Cantos Disponibles

| Canto | Puntos | Requiere | Descripción |
|-------|--------|----------|-------------|
| **Envido** | 2 | - | Primera apuesta |
| **Real Envido** | +3 | Envido primero | Suma 3 puntos más |
| **Falta Envido** | Variable | - | Puntos que faltan para ganar |

### Uso del Manager de Envido

```typescript
import { createEnvidoManager, EnvidoBet } from 'truco-engine';

const manager = createEnvidoManager();

// Secuencia típica
manager.callEnvido();
console.log(manager.getPointsAtStake(30, 0)); // 2 puntos

manager.callRealEnvido();
console.log(manager.getPointsAtStake(30, 0)); // 5 puntos total

// Aceptar
manager.accept();

// O rechazar (otorga puntos al oponente)
const awarded = manager.reject(); // 3 puntos
```

### Falta Envido - Alto Riesgo

```typescript
const manager = createEnvidoManager();

manager.callEnvido();
manager.callFaltaEnvido();

// Si un equipo tiene 25 puntos y necesita 30 para ganar
const stake = manager.getPointsAtStake(30, 25); // 5 puntos
// El ganador recibe los puntos que le faltan para ganar
```

### Cálculo de Envido

```typescript
import { calculateEnvido, calculateTeamEnvido } from 'truco-engine';

// Cálculo individual
const hand = [
  { value: 7, suit: 'espada', id: '7-espada' },
  { value: 6, suit: 'espada', id: '6-espada' },
  { value: 2, suit: 'oro', id: '2-oro' }
];

const result = calculateEnvido(hand);
console.log(result.score); // 33 (20 + 7 + 6)
console.log(result.cards);  // [7-espada, 6-espada]

// Cálculo por equipo (mejor envido del equipo)
const teamHands = [hand1, hand2, hand3];
const teamResult = calculateTeamEnvido(teamHands);
```

**Reglas del Envido:**
- Dos cartas del mismo palo: **20 + suma de valores**
- Figuras (10, 11, 12): **valen 0**
- Sin dos del mismo palo: **valor de la carta más alta**

### Validación de Cantos

```typescript
// Verificar si se puede hacer un canto
manager.canCall(EnvidoBet.ENVIDO);       // true al inicio
manager.canCall(EnvidoBet.REAL_ENVIDO);  // false (requiere Envido primero)
manager.canCall(EnvidoBet.FALTA_ENVIDO); // true siempre

// Después de cantar Envido
manager.callEnvido();
manager.canCall(EnvidoBet.REAL_ENVIDO);  // true ahora
manager.canCall(EnvidoBet.ENVIDO);       // false (ya cantado)
```

---

## 🌸 Módulo de Flor

### Detectar y Calcular Flor

```typescript
import { hasFlor, calculateFlor, calculateTeamFlor } from 'truco-engine';

const hand = [
  { value: 7, suit: 'espada', id: '7-espada' },
  { value: 6, suit: 'espada', id: '6-espada' },
  { value: 5, suit: 'espada', id: '5-espada' }
];

// Verificar flor
if (hasFlor(hand)) {
  const flor = calculateFlor(hand);
  console.log(flor.score); // 38 (20 + 7 + 6 + 5)
  console.log(flor.suit);  // 'espada'
  console.log(flor.cards); // Las 3 cartas
}

// Flor de equipo (null si ninguno tiene)
const teamFlor = calculateTeamFlor([hand1, hand2]);
```

**Reglas de la Flor:**
- Requiere 3 cartas del mismo palo
- Puntos: **20 + suma de las 3 cartas**
- Figuras valen 0

---

## 🎲 Módulo de Truco

### Estados del Truco

```typescript
import { TrucoState, createTrucoManager } from 'truco-engine';

const manager = createTrucoManager();

console.log(manager.currentState); // TrucoState.NORMAL (1 punto)

// Subir la apuesta
manager.raise(); // TrucoState.TRUCO (2 puntos)
manager.raise(); // TrucoState.RETRUCO (3 puntos)
manager.raise(); // TrucoState.VALE4 (4 puntos)

// Obtener puntos del estado actual
const points = manager.getPoints(); // 4

// Verificar si se puede subir
manager.canRaise(); // false (ya en Vale 4)
```

### Secuencia Típica

```
NORMAL (1 pt)
   ↓ Truco!
TRUCO (2 pts)
   ↓ Retruco!
RETRUCO (3 pts)
   ↓ Vale 4!
VALE4 (4 pts)
   ↓ (máximo)
```

### Puntos por Rechazo

```typescript
import { getRejectionPoints } from 'truco-engine';

// Puntos otorgados si se rechaza
getRejectionPoints(TrucoState.TRUCO);    // 1 punto
getRejectionPoints(TrucoState.RETRUCO);  // 2 puntos
getRejectionPoints(TrucoState.VALE4);    // 3 puntos
```

---

## 🎮 Motor de Partidas (Match Engine)

### Crear Partidas

#### 1v1 - Mano a Mano

```typescript
const match = new Match({
  teams: [
    { id: 'team1', playerIds: ['alice'], name: 'Alice' },
    { id: 'team2', playerIds: ['bob'], name: 'Bob' }
  ],
  pointsToWin: 30
});
```

#### 2v2 - Por Equipos

```typescript
const match = new Match({
  teams: [
    { id: 'team1', playerIds: ['p1', 'p2'], name: 'Los Tigres' },
    { id: 'team2', playerIds: ['p3', 'p4'], name: 'Los Leones' }
  ],
  pointsToWin: 30
});
```

#### 3v3 - Grandes Equipos

```typescript
const match = new Match({
  teams: [
    { id: 'team1', playerIds: ['p1', 'p2', 'p3'], name: 'Equipo A' },
    { id: 'team2', playerIds: ['p4', 'p5', 'p6'], name: 'Equipo B' }
  ],
  pointsToWin: 30
});
```

### Gestión de Partidas

```typescript
// Obtener jugador actual
const current = match.getCurrentPlayer();

// Jugar carta
match.play(current.id, '1-espada');

// Obtener estado completo
const state = match.getState();
console.log(state.currentRound);      // Ronda actual (0-2)
console.log(state.teams);             // Equipos con puntajes
console.log(state.roundResults);      // Resultados de rondas
console.log(state.trucoState);        // Estado del truco

// Verificar si terminó
if (match.isMatchFinished()) {
  const winner = match.getWinner();
  console.log(`Ganador: ${winner.name}`);
}
```

### Sistema de Turnos

El engine maneja automáticamente la rotación de turnos:

```typescript
const state = match.getState();

// En juegos por equipos, alterna entre equipos
console.log(state.turnManager.current()); // 'p1'
match.play('p1', 'card-id');

console.log(state.turnManager.current()); // 'p3' (del otro equipo)
match.play('p3', 'card-id');

console.log(state.turnManager.current()); // 'p2' (vuelve al primer equipo)
```

---

## 🎯 Ejemplos Completos

### Ejemplo 1: Partida Rápida 1v1

```typescript
import { Match, calculateEnvido } from 'truco-engine';

const match = new Match({
  teams: [
    { id: 't1', playerIds: ['juan'] },
    { id: 't2', playerIds: ['pedro'] }
  ],
  pointsToWin: 15
});

// Mostrar envidos
const players = match.getPlayers();
players.forEach(p => {
  const env = calculateEnvido(p.hand);
  console.log(`${p.id}: ${env.score} de envido`);
});

// Jugar una ronda completa
while (!match.isMatchFinished()) {
  const current = match.getCurrentPlayer();
  if (current && current.hand.length > 0) {
    match.play(current.id, current.hand[0].id);
  }
}

console.log('Ganador:', match.getWinner()?.name);
```

### Ejemplo 2: Sistema de Envido Completo

```typescript
import {
  createEnvidoManager,
  calculateEnvido,
  createCard
} from 'truco-engine';

const manager = createEnvidoManager();

// Jugador 1 canta envido
manager.callEnvido();
console.log('Puntos en juego:', manager.getPointsAtStake(30, 0)); // 2

// Jugador 2 sube a real envido
manager.callRealEnvido();
console.log('Puntos en juego:', manager.getPointsAtStake(30, 0)); // 5

// Aceptan
manager.accept();

// Calcular quién gana
const hand1 = [
  createCard(7, 'espada'),
  createCard(6, 'espada'),
  createCard(2, 'oro')
];

const hand2 = [
  createCard(5, 'copa'),
  createCard(4, 'copa'),
  createCard(1, 'basto')
];

const env1 = calculateEnvido(hand1);
const env2 = calculateEnvido(hand2);

if (env1.score > env2.score) {
  console.log(`Jugador 1 gana con ${env1.score}`);
} else {
  console.log(`Jugador 2 gana con ${env2.score}`);
}
```

### Ejemplo 3: Partida 2v2 con Estrategia

```typescript
import { Match, calculateEnvido, hasFlor } from 'truco-engine';

const match = new Match({
  teams: [
    { id: 't1', playerIds: ['p1', 'p2'], name: 'Equipo A' },
    { id: 't2', playerIds: ['p3', 'p4'], name: 'Equipo B' }
  ]
});

const players = match.getPlayers();

// Analizar manos antes de jugar
players.forEach(player => {
  const env = calculateEnvido(player.hand);
  console.log(`${player.id}:`);
  console.log(`  Envido: ${env.score}`);

  if (hasFlor(player.hand)) {
    console.log(`  ¡Tiene FLOR!`);
  }
});

// Simular estrategia: jugar carta más fuerte primero
import { getCardRank } from 'truco-engine';

while (!match.isMatchFinished()) {
  const current = match.getCurrentPlayer();

  if (current && current.hand.length > 0) {
    // Ordenar por jerarquía y jugar la más fuerte
    const sorted = [...current.hand].sort((a, b) =>
      getCardRank(a) - getCardRank(b)
    );

    match.play(current.id, sorted[0].id);
  }
}

const winner = match.getWinner();
console.log(`🏆 Ganador: ${winner?.name}`);
```

### Ejemplo 4: Falta Envido - Situación de Riesgo

```typescript
import { createEnvidoManager } from 'truco-engine';

// Situación: Equipo A tiene 28 puntos, necesita 30 para ganar
const currentScore = 28;
const pointsToWin = 30;

const manager = createEnvidoManager();

console.log(`Marcador: ${currentScore}/${pointsToWin}`);
console.log('Jugador A: "FALTA ENVIDO!"');

manager.callFaltaEnvido();

const stake = manager.getPointsAtStake(pointsToWin, currentScore);
console.log(`⚠️  Puntos en juego: ${stake}`);
console.log('(El ganador se lleva la partida!)');

// Si acepta...
manager.accept();

// El ganador del envido gana stake puntos
// Si Equipo A gana: 28 + 2 = 30 → GANA LA PARTIDA
// Si Equipo B gana: obtiene 2 puntos
```

---

## 📚 API Reference

### Cartas

#### Funciones

- `createDeck(): Card[]` - Crea mazo español completo
- `shuffle(deck: Card[]): Card[]` - Mezcla un mazo
- `deal(deck: Card[], playerCount: number, cardsPerPlayer?: number): Card[][]` - Reparte cartas
- `createShuffledDeck(): Card[]` - Crea y mezcla en un paso
- `createCard(value: number, suit: Suit): Card` - Crea una carta individual

#### Jerarquía

- `getCardRank(card: Card): number` - Obtiene ranking (menor = más fuerte)
- `compareCards(card1: Card, card2: Card): number` - Compara dos cartas
- `getWinningCard(cards: Card[]): Card | null` - Determina ganadora (null si parda)
- `beats(card1: Card, card2: Card): boolean` - Verifica si card1 gana a card2

### Envido

#### Cálculo

- `calculateEnvido(hand: Card[]): EnvidoResult` - Calcula envido de una mano
- `getEnvidoValue(card: Card): number` - Valor de carta para envido (figuras = 0)
- `calculateTeamEnvido(hands: Card[][]): EnvidoResult` - Mejor envido del equipo
- `compareEnvido(result1: EnvidoResult, result2: EnvidoResult): number` - Compara resultados

#### Sistema de Cantos

- `createEnvidoManager(): EnvidoManager` - Crea manager de apuestas
- `calculateEnvidoPoints(bets: EnvidoBet[], pointsToWin: number, score: number): number` - Calcula puntos totales
- `canMakeEnvidoBet(currentBets: EnvidoBet[], newBet: EnvidoBet): boolean` - Valida apuesta
- `getEnvidoBetName(bet: EnvidoBet): string` - Nombre del canto

#### EnvidoManager

```typescript
interface EnvidoManager {
  bets: EnvidoBet[];                    // Apuestas actuales
  callEnvido(): void;                   // Cantar envido
  callRealEnvido(): void;               // Cantar real envido
  callFaltaEnvido(): void;              // Cantar falta envido
  accept(): number;                     // Aceptar apuesta
  reject(): number;                     // Rechazar (retorna puntos otorgados)
  getPointsAtStake(pointsToWin: number, score: number): number;  // Puntos en juego
  canCall(bet: EnvidoBet): boolean;     // Validar si puede cantar
  isActive(): boolean;                  // Hay apuesta activa?
  reset(): void;                        // Reiniciar manager
}
```

### Flor

- `hasFlor(hand: Card[]): boolean` - Verifica si tiene flor
- `calculateFlor(hand: Card[]): FlorResult | null` - Calcula puntos de flor
- `calculateTeamFlor(hands: Card[][]): FlorResult | null` - Mejor flor del equipo
- `compareFlor(flor1: FlorResult | null, flor2: FlorResult | null): number` - Compara flores

### Truco

#### Estado

- `createTrucoManager(): TrucoManager` - Crea manager de truco
- `nextTrucoState(current: TrucoState): TrucoState` - Siguiente estado
- `canRaise(state: TrucoState): boolean` - Puede subir?
- `getTrucoPoints(state: TrucoState): number` - Puntos del estado
- `getTrucoStateName(state: TrucoState): string` - Nombre del estado

#### Puntos

- `getRejectionPoints(state: TrucoState): number` - Puntos por rechazo
- `getWinPoints(state: TrucoState): number` - Puntos por ganar

### Match Engine

#### Match Class

```typescript
class Match {
  constructor(config: MatchConfig)

  // Acciones
  play(playerId: string, cardId: string): void

  // Consultas
  getState(): MatchState
  getCurrentPlayer(): Player | undefined
  getPlayer(playerId: string): Player | undefined
  getTeam(teamId: string): Team | undefined
  getTeams(): Team[]
  getPlayers(): Player[]
  getCurrentRound(): number
  isMatchFinished(): boolean
  getWinner(): Team | null
}
```

#### Tipos

```typescript
interface MatchConfig {
  teams: Array<{
    id: string;
    playerIds: string[];
    name?: string;
  }>;
  pointsToWin?: number; // Default: 30
}

interface MatchState {
  players: Player[];
  teams: Team[];
  currentRound: number;           // 0-2
  roundResults: RoundResult[];
  playsInCurrentRound: CardPlay[];
  turnManager: TurnManager;
  trucoState: TrucoState;
  isFinished: boolean;
}
```

### Utilidades

#### Jugadores

- `createPlayer(id: string, teamId: string, name?: string): Player`
- `removeCardFromHand(player: Player, cardId: string): Card | null`
- `addCardsToHand(player: Player, cards: Card[]): void`
- `hasCard(player: Player, cardId: string): boolean`
- `clearHand(player: Player): void`

#### Equipos

- `createTeam(id: string, playerIds: string[], name?: string): Team`
- `addPoints(team: Team, points: number): void`
- `getTeamPlayers(team: Team, allPlayers: Player[]): Player[]`
- `isPlayerInTeam(team: Team, playerId: string): boolean`

#### Rondas

- `resolveRound(plays: CardPlay[]): RoundResult` - Determina ganador de ronda
- `determineMatchWinner(roundResults: RoundResult[]): string | null` - Ganador por rondas

---

## 🎬 Ejecutar Ejemplos

La librería incluye ejemplos ejecutables en la carpeta `examples/`:

```bash
# Demo de sistema de envido
node examples/demo-envido.js

# Partida completa
node examples/demo-match-completo.js
```

Ver [examples/README.md](examples/README.md) para más detalles.

---

## 🏗️ Arquitectura

```
truco-engine/
├── src/
│   ├── cards/          # Baraja y jerarquía
│   │   ├── cards.ts
│   │   ├── deck.ts
│   │   └── hierarchy.ts
│   │
│   ├── envido/         # Sistema de envido
│   │   ├── envido.ts
│   │   ├── envidoManager.ts
│   │   └── flor.ts
│   │
│   ├── truco/          # Estados de truco
│   │   ├── trucoState.ts
│   │   └── truco.ts
│   │
│   └── match/          # Motor de partidas
│       ├── player.ts
│       ├── team.ts
│       ├── turnManager.ts
│       ├── round.ts
│       └── match.ts
│
├── dist/               # Build output
├── examples/           # Ejemplos ejecutables
├── swagger.yaml        # API documentation
└── index.ts            # Entry point
```

---

## 🔧 Desarrollo

```bash
# Instalar dependencias
npm install

# Compilar
npm run build

# Modo watch
npm run watch

# Limpiar build
npm run clean
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📋 Roadmap

### v1.1.0 (Próximo)
- [ ] Flor con contraflor
- [ ] Persistencia de partidas
- [ ] Replay de partidas
- [ ] Estadísticas de jugadores

### v2.0.0 (Futuro)
- [ ] Truco Uruguayo
- [ ] Truco Venezolano
- [ ] Sistema de torneos
- [ ] AI para jugar contra la máquina

---

## ❓ FAQ

<details>
<summary><strong>¿Puedo usar esto en el navegador?</strong></summary>

Sí, la librería es compatible con navegadores. Usa un bundler como Webpack o Vite para incluirla en tu proyecto web.
</details>

<details>
<summary><strong>¿Soporta partidas online?</strong></summary>

La librería maneja la lógica del juego. Para partidas online necesitarás implementar la capa de red (WebSockets, etc.) por separado.
</details>

<details>
<summary><strong>¿Qué variante de Truco está implementada?</strong></summary>

Truco Argentino oficial. Estamos trabajando en variantes uruguayas y venezolanas para futuras versiones.
</details>

<details>
<summary><strong>¿Cómo manejo la validación de turnos?</strong></summary>

El Match engine valida automáticamente los turnos. Si un jugador intenta jugar fuera de turno, se lanza un error.
</details>

<details>
<summary><strong>¿Puedo usar esto comercialmente?</strong></summary>

Sí, la licencia MIT permite uso comercial sin restricciones.
</details>

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- Reglas oficiales del Truco Argentino
- Comunidad de desarrolladores TypeScript
- Todos los contribuidores del proyecto

---

## 💻 Desarrollado por:

- 📧 Email: [lms.segovia86@gmail.com](mailto:lms.segovia86@gmail.com)
- 📖 Documentación: Ver [swagger.yaml](https://editor.swagger.io/)

---

<div align="center">

[⬆ Volver arriba](#-truco-engine)

</div>
