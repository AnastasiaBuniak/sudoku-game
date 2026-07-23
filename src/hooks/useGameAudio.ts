import { useCallback, useEffect, useRef, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

const bgMusic = require('../../assets/sounds/bg-music.wav');
const correctSound = require('../../assets/sounds/correct.wav');

export function useGameAudio() {
  const [muted, setMuted] = useState(false);
  const musicStarted = useRef(false);
  const musicPlayer = useAudioPlayer(bgMusic);
  const correctPlayer = useAudioPlayer(correctSound);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      shouldPlayInBackground: false,
    }).catch(() => undefined);

    musicPlayer.loop = true;
    musicPlayer.volume = 0.28;
    correctPlayer.volume = 0.75;

    try {
      musicPlayer.play();
      musicStarted.current = true;
    } catch {
      musicStarted.current = false;
    }

    return () => {
      musicPlayer.pause();
    };
    // Players from useAudioPlayer are stable for the component lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    musicPlayer.muted = muted;
    correctPlayer.muted = muted;
  }, [muted, musicPlayer, correctPlayer]);

  const ensureMusicPlaying = useCallback(() => {
    if (muted || musicPlayer.playing) return;
    try {
      musicPlayer.play();
      musicStarted.current = true;
    } catch {
      // Web may block autoplay until a gesture.
    }
  }, [muted, musicPlayer]);

  const playCorrect = useCallback(async () => {
    ensureMusicPlaying();
    if (muted) return;
    try {
      await correctPlayer.seekTo(0);
      correctPlayer.play();
    } catch {
      // Ignore playback errors
    }
  }, [muted, correctPlayer, ensureMusicPlaying]);

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      if (!next) {
        try {
          musicPlayer.play();
        } catch {
          // Ignore
        }
      } else {
        musicPlayer.pause();
      }
      return next;
    });
  }, [musicPlayer]);

  return { muted, toggleMute, playCorrect, ensureMusicPlaying };
}
