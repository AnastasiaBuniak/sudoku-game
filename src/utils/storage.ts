import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LevelProgress } from './levels';
import { createDefaultProgress } from './levels';
import type { Board, Difficulty } from './sudoku';

const LEVEL_PROGRESS_KEY = '@sudoku/level-progress';
const SESSION_KEY = '@sudoku/session';

export type Screen = 'home' | 'game';

export const MAX_MISTAKES = 3;

export type PersistedGame = {
  difficulty: Difficulty;
  board: Board;
  given: Board;
  solution: Board;
  won: boolean;
  winCounted: boolean;
  /** Chances left before game over (starts at MAX_MISTAKES). */
  mistakesLeft: number;
  lost: boolean;
};

export type PersistedSession = {
  screen: Screen;
  selectedLevel: Difficulty;
  game: PersistedGame | null;
};

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'profi', 'master'];

export function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === 'string' && DIFFICULTIES.includes(value as Difficulty);
}

function isBoard(value: unknown): value is Board {
  if (!Array.isArray(value) || value.length !== 9) return false;
  return value.every(
    (row) =>
      Array.isArray(row) &&
      row.length === 9 &&
      row.every((cell) => typeof cell === 'number' && cell >= 0 && cell <= 9),
  );
}

function sanitizeProgress(raw: unknown): LevelProgress {
  const defaults = createDefaultProgress();
  if (!raw || typeof raw !== 'object') return defaults;

  const data = raw as Partial<LevelProgress>;
  const highestUnlockedIndex =
    typeof data.highestUnlockedIndex === 'number' &&
    data.highestUnlockedIndex >= 0 &&
    data.highestUnlockedIndex <= 4
      ? Math.floor(data.highestUnlockedIndex)
      : 0;

  const wins = { ...defaults.wins };
  if (data.wins && typeof data.wins === 'object') {
    DIFFICULTIES.forEach((level) => {
      const value = (data.wins as Record<string, unknown>)[level];
      if (typeof value === 'number' && value >= 0) {
        wins[level] = Math.floor(value);
      }
    });
  }

  return { highestUnlockedIndex, wins };
}

function sanitizeGame(raw: unknown): PersistedGame | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Partial<PersistedGame>;
  if (!isDifficulty(data.difficulty)) return null;
  if (!isBoard(data.board) || !isBoard(data.given) || !isBoard(data.solution)) return null;

  return {
    difficulty: data.difficulty,
    board: data.board,
    given: data.given,
    solution: data.solution,
    won: Boolean(data.won),
    winCounted: Boolean(data.winCounted),
    mistakesLeft:
      typeof data.mistakesLeft === 'number' && data.mistakesLeft >= 0 && data.mistakesLeft <= MAX_MISTAKES
        ? Math.floor(data.mistakesLeft)
        : MAX_MISTAKES,
    lost: Boolean(data.lost),
  };
}

export function createDefaultSession(): PersistedSession {
  return {
    screen: 'home',
    selectedLevel: 'easy',
    game: null,
  };
}

function sanitizeSession(raw: unknown): PersistedSession {
  const defaults = createDefaultSession();
  if (!raw || typeof raw !== 'object') return defaults;

  const data = raw as Partial<PersistedSession>;
  const screen = data.screen === 'game' || data.screen === 'home' ? data.screen : 'home';
  const selectedLevel = isDifficulty(data.selectedLevel) ? data.selectedLevel : 'easy';
  const game = sanitizeGame(data.game);

  return {
    screen: game ? screen : 'home',
    selectedLevel,
    game,
  };
}

export async function loadLevelProgress(): Promise<LevelProgress> {
  try {
    const stored = await AsyncStorage.getItem(LEVEL_PROGRESS_KEY);
    if (!stored) return createDefaultProgress();
    return sanitizeProgress(JSON.parse(stored));
  } catch {
    return createDefaultProgress();
  }
}

export async function saveLevelProgress(progress: LevelProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(LEVEL_PROGRESS_KEY, JSON.stringify(progress));
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
