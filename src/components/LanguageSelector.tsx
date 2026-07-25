import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LOCALES, type LocaleCode } from '../i18n';
import { useI18n } from '../i18n/I18nProvider';
import { useLayoutMetrics } from '../hooks/useLayoutMetrics';
import { borders, colors, fonts, radii, shadows, spacing } from '../theme';
import { PressableScale } from './PressableScale';

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const { hitSize, insets, fontScale, modalMaxWidth } = useLayoutMetrics();

  return (
    <>
      <PressableScale
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={t('a11y.language')}
        style={[
          styles.button,
          {
            top: Math.max(8, insets.top + 4),
            // Match BackButton: always top-left across locales (including RTL).
            left: Math.max(12, insets.left + 10),
            width: hitSize,
            height: hitSize,
          },
        ]}
        scaleTo={0.92}
      >
        <Ionicons
          name="globe-outline"
          size={Math.round(22 * fontScale)}
          color={colors.ink}
        />
      </PressableScale>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setOpen(false)}
            accessibilityRole="button"
            accessibilityLabel={t('a11y.language')}
          />
          <View style={[styles.sheet, { maxWidth: modalMaxWidth }]}>
            <Text style={styles.sheetTitle}>{t('a11y.language')}</Text>
            <View style={styles.list}>
              {LOCALES.map((item) => {
                const active = item.code === locale;
                return (
                  <PressableScale
                    key={item.code}
                    onPress={() => {
                      setLocale(item.code as LocaleCode);
                      setOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={item.nativeName}
                    style={[styles.option, active && styles.optionActive]}
                    scaleTo={0.97}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>
                      {item.nativeName}
                    </Text>
                    {active ? <Text style={styles.check}>✓</Text> : null}
                  </PressableScale>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.modalBg,
    borderRadius: radii.xl,
    borderWidth: borders.chunky,
    borderColor: colors.modalBorder,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    ...shadows.soft,
  },
  sheetTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: '700',
    color: colors.title,
    textAlign: 'center',
  },
  list: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.tile,
    borderWidth: borders.thick,
    borderColor: colors.eraseBorder,
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    paddingVertical: 12,
    ...shadows.button,
  },
  optionActive: {
    backgroundColor: colors.hintBg,
    borderColor: colors.hintBorder,
  },
  optionText: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 16,
    fontWeight: '800',
    color: colors.inkSoft,
  },
  optionTextActive: {
    color: colors.hintText,
  },
  check: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 16,
    fontWeight: '800',
    color: colors.hintText,
  },
});
