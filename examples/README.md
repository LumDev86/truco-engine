# Ejemplos de Truco Engine

Esta carpeta contiene ejemplos ejecutables de cómo usar la librería Truco Engine.

## 📋 Ejemplos Disponibles

### 1. **demo-envido.js** - Sistema de Cantos de Envido
Demuestra el funcionamiento completo del sistema de apuestas de Envido.

```bash
node examples/demo-envido.js
```

**Incluye:**
- ✅ Envido simple (2 puntos)
- ✅ Envido + Real Envido (5 puntos)
- ✅ Falta Envido (puntos variables)
- ✅ Rechazo de envido

---

### 2. **demo-match-completo.js** - Match Completo
Muestra un match completo de Truco con envido y jugadas.

```bash
node examples/demo-match-completo.js
```

**Incluye:**
- ✅ Creación de match 1v1
- ✅ Cálculo de envido y flor
- ✅ Cantos y apuestas
- ✅ Jugada de cartas
- ✅ Determinación de ganador

---

### 3. **basic-1v1.ts** - Ejemplo TypeScript
Código TypeScript que muestra cómo usar la librería (requiere compilación).

```bash
npx ts-node examples/basic-1v1.ts
```

---

### 4. **envido-betting.ts** - Sistema de Envido TypeScript
Ejemplo detallado del sistema de envido en TypeScript.

```bash
npx ts-node examples/envido-betting.ts
```

---

## 🚀 Cómo Ejecutar

### Opción 1: Ejemplos JavaScript (Recomendado)
Los archivos `.js` usan la librería compilada y se ejecutan directamente:

```bash
# Desde la raíz del proyecto
node examples/demo-envido.js
node examples/demo-match-completo.js
```

### Opción 2: Ejemplos TypeScript
Los archivos `.ts` requieren TypeScript instalado:

```bash
# Instalar dependencias si no lo has hecho
npm install

# Compilar primero
npm run build

# Ejecutar con ts-node
npx ts-node examples/basic-1v1.ts
npx ts-node examples/envido-betting.ts
```

---

## 📚 Uso Básico de la Librería

### Crear un Match

```javascript
const { Match } = require('./dist/index.js');

const match = new Match({
  teams: [
    { id: 'team1', playerIds: ['player1'], name: 'Equipo 1' },
    { id: 'team2', playerIds: ['player2'], name: 'Equipo 2' }
  ],
  pointsToWin: 30
});
```

### Calcular Envido

```javascript
const { calculateEnvido, createCard } = require('./dist/index.js');

const hand = [
  createCard(7, 'espada'),
  createCard(6, 'espada'),
  createCard(2, 'oro')
];

const result = calculateEnvido(hand);
console.log(result.score); // 33
```

### Usar Sistema de Cantos

```javascript
const { createEnvidoManager } = require('./dist/index.js');

const manager = createEnvidoManager();

// Llamar envido
manager.callEnvido();
console.log(manager.getPointsAtStake(30, 0)); // 2

// Subir a Real Envido
manager.callRealEnvido();
console.log(manager.getPointsAtStake(30, 0)); // 5

// Aceptar o rechazar
manager.accept();
// o
const points = manager.reject(); // Otorga puntos
```

---

## 🎯 Formatos Soportados

La librería soporta:
- **1v1** - Un jugador vs un jugador
- **2v2** - Dos equipos de dos jugadores
- **3v3** - Dos equipos de tres jugadores

Ejemplo 2v2:

```javascript
const match = new Match({
  teams: [
    { id: 'team1', playerIds: ['p1', 'p2'], name: 'Los Tigres' },
    { id: 'team2', playerIds: ['p3', 'p4'], name: 'Los Leones' }
  ],
  pointsToWin: 30
});
```

---

## 📖 Más Información

- Ver **README.md** principal para documentación completa
- Ver **swagger.yaml** para referencia de API
- Consultar código fuente en **src/** para detalles de implementación

---

## 🐛 Problemas?

Si encuentras algún problema al ejecutar los ejemplos:

1. Asegúrate de haber compilado la librería: `npm run build`
2. Verifica que estés en la raíz del proyecto
3. Revisa que Node.js esté instalado: `node --version`

---

¡Disfruta usando Truco Engine! 🎮
