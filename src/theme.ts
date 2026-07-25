export const brand = {
  name: 'Gummy Sudoku',
  tagline: 'Soft puzzles for kids',
} as const;

/**
 * Visual system matched to the Gummy Sudoku splash/icon art:
 * misty candy sky, glossy lavender board, cream pillow tiles, rainbow gummy digits.
 */
export const colors = {
  bgTop: '#E0D0F8',
  bgMid: '#E8D8F8',
  bgBottom: '#D8ECFF',

  blobPink: 'rgba(255, 170, 210, 0.45)',
  blobYellow: 'rgba(255, 230, 150, 0.35)',
  blobMint: 'rgba(150, 230, 220, 0.4)',
  blobLavender: 'rgba(190, 170, 255, 0.42)',
  blobBlue: 'rgba(160, 210, 255, 0.4)',

  starPink: '#FFB6D9',
  starYellow: '#FFE08A',
  starMint: '#9EE8D8',
  starLavender: '#D2B8FF',
  sparkle: 'rgba(255, 255, 255, 0.85)',

  title: '#8B5CF6',
  titleShadow: 'rgba(100, 70, 180, 0.28)',
  ink: '#5B3A8C',
  inkSoft: '#7A6AA8',
  /** Soft clear blue board digits — readable, easy on eyes */
  digit: '#2F8FD6',
  digitCorrectFlash: '#34C759',

  subtitleBg: '#E8FFF8',
  subtitleBorder: '#8ADCC8',
  subtitleText: '#2A8A78',

  // Glossy lavender board frame (sampled from home art)
  boardFrame: '#D9B9EA',
  boardFrameDark: '#C9A0E0',
  boardFrameLight: '#E8D2F4',
  boardWell: '#D9B9EA',
  boardShadow: 'rgba(140, 100, 180, 0.28)',

  // Cream pillow tiles (sampled from home art: ~rgb 253,242,222)
  tile: '#FDF2DE',
  tileLight: '#FFF6E8',
  tileDeep: '#F7E8C8',
  tileShadow: 'rgba(160, 120, 190, 0.2)',
  tileSelected: '#D8ECFF',
  tileRelated: '#F7F2FF',
  /** Matching digits — soft sky, in family with tileSelected / digit blue. */
  tileSame: '#BFE6FF',
  /** Wrong answers — soft rose fill (paired with conflictText). */
  tileConflict: '#FFC8BE',

  /** Wrong answers on the board */
  conflictText: '#E11D48',
  /** Matching digits — richer blue than the default digit, still clearly “same”. */
  digitSame: '#1A6FBF',

  // Per-digit gummy candy colors (board + pad) — violet-leaning, less hot pink
  gummy: [
    { bg: '#C4A0FF', border: '#9B6AE8', text: '#A78BFA', gloss: '#E4D4FF' }, // 1 lilac
    { bg: '#FFB86A', border: '#F08A30', text: '#FF9A3A', gloss: '#FFD8A8' }, // 2 orange
    { bg: '#FFE066', border: '#E0B820', text: '#F0C020', gloss: '#FFF0A8' }, // 3 yellow
    { bg: '#9AE85A', border: '#6EC830', text: '#6ED83A', gloss: '#D0F8A8' }, // 4 lime
    { bg: '#5ADCC0', border: '#28B898', text: '#2AC8A8', gloss: '#A8F0E0' }, // 5 mint
    { bg: '#6AC8F0', border: '#30A0D8', text: '#30B0E8', gloss: '#B0E8FF' }, // 6 sky
    { bg: '#7A9AFF', border: '#4A6EF0', text: '#5A7AFF', gloss: '#C0D0FF' }, // 7 blue
    { bg: '#B08AFF', border: '#8A5AE0', text: '#9B6AFF', gloss: '#DCC8FF' }, // 8 grape
    { bg: '#9A7AFF', border: '#6E4AD8', text: '#7C5CE0', gloss: '#D0C0FF' }, // 9 violet
  ] as const,

  eraseBg: '#FFF8F0',
  eraseBorder: '#C9A8E8',
  eraseText: '#8A6AA8',

  easyBg: '#D8F8EE',
  easyBorder: '#6AD4B8',
  easyText: '#1A7A68',
  mediumBg: '#FFF3B0',
  mediumBorder: '#E0C040',
  mediumText: '#7A5C00',
  hardBg: '#E0D4FF',
  hardBorder: '#A78BFA',
  hardText: '#5B21B6',
  profiBg: '#D0EEFF',
  profiBorder: '#5BB8E0',
  profiText: '#0C4A6E',
  masterBg: '#E8D8FF',
  masterBorder: '#B07AFF',
  masterText: '#5B21B6',
  lockedBg: '#F4F0F8',
  lockedBorder: '#E4DCE8',
  lockedText: '#B0A0B8',
  hintBg: '#FFF6E8',
  hintBorder: '#F0C98A',
  hintText: '#9A5B1A',

  chanceFull: '#A78BFA',
  chanceEmpty: '#F0E8F4',
  chanceBorder: '#7C5CE0',
  chanceEmptyBorder: '#E4DCE8',
  chanceLabel: '#6D28D9',

  ctaBg: '#A78BFA',
  ctaBorder: '#7C5CE0',
  ctaText: '#FFFFFF',
  ctaGloss: 'rgba(255,255,255,0.35)',

  modalBg: '#FFF8F0',
  modalBorder: '#C9A8E8',
  modalFailBorder: '#F0A878',
  star: '#FFE066',
  overlay: 'rgba(90, 50, 120, 0.35)',
};

