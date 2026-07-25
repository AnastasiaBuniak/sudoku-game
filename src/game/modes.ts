import type { GridSpec } from '../utils/sudoku';

export type GameMode = 'numbers' | 'animals';

export const GAME_MODES: GameMode[] = ['numbers', 'animals'];

/** What kind of glyph a mode paints inside each cell. */
export type SymbolKind = 'digit' | 'animal';

export type LevelConfig = {
  /** Unique id within its mode (also the i18n key under `levels.*`). */
  id: string;
  grid: GridSpec;
  /** Prefilled cells the puzzle starts with. */
  clues: number;
  /** Wins at this level needed to unlock the next one (0 = last level). */
  winsToUnlockNext: number;
};

export type ModeConfig = {
  mode: GameMode;
  symbol: SymbolKind;
  levels: LevelConfig[];
};

const GRID_9: GridSpec = { size: 9, boxRows: 3, boxCols: 3 };
const GRID_6: GridSpec = { size: 6, boxRows: 2, boxCols: 3 };
const GRID_4: GridSpec = { size: 4, boxRows: 2, boxCols: 2 };

/** Classic numbers mode — unchanged 9×9 ladder. */
const NUMBERS_MODE: ModeConfig = {
  mode: 'numbers',
  symbol: 'digit',
  levels: [
    { id: 'easy', grid: GRID_9, clues: 54, winsToUnlockNext: 3 },
    { id: 'medium', grid: GRID_9, clues: 46, winsToUnlockNext: 3 },
    { id: 'hard', grid: GRID_9, clues: 38, winsToUnlockNext: 5 },
    { id: 'profi', grid: GRID_9, clues: 32, winsToUnlockNext: 5 },
    { id: 'master', grid: GRID_9, clues: 28, winsToUnlockNext: 0 },
  ],
};

/**
 * Animal mode — a gentler ladder for young kids. Easy levels use 2×2 boxes
 * (4×4 grids) with only a few animals, then step up to 6×6.
 */
const ANIMALS_MODE: ModeConfig = {
  mode: 'animals',
  symbol: 'animal',
  levels: [
    { id: 'cubs', grid: GRID_4, clues: 10, winsToUnlockNext: 3 },
    { id: 'meadow', grid: GRID_4, clues: 8, winsToUnlockNext: 3 },
    { id: 'forest', grid: GRID_6, clues: 22, winsToUnlockNext: 4 },
    { id: 'jungle', grid: GRID_6, clues: 18, winsToUnlockNext: 0 },
  ],
};

export const MODE_CONFIGS: Record<GameMode, ModeConfig> = {
  numbers: NUMBERS_MODE,
  animals: ANIMALS_MODE,
};

/** Animal glyph keys, indexed by cell value (value 1 → ANIMALS[0], …). */
export const ANIMALS = ['rabbit', 'cat', 'bear', 'fox', 'frog', 'panda'] as const;
export type AnimalKey = (typeof ANIMALS)[number];

export function isGameMode(value: unknown): value is GameMode {
  return value === 'numbers' || value === 'animals';
}

export function getModeConfig(mode: GameMode): ModeConfig {
  return MODE_CONFIGS[mode];
}

export function getLevelIds(mode: GameMode): string[] {
  return MODE_CONFIGS[mode].levels.map((level) => level.id);
}

export function getLevelConfig(mode: GameMode, levelId: string): LevelConfig | null {
  return MODE_CONFIGS[mode].levels.find((level) => level.id === levelId) ?? null;
}

export function getDefaultLevelId(mode: GameMode): string {
  return MODE_CONFIGS[mode].levels[0].id;
}

export function getLevelIndex(mode: GameMode, levelId: string): number {
  return MODE_CONFIGS[mode].levels.findIndex((level) => level.id === levelId);
}
