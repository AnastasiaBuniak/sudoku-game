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
  modes?: {
    numbers: string;
    animals: string;
  };
  levels: {
    easy: string;
    medium: string;
    hard: string;
    profi: string;
    master: string;
    /** Animal-mode level names (English fallback via i18n when untranslated). */
    cubs?: string;
    meadow?: string;
    forest?: string;
    jungle?: string;
  };
  game: {
    chances: string;
    chancesLeft: string;
    erase: string;
    newGame: string;
    nice: string;
    levelUnlocked: string;
  };
  win: {
    title: string;
    message: string;
    playAgain: string;
    backHome: string;
    keepLooking: string;
  };
  gameOver: {
    title: string;
    message: string;
    tryAgain: string;
    backHome: string;
  };
  a11y: {
    backHome: string;
    mute: string;
    unmute: string;
    language: string;
  };
};

export type LocaleMeta = {
  code: LocaleCode;
  /** Language name shown in its own script (always). */
  nativeName: string;
  rtl?: boolean;
};
