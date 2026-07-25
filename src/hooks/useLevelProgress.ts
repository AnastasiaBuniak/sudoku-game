import { useCallback, useEffect, useState } from 'react';
import { MODE_CONFIGS, type GameMode } from '../game/modes';
import { recordWin, type LevelProgress, type RecordWinResult } from '../utils/levels';
import {
  createDefaultAllProgress,
  loadAllProgress,
  saveAllProgress,
  type AllProgress,
} from '../utils/storage';

export function useLevelProgress() {
  const [allProgress, setAllProgress] = useState<AllProgress>(createDefaultAllProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadAllProgress().then((loaded) => {
      if (cancelled) return;
      setAllProgress(loaded);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: AllProgress) => {
    setAllProgress(next);
    void saveAllProgress(next);
  }, []);

  const getProgress = useCallback(
    (mode: GameMode): LevelProgress => allProgress[mode],
    [allProgress],
  );

  const completeGame = useCallback(
    (mode: GameMode, levelId: string): RecordWinResult => {
      const config = MODE_CONFIGS[mode];
      const result = recordWin(config, allProgress[mode], levelId);
      persist({ ...allProgress, [mode]: result.progress });
      return result;
    },
    [allProgress, persist],
  );

  return { allProgress, getProgress, ready, completeGame };
}
