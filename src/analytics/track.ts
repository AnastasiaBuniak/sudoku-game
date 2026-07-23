import type { AnalyticsBackend, AnalyticsEvent } from './events';

const consoleBackend: AnalyticsBackend = {
  track(event) {
    if (__DEV__) {
      console.log('[analytics]', event.name, event.props);
    }
  },
};

let backend: AnalyticsBackend = consoleBackend;

/** Swap in Firebase/PostHog later without touching gameplay call sites. */
export function setAnalyticsBackend(next: AnalyticsBackend) {
  backend = next;
}

export function track(event: AnalyticsEvent) {
  try {
    backend.track(event);
  } catch {
    // Never let analytics break gameplay.
  }
}
