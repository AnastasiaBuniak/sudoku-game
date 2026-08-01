import type { GameMode } from '../game/modes';
import type { LocaleCode } from '../i18n/types';

export type AdPlacement = 'post_win' | 'queued_win' | 'post_loss' | 'queued_loss';
export type AdFormat = 'interstitial';

/** Anonymous product events only — no user IDs or device advertising IDs. */
export type AnalyticsEvent =
  | { name: 'app_open'; props: { locale: LocaleCode } }
  | { name: 'locale_changed'; props: { locale: LocaleCode } }
  | { name: 'mode_selected'; props: { mode: GameMode; locale: LocaleCode } }
  | { name: 'level_selected'; props: { mode: GameMode; level: string; locale: LocaleCode } }
  | { name: 'level_unlocked'; props: { mode: GameMode; level: string; locale: LocaleCode } }
  | { name: 'puzzle_started'; props: { mode: GameMode; level: string; locale: LocaleCode } }
  | { name: 'puzzle_continued'; props: { mode: GameMode; level: string; locale: LocaleCode } }
  | { name: 'puzzle_won'; props: { mode: GameMode; level: string; locale: LocaleCode } }
  | { name: 'puzzle_lost'; props: { mode: GameMode; level: string; locale: LocaleCode } }
  | {
      name: 'cell_correct';
      props: { mode: GameMode; digit: number; level: string; locale: LocaleCode };
    }
  | {
      name: 'cell_wrong';
      props: {
        mode: GameMode;
        digit: number;
        level: string;
        locale: LocaleCode;
        chances_left: number;
      };
    }
  | {
      name: 'ad_show_requested';
      props: { placement: AdPlacement; format: AdFormat; ready: boolean };
    }
  | {
      name: 'ad_opened';
      props: { placement: AdPlacement; format: AdFormat };
    }
  | {
      name: 'ad_closed';
      props: { placement: AdPlacement; format: AdFormat };
    }
  | {
      name: 'ad_clicked';
      props: { placement: AdPlacement; format: AdFormat };
    }
  | {
      name: 'ad_failed';
      props: { placement: AdPlacement; format: AdFormat; phase: 'load' | 'show' };
    };

export type AnalyticsBackend = {
  track: (event: AnalyticsEvent) => void;
};
