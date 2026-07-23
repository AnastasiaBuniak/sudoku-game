import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createDefaultSession,
  hasUnfinishedGame,
  loadSession,
  saveSession,
  type PersistedGame,
  type PersistedSession,
  type Screen,
} from '../utils/storage';
import type { Difficulty } from '../utils/sudoku';

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

  const setSelectedLevel = useCallback(
    (selectedLevel: Difficulty) => {
      persist({ ...sessionRef.current, selectedLevel });
    },
    [persist],
  );

  const setGame = useCallback(
    (game: PersistedGame | null, screen?: Screen) => {
      const current = sessionRef.current;
      persist({
        ...current,
        game,
        screen: screen ?? current.screen,
        selectedLevel: game?.difficulty ?? current.selectedLevel,
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
    setSelectedLevel,
    setGame,
    updateGame,
    clearGame,
  };
}
