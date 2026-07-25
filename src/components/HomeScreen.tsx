import { Image, StyleSheet, Text, View } from 'react-native';
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
import { borders, brand, colors, fonts, radii, shadows, spacing } from '../theme';
import { PressableScale } from './PressableScale';

type Props = {
  mode: GameMode;
  progress: LevelProgress;
  selectedLevel: string;
  canContinue: boolean;
  continueLevel: string | null;
  onSelectMode: (mode: GameMode) => void;
  onSelectLevel: (level: string) => void;
  onContinue: () => void;
  onPlay: () => void;
};

const LEVEL_PALETTES = [
  { bg: colors.easyBg, border: colors.easyBorder, text: colors.easyText },
  { bg: colors.mediumBg, border: colors.mediumBorder, text: colors.mediumText },
  { bg: colors.hardBg, border: colors.hardBorder, text: colors.hardText },
  { bg: colors.profiBg, border: colors.profiBorder, text: colors.profiText },
  { bg: colors.masterBg, border: colors.masterBorder, text: colors.masterText },
];

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
  const canPlay = isLevelUnlocked(config, progress, selectedLevel);
  const nextUnlock = getNextUnlockPrompt(config, progress);
  const ctaMaxWidth = Math.min(layout.boardSize || 340, layout.contentMaxWidth);
  const levelLabel = (level: string) => t(`levels.${level}`);

  // Top-anchor with a small screen-scaled inset so tall phones aren't glued to
  // the status bar, but mode/content height changes never re-center the page.
  const topInset = layout.isCompact
    ? layout.pagePaddingY
    : Math.round(clamp(layout.height * 0.035, 16, layout.isTablet ? 40 : 28));

  // Reserve room for optional rows so Continue / unlock / level-count changes
  // don't shove neighbors around. Primary slot uses Continue's taller size
  // (label + subtitle) even when only "Play" is shown.
  const primaryCtaMinHeight = Math.round(88 * layout.scale);
  const secondaryCtaMinHeight = Math.round(52 * layout.scale);
  const unlockSlotMinHeight = Math.round(64 * layout.fontScale);
  const levelRowHeight = Math.round((layout.isCompact ? 44 : 48) * layout.scale);
  const levelsGridMinHeight = levelRowHeight * 2 + 10;

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
          style={{
            width: layout.heroSize,
            height: layout.heroSize,
            marginBottom: 4,
          }}
          accessibilityLabel={t('brand.a11yBoard')}
          accessible
        >
          {/* Keep both heroes mounted so mode switches don't reload/remeasure. */}
          <Image
            source={require('../../assets/icon.png')}
            style={[styles.heroImage, mode !== 'numbers' && styles.heroImageHidden]}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/icon-animals.png')}
            style={[styles.heroImage, mode !== 'animals' && styles.heroImageHidden]}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.title, { fontSize: layout.titleSize }]}>{brand.name}</Text>
        <Text style={[styles.tagline, { fontSize: Math.round(16 * layout.fontScale) }]}>
          {t('brand.tagline')}
        </Text>
      </View>

      <View style={styles.modeToggle}>
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
        {/* Primary CTA slot stays put: Continue when available, otherwise Play. */}
        <PressableScale
          onPress={canContinue ? onContinue : onPlay}
          disabled={!canContinue && !canPlay}
          style={[
            styles.playButton,
            { maxWidth: ctaMaxWidth, minHeight: primaryCtaMinHeight },
            !canContinue && !canPlay && styles.playDisabled,
          ]}
          scaleTo={0.97}
        >
          {canContinue && continueLevel ? (
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
        <View style={[styles.secondaryCtaSlot, { minHeight: secondaryCtaMinHeight }]}>
          {canContinue ? (
            <PressableScale
              onPress={onPlay}
              disabled={!canPlay}
              style={[
                styles.secondaryPlayButton,
                { maxWidth: ctaMaxWidth },
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
          ) : null}
        </View>
      </View>

      <View style={styles.levelsBlock}>
        <Text style={styles.levelsHeading}>{t('home.chooseLevel')}</Text>
        <View style={[styles.unlockSlot, { minHeight: unlockSlotMinHeight }]}>
          {nextUnlock ? (
            <View style={[styles.unlockBanner, { maxWidth: Math.min(360, layout.contentMaxWidth) }]}>
              <Text style={styles.unlockBannerText}>
                {t('home.unlockPrompt', {
                  count: nextUnlock.remaining,
                  level: levelLabel(nextUnlock.requiredLevel.id),
                  next: levelLabel(nextUnlock.level.id),
                })}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.levelsGrid, { minHeight: levelsGridMinHeight }]}>
          {config.levels.map((level, index) => {
            const unlocked = isLevelUnlocked(config, progress, level.id);
            const active = unlocked && level.id === selectedLevel;
            const palette = unlocked
              ? LEVEL_PALETTES[index % LEVEL_PALETTES.length]
              : {
                  bg: colors.lockedBg,
                  border: colors.lockedBorder,
                  text: colors.lockedText,
                };

            return (
              <PressableScale
                key={level.id}
                onPress={() => {
                  if (!unlocked) return;
                  onSelectLevel(level.id);
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
    flexGrow: 1,
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
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
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
    paddingVertical: 22,
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
