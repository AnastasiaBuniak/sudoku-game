import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, View } from 'react-native';
import {
  GAME_MODES,
  getModeConfig,
  type GameMode,
} from '../game/modes';
import {
  getNextUnlockPrompt,
  isLevelUnlocked,
  type LevelProgress,
} from '../utils/levels';
import { useI18n } from '../i18n/I18nProvider';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { borders, brand, colors, fonts, getLevelPalette, radii, shadows, spacing } from '../theme';
import { PressableScale } from './PressableScale';

/** Android fades newly-shown Images by default; that reads as the hero “dropping”. */
const HERO_FADE_DURATION = Platform.OS === 'android' ? 0 : undefined;

type Props = {
  mode: GameMode;
  progress: LevelProgress;
  selectedLevel: string;
  canContinue: boolean;
  continueLevel: string | null;
  onSelectMode: (mode: GameMode) => void;
  onSelectLevel: (level: string) => void;
  onContinue: () => void;
  onPlay: (levelId: string) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function HomeScreen({
  mode,
  progress,
  selectedLevel,
  canContinue,
  continueLevel,
  onSelectMode,
  onSelectLevel,
  onContinue,
  onPlay,
}: Props) {
  const layout = useLayoutMetrics();
  const { t } = useI18n();
  const config = getModeConfig(mode);
  // Local selection updates synchronously on tap so Play can't race a stale prop.
  const [activeLevel, setActiveLevel] = useState(selectedLevel);
  useEffect(() => {
    setActiveLevel(selectedLevel);
  }, [selectedLevel, mode]);

  const canPlay = isLevelUnlocked(config, progress, activeLevel);
  const nextUnlock = getNextUnlockPrompt(config, progress);
  const ctaMaxWidth = Math.min(layout.boardSize || 340, layout.contentMaxWidth);
  const levelLabel = (level: string) => t(`levels.${level}`);
  const unlockNudge = useRef(new Animated.Value(0)).current;

  // Continue only for the selected level. Otherwise Play starts the selection
  // (avoids resuming an older animals puzzle after tapping a different level).
  const continueSelected = Boolean(
    canContinue && continueLevel && continueLevel === activeLevel,
  );
  const continueOther = Boolean(
    canContinue && continueLevel && continueLevel !== activeLevel,
  );

  const nudgeUnlockBanner = () => {
    unlockNudge.stopAnimation();
    unlockNudge.setValue(0);
    // Vertical bob only — scaling widened the banner past the screen and got clipped.
    Animated.sequence([
      Animated.timing(unlockNudge, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(unlockNudge, {
        toValue: 0,
        useNativeDriver: true,
        speed: 38,
        bounciness: 8,
      }),
    ]).start();
  };

  // Top-anchor with a small screen-scaled inset so tall phones aren't glued to
  // the status bar, but mode/content height changes never re-center the page.
  const topInset = layout.isCompact
    ? layout.pagePaddingY
    : Math.round(clamp(layout.height * 0.035, 16, layout.isTablet ? 40 : 28));

  // Fixed slots (not minHeights) so mode / Continue / unlock changes never
  // reflow neighbors — especially important on Android Yoga.
  const primaryCtaHeight = Math.round(88 * layout.scale);
  const secondaryCtaHeight = Math.round(52 * layout.scale);
  const unlockSlotHeight = Math.round(72 * layout.fontScale);
  // Match real pill height (padding + label + chunky border), not a tight estimate.
  const levelRowHeight = Math.round((layout.isCompact ? 54 : 58) * layout.scale);
  const levelsGridMinHeight = levelRowHeight * 2 + 10;
  const heroSize = layout.heroSize;
  const titleSize = layout.titleSize;
  const taglineSize = Math.round(16 * layout.fontScale);

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: Math.min(layout.contentMaxWidth, layout.width - layout.pagePaddingX * 2),
          gap: layout.gap + 6,
          paddingTop: topInset,
          paddingBottom: layout.pagePaddingY,
        },
      ]}
    >
      <View style={styles.brand}>
        <View
          collapsable={false}
          style={{
            width: heroSize,
            height: heroSize,
            marginBottom: 4,
            overflow: 'hidden',
          }}
          accessibilityLabel={t('brand.a11yBoard')}
          accessible
        >
          {/* Keep both heroes mounted so mode switches don't reload/remeasure. */}
          <Image
            source={require('../../assets/icon.png')}
            style={[
              styles.heroImage,
              { width: heroSize, height: heroSize },
              mode !== 'numbers' && styles.heroImageHidden,
            ]}
            resizeMode="contain"
            {...(HERO_FADE_DURATION === 0 ? { fadeDuration: 0 } : null)}
          />
          <Image
            source={require('../../assets/icon-animals.png')}
            style={[
              styles.heroImage,
              { width: heroSize, height: heroSize },
              mode !== 'animals' && styles.heroImageHidden,
            ]}
            resizeMode="contain"
            {...(HERO_FADE_DURATION === 0 ? { fadeDuration: 0 } : null)}
          />
        </View>
        <Text style={[styles.title, { fontSize: titleSize }]}>{brand.name}</Text>
        <Text style={[styles.tagline, { fontSize: taglineSize }]}>
          {t('brand.tagline')}
        </Text>
      </View>

      <View style={[styles.modeToggle, { maxWidth: ctaMaxWidth, width: '86%' }]}>
        {GAME_MODES.map((option) => {
          const active = option === mode;
          return (
            <PressableScale
              key={option}
              onPress={() => onSelectMode(option)}
              style={[styles.modeButton, active && styles.modeButtonActive]}
              scaleTo={0.96}
            >
              <Text style={[styles.modeText, active && styles.modeTextActive]}>
                {t(`modes.${option}`)}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      <View style={styles.actions}>
        {/* Primary: Continue only if it matches the selected level; else Play that level. */}
        <PressableScale
          onPress={continueSelected ? onContinue : () => onPlay(activeLevel)}
          disabled={!continueSelected && !canPlay}
          style={[
            styles.playButton,
            { maxWidth: ctaMaxWidth, height: primaryCtaHeight },
            !continueSelected && !canPlay && styles.playDisabled,
          ]}
          scaleTo={0.97}
        >
          {continueSelected && continueLevel ? (
            <>
              <Text style={[styles.playText, { fontSize: layout.buttonFontSize }]}>
                {t('home.continue')}
              </Text>
              <Text style={styles.playSubtext}>
                {t('home.continuePuzzle', { level: levelLabel(continueLevel) })}
              </Text>
            </>
          ) : (
            <Text style={[styles.playText, { fontSize: layout.buttonFontSize }]}>
              {t('home.play')}
            </Text>
          )}
        </PressableScale>

        {/* Secondary slot always reserved so levels don't jump when Continue appears. */}
        <View style={[styles.secondaryCtaSlot, { height: secondaryCtaHeight }]}>
          {continueSelected ? (
            <PressableScale
              onPress={() => onPlay(activeLevel)}
              disabled={!canPlay}
              style={[
                styles.secondaryPlayButton,
                { maxWidth: ctaMaxWidth, height: secondaryCtaHeight },
                !canPlay && styles.playDisabled,
              ]}
              scaleTo={0.97}
            >
              <Text
                style={[
                  styles.playText,
                  styles.secondaryPlayText,
                  { fontSize: Math.round(18 * layout.fontScale) },
                ]}
              >
                {t('home.newPuzzle')}
              </Text>
            </PressableScale>
          ) : continueOther && continueLevel ? (
            <PressableScale
              onPress={onContinue}
              style={[
                styles.secondaryPlayButton,
                { maxWidth: ctaMaxWidth, height: secondaryCtaHeight },
              ]}
              scaleTo={0.97}
            >
              <Text
                style={[
                  styles.playText,
                  styles.secondaryPlayText,
                  { fontSize: Math.round(16 * layout.fontScale) },
                ]}
                numberOfLines={1}
              >
                {t('home.continue')} · {levelLabel(continueLevel)}
              </Text>
            </PressableScale>
          ) : null}
        </View>
      </View>

      <View style={styles.levelsBlock}>
        <Text style={styles.levelsHeading}>{t('home.chooseLevel')}</Text>
        <View style={[styles.unlockSlot, { height: unlockSlotHeight }]}>
          {nextUnlock ? (
            <Animated.View
              style={[
                styles.unlockBanner,
                {
                  maxWidth: Math.min(360, layout.contentMaxWidth),
                  height: unlockSlotHeight,
                  transform: [
                    {
                      translateY: unlockNudge.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -4],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.unlockBannerText} numberOfLines={3}>
                {t('home.unlockPrompt', {
                  count: nextUnlock.remaining,
                  level: levelLabel(nextUnlock.requiredLevel.id),
                  next: levelLabel(nextUnlock.level.id),
                })}
              </Text>
            </Animated.View>
          ) : null}
        </View>
        <View style={[styles.levelsGrid, { minHeight: levelsGridMinHeight }]}>
          {config.levels.map((level, index) => {
            const unlocked = isLevelUnlocked(config, progress, level.id);
            const active = unlocked && level.id === activeLevel;
            const palette = unlocked
              ? getLevelPalette(index)
              : {
                  bg: colors.lockedBg,
                  border: colors.lockedBorder,
                  text: colors.lockedText,
                };

            return (
              <PressableScale
                key={level.id}
                onPress={() => {
                  if (!unlocked) {
                    if (nextUnlock) nudgeUnlockBanner();
                    return;
                  }
                  setActiveLevel(level.id);
                  onSelectLevel(level.id);
                }}
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
                  {levelLabel(level.id)}
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
    // Intrinsic height + top-anchor in the parent ScrollView — avoid flexGrow
    // so shorter animals-mode content can't re-center on Android.
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.xl,
    overflow: 'hidden',
  },
  brand: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heroImageHidden: {
    opacity: 0,
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
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.tile,
    borderRadius: radii.pill,
    borderWidth: borders.thick,
    borderColor: colors.eraseBorder,
    padding: 4,
    ...shadows.button,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: radii.pill,
  },
  modeButtonActive: {
    backgroundColor: colors.ctaBg,
  },
  modeText: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 15,
    fontWeight: '800',
    color: colors.inkSoft,
  },
  modeTextActive: {
    color: colors.ctaText,
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
    paddingVertical: 0,
    ...shadows.soft,
  },
  secondaryCtaSlot: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: 0,
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
    gap: spacing.sm,
    alignItems: 'center',
  },
  levelsHeading: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  unlockSlot: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockBanner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.hintBg,
    borderWidth: borders.thick,
    borderColor: colors.hintBorder,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
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
    alignContent: 'flex-start',
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
