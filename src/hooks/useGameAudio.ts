import { useCallback, useEffect, useRef, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

const bgMusic = require('../../assets/sounds/bg-music.wav');
const correctSound = require('../../assets/sounds/correct.wav');
const wrongSound = require('../../assets/sounds/wrong.wav');
const eraseSound = require('../../assets/sounds/erase.wav');

export function useGameAudio() {
  const [muted, setMuted] = useState(false);
  const musicStarted = useRef(false);
  const musicPlayer = useAudioPlayer(bgMusic);
  const correctPlayer = useAudioPlayer(correctSound);
  const wrongPlayer = useAudioPlayer(wrongSound);
  const erasePlayer = useAudioPlayer(eraseSound);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      shouldPlayInBackground: false,
    }).catch(() => undefined);

    musicPlayer.loop = true;
    musicPlayer.volume = 0.28;
    correctPlayer.volume = 0.75;
    wrongPlayer.volume = 0.7;
    erasePlayer.volume = 0.55;

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
    wrongPlayer.muted = muted;
    erasePlayer.muted = muted;
  }, [muted, musicPlayer, correctPlayer, wrongPlayer, erasePlayer]);

  const ensureMusicPlaying = useCallback(() => {
    if (muted || musicPlayer.playing) return;
    try {
      musicPlayer.play();
      musicStarted.current = true;
    } catch {
      // Web may block autoplay until a gesture.
    }
  }, [muted, musicPlayer]);

  const playSfx = useCallback(
    async (player: typeof correctPlayer) => {
      ensureMusicPlaying();
      if (muted) return;
      try {
        await player.seekTo(0);
        player.play();
      } catch {
        // Ignore playback errors
      }
    },
    [muted, ensureMusicPlaying],
  );

  const playCorrect = useCallback(() => playSfx(correctPlayer), [playSfx, correctPlayer]);
  const playWrong = useCallback(() => playSfx(wrongPlayer), [playSfx, wrongPlayer]);
  const playErase = useCallback(() => playSfx(erasePlayer), [playSfx, erasePlayer]);

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

  return { muted, toggleMute, playCorrect, playWrong, playErase, ensureMusicPlaying };
}
