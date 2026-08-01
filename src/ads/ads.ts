import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AdEventType,
  InterstitialAd,
  MaxAdContentRating,
  MobileAds,
  TestIds,
} from 'react-native-google-mobile-ads';
import { track } from '../analytics';
import type { AdPlacement } from '../analytics/events';

/** Production interstitial (Android). `__DEV__` uses Google's official test unit. */
const PRODUCTION_INTERSTITIAL_UNIT_ID = 'ca-app-pub-7343052448319099/2445179987';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : PRODUCTION_INTERSTITIAL_UNIT_ID;
const FORMAT = 'interstitial' as const;
const PENDING_END_AD_KEY = '@sudoku/pending-end-ad';
/** Legacy key from the win-only queue — migrated on init. */
const LEGACY_PENDING_WIN_AD_KEY = '@sudoku/pending-win-ad';

type GameEndOutcome = 'win' | 'loss';

let interstitial = InterstitialAd.createForAdRequest(adUnitId);
let loaded = false;
let loading = false;
let initialized = false;
let pendingOutcome: GameEndOutcome | null = null;
let activePlacement: AdPlacement = 'post_win';

function attachListeners() {
  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    loaded = true;
    loading = false;
  });
  interstitial.addAdEventListener(AdEventType.OPENED, () => {
    track({
      name: 'ad_opened',
      props: { placement: activePlacement, format: FORMAT },
    });
  });
  interstitial.addAdEventListener(AdEventType.CLICKED, () => {
    track({
      name: 'ad_clicked',
      props: { placement: activePlacement, format: FORMAT },
    });
  });
  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    track({
      name: 'ad_closed',
      props: { placement: activePlacement, format: FORMAT },
    });
    loaded = false;
    preload();
  });
  interstitial.addAdEventListener(AdEventType.ERROR, () => {
    loaded = false;
    loading = false;
    track({
      name: 'ad_failed',
      props: { placement: activePlacement, format: FORMAT, phase: 'load' },
    });
  });
}

function preload() {
  if (loaded || loading) return;
  loading = true;
  interstitial.load();
}

async function persistPendingOutcome(outcome: GameEndOutcome | null): Promise<void> {
  pendingOutcome = outcome;
  try {
    if (outcome) {
      await AsyncStorage.setItem(PENDING_END_AD_KEY, outcome);
    } else {
      await AsyncStorage.removeItem(PENDING_END_AD_KEY);
    }
    await AsyncStorage.removeItem(LEGACY_PENDING_WIN_AD_KEY);
  } catch {
    // Queue still works in-memory for this session.
  }
}

function placementFor(outcome: GameEndOutcome, when: 'post' | 'queued'): AdPlacement {
  if (when === 'post') {
    return outcome === 'win' ? 'post_win' : 'post_loss';
  }
  return outcome === 'win' ? 'queued_win' : 'queued_loss';
}

async function showInterstitial(placement: AdPlacement): Promise<void> {
  if (!initialized) return;
  activePlacement = placement;
  track({
    name: 'ad_show_requested',
    props: { placement, format: FORMAT, ready: loaded },
  });
  if (!loaded) {
    preload();
    return;
  }
  try {
    await interstitial.show();
  } catch {
    loaded = false;
    track({
      name: 'ad_failed',
      props: { placement, format: FORMAT, phase: 'show' },
    });
    preload();
  }
}

export async function initAds(): Promise<void> {
  if (initialized) return;
  try {
    const stored = await AsyncStorage.getItem(PENDING_END_AD_KEY);
    if (stored === 'win' || stored === 'loss') {
      pendingOutcome = stored;
    } else if ((await AsyncStorage.getItem(LEGACY_PENDING_WIN_AD_KEY)) === '1') {
      pendingOutcome = 'win';
      await persistPendingOutcome('win');
    }
    await MobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      testDeviceIdentifiers: __DEV__ ? ['EMULATOR'] : [],
    });
    await MobileAds().initialize();
    attachListeners();
    preload();
    initialized = true;
  } catch {
    // Ads are optional — never block gameplay if the SDK fails.
  }
}

/** Queue an interstitial after a finished game when the player leaves without an immediate show. */
export function enqueueGameEndInterstitial(outcome: GameEndOutcome): void {
  void persistPendingOutcome(outcome);
}

/** Show the post-game interstitial immediately (Win / Game Over primary action). */
export function showGameEndInterstitial(outcome: GameEndOutcome): void {
  void persistPendingOutcome(null);
  void showInterstitial(placementFor(outcome, 'post'));
}

/** Show a queued end-of-game interstitial when the next puzzle starts, if any. */
export function maybeShowQueuedGameEndInterstitial(): void {
  if (!pendingOutcome) return;
  const outcome = pendingOutcome;
  void persistPendingOutcome(null);
  void showInterstitial(placementFor(outcome, 'queued'));
}
