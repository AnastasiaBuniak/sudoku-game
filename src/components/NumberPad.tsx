import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { SymbolKind } from '../game/modes';
import { useI18n } from '../i18n/I18nProvider';
import { borders, colors, fonts, radii, shadows, spacing } from '../theme';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { AnimalGlyph } from './AnimalGlyph';
import { PressableScale } from './PressableScale';

type Props = {
  onNumberPress: (value: number) => void;
  onErase: () => void;
  disabledNumbers: Set<number>;
  /** How many symbols the pad offers (matches the grid size). */
  count: number;
  symbol: SymbolKind;
  maxWidth: number;
};

export function NumberPad({
  onNumberPress,
  onErase,
  disabledNumbers,
  count,
  symbol,
  maxWidth,
}: Props) {
  const { fontScale, isCompact, gap } = useLayoutMetrics();
  const { t } = useI18n();
  const values = Array.from({ length: count }, (_, index) => index + 1);
  const remaining = values.filter((value) => !disabledNumbers.has(value));
  const cellGap = isCompact ? 4 : 6;

  // Keep buttons from ballooning when a mode only has a few symbols (e.g. 4×4).
  const columns = Math.max(count, 5);
  const buttonSize = Math.floor((maxWidth - cellGap * (columns - 1)) / columns);
  const digitSize = Math.max(13, Math.round(buttonSize * 0.42 * fontScale));
  const glyphSize = Math.round(buttonSize * 0.66);

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
              style={[styles.buttonWrap, { width: buttonSize, height: buttonSize }]}
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
      <PressableScale onPress={onErase} style={styles.eraseButton}>
        <Text style={[styles.eraseText, { fontSize: Math.round(16 * fontScale) }]}>
          {t('game.erase')}
        </Text>
      </PressableScale>
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
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  eraseButton: {
    alignSelf: 'center',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.eraseBg,
    borderWidth: borders.thick,
    borderColor: colors.eraseBorder,
    ...shadows.button,
  },
  eraseText: {
    fontFamily: fonts.bodyHeavy,
    fontWeight: '800',
    color: colors.eraseText,
  },
});
