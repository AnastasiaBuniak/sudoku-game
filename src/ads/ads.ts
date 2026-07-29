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

let interstitial = InterstitialAd.createForAdRequest(adUnitId);
let loaded = false;
let loading = false;
let initialized = false;
let completionsTowardAd = 0;
let activePlacement: AdPlacement = 'digit_complete';

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

/** Call when a number/animal is fully completed. Shows a full-screen ad every 2nd time. */
export function maybeShowInterstitialOnDigitComplete(): void {
  completionsTowardAd += 1;
  if (completionsTowardAd % 2 !== 0) return;
  void showInterstitial('digit_complete');
}
