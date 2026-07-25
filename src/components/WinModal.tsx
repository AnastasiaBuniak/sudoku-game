import { useEffect, useMemo, useRef } from 'react';
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

const CONFETTI_COLORS = [
  colors.starLavender,
  colors.starYellow,
  colors.starMint,
  colors.gummy[0].bg,
  colors.gummy[2].bg,
  colors.gummy[4].bg,
  colors.gummy[5].bg,
  colors.gummy[6].bg,
  colors.gummy[7].bg,
];

type Piece = {
  key: string;
  left: number;
  size: number;
  color: string;
  delay: number;
  drift: number;
  spin: number;
  round: boolean;
  duration: number;
};

function buildPieces(seed: number): Piece[] {
  // Deterministic-enough scatter from a seed so pieces don't reshuffle mid-flight.
  let n = seed || 1;
  const next = () => {
    n = (n * 16807) % 2147483647;
    return n / 2147483647;
  };

  return Array.from({ length: 28 }, (_, index) => {
    const roll = next();
    return {
      key: `confetti-${index}`,
      left: next() * 100,
      size: 6 + Math.round(next() * 8),
      color: CONFETTI_COLORS[Math.floor(next() * CONFETTI_COLORS.length)],
      delay: Math.round(next() * 220),
      drift: (next() - 0.5) * 70,
      spin: (next() > 0.5 ? 1 : -1) * (140 + next() * 220),
      round: roll > 0.45,
      duration: 1400 + Math.round(next() * 900),
    };
  });
}

function ConfettiBurst({ active }: { active: boolean }) {
  const { height } = useLayoutMetrics();
  const pieces = useMemo(() => buildPieces(active ? Date.now() % 100000 : 1), [active]);
  const progress = useRef(pieces.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    progress.forEach((value) => value.setValue(0));
    if (!active) return;

    const animations = pieces.map((piece, index) =>
      Animated.timing(progress[index], {
        toValue: 1,
        duration: piece.duration,
        delay: piece.delay,
        useNativeDriver: true,
      }),
    );
    const batch = Animated.parallel(animations);
    batch.start();
    return () => batch.stop();
  }, [active, pieces, progress]);

  if (!active) return null;

  const fallDistance = Math.max(520, height * 0.85);

  return (
    <View pointerEvents="none" style={styles.confettiLayer}>
      {pieces.map((piece, index) => {
        const value = progress[index];
        return (
          <Animated.View
            key={piece.key}
            style={[
              styles.confettiPiece,
              {
                left: `${piece.left}%`,
                width: piece.size,
                height: piece.round ? piece.size : piece.size * 1.55,
                borderRadius: piece.round ? piece.size : 3,
                backgroundColor: piece.color,
                opacity: value.interpolate({
                  inputRange: [0, 0.12, 0.75, 1],
                  outputRange: [0, 1, 1, 0],
                }),
                transform: [
                  {
                    translateY: value.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-40, fallDistance],
                    }),
                  },
                  {
                    translateX: value.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, piece.drift],
                    }),
                  },
                  {
                    rotate: value.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', `${piece.spin}deg`],
                    }),
                  },
                  {
                    scale: value.interpolate({
                      inputRange: [0, 0.15, 1],
                      outputRange: [0.4, 1.1, 0.85],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

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
        <ConfettiBurst active={visible} />
        <Animated.View style={[styles.card, { maxWidth: modalMaxWidth, transform: [{ scale: pop }] }]}>
          <Text style={styles.title}>{t('win.title')}</Text>
          <Text style={styles.message}>{t('win.message')}</Text>
          {unlockMessage ? <Text style={styles.unlock}>{unlockMessage}</Text> : null}
          <PressableScale onPress={onPlayAgain} style={styles.button}>
            <Text style={styles.buttonText}>{t('win.playNext')}</Text>
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
  confettiLayer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  confettiPiece: {
    position: 'absolute',
    top: 0,
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
