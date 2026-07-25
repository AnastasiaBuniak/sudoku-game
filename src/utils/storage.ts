import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GAME_MODES,
  getLevelConfig,
  getLevelIds,
  isGameMode,
  MODE_CONFIGS,
  getDefaultLevelId,
  type GameMode,
} from '../game/modes';
import type { LevelProgress } from './levels';
import { createDefaultProgress } from './levels';
import { isGridSpec, type Board, type GridSpec } from './sudoku';

/** Legacy (pre-mode) numbers-only progress key. */
const LEGACY_PROGRESS_KEY = '@sudoku/level-progress';
const PROGRESS_KEY = '@sudoku/progress-v2';
const SESSION_KEY = '@sudoku/session-v2';

export type Screen = 'home' | 'game';

export const MAX_MISTAKES = 3;

export type PersistedGame = {
  mode: GameMode;
  levelId: string;
  grid: GridSpec;
  board: Board;
  given: Board;
  solution: Board;
  won: boolean;
  winCounted: boolean;
  /** Chances left before game over (starts at MAX_MISTAKES). */
  mistakesLeft: number;
  lost: boolean;
};

export type AllProgress = Record<GameMode, LevelProgress>;

export type PersistedSession = {
  mode: GameMode;
  screen: Screen;
  /** Remembered level selection per mode. */
  selectedLevels: Record<GameMode, string>;
  game: PersistedGame | null;
};

function isBoardOfSize(value: unknown, size: number): value is Board {
  if (!Array.isArray(value) || value.length !== size) return false;
  return value.every(
    (row) =>
      Array.isArray(row) &&
      row.length === size &&
      row.every((cell) => typeof cell === 'number' && cell >= 0 && cell <= size),
  );
}

function sanitizeModeProgress(mode: GameMode, raw: unknown): LevelProgress {
  const config = MODE_CONFIGS[mode];
  const defaults = createDefaultProgress(config);
  if (!raw || typeof raw !== 'object') return defaults;

  const data = raw as Partial<LevelProgress>;
  const maxIndex = config.levels.length - 1;
  const highestUnlockedIndex =
    typeof data.highestUnlockedIndex === 'number' &&
    data.highestUnlockedIndex >= 0 &&
    data.highestUnlockedIndex <= maxIndex
      ? Math.floor(data.highestUnlockedIndex)
      : 0;

  const wins = { ...defaults.wins };
  if (data.wins && typeof data.wins === 'object') {
    getLevelIds(mode).forEach((levelId) => {
      const value = (data.wins as Record<string, unknown>)[levelId];
      if (typeof value === 'number' && value >= 0) {
        wins[levelId] = Math.floor(value);
      }
    });
  }

  return { highestUnlockedIndex, wins };
}

export function createDefaultAllProgress(): AllProgress {
  return {
    numbers: createDefaultProgress(MODE_CONFIGS.numbers),
    animals: createDefaultProgress(MODE_CONFIGS.animals),
  };
}

function sanitizeAllProgress(raw: unknown): AllProgress {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    numbers: sanitizeModeProgress('numbers', data.numbers),
    animals: sanitizeModeProgress('animals', data.animals),
  };
}

function sanitizeGame(raw: unknown): PersistedGame | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Partial<PersistedGame>;
  if (!isGameMode(data.mode)) return null;
  if (typeof data.levelId !== 'string') return null;

  const levelConfig = getLevelConfig(data.mode, data.levelId);
  if (!levelConfig) return null;
  if (!isGridSpec(data.grid)) return null;
  if (
    data.grid.size !== levelConfig.grid.size ||
    data.grid.boxRows !== levelConfig.grid.boxRows ||
    data.grid.boxCols !== levelConfig.grid.boxCols
  ) {
    return null;
  }

  const size = data.grid.size;
  if (
    !isBoardOfSize(data.board, size) ||
    !isBoardOfSize(data.given, size) ||
    !isBoardOfSize(data.solution, size)
  ) {
    return null;
  }

  return {
    mode: data.mode,
    levelId: data.levelId,
    grid: data.grid,
    board: data.board,
    given: data.given,
    solution: data.solution,
    won: Boolean(data.won),
    winCounted: Boolean(data.winCounted),
    mistakesLeft:
      typeof data.mistakesLeft === 'number' &&
      data.mistakesLeft >= 0 &&
      data.mistakesLeft <= MAX_MISTAKES
        ? Math.floor(data.mistakesLeft)
        : MAX_MISTAKES,
    lost: Boolean(data.lost),
  };
}

export function createDefaultSession(): PersistedSession {
  return {
    mode: 'numbers',
    screen: 'home',
    selectedLevels: {
      numbers: getDefaultLevelId('numbers'),
      animals: getDefaultLevelId('animals'),
    },
    game: null,
  };
}

function sanitizeSelectedLevels(raw: unknown): Record<GameMode, string> {
  const defaults = createDefaultSession().selectedLevels;
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const result = { ...defaults };
  GAME_MODES.forEach((mode) => {
    const value = data[mode];
    if (typeof value === 'string' && getLevelConfig(mode, value)) {
      result[mode] = value;
    }
  });
  return result;
}

function sanitizeSession(raw: unknown): PersistedSession {
  const defaults = createDefaultSession();
  if (!raw || typeof raw !== 'object') return defaults;

  const data = raw as Partial<PersistedSession>;
  const mode = isGameMode(data.mode) ? data.mode : 'numbers';
  const screen = data.screen === 'game' || data.screen === 'home' ? data.screen : 'home';
  const selectedLevels = sanitizeSelectedLevels(data.selectedLevels);
  const game = sanitizeGame(data.game);

  return {
    mode: game ? game.mode : mode,
    screen: game ? screen : 'home',
    selectedLevels,
    game,
  };
}

/** Reads legacy numbers-only progress so returning players keep their unlocks. */
async function loadLegacyNumbersProgress(): Promise<LevelProgress | null> {
  try {
    const stored = await AsyncStorage.getItem(LEGACY_PROGRESS_KEY);
    if (!stored) return null;
    return sanitizeModeProgress('numbers', JSON.parse(stored));
  } catch {
    return null;
  }
}

export async function loadAllProgress(): Promise<AllProgress> {
  try {
    const stored = await AsyncStorage.getItem(PROGRESS_KEY);
    if (stored) return sanitizeAllProgress(JSON.parse(stored));

    // Migrate legacy numbers-only progress into the mode-aware structure.
    const legacy = await loadLegacyNumbersProgress();
    const migrated = createDefaultAllProgress();
    if (legacy) migrated.numbers = legacy;
    return migrated;
  } catch {
    return createDefaultAllProgress();
  }
}

export async function saveAllProgress(progress: AllProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Ignore persistence failures; in-memory progress still works.
  }
}

export async function loadSession(): Promise<PersistedSession> {
  try {
    const stored = await AsyncStorage.getItem(SESSION_KEY);
    if (!stored) return createDefaultSession();
    return sanitizeSession(JSON.parse(stored));
  } catch {
    return createDefaultSession();
  }
}

export async function saveSession(session: PersistedSession): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore persistence failures; in-memory session still works.
  }
}

export function hasUnfinishedGame(game: PersistedGame | null): boolean {
  return game !== null && !game.won && !game.lost;
}
