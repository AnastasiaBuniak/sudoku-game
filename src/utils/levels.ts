import type { Difficulty } from './sudoku';

export const LEVELS: Difficulty[] = ['easy', 'medium', 'hard', 'profi', 'master'];

export const LEVEL_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  profi: 'Profi',
  master: 'Master',
};

/** Wins needed at this level to unlock the next one. */
export const WINS_TO_UNLOCK_NEXT: Record<Difficulty, number> = {
  easy: 3,
  medium: 3,
  hard: 5,
  profi: 5,
  master: 0,
};

export type LevelProgress = {
  /** Highest unlocked level index in LEVELS (0 = easy). */
  highestUnlockedIndex: number;
  /** Completed games per level. */
  wins: Record<Difficulty, number>;
};

export function createDefaultProgress(): LevelProgress {
  return {
    highestUnlockedIndex: 0,
    wins: {
      easy: 0,
      medium: 0,
      hard: 0,
      profi: 0,
      master: 0,
    },
  };
}

export function isLevelUnlocked(progress: LevelProgress, level: Difficulty): boolean {
  return LEVELS.indexOf(level) <= progress.highestUnlockedIndex;
}

export function getNextLevel(level: Difficulty): Difficulty | null {
  const index = LEVELS.indexOf(level);
  if (index < 0 || index >= LEVELS.length - 1) return null;
  return LEVELS[index + 1];
}

export function getUnlockRequirement(level: Difficulty): number {
  return WINS_TO_UNLOCK_NEXT[level];
}

/** The next locked level and how many wins remain to unlock it. */
export function getNextUnlockPrompt(progress: LevelProgress): {
  level: Difficulty;
  requiredLevel: Difficulty;
  remaining: number;
} | null {
  const nextIndex = progress.highestUnlockedIndex + 1;
  if (nextIndex >= LEVELS.length) return null;

  const nextLevel = LEVELS[nextIndex];
  const requiredLevel = LEVELS[progress.highestUnlockedIndex];
  const needed = getUnlockRequirement(requiredLevel);
  const remaining = Math.max(0, needed - progress.wins[requiredLevel]);

  return {
    level: nextLevel,
    requiredLevel,
    remaining,
  };
}

export type RecordWinResult = {
  progress: LevelProgress;
  unlockedLevel: Difficulty | null;
};

/** Record a completed game and unlock the next level when the threshold is met. */
export function recordWin(progress: LevelProgress, level: Difficulty): RecordWinResult {
  if (!isLevelUnlocked(progress, level)) {
    return { progress, unlockedLevel: null };
  }

  const nextWins = { ...progress.wins, [level]: progress.wins[level] + 1 };
  let highestUnlockedIndex = progress.highestUnlockedIndex;
  let unlockedLevel: Difficulty | null = null;

  const levelIndex = LEVELS.indexOf(level);
  const needed = getUnlockRequirement(level);
  const next = getNextLevel(level);

  if (next && needed > 0 && nextWins[level] >= needed && highestUnlockedIndex === levelIndex) {
    highestUnlockedIndex = levelIndex + 1;
    unlockedLevel = next;
  }

  return {
    progress: {
      highestUnlockedIndex,
      wins: nextWins,
    },
    unlockedLevel,
  };
}
