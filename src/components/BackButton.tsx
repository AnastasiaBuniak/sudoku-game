import { StyleSheet, View } from 'react-native';
import { useI18n } from '../i18n/I18nProvider';
import { borders, colors, radii, shadows } from '../theme';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { PressableScale } from './PressableScale';

type Props = {
  onPress: () => void;
};

function BackIcon() {
  return (
    <View style={styles.icon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.arrowHead} />
      <View style={styles.arrowShaft} />
    </View>
  );
}

export function BackButton({ onPress }: Props) {
  const { hitSize, insets } = useLayoutMetrics();
  const { t, isRtl } = useI18n();

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('a11y.backHome')}
      style={[
        styles.button,
        {
          top: Math.max(8, insets.top + 4),
          ...(isRtl
            ? { right: Math.max(12, insets.right + 10) }
            : { left: Math.max(12, insets.left + 10) }),
          width: hitSize,
          height: hitSize,
          transform: isRtl ? [{ scaleX: -1 }] : undefined,
        },
      ]}
      scaleTo={0.92}
    >
      <BackIcon />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    zIndex: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.tile,
    borderWidth: borders.thick,
    borderColor: colors.eraseBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  icon: {
    width: 18,
    height: 16,
    justifyContent: 'center',
  },
  arrowHead: {
    position: 'absolute',
    left: 1,
    top: 2,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.ink,
  },
  arrowShaft: {
    position: 'absolute',
    left: 7,
    top: 6.5,
    width: 11,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.ink,
  },
});
