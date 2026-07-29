/** AdMob is native-only; web is a no-op so Metro can still bundle. */
export async function initAds(): Promise<void> {
  return;
}

export function maybeShowInterstitialOnDigitComplete(): void {
  return;
}
