import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useI18n } from '../i18n/I18nProvider';
import { borders, colors, radii, shadows } from '../theme';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { PressableScale } from './PressableScale';

type Props = {
  muted: boolean;
  onToggle: () => void;
};

export function MuteButton({ muted, onToggle }: Props) {
  const { hitSize, insets, fontScale } = useLayoutMetrics();
  const { t, isRtl } = useI18n();

  return (
    <PressableScale
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={muted ? t('a11y.unmute') : t('a11y.mute')}
      accessibilityState={{ selected: !muted }}
      style={[
        styles.button,
        {
          top: Math.max(8, insets.top + 4),
          ...(isRtl
            ? { left: Math.max(12, insets.left + 10) }
            : { right: Math.max(12, insets.right + 10) }),
          width: hitSize,
          height: hitSize,
        },
      ]}
      scaleTo={0.92}
    >
      <Ionicons
        name={muted ? 'volume-mute' : 'volume-high'}
        size={Math.round(22 * fontScale)}
        color={muted ? colors.conflictText : colors.ink}
      />
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
