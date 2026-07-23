import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useI18n } from '../i18n/I18nProvider';
import { borders, colors, fonts, radii, shadows, spacing } from '../theme';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { PressableScale } from './PressableScale';

type Props = {
  onNumberPress: (value: number) => void;
  onErase: () => void;
  disabledNumbers: Set<number>;
  maxWidth: number;
};

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function NumberPad({ onNumberPress, onErase, disabledNumbers, maxWidth }: Props) {
  const { fontScale, isCompact, gap } = useLayoutMetrics();
  const { t } = useI18n();
  const remainingNumbers = NUMBERS.filter((number) => !disabledNumbers.has(number));
  const cellGap = isCompact ? 4 : 6;
  const approxCell = maxWidth / 9;
  const digitSize = Math.max(13, Math.round(approxCell * 0.42 * fontScale));

  return (
    <View style={[styles.container, { maxWidth, width: '100%', gap: Math.max(spacing.sm, gap) }]}>
      <View style={[styles.row, { gap: cellGap }]}>
        {remainingNumbers.map((number) => {
          const gummy = colors.gummy[number - 1];
          return (
            <PressableScale
              key={number}
              onPress={() => onNumberPress(number)}
              scaleTo={0.8}
              style={styles.buttonWrap}
            >
              <LinearGradient
                colors={[gummy.gloss, gummy.bg, gummy.border]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.button}
              >
                <View style={styles.buttonShine} />
                <Text style={[styles.buttonText, { fontSize: digitSize }]}>{number}</Text>
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
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrap: {
    flex: 1,
    aspectRatio: 1,
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
