import type { LevelConfig, ModeConfig } from '../game/modes';

/** Progress within a single mode. Wins are keyed by level id. */
export type LevelProgress = {
  /** Highest unlocked level index within the mode's ordered level list. */
  highestUnlockedIndex: number;
  /** Completed games per level id. */
  wins: Record<string, number>;
};

export function createDefaultProgress(config?: ModeConfig): LevelProgress {
  const wins: Record<string, number> = {};
  config?.levels.forEach((level) => {
    wins[level.id] = 0;
  });
  return { highestUnlockedIndex: 0, wins };
}

function levelIndex(config: ModeConfig, levelId: string): number {
  return config.levels.findIndex((level) => level.id === levelId);
}

export function isLevelUnlocked(
  config: ModeConfig,
  progress: LevelProgress,
  levelId: string,
): boolean {
  const index = levelIndex(config, levelId);
  return index >= 0 && index <= progress.highestUnlockedIndex;
}

export function getNextLevel(config: ModeConfig, levelId: string): LevelConfig | null {
  const index = levelIndex(config, levelId);
  if (index < 0 || index >= config.levels.length - 1) return null;
  return config.levels[index + 1];
}

export function getWins(progress: LevelProgress, levelId: string): number {
  return progress.wins[levelId] ?? 0;
}

/** The next locked level and how many wins remain to unlock it. */
export function getNextUnlockPrompt(
  config: ModeConfig,
  progress: LevelProgress,
): { level: LevelConfig; requiredLevel: LevelConfig; remaining: number } | null {
  const nextIndex = progress.highestUnlockedIndex + 1;
  if (nextIndex >= config.levels.length) return null;

  const nextLevel = config.levels[nextIndex];
  const requiredLevel = config.levels[progress.highestUnlockedIndex];
  const needed = requiredLevel.winsToUnlockNext;
  const remaining = Math.max(0, needed - getWins(progress, requiredLevel.id));

  return { level: nextLevel, requiredLevel, remaining };
}

export type RecordWinResult = {
  progress: LevelProgress;
  /** The newly unlocked level id, if any. */
  unlockedLevel: string | null;
};

/** Record a completed game and unlock the next level when the threshold is met. */
export function recordWin(
  config: ModeConfig,
  progress: LevelProgress,
  levelId: string,
): RecordWinResult {
  if (!isLevelUnlocked(config, progress, levelId)) {
    return { progress, unlockedLevel: null };
  }

  const nextWins = { ...progress.wins, [levelId]: getWins(progress, levelId) + 1 };
  let highestUnlockedIndex = progress.highestUnlockedIndex;
  let unlockedLevel: string | null = null;

  const index = levelIndex(config, levelId);
  const level = config.levels[index];
  const next = getNextLevel(config, levelId);

  if (
    next &&
    level.winsToUnlockNext > 0 &&
    nextWins[levelId] >= level.winsToUnlockNext &&
    highestUnlockedIndex === index
  ) {
    highestUnlockedIndex = index + 1;
    unlockedLevel = next.id;
  }

  return {
    progress: { highestUnlockedIndex, wins: nextWins },
    unlockedLevel,
  };
}
