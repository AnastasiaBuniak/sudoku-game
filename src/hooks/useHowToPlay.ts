import { useCallback, useEffect, useState } from 'react';
import { loadHowToPlaySeen, saveHowToPlaySeen } from '../utils/howToPlay';

export function useHowToPlay() {
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadHowToPlaySeen().then((value) => {
      if (cancelled) return;
      setSeen(value);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const open = useCallback(() => {
    setVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setSeen((prev) => {
      if (!prev) {
        void saveHowToPlaySeen();
      }
      return true;
    });
  }, []);

  return { ready, seen, visible, open, dismiss };
}
