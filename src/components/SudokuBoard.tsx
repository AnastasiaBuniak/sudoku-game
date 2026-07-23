import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Board } from '../utils/sudoku';
import type { CheerEvent } from '../utils/sudoku';
import { useI18n } from '../i18n/I18nProvider';
import { colors, fonts, radii, shadows } from '../theme';

type Props = {
  board: Board;
  given: Board;
  selected: { row: number; col: number } | null;
  incorrectCells: Set<string>;
  cheer: CheerEvent | null;
  boardSize: number;
  onSelect: (row: number, col: number) => void;
};

type DigitProps = {
  value: number;
  isGiven: boolean;
  isIncorrect: boolean;
  fontSize: number;
  celebrate: boolean;
};

const SPARKLE_COLORS = [colors.starPink, colors.starYellow, colors.starMint, colors.starLavender];

function CellSparkles({ active, strong }: { active: boolean; strong: boolean }) {
  const progress = useRef(new Animated.Value(0)).current;
  const count = strong ? 6 : 3;

  useEffect(() => {
    if (!active) {
      progress.setValue(0);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: strong ? 700 : 520,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [active, strong, progress]);

  const sparks = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
        const distance = strong ? 16 : 12;
        return {
          key: `spark-${index}`,
          color: SPARKLE_COLORS[index % SPARKLE_COLORS.length],
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: strong ? 7 : 5,
        };
      }),
    [count, strong],
  );

  if (!active) return null;

  return (
    <View pointerEvents="none" style={styles.sparkleLayer}>
      {sparks.map((spark) => (
        <Animated.View
          key={spark.key}
          style={[
            styles.sparkle,
            {
              width: spark.size,
              height: spark.size,
              borderRadius: spark.size,
              backgroundColor: spark.color,
              opacity: progress.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  translateX: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, spark.x],
                  }),
                },
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, spark.y],
                  }),
                },
                {
                  scale: progress.interpolate({
                    inputRange: [0, 0.35, 1],
                    outputRange: [0.4, 1.15, 0.2],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

function BoardDigit({ value, isGiven, isIncorrect, fontSize, celebrate }: DigitProps) {
  const flash = useRef(new Animated.Value(0)).current;
  const previous = useRef(value);

  useEffect(() => {
    const wasEmptyOrDifferent = previous.current !== value;
    previous.current = value;

    if (value === 0 || isIncorrect || isGiven || !wasEmptyOrDifferent) {
      if (!celebrate) flash.setValue(0);
      return;
    }

    flash.setValue(1);
    const animation = Animated.timing(flash, {
      toValue: 0,
      duration: 550,
      delay: 180,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [value, isIncorrect, isGiven, flash, celebrate]);

  useEffect(() => {
    if (!celebrate || value === 0 || isIncorrect || isGiven) return;
    flash.setValue(1);
    const animation = Animated.timing(flash, {
      toValue: 0,
      duration: 550,
      delay: 180,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [celebrate, value, isIncorrect, isGiven, flash]);

  if (value === 0) return null;

  if (isIncorrect) {
    return <Text style={[styles.digit, styles.digitWrong, { fontSize }]}>{value}</Text>;
  }

  if (isGiven) {
    return <Text style={[styles.digit, styles.digitNormal, { fontSize }]}>{value}</Text>;
  }

  return (
    <View style={styles.digitStack}>
      <Text style={[styles.digit, styles.digitNormal, { fontSize }]}>{value}</Text>
      <Animated.Text
        style={[
          styles.digit,
          styles.digitFlash,
          styles.digitOverlay,
          { fontSize, opacity: flash },
        ]}
      >
        {value}
      </Animated.Text>
    </View>
  );
}

function PillowTile({
  size,
  radius,
  selected,
  related,
  sameNumber,
  incorrect,
  celebrate,
  boxCelebrate,
  onPress,
  children,
}: {
  size: number;
  radius: number;
  selected: boolean;
  related: boolean;
  sameNumber: boolean;
  incorrect: boolean;
  celebrate: boolean;
  boxCelebrate: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const base = incorrect
    ? colors.tileConflict
    : selected
      ? colors.tileSelected
      : sameNumber
        ? colors.tileSame
        : related
          ? colors.tileRelated
          : colors.tile;

  const gradient =
    base === colors.tile
      ? ([colors.tileLight, colors.tile, colors.tileDeep] as const)
      : ([base, base, base] as const);

  useEffect(() => {
    if (!celebrate && !boxCelebrate) {
      scale.setValue(1);
      return;
    }
    const peak = celebrate ? 1.14 : 1.08;
    const animation = Animated.sequence([
      Animated.spring(scale, {
        toValue: peak,
        useNativeDriver: true,
        speed: 42,
        bounciness: 10,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 28,
        bounciness: 8,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [celebrate, boxCelebrate, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        style={[
          styles.tileOuter,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderColor: selected ? colors.digit : 'transparent',
            borderWidth: selected ? 2 : 0,
            backgroundColor: colors.tile,
          },
          boxCelebrate && styles.tileBoxGlow,
        ]}
      >
        <LinearGradient
          colors={gradient}
          locations={[0, 0.55, 1]}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          style={[styles.tileInner, { borderRadius: Math.max(6, radius - 2) }]}
        >
          <View style={styles.tileShine} />
          {children}
          <CellSparkles active={celebrate} strong={boxCelebrate} />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export function SudokuBoard({
  board,
  given,
  selected,
  incorrectCells,
  cheer,
  boardSize,
  onSelect,
}: Props) {
  const { t } = useI18n();
  const framePad = Math.max(10, Math.round(boardSize * 0.035));
  const cellGap = Math.max(3, Math.round(boardSize * 0.012));
  const blockGap = Math.max(7, Math.round(boardSize * 0.028));
  const inner = boardSize - framePad * 2;
  const cellSize = (inner - cellGap * 6 - blockGap * 2) / 9;
  const digitSize = Math.max(14, Math.round(cellSize * 0.56));
  const tileRadius = Math.max(8, cellSize * 0.32);
  const selectedValue = selected !== null ? board[selected.row][selected.col] : 0;
  const frameRadius = radii.xxl + 4;
  const cheerBox =
    cheer?.boxComplete != null && cheer.boxComplete
      ? {
          row: Math.floor(cheer.row / 3),
          col: Math.floor(cheer.col / 3),
        }
      : null;
  const niceOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!cheer?.boxComplete) {
      niceOpacity.setValue(0);
      return;
    }
    niceOpacity.setValue(0);
    const animation = Animated.sequence([
      Animated.timing(niceOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.delay(700),
      Animated.timing(niceOpacity, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [cheer?.id, cheer?.boxComplete, niceOpacity]);

  return (
    <View
      style={[
        styles.shadowWrap,
        { width: boardSize, height: boardSize, borderRadius: frameRadius },
      ]}
    >
      <LinearGradient
        colors={[colors.boardFrameLight, colors.boardFrame, colors.boardFrameDark]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.frame, { borderRadius: frameRadius, padding: framePad }]}
      >
        <View style={styles.frameGloss} />

        <View style={styles.grid}>
          {board.map((row, rowIndex) => (
            <View
              key={`row-${rowIndex}`}
              style={[
                styles.row,
                {
                  marginBottom: rowIndex === 8 ? 0 : rowIndex % 3 === 2 ? blockGap : cellGap,
                },
              ]}
            >
              {row.map((value, colIndex) => {
                const isSelected = selected?.row === rowIndex && selected?.col === colIndex;
                const isGiven = given[rowIndex][colIndex] !== 0;
                const isIncorrect = incorrectCells.has(`${rowIndex}-${colIndex}`);
                const isRelated =
                  selected !== null &&
                  !isSelected &&
                  (selected.row === rowIndex ||
                    selected.col === colIndex ||
                    (Math.floor(selected.row / 3) === Math.floor(rowIndex / 3) &&
                      Math.floor(selected.col / 3) === Math.floor(colIndex / 3)));
                const isSameNumber = value !== 0 && value === selectedValue;
                const marginRight =
                  colIndex === 8 ? 0 : colIndex % 3 === 2 ? blockGap : cellGap;
                const celebrate =
                  cheer !== null && cheer.row === rowIndex && cheer.col === colIndex;
                const boxCelebrate =
                  cheerBox !== null &&
                  Math.floor(rowIndex / 3) === cheerBox.row &&
                  Math.floor(colIndex / 3) === cheerBox.col;

                return (
                  <View key={`cell-${rowIndex}-${colIndex}`} style={{ marginRight }}>
                    <PillowTile
                      size={cellSize}
                      radius={tileRadius}
                      selected={isSelected}
                      related={isRelated}
                      sameNumber={isSameNumber}
                      incorrect={isIncorrect}
                      celebrate={celebrate}
                      boxCelebrate={boxCelebrate}
                      onPress={() => onSelect(rowIndex, colIndex)}
                    >
                      <BoardDigit
                        value={value}
                        isGiven={isGiven}
                        isIncorrect={isIncorrect}
                        fontSize={digitSize}
                        celebrate={celebrate}
                      />
                    </PillowTile>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <Animated.View
          pointerEvents="none"
          style={[styles.niceChip, { opacity: niceOpacity }]}
        >
          <Text style={styles.niceText}>{t('game.nice')}</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    overflow: 'hidden',
    ...shadows.soft,
  },
  frame: {
    flex: 1,
    overflow: 'hidden',
  },
  frameGloss: {
    position: 'absolute',
    top: 8,
    left: 18,
    right: 48,
    height: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  tileOuter: {
    overflow: 'hidden',
    ...shadows.tile,
  },
  tileBoxGlow: {
    borderWidth: 2,
    borderColor: 'rgba(120, 210, 160, 0.75)',
  },
  tileInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tileShine: {
    position: 'absolute',
    top: 3,
    left: 5,
    right: 12,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  sparkleLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
  niceChip: {
    position: 'absolute',
    alignSelf: 'center',
    top: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.digitCorrectFlash,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...shadows.button,
  },
  niceText: {
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: '700',
    color: colors.digitCorrectFlash,
  },
  digitStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitOverlay: {
    position: 'absolute',
  },
  digit: {
    fontFamily: fonts.display,
    fontWeight: '700',
  },
  digitNormal: {
    color: colors.digit,
  },
  digitFlash: {
    color: colors.digitCorrectFlash,
  },
  digitWrong: {
    color: colors.conflictText,
  },
});
