import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useI18n } from '../i18n/I18nProvider';
import { borders, colors, radii, shadows } from '../theme';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { PressableScale } from './PressableScale';

type Props = {
  onPress: () => void;
};

/** Top-right chrome, parked to the left of MuteButton. */
export function HelpButton({ onPress }: Props) {
  const { hitSize, insets, fontScale } = useLayoutMetrics();
  const { t } = useI18n();
  const muteRight = Math.max(12, insets.right + 10);
  const gap = 8;

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('a11y.howToPlay')}
      style={[
        styles.button,
        {
          top: Math.max(8, insets.top + 4),
          right: muteRight + hitSize + gap,
          width: hitSize,
          height: hitSize,
        },
      ]}
      scaleTo={0.92}
    >
      <Ionicons name="help" size={Math.round(22 * fontScale)} color={colors.ink} />
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
});
