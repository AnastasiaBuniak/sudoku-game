import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { SymbolKind } from '../game/modes';
import { useI18n } from '../i18n/I18nProvider';
import { borders, colors, fonts, radii, shadows, spacing } from '../theme';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { AnimalGlyph } from './AnimalGlyph';
import { PressableScale } from './PressableScale';

type Props = {
  onNumberPress: (value: number) => void;
  onUndo: () => void;
  canUndo: boolean;
  /** Pulse the eraser while a wrong (red) cell is selected. */
  promptErase?: boolean;
  disabledNumbers: Set<number>;
  /** How many symbols the pad offers (matches the grid size). */
  count: number;
  symbol: SymbolKind;
  maxWidth: number;
};

export function NumberPad({
  onNumberPress,
  onUndo,
  canUndo,
  promptErase = false,
  disabledNumbers,
  count,
  symbol,
  maxWidth,
}: Props) {
  const { fontScale, isCompact, gap } = useLayoutMetrics();
  const { t } = useI18n();
  const values = Array.from({ length: count }, (_, index) => index + 1);
  const remaining = values.filter((value) => !disabledNumbers.has(value));
  const cellGap = isCompact ? 2 : 4;

  // Keep buttons from ballooning when a mode only has a few symbols (e.g. 4×4).
  const columns = Math.max(count, 5);
  const buttonSize = Math.floor((maxWidth - cellGap * (columns - 1)) / columns);
  const tapSize = Math.round(buttonSize * 1.04);
  const digitSize = Math.max(13, Math.round(buttonSize * 0.4 * fontScale));
  const glyphSize = Math.round(buttonSize * 0.62);
  const undoSize = Math.max(32, Math.round(tapSize * 0.72));
  const undoIconSize = Math.round(undoSize * 0.62);

  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!promptErase || !canUndo) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 520,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 520,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
      pulse.setValue(0);
    };
  }, [promptErase, canUndo, pulse]);

  const eraseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.14],
  });
  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.55],
  });
  const ringOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0],
  });

  return (
    <View style={[styles.container, { maxWidth, width: '100%', gap: Math.max(spacing.sm, gap) }]}>
      <View style={[styles.row, { gap: cellGap }]}>
        {remaining.map((value) => {
          const gummy = colors.gummy[(value - 1) % colors.gummy.length];
          return (
            <PressableScale
              key={value}
              onPress={() => onNumberPress(value)}
              scaleTo={0.8}
              style={[styles.buttonWrap, { width: buttonSize, height: tapSize }]}
            >
              <LinearGradient
                colors={[gummy.gloss, gummy.bg, gummy.border]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.button}
              >
                <View style={styles.buttonShine} />
                {symbol === 'animal' ? (
                  <AnimalGlyph value={value} size={glyphSize} />
                ) : (
                  <Text style={[styles.buttonText, { fontSize: digitSize }]}>{value}</Text>
                )}
              </LinearGradient>
            </PressableScale>
          );
        })}
      </View>
      <View style={[styles.undoWrap, { width: undoSize, height: undoSize }]}>
        {promptErase && canUndo ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.undoRing,
              {
                width: undoSize,
                height: undoSize,
                borderRadius: undoSize / 2,
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />
        ) : null}
        <Animated.View style={{ transform: [{ scale: eraseScale }] }}>
          <PressableScale
            onPress={onUndo}
            disabled={!canUndo}
            accessibilityRole="button"
            accessibilityLabel={t('a11y.undo')}
            accessibilityState={{ disabled: !canUndo }}
            scaleTo={0.9}
            style={[
              styles.undoButton,
              {
                width: undoSize,
                height: undoSize,
                opacity: canUndo ? 1 : 0.4,
                borderColor: promptErase && canUndo ? colors.conflictText : colors.eraseBorder,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="eraser"
              size={undoIconSize}
              color={promptErase && canUndo ? colors.conflictText : colors.eraseText}
            />
          </PressableScale>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  buttonWrap: {
    borderRadius: radii.sm,
    ...shadows.button,
  },
  button: {
    flex: 1,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borders.thick,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  buttonShine: {
    position: 'absolute',
    top: 3,
    left: 5,
    right: 10,
    height: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  buttonText: {
    fontFamily: fonts.display,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  undoWrap: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  undoRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.conflictText,
    backgroundColor: 'transparent',
  },
  undoButton: {
    borderRadius: radii.pill,
    backgroundColor: colors.eraseBg,
    borderWidth: borders.thick,
    borderColor: colors.eraseBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
});
