import { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../i18n/I18nProvider';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { borders, colors, fonts, radii, shadows, spacing } from '../theme';
import { PressableScale } from './PressableScale';

type Props = {
  visible: boolean;
  unlockMessage?: string | null;
  onPlayAgain: () => void;
  onHome: () => void;
  onClose: () => void;
};

export function WinModal({
  visible,
  unlockMessage,
  onPlayAgain,
  onHome,
  onClose,
}: Props) {
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
      bounciness: 10,
    }).start();
  }, [visible, pop]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { maxWidth: modalMaxWidth, transform: [{ scale: pop }] }]}>
          <Text style={styles.stars}>★★★</Text>
          <Text style={styles.title}>{t('win.title')}</Text>
          <Text style={styles.message}>{t('win.message')}</Text>
          {unlockMessage ? <Text style={styles.unlock}>{unlockMessage}</Text> : null}
          <PressableScale onPress={onPlayAgain} style={styles.button}>
            <Text style={styles.buttonText}>{t('win.playAgain')}</Text>
          </PressableScale>
          <PressableScale onPress={onHome} style={styles.secondary}>
            <Text style={styles.secondaryText}>{t('win.backHome')}</Text>
          </PressableScale>
          <PressableScale onPress={onClose} style={styles.secondary}>
            <Text style={styles.keepLooking}>{t('win.keepLooking')}</Text>
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
    alignItems: 'center',
    gap: 10,
    ...shadows.soft,
  },
  stars: {
    fontSize: 34,
    color: colors.star,
    letterSpacing: 8,
    marginBottom: 2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    fontWeight: '700',
    color: colors.title,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
  },
  unlock: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 15,
    fontWeight: '800',
    color: colors.hintText,
    textAlign: 'center',
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
    fontWeight: '700',
  },
  secondary: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  secondaryText: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  keepLooking: {
    fontFamily: fonts.bodySoft,
    fontSize: 14,
    fontWeight: '600',
    color: colors.eraseText,
  },
});
