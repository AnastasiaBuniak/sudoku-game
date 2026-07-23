import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import ar from './locales/ar';
import de from './locales/de';
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import hi from './locales/hi';
import ja from './locales/ja';
import zh from './locales/zh';
import {
  LOCALE_CODES,
  type LocaleCode,
  type LocaleMeta,
  type TranslationTree,
} from './types';

export const LOCALES: LocaleMeta[] = [
  { code: 'en', nativeName: 'English' },
  { code: 'zh', nativeName: '中文' },
  { code: 'hi', nativeName: 'हिन्दी' },
  { code: 'es', nativeName: 'Español' },
  { code: 'ar', nativeName: 'العربية', rtl: true },
  { code: 'ja', nativeName: '日本語' },
  { code: 'de', nativeName: 'Deutsch' },
  { code: 'fr', nativeName: 'Français' },
];

const translations: Record<LocaleCode, TranslationTree> = {
  en,
  zh,
  hi,
  es,
  ar,
  ja,
  de,
  fr,
};

export const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export function isLocaleCode(value: unknown): value is LocaleCode {
  return typeof value === 'string' && (LOCALE_CODES as readonly string[]).includes(value);
}

/** Map device language (e.g. zh-Hans, pt-BR) to a supported locale. */
export function resolveDeviceLocale(): LocaleCode {
  const deviceLocales = getLocales();
  for (const locale of deviceLocales) {
    const code = locale.languageCode?.toLowerCase();
    if (code && isLocaleCode(code)) return code;
  }
  return 'en';
}

export function isRtlLocale(locale: LocaleCode): boolean {
  return LOCALES.some((item) => item.code === locale && item.rtl);
}

export type { LocaleCode, LocaleMeta, TranslationTree };
export { LOCALE_CODES };
