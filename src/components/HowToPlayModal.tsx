import { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import type { GameMode } from '../game/modes';
import { useI18n } from '../i18n/I18nProvider';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { borders, colors, fonts, radii, shadows, spacing } from '../theme';
import { PressableScale } from './PressableScale';

type Props = {
  visible: boolean;
  mode: GameMode;
  onDismiss: () => void;
};

const STEP_COLORS = [
  { bg: colors.gummy[0].bg, border: colors.gummy[0].border, text: colors.ink },
  { bg: colors.gummy[2].bg, border: colors.gummy[2].border, text: colors.ink },
  { bg: colors.gummy[4].bg, border: colors.gummy[4].border, text: colors.ink },
] as const;

export function HowToPlayModal({ visible, mode, onDismiss }: Props) {
  const pop = useRef(new Animated.Value(0.86)).current;
  const { modalMaxWidth } = useLayoutMetrics();
  const { t } = useI18n();

  const steps = [
    t('howToPlay.step1'),
    mode === 'animals' ? t('howToPlay.step2Animals') : t('howToPlay.step2Numbers'),
    mode === 'animals' ? t('howToPlay.step3Animals') : t('howToPlay.step3Numbers'),
  ];

  useEffect(() => {
    if (!visible) {
      pop.setValue(0.86);
      return;
    }
    Animated.spring(pop, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  }, [visible, pop]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { maxWidth: modalMaxWidth, transform: [{ scale: pop }] }]}>
          <Text style={styles.title}>{t('howToPlay.title')}</Text>

          <View style={styles.steps}>
            {steps.map((label, index) => {
              const palette = STEP_COLORS[index] ?? STEP_COLORS[0];
              return (
                <View key={`step-${index}`} style={styles.stepRow}>
                  <View
                    style={[
                      styles.stepBadge,
                      { backgroundColor: palette.bg, borderColor: palette.border },
                    ]}
                  >
                    <Text style={[styles.stepNumber, { color: palette.text }]}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{label}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.chancesBox}>
            <Text style={styles.chancesHearts}>♥ ♥ ♥</Text>
            <Text style={styles.chancesText}>{t('howToPlay.chances')}</Text>
          </View>

          <PressableScale onPress={onDismiss} style={styles.button}>
            <Text style={styles.buttonText}>{t('howToPlay.gotIt')}</Text>
          </PressableScale>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.modalBg,
    borderRadius: radii.xl,
    borderWidth: borders.chunky,
    borderColor: colors.modalBorder,
    paddingVertical: 28,
    paddingHorizontal: spacing.xl,
    alignItems: 'stretch',
    gap: 14,
    ...shadows.soft,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.title,
    textAlign: 'center',
  },
  steps: {
    gap: 12,
    marginTop: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBadge: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    borderWidth: borders.thick,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontFamily: fonts.displaySoft,
    fontSize: 16,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
  },
  chancesBox: {
    backgroundColor: colors.hintBg,
    borderWidth: borders.thick,
    borderColor: colors.hintBorder,
    borderRadius: radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  chancesHearts: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 16,
    color: colors.conflictText,
    letterSpacing: 2,
  },
  chancesText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.hintText,
    textAlign: 'center',
  },
  button: {
    marginTop: 4,
    alignSelf: 'center',
    backgroundColor: colors.ctaBg,
    borderWidth: borders.thick,
    borderColor: colors.ctaBorder,
    borderRadius: radii.pill,
    paddingHorizontal: 32,
    paddingVertical: 14,
    ...shadows.button,
  },
  buttonText: {
    fontFamily: fonts.displaySoft,
    color: colors.ctaText,
    fontSize: 18,
  },
});
