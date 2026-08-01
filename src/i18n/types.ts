export const LOCALE_CODES = ['en', 'zh', 'hi', 'es', 'ar', 'ja', 'de', 'fr'] as const;

export type LocaleCode = (typeof LOCALE_CODES)[number];

export type TranslationTree = {
  brand: {
    tagline: string;
    a11yBoard: string;
  };
  home: {
    continue: string;
    continuePuzzle: string;
    newPuzzle: string;
    play: string;
    chooseLevel: string;
    unlockPrompt: string;
  };
  modes: {
    numbers: string;
    animals: string;
  };
  levels: {
    easy: string;
    medium: string;
    hard: string;
    /** Display label for level id `profi` (kept as id for saved progress). */
    profi: string;
    master: string;
    cubs: string;
    meadow: string;
    forest: string;
    jungle: string;
  };
  game: {
    chances: string;
    chancesLeft: string;
    undo: string;
    newGame: string;
    nice: string;
    levelUnlocked: string;
  };
  win: {
    title: string;
    message: string;
    /** Shown above the unlocked level chip when a new level opens. */
    unlockTitle: string;
    unlockBody: string;
    playUnlocked: string;
    playNext: string;
    backHome: string;
    keepLooking: string;
  };
  gameOver: {
    title: string;
    message: string;
    tryAgain: string;
    backHome: string;
  };
  howToPlay: {
    title: string;
    step1: string;
    step2Numbers: string;
    step2Animals: string;
    step3Numbers: string;
    step3Animals: string;
    chances: string;
    gotIt: string;
  };
  a11y: {
    backHome: string;
    mute: string;
    unmute: string;
    language: string;
    howToPlay: string;
    undo: string;
  };
};

export type LocaleMeta = {
  code: LocaleCode;
  /** Language name shown in its own script (always). */
  nativeName: string;
  rtl?: boolean;
};