/** Shared home-pill / in-game level-chip colors (by ladder index). */
export type LevelPalette = {
  bg: string;
  border: string;
  text: string;
};

export const LEVEL_PALETTES: LevelPalette[] = [
  { bg: colors.easyBg, border: colors.easyBorder, text: colors.easyText },
  { bg: colors.mediumBg, border: colors.mediumBorder, text: colors.mediumText },
  { bg: colors.hardBg, border: colors.hardBorder, text: colors.hardText },
  { bg: colors.profiBg, border: colors.profiBorder, text: colors.profiText },
  { bg: colors.masterBg, border: colors.masterBorder, text: colors.masterText },
];

export function getLevelPalette(index: number): LevelPalette {
  const safeIndex = index >= 0 ? index : 0;
  return LEVEL_PALETTES[safeIndex % LEVEL_PALETTES.length];
}

export const fonts = {
  display: 'Fredoka_700Bold',
  displaySoft: 'Fredoka_600SemiBold',
  body: 'Nunito_700Bold',
  bodySoft: 'Nunito_600SemiBold',
  bodyHeavy: 'Nunito_800ExtraBold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const typography = {
  hero: { fontFamily: fonts.display, fontSize: 44, letterSpacing: 0.3 },
  title: { fontFamily: fonts.display, fontSize: 36, letterSpacing: 0.2 },
  subtitle: { fontFamily: fonts.body, fontSize: 16 },
  body: { fontFamily: fonts.bodySoft, fontSize: 15 },
  label: { fontFamily: fonts.bodyHeavy, fontSize: 14 },
  button: { fontFamily: fonts.displaySoft, fontSize: 22 },
  buttonSm: { fontFamily: fonts.bodyHeavy, fontSize: 16 },
  cell: { fontFamily: fonts.display, fontSize: 22 },
  caption: { fontFamily: fonts.bodySoft, fontSize: 12 },
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 36,
  pill: 999,
};

export const borders = {
  thin: 2,
  thick: 3,
  chunky: 4,
  board: 10,
};

export const shadows = {
  soft: {
    shadowColor: '#A878C8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  button: {
    shadowColor: '#A878C8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  tile: {
    shadowColor: '#A878C8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 2,
  },
};
