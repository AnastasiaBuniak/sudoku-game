import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameMode } from '../game/modes';
import {
  createDefaultSession,
  hasUnfinishedGame,
  loadSession,
  saveSession,
  type PersistedGame,
  type PersistedSession,
  type Screen,
} from '../utils/storage';

export function usePersistedSession() {
  const [session, setSession] = useState<PersistedSession>(createDefaultSession);
  const [ready, setReady] = useState(false);
  const sessionRef = useRef(session);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    let cancelled = false;
    loadSession().then((loaded) => {
      if (cancelled) return;
      setSession(loaded);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: PersistedSession) => {
    sessionRef.current = next;
    setSession(next);
    void saveSession(next);
  }, []);

  const setScreen = useCallback(
    (screen: Screen) => {
      persist({ ...sessionRef.current, screen });
    },
    [persist],
  );

  const setMode = useCallback(
    (mode: GameMode) => {
      persist({ ...sessionRef.current, mode });
    },
    [persist],
  );

  const setSelectedLevel = useCallback(
    (mode: GameMode, levelId: string) => {
      const current = sessionRef.current;
      persist({
        ...current,
        selectedLevels: { ...current.selectedLevels, [mode]: levelId },
      });
    },
    [persist],
  );

  const setGame = useCallback(
    (game: PersistedGame | null, screen?: Screen) => {
      const current = sessionRef.current;
      persist({
        ...current,
        game,
        mode: game?.mode ?? current.mode,
        screen: screen ?? current.screen,
        selectedLevels: game
          ? { ...current.selectedLevels, [game.mode]: game.levelId }
          : current.selectedLevels,
      });
    },
    [persist],
  );

  const updateGame = useCallback(
    (patch: Partial<PersistedGame>) => {
      const current = sessionRef.current;
      if (!current.game) return;
      persist({
        ...current,
        game: { ...current.game, ...patch },
      });
    },
    [persist],
  );

  const clearGame = useCallback(
    (screen: Screen = 'home') => {
      persist({
        ...sessionRef.current,
        screen,
        game: null,
      });
    },
    [persist],
  );

  return {
    session,
    ready,
    canContinue: hasUnfinishedGame(session.game),
    setScreen,
    setMode,
    setSelectedLevel,
    setGame,
    updateGame,
    clearGame,
  };
}
