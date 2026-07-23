import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { track } from '../analytics';
import {
  i18n,
  isLocaleCode,
  isRtlLocale,
  resolveDeviceLocale,
  type LocaleCode,
} from './index';

const LOCALE_KEY = '@sudoku/locale';

type TranslateOptions = Record<string, string | number>;

type I18nContextValue = {
  locale: LocaleCode;
  ready: boolean;
  isRtl: boolean;
  setLocale: (locale: LocaleCode) => void;
  t: (key: string, options?: TranslateOptions) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function applyLocale(locale: LocaleCode) {
  i18n.locale = locale;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let next: LocaleCode = resolveDeviceLocale();
      try {
        const stored = await AsyncStorage.getItem(LOCALE_KEY);
        if (isLocaleCode(stored)) next = stored;
      } catch {
        // Fall back to device / English.
      }
      if (cancelled) return;
      applyLocale(next);
      setLocaleState(next);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback((next: LocaleCode) => {
    applyLocale(next);
    setLocaleState(next);
    void AsyncStorage.setItem(LOCALE_KEY, next).catch(() => undefined);
    track({ name: 'locale_changed', props: { locale: next } });
  }, []);

  const t = useCallback(
    (key: string, options?: TranslateOptions) => {
      void locale;
      return i18n.t(key, options);
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      ready,
      isRtl: isRtlLocale(locale),
      setLocale,
      t,
    }),
    [locale, ready, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
