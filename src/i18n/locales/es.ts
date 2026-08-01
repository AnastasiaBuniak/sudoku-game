import type { TranslationTree } from '../types';

/** Spanish — 4th most spoken; strong LatAm & Spain puzzle audience. */
const es: TranslationTree = {
  brand: {
    tagline: 'Puzzles suaves para niños',
    a11yBoard: 'Tablero de caramelos de Gummy Sudoku',
  },
  home: {
    continue: 'Continuar',
    continuePuzzle: 'Puzzle %{level}',
    newPuzzle: 'Nuevo puzzle',
    play: 'Jugar',
    chooseLevel: 'Elige un nivel',
    unlockPrompt: '¡Gana %{count} puzzles %{level} más para desbloquear %{next}!',
  },
  modes: {
    numbers: 'Números',
    animals: 'Animales',
  },
  levels: {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    profi: 'Experto',
    master: 'Maestro',
    cubs: 'Cachorros',
    meadow: 'Prado',
    forest: 'Bosque',
    jungle: 'Jungla',
  },
  game: {
    chances: 'Vidas',
    chancesLeft: '%{count} vidas restantes',
    undo: 'Deshacer',
    newGame: 'Nueva partida',
    nice: '¡Bien!',
    levelUnlocked: '¡Genial! Desbloqueaste %{level}!',
  },
  win: {
    title: '¡Dulce!',
    message: '¡Resolviste el puzzle!',
    unlockTitle: '¡Nuevo nivel desbloqueado!',
    unlockBody: '¡Genial — desbloqueaste el siguiente nivel!',
    playUnlocked: 'Jugar %{level}',
    playNext: 'Jugar siguiente',
    backHome: 'Volver al inicio',
    keepLooking: 'Seguir mirando',
  },
  gameOver: {
    title: '¡Sin vidas!',
    message: 'Ese puzzle fue difícil. ¿Quieres uno nuevo?',
    tryAgain: 'Intentar de nuevo',
    backHome: 'Volver al inicio',
  },
  howToPlay: {
    title: 'Cómo jugar',
    step1: 'Toca una casilla vacía',
    step2Numbers: 'Toca un número abajo',
    step2Animals: 'Toca un animal abajo',
    step3Numbers: 'Cada número solo una vez en cada fila, columna y bloque',
    step3Animals: 'Cada animal solo una vez en cada fila, columna y bloque',
    chances: 'Los corazones son tus vidas. Un error gasta una.',
    gotIt: '¡Entendido!',
  },
  a11y: {
    backHome: 'Volver al inicio',
    mute: 'Silenciar sonidos',
    unmute: 'Activar sonidos',
    language: 'Idioma',
    howToPlay: 'Cómo jugar',
    undo: 'Deshacer el último movimiento',
  },
};

export default es;
