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
  levels: {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    profi: 'Profi',
    master: 'Máster',
  },
  game: {
    chances: 'Vidas',
    chancesLeft: '%{count} vidas restantes',
    erase: 'Borrar',
    newGame: 'Nueva partida',
    nice: '¡Bien!',
    levelUnlocked: '¡Nivel %{level} desbloqueado!',
  },
  win: {
    title: '¡Dulce!',
    message: '¡Resolviste el puzzle!',
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
  a11y: {
    backHome: 'Volver al inicio',
    mute: 'Silenciar sonidos',
    unmute: 'Activar sonidos',
    language: 'Idioma',
  },
};

export default es;
