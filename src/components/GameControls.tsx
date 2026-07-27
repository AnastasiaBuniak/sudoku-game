import { StyleSheet, Text } from 'react-native';
import { useI18n } from '../i18n/I18nProvider';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { borders, colors, fonts, radii, shadows } from '../theme';
import { PressableScale } from './PressableScale';

type Props = {
  onNewGame: () => void;
};

export function GameControls({ onNewGame }: Props) {
  const { fontScale, isCompact } = useLayoutMetrics();
  const { t } = useI18n();

  return (
    <PressableScale
      onPress={onNewGame}
      style={[
        styles.newGameButton,
        {
          paddingHorizontal: isCompact ? 22 : 28,
          paddingVertical: isCompact ? 10 : 12,
        },
      ]}
    >
      <Text style={[styles.newGameText, { fontSize: Math.round(16 * fontScale) }]}>
        {t('game.newGame')}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  newGameButton: {
    alignSelf: 'center',
    backgroundColor: colors.tile,
    borderWidth: borders.thick,
    borderColor: colors.eraseBorder,
    borderRadius: radii.pill,
    ...shadows.button,
  },
  newGameText: {
    fontFamily: fonts.bodyHeavy,
    color: colors.inkSoft,
  },
});
