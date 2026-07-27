import { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../i18n/I18nProvider';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { borders, colors, fonts, radii, shadows, spacing } from '../theme';
import { PressableScale } from './PressableScale';

type Props = {
  visible: boolean;
  onTryAgain: () => void;
  onHome: () => void;
};

export function GameOverModal({ visible, onTryAgain, onHome }: Props) {
  const pop = useRef(new Animated.Value(0.86)).current;
  const { modalMaxWidth } = useLayoutMetrics();
  const { t } = useI18n();

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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onHome}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { maxWidth: modalMaxWidth, transform: [{ scale: pop }] }]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>♥ ♥ ♥</Text>
          </View>
          <Text style={styles.title}>{t('gameOver.title')}</Text>
          <Text style={styles.message}>{t('gameOver.message')}</Text>
          <PressableScale onPress={onTryAgain} style={styles.button}>
            <Text style={styles.buttonText}>{t('gameOver.tryAgain')}</Text>
          </PressableScale>
          <PressableScale onPress={onHome} style={styles.secondary}>
            <Text style={styles.secondaryText}>{t('gameOver.backHome')}</Text>
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
    borderColor: colors.modalFailBorder,
    paddingVertical: 28,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: 10,
    ...shadows.soft,
  },
  badge: {
    backgroundColor: colors.hintBg,
    borderWidth: borders.thick,
    borderColor: colors.hintBorder,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 18,
    letterSpacing: 4,
    color: colors.chanceLabel,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.hintText,
    textAlign: 'center',
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  button: {
    marginTop: spacing.sm,
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
  secondary: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  secondaryText: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 15,
    color: colors.ink,
  },
});
