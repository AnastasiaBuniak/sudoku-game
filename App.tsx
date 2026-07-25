import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Fredoka_600SemiBold,
  Fredoka_700Bold,
  useFonts as useFredokaFonts,
} from '@expo-google-fonts/fredoka';
import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts as useNunitoFonts,
} from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from './src/components/BackButton';
import { GameControls } from './src/components/GameControls';
import { GameOverModal } from './src/components/GameOverModal';
import { HomeScreen } from './src/components/HomeScreen';
import { LanguageSelector } from './src/components/LanguageSelector';
import { MistakesCounter } from './src/components/MistakesCounter';
import { MuteButton } from './src/components/MuteButton';
import { NumberPad } from './src/components/NumberPad';
import { CandySkyBackground } from './src/components/CandySkyBackground';
import { SoftBackground } from './src/components/SoftBackground';
import { SudokuBoard } from './src/components/SudokuBoard';
import { WinModal } from './src/components/WinModal';
import { useGameAudio } from './src/hooks/useGameAudio';
import { useLayoutMetrics } from './src/hooks/useLayoutMetrics';
import { useLevelProgress } from './src/hooks/useLevelProgress';
import { usePersistedSession } from './src/hooks/usePersistedSession';
import { track } from './src/analytics';
import { AnalyticsProvider } from './src/analytics/AnalyticsProvider';
import { I18nProvider, useI18n } from './src/i18n/I18nProvider';
import { borders, brand, colors, fonts, radii, spacing } from './src/theme';
import { getLevelConfig, getModeConfig, type GameMode } from './src/game/modes';
import { isLevelUnlocked } from './src/utils/levels';
import { MAX_MISTAKES, type PersistedGame } from './src/utils/storage';
import {
  cloneBoard,
  didCompleteDigit,
  generatePuzzle,
  getIncorrectCells,
  isBoardComplete,
  isBoxComplete,
  isGivenCell,
  type Board,
  type CheerEvent,
} from './src/utils/sudoku';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function createNewGame(mode: GameMode, levelId: string): PersistedGame {
  const level = getLevelConfig(mode, levelId);
  if (!level) {
    throw new Error(`Unknown level "${levelId}" for mode "${mode}"`);
  }
  const { puzzle, solution } = generatePuzzle(level.grid, level.clues);
  return {
    mode,
    levelId,
    grid: level.grid,
    board: cloneBoard(puzzle),
    given: cloneBoard(puzzle),
    solution,
    won: false,
    winCounted: false,
    mistakesLeft: MAX_MISTAKES,
    lost: false,
  };
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AnalyticsProvider>
        <I18nProvider>
          <AppContent />
        </I18nProvider>
      </AnalyticsProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [fredokaLoaded] = useFredokaFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });
  const [nunitoLoaded] = useNunitoFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const fontsReady = fredokaLoaded && nunitoLoaded;
  const layout = useLayoutMetrics();
  const { t, ready: localeReady, locale } = useI18n();

  const { muted, toggleMute, playCorrect, ensureMusicPlaying } = useGameAudio();
  const { getProgress, ready: progressReady, completeGame } = useLevelProgress();
  const {
    session,
    ready: sessionReady,
    canContinue,
    setScreen,
    setMode,
    setSelectedLevel,
    setGame,
    updateGame,
    clearGame,
  } = usePersistedSession();

  const ready = fontsReady && progressReady && sessionReady && localeReady;
  const { screen, mode, selectedLevels, game } = session;
  const selectedLevel = selectedLevels[mode];
  const progress = getProgress(mode);
  // Scope "Continue" to the mode being viewed so switching modes shows that
  // mode's unfinished puzzle (if any) rather than another mode's game.
  const canContinueMode = canContinue && game?.mode === mode;

  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);
  const [winDismissed, setWinDismissed] = useState(false);
  const [cheer, setCheer] = useState<CheerEvent | null>(null);
  const cheerIdRef = useRef(0);
  const winHandledRef = useRef(false);
  const lossTrackedRef = useRef(false);
  const appOpenTrackedRef = useRef(false);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [ready]);

  useEffect(() => {
    if (!ready || appOpenTrackedRef.current) return;
    appOpenTrackedRef.current = true;
    track({ name: 'app_open', props: { locale } });
  }, [ready, locale]);

  useEffect(() => {
    if (!game?.lost) {
      lossTrackedRef.current = false;
      return;
    }
    if (lossTrackedRef.current) return;
    lossTrackedRef.current = true;
    track({
      name: 'puzzle_lost',
      props: { mode: game.mode, level: game.levelId, locale },
    });
  }, [game?.lost, game?.mode, game?.levelId, locale]);

  const incorrectCells = useMemo(() => {
    if (!game) return new Set<string>();
    return getIncorrectCells(game.board, game.given, game.solution);
  }, [game]);

  const disabledNumbers = useMemo(() => {
    const disabled = new Set<number>();
    if (!game) return disabled;

    const size = game.grid.size;
    const counts = new Map<number, number>();
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const value = game.board[row][col];
        if (value === 0 || value !== game.solution[row][col]) continue;
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }

    counts.forEach((count, value) => {
      if (count >= size) disabled.add(value);
    });
    return disabled;
  }, [game]);

  const startFreshGame = useCallback(
    (nextMode: GameMode, levelId: string) => {
      setSelected(null);
      setUnlockMessage(null);
      setWinDismissed(false);
      setCheer(null);
      winHandledRef.current = false;
      lossTrackedRef.current = false;
      track({ name: 'puzzle_started', props: { mode: nextMode, level: levelId, locale } });
      setGame(createNewGame(nextMode, levelId), 'game');
    },
    [locale, setGame],
  );

  const goHome = useCallback(() => {
    setSelected(null);
    setUnlockMessage(null);
    setWinDismissed(false);
    setCheer(null);
    winHandledRef.current = false;
    if (game?.won || game?.lost) {
      clearGame('home');
      return;
    }
    setScreen('home');
  }, [clearGame, game?.lost, game?.won, setScreen]);

  const handleContinue = useCallback(() => {
    if (!canContinue || !game) return;
    ensureMusicPlaying();
    setSelected(null);
    track({
      name: 'puzzle_continued',
      props: { mode: game.mode, level: game.levelId, locale },
    });
    setScreen('game');
  }, [canContinue, ensureMusicPlaying, game, locale, setScreen]);

  const handlePlay = useCallback(() => {
    const config = getModeConfig(mode);
    if (!isLevelUnlocked(config, progress, selectedLevel)) return;
    ensureMusicPlaying();
    startFreshGame(mode, selectedLevel);
  }, [ensureMusicPlaying, mode, progress, selectedLevel, startFreshGame]);

  useEffect(() => {
    if (!game?.won || game.winCounted || winHandledRef.current) return;
    winHandledRef.current = true;

    const result = completeGame(game.mode, game.levelId);
    track({
      name: 'puzzle_won',
      props: { mode: game.mode, level: game.levelId, locale },
    });
    if (result.unlockedLevel) {
      track({
        name: 'level_unlocked',
        props: { mode: game.mode, level: result.unlockedLevel, locale },
      });
    }
    setUnlockMessage(
      result.unlockedLevel
        ? t('game.levelUnlocked', { level: t(`levels.${result.unlockedLevel}`) })
        : null,
    );
    updateGame({ winCounted: true });
  }, [game, completeGame, updateGame, t, locale]);

  useEffect(() => {
    if (!game || !game.won) {
      winHandledRef.current = false;
    }
  }, [game?.won, game?.levelId]);

  const updateCell = (row: number, col: number, value: number) => {
    if (!game || isGivenCell(game.given, row, col) || game.won || game.lost) return;

    const previous = game.board[row][col];
    if (previous === value) return;

    const nextBoard: Board = cloneBoard(game.board);
    nextBoard[row][col] = value;

    let mistakesLeft = game.mistakesLeft;
    let lost = false;

    if (value !== 0 && value !== game.solution[row][col]) {
      mistakesLeft = Math.max(0, mistakesLeft - 1);
      lost = mistakesLeft === 0;
      setCheer(null);
      track({
        name: 'cell_wrong',
        props: {
          mode: game.mode,
          digit: value,
          level: game.levelId,
          locale,
          chances_left: mistakesLeft,
        },
      });
    } else if (value !== 0 && value === game.solution[row][col]) {
      void playCorrect();
      track({
        name: 'cell_correct',
        props: { mode: game.mode, digit: value, level: game.levelId, locale },
      });
      const boxWasComplete = isBoxComplete(game.board, game.solution, row, col, game.grid);
      const boxComplete =
        !boxWasComplete && isBoxComplete(nextBoard, game.solution, row, col, game.grid);
      cheerIdRef.current += 1;
      setCheer({
        id: cheerIdRef.current,
        row,
        col,
        boxComplete,
      });

      if (didCompleteDigit(game.board, nextBoard, game.solution, value)) {
        track({
          name: 'number_completed',
          props: { mode: game.mode, digit: value, level: game.levelId, locale },
        });
      }
    }

    const won = !lost && value !== 0 && isBoardComplete(nextBoard, game.solution);
    updateGame({ board: nextBoard, mistakesLeft, lost, won });
  };

  const handleNumberPress = (value: number) => {
    ensureMusicPlaying();
    if (!selected || !game || game.won || game.lost) return;
    updateCell(selected.row, selected.col, value);
  };

  const handleErase = () => {
    ensureMusicPlaying();
    if (!selected || !game || game.won || game.lost) return;
    updateCell(selected.row, selected.col, 0);
  };

  const onGameScreen = screen === 'game' && Boolean(game);

  if (!ready) {
    return (
      <View style={styles.root}>
        <SoftBackground />
        <SafeAreaView style={styles.loading}>
          <ActivityIndicator size="large" color={colors.title} />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {onGameScreen ? <CandySkyBackground /> : <SoftBackground />}

      <StatusBar style="dark" />
      {onGameScreen ? (
        <BackButton
          onPress={() => {
            ensureMusicPlaying();
            goHome();
          }}
        />
      ) : (
        <LanguageSelector />
      )}
      <MuteButton muted={muted} onToggle={toggleMute} />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <ScrollView
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          alwaysBounceHorizontal={false}
          contentContainerStyle={[
            styles.container,
            {
              width: '100%',
              maxWidth: '100%',
              paddingHorizontal: layout.pagePaddingX,
              paddingTop: layout.pagePaddingY + (onGameScreen ? layout.hitSize : 0),
              paddingBottom: layout.pagePaddingY + Math.max(layout.insets.bottom, 8),
              gap: layout.gap,
              // Home is top-anchored so mode/content height changes don't re-center.
              justifyContent: onGameScreen ? 'center' : 'flex-start',
            },
          ]}
        >
          {screen === 'home' || !game ? (
            <HomeScreen
              mode={mode}
              progress={progress}
              selectedLevel={selectedLevel}
              canContinue={canContinueMode}
              continueLevel={canContinueMode && game ? game.levelId : null}
              onSelectMode={(nextMode) => {
                ensureMusicPlaying();
                setMode(nextMode);
                track({ name: 'mode_selected', props: { mode: nextMode, locale } });
              }}
              onSelectLevel={(level) => {
                ensureMusicPlaying();
                setSelectedLevel(mode, level);
                track({ name: 'level_selected', props: { mode, level, locale } });
              }}
              onContinue={handleContinue}
              onPlay={handlePlay}
            />
          ) : (
            <View
              style={[
                styles.gameColumn,
                {
                  width: '100%',
                  maxWidth: Math.max(layout.boardSize, layout.contentMaxWidth),
                  gap: layout.gap,
                },
              ]}
            >
              <View style={styles.header}>
                <Text style={[styles.title, { fontSize: layout.playTitleSize }]}>{brand.name}</Text>
                <View style={styles.headerMeta}>
                  <View style={styles.subtitleChip}>
                    <Text style={styles.subtitle}>{t(`levels.${game.levelId}`)}</Text>
                  </View>
                  <MistakesCounter mistakesLeft={game.mistakesLeft} />
                </View>
              </View>

              <View style={styles.boardWrap}>
                <SudokuBoard
                  board={game.board}
                  given={game.given}
                  grid={game.grid}
                  symbol={getModeConfig(game.mode).symbol}
                  selected={selected}
                  incorrectCells={incorrectCells}
                  cheer={cheer}
                  boardSize={layout.boardSize}
                  onSelect={(row, col) => {
                    ensureMusicPlaying();
                    if (game.lost || game.won) return;
                    setSelected({ row, col });
                  }}
                />
              </View>

              <NumberPad
                onNumberPress={handleNumberPress}
                onErase={handleErase}
                disabledNumbers={disabledNumbers}
                count={game.grid.size}
                symbol={getModeConfig(game.mode).symbol}
                maxWidth={layout.padMaxWidth}
              />

              <GameControls
                onNewGame={() => {
                  ensureMusicPlaying();
                  startFreshGame(game.mode, game.levelId);
                }}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <WinModal
        visible={Boolean(game?.won && screen === 'game' && !winDismissed)}
        unlockMessage={unlockMessage}
        onPlayAgain={() => {
          if (!game) return;
          startFreshGame(game.mode, game.levelId);
        }}
        onHome={goHome}
        onClose={() => setWinDismissed(true)}
      />

      <GameOverModal
        visible={Boolean(game?.lost && screen === 'game')}
        onTryAgain={() => {
          if (!game) return;
          startFreshGame(game.mode, game.levelId);
        }}
        onHome={goHome}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgMid,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
    overflow: 'hidden',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    width: '100%',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameColumn: {
    width: '100%',
    maxWidth: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  boardWrap: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  headerMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    color: colors.title,
    textShadowColor: colors.titleShadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
    letterSpacing: 0.2,
  },
  subtitleChip: {
    backgroundColor: colors.subtitleBg,
    borderWidth: borders.thick,
    borderColor: colors.subtitleBorder,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  subtitle: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 14,
    fontWeight: '800',
    color: colors.subtitleText,
  },
});
