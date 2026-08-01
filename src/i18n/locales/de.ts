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
  modes: {
    numbers: 'Zahlen',
    animals: 'Tiere',
  },
  levels: {
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
    profi: 'Profi',
    master: 'Meister',
    cubs: 'Kleine',
    meadow: 'Wiese',
    forest: 'Wald',
    jungle: 'Dschungel',
  },
  game: {
    chances: 'Leben',
    chancesLeft: 'Noch %{count} Leben',
    undo: 'Rückgängig',
    newGame: 'Neues Spiel',
    nice: 'Toll!',
    levelUnlocked: 'Toll! %{level} freigeschaltet!',
  },
  win: {
    title: 'Süß!',
    message: 'Du hast das Rätsel gelöst!',
    unlockTitle: 'Neues Level freigeschaltet!',
    unlockBody: 'Toll — du hast das nächste Level freigeschaltet',
    playUnlocked: '%{level} spielen',
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
  howToPlay: {
    title: 'So geht’s',
    step1: 'Tippe auf ein leeres Feld',
    step2Numbers: 'Tippe unten auf eine Zahl',
    step2Animals: 'Tippe unten auf ein Tier',
    step3Numbers: 'Jede Zahl nur einmal in jeder Reihe, Spalte und jedem Block',
    step3Animals: 'Jedes Tier nur einmal in jeder Reihe, Spalte und jedem Block',
    chances: 'Herzen sind deine Leben. Ein Fehler kostet eines.',
    gotIt: 'Alles klar!',
  },
  a11y: {
    backHome: 'Zur Startseite zurück',
    mute: 'Ton aus',
    unmute: 'Ton an',
    language: 'Sprache',
    howToPlay: 'So geht’s',
    undo: 'Letzten Zug rückgängig machen',
  },
};

export default de;
