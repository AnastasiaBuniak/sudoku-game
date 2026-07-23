import { Image, StyleSheet, Text, View } from 'react-native';
import {
  getNextUnlockPrompt,
  isLevelUnlocked,
  LEVELS,
  type LevelProgress,
} from '../utils/levels';
import type { Difficulty } from '../utils/sudoku';
import { useI18n } from '../i18n/I18nProvider';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { borders, brand, colors, fonts, radii, shadows, spacing } from '../theme';
import { PressableScale } from './PressableScale';

type Props = {
  progress: LevelProgress;
  selectedLevel: Difficulty;
  canContinue: boolean;
  continueLevel: Difficulty | null;
  onSelectLevel: (level: Difficulty) => void;
  onContinue: () => void;
  onPlay: () => void;
};

const levelStyles: Record<
  Difficulty,
  { bg: string; border: string; text: string }
> = {
  easy: { bg: colors.easyBg, border: colors.easyBorder, text: colors.easyText },
  medium: { bg: colors.mediumBg, border: colors.mediumBorder, text: colors.mediumText },
  hard: { bg: colors.hardBg, border: colors.hardBorder, text: colors.hardText },
  profi: { bg: colors.profiBg, border: colors.profiBorder, text: colors.profiText },
  master: { bg: colors.masterBg, border: colors.masterBorder, text: colors.masterText },
};

export function HomeScreen({
  progress,
  selectedLevel,
  canContinue,
  continueLevel,
  onSelectLevel,
  onContinue,
  onPlay,
}: Props) {
  const layout = useLayoutMetrics();
  const { t } = useI18n();
  const canPlay = isLevelUnlocked(progress, selectedLevel);
  const nextUnlock = getNextUnlockPrompt(progress);
  const ctaMaxWidth = Math.min(layout.boardSize || 340, layout.contentMaxWidth);
  const levelLabel = (level: Difficulty) => t(`levels.${level}`);

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: Math.min(layout.contentMaxWidth, layout.width - layout.pagePaddingX * 2),
          gap: layout.gap + 6,
          paddingVertical: layout.pagePaddingY,
        },
      ]}
    >
      <View style={styles.brand}>
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: layout.heroSize, height: layout.heroSize, marginBottom: 4 }}
          resizeMode="contain"
          accessibilityLabel={t('brand.a11yBoard')}
        />
        <Text style={[styles.title, { fontSize: layout.titleSize }]}>{brand.name}</Text>
        <Text style={[styles.tagline, { fontSize: Math.round(16 * layout.fontScale) }]}>
          {t('brand.tagline')}
        </Text>
      </View>

      <View style={styles.actions}>
        {canContinue && continueLevel ? (
          <PressableScale
            onPress={onContinue}
            style={[styles.playButton, { maxWidth: ctaMaxWidth }]}
            scaleTo={0.97}
          >
            <Text style={[styles.playText, { fontSize: layout.buttonFontSize }]}>
              {t('home.continue')}
            </Text>
            <Text style={styles.playSubtext}>
              {t('home.continuePuzzle', { level: levelLabel(continueLevel) })}
            </Text>
          </PressableScale>
        ) : null}

        <PressableScale
          onPress={onPlay}
          disabled={!canPlay}
          style={[
            canContinue ? styles.secondaryPlayButton : styles.playButton,
            { maxWidth: ctaMaxWidth },
            !canPlay && styles.playDisabled,
          ]}
          scaleTo={0.97}
        >
          <Text
            style={[
              styles.playText,
              { fontSize: canContinue ? Math.round(18 * layout.fontScale) : layout.buttonFontSize },
              canContinue && styles.secondaryPlayText,
            ]}
          >
            {canContinue ? t('home.newPuzzle') : t('home.play')}
          </Text>
        </PressableScale>
      </View>

      <View style={styles.levelsBlock}>
        <Text style={styles.levelsHeading}>{t('home.chooseLevel')}</Text>
        {nextUnlock ? (
          <View style={[styles.unlockBanner, { maxWidth: Math.min(360, layout.contentMaxWidth) }]}>
            <Text style={styles.unlockBannerText}>
              {t('home.unlockPrompt', {
                count: nextUnlock.remaining,
                level: levelLabel(nextUnlock.requiredLevel),
                next: levelLabel(nextUnlock.level),
              })}
            </Text>
          </View>
        ) : null}
        <View style={styles.levelsGrid}>
          {LEVELS.map((level) => {
            const unlocked = isLevelUnlocked(progress, level);
            const active = unlocked && level === selectedLevel;
            const palette = unlocked
              ? levelStyles[level]
              : {
                  bg: colors.lockedBg,
                  border: colors.lockedBorder,
                  text: colors.lockedText,
                };

            return (
              <PressableScale
                key={level}
                onPress={() => {
                  if (!unlocked) return;
                  onSelectLevel(level);
                }}
                disabled={!unlocked}
                style={[
                  styles.levelButton,
                  {
                    minWidth: layout.isTablet ? 120 : layout.isCompact ? 88 : 100,
                    backgroundColor: palette.bg,
                    borderColor: palette.border,
                    borderWidth: active ? borders.chunky : borders.thick,
                    opacity: unlocked ? 1 : 0.48,
                  },
                ]}
              >
                <Text style={[styles.levelText, { color: palette.text }]}>
                  {levelLabel(level)}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.md,
    overflow: 'hidden',
  },
  brand: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    color: colors.title,
    textShadowColor: colors.titleShadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: fonts.body,
    fontWeight: '700',
    color: colors.inkSoft,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
  },
  playButton: {
    width: '86%',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ctaBg,
    borderWidth: borders.chunky,
    borderColor: colors.ctaBorder,
    borderRadius: radii.pill,
    paddingVertical: 22,
    ...shadows.soft,
  },
  secondaryPlayButton: {
    width: '86%',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tile,
    borderWidth: borders.thick,
    borderColor: colors.ctaBorder,
    borderRadius: radii.pill,
    paddingVertical: 14,
    ...shadows.button,
  },
  playDisabled: {
    opacity: 0.4,
  },
  playText: {
    fontFamily: fonts.display,
    color: colors.ctaText,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  secondaryPlayText: {
    color: colors.ctaBorder,
  },
  playSubtext: {
    marginTop: 4,
    fontFamily: fonts.body,
    color: colors.ctaText,
    fontSize: 14,
    fontWeight: '700',
    opacity: 0.92,
    textAlign: 'center',
  },
  levelsBlock: {
    width: '100%',
    gap: spacing.md,
    alignItems: 'center',
  },
  levelsHeading: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  unlockBanner: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.hintBg,
    borderWidth: borders.thick,
    borderColor: colors.hintBorder,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  unlockBannerText: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 14,
    fontWeight: '800',
    color: colors.hintText,
    textAlign: 'center',
    lineHeight: 20,
  },
  levelsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  levelButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii.pill,
    ...shadows.button,
  },
  levelText: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 14,
    fontWeight: '800',
  },
});
