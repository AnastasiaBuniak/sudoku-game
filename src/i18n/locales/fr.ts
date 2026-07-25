import type { TranslationTree } from '../types';

/** French — strong European Sudoku market. */
const fr: TranslationTree = {
  brand: {
    tagline: 'Des puzzles doux pour les enfants',
    a11yBoard: 'Plateau bonbon Gummy Sudoku',
  },
  home: {
    continue: 'Continuer',
    continuePuzzle: 'Puzzle %{level}',
    newPuzzle: 'Nouveau puzzle',
    play: 'Jouer',
    chooseLevel: 'Choisir un niveau',
    unlockPrompt: 'Gagne encore %{count} puzzles %{level} pour débloquer %{next} !',
  },
  levels: {
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    profi: 'Profi',
    master: 'Maître',
  },
  game: {
    chances: 'Vies',
    chancesLeft: '%{count} vies restantes',
    erase: 'Effacer',
    newGame: 'Nouvelle partie',
    nice: 'Bravo !',
    levelUnlocked: 'Niveau %{level} débloqué !',
  },
  win: {
    title: 'Sucré !',
    message: 'Tu as résolu le puzzle !',
    playNext: 'Partie suivante',
    backHome: "Retour à l'accueil",
    keepLooking: 'Continuer à regarder',
  },
  gameOver: {
    title: 'Plus de vies !',
    message: 'Ce puzzle était costaud. On en tente un nouveau ?',
    tryAgain: 'Réessayer',
    backHome: "Retour à l'accueil",
  },
  a11y: {
    backHome: "Retourner à l'accueil",
    mute: 'Couper le son',
    unmute: 'Activer le son',
    language: 'Langue',
  },
};

export default fr;
