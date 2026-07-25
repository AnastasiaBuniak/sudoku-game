import type { TranslationTree } from '../types';

/** German — top traffic market for major Sudoku sites. */
const de: TranslationTree = {
  brand: {
    tagline: 'Sanfte Rätsel für Kinder',
    a11yBoard: 'Gummy Sudoku Bonbon-Brett',
  },
  home: {
    continue: 'Weiter',
    continuePuzzle: '%{level}-Rätsel',
    newPuzzle: 'Neues Rätsel',
    play: 'Spielen',
    chooseLevel: 'Level wählen',
    unlockPrompt: 'Gewinne noch %{count} %{level}-Rätsel, um %{next} freizuschalten!',
  },
  levels: {
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
    profi: 'Profi',
    master: 'Meister',
  },
  game: {
    chances: 'Leben',
    chancesLeft: 'Noch %{count} Leben',
    erase: 'Löschen',
    newGame: 'Neues Spiel',
    nice: 'Toll!',
    levelUnlocked: '%{level}-Level freigeschaltet!',
  },
  win: {
    title: 'Süß!',
    message: 'Du hast das Rätsel gelöst!',
    playNext: 'Weiter spielen',
    backHome: 'Zur Startseite',
    keepLooking: 'Weiter schauen',
  },
  gameOver: {
    title: 'Keine Leben mehr!',
    message: 'Das Rätsel war knifflig. Neues versuchen?',
    tryAgain: 'Nochmal versuchen',
    backHome: 'Zur Startseite',
  },
  a11y: {
    backHome: 'Zur Startseite zurück',
    mute: 'Ton aus',
    unmute: 'Ton an',
    language: 'Sprache',
  },
};

export default de;
