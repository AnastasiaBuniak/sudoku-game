import { useCallback, useEffect, useState } from 'react';
import {
  createDefaultProgress,
  recordWin,
  type LevelProgress,
  type RecordWinResult,
} from '../utils/levels';
import { isDifficulty, loadLevelProgress, saveLevelProgress } from '../utils/storage';
import type { Difficulty } from '../utils/sudoku';

export function useLevelProgress() {
  const [progress, setProgress] = useState<LevelProgress>(createDefaultProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadLevelProgress().then((loaded) => {
      if (cancelled) return;
      setProgress(loaded);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: LevelProgress) => {
    setProgress(next);
    void saveLevelProgress(next);
  }, []);

  const completeGame = useCallback(
    (level: Difficulty): RecordWinResult => {
      if (!isDifficulty(level)) {
        return { progress, unlockedLevel: null };
      }

      const result = recordWin(progress, level);
      persist(result.progress);
      return result;
    },
    [persist, progress],
  );

  return { progress, ready, completeGame };
}
