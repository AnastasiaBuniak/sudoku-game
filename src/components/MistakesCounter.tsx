import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useI18n } from '../i18n/I18nProvider';
import { borders, colors, fonts, radii, shadows, spacing } from '../theme';
import { MAX_MISTAKES } from '../utils/storage';

type Props = {
  mistakesLeft: number;
};

export function MistakesCounter({ mistakesLeft }: Props) {
  const { t } = useI18n();
  const clamped = Math.max(0, Math.min(MAX_MISTAKES, mistakesLeft));
  const pulse = useRef(new Animated.Value(1)).current;
  const prev = useRef(clamped);

  useEffect(() => {
    if (clamped < prev.current) {
      Animated.sequence([
        Animated.spring(pulse, { toValue: 1.12, useNativeDriver: true, speed: 50, bounciness: 8 }),
        Animated.spring(pulse, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }),
      ]).start();
    }
    prev.current = clamped;
  }, [clamped, pulse]);

  return (
    <Animated.View
      style={[styles.wrap, { transform: [{ scale: pulse }] }]}
      accessibilityRole="text"
      accessibilityLabel={t('game.chancesLeft', { count: clamped })}
    >
      <Text style={styles.label}>{t('game.chances')}</Text>
      <View style={styles.pips}>
        {Array.from({ length: MAX_MISTAKES }, (_, index) => {
          const remaining = index < clamped;
          return remaining ? (
            <LinearGradient
              key={`chance-${index}`}
              colors={[colors.gummy[0].gloss, colors.chanceFull]}
              style={styles.pipFull}
            >
              <Text style={styles.pipMark}>♥</Text>
            </LinearGradient>
          ) : (
            <View key={`chance-${index}`} style={styles.pipEmpty}>
              <Text style={styles.pipMarkUsed}>·</Text>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.tile,
    borderWidth: borders.thick,
    borderColor: colors.chanceBorder,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...shadows.button,
  },
  label: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 13,
    color: colors.chanceLabel,
  },
  pips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pipFull: {
    width: 26,
    height: 26,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borders.thin,
    borderColor: colors.chanceBorder,
  },
  pipEmpty: {
    width: 26,
    height: 26,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chanceEmpty,
    borderWidth: borders.thin,
    borderColor: colors.chanceEmptyBorder,
  },
  pipMark: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 16,
  },
  pipMarkUsed: {
    color: colors.lockedText,
    fontSize: 18,
    fontWeight: '900',
  },
});
