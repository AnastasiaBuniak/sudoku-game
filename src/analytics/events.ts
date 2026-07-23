import type { LocaleCode } from '../i18n/types';
import type { Difficulty } from '../utils/sudoku';

/** Anonymous product events only — no user IDs or device advertising IDs. */
export type AnalyticsEvent =
  | { name: 'app_open'; props: { locale: LocaleCode } }
  | { name: 'locale_changed'; props: { locale: LocaleCode } }
  | { name: 'level_selected'; props: { level: Difficulty; locale: LocaleCode } }
  | { name: 'level_unlocked'; props: { level: Difficulty; locale: LocaleCode } }
  | { name: 'puzzle_started'; props: { level: Difficulty; locale: LocaleCode } }
  | { name: 'puzzle_continued'; props: { level: Difficulty; locale: LocaleCode } }
  | { name: 'puzzle_won'; props: { level: Difficulty; locale: LocaleCode } }
  | { name: 'puzzle_lost'; props: { level: Difficulty; locale: LocaleCode } }
  | {
      name: 'cell_correct';
      props: { digit: number; level: Difficulty; locale: LocaleCode };
    }
  | {
      name: 'cell_wrong';
      props: { digit: number; level: Difficulty; locale: LocaleCode; chances_left: number };
    }
  | {
      name: 'number_completed';
      props: { digit: number; level: Difficulty; locale: LocaleCode };
    };

export type AnalyticsBackend = {
  track: (event: AnalyticsEvent) => void;
};
