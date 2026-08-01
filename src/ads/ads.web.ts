/** AdMob is native-only; web is a no-op so Metro can still bundle. */
export async function initAds(): Promise<void> {
  return;
}

export function enqueueGameEndInterstitial(_outcome: 'win' | 'loss'): void {
  return;
}

export function showGameEndInterstitial(_outcome: 'win' | 'loss'): void {
  return;
}

export function maybeShowQueuedGameEndInterstitial(): void {
  return;
}
