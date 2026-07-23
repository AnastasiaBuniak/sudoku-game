import { useEffect, type ReactNode } from 'react';
import { PostHogProvider, usePostHog } from 'posthog-react-native';
import type { AnalyticsBackend } from './events';
import { setAnalyticsBackend } from './track';

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY?.trim() ?? '';
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com';

const consoleBackend: AnalyticsBackend = {
  track(event) {
    if (__DEV__) {
      console.log('[analytics]', event.name, event.props);
    }
  },
};

function PostHogBridge() {
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) return;

    setAnalyticsBackend({
      track(event) {
        posthog.capture(event.name, event.props);
        if (__DEV__) {
          console.log('[analytics:posthog]', event.name, event.props);
        }
      },
    });

    return () => {
      setAnalyticsBackend(consoleBackend);
    };
  }, [posthog]);

  return null;
}

type Props = {
  children: ReactNode;
};

/**
 * Product analytics only: anonymous events, no session replay, no autocapture.
 * Without EXPO_PUBLIC_POSTHOG_API_KEY, falls back to console logging in __DEV__.
 */
export function AnalyticsProvider({ children }: Props) {
  if (!apiKey) {
    if (__DEV__) {
      console.warn(
        '[analytics] EXPO_PUBLIC_POSTHOG_API_KEY is missing — using console backend only.',
      );
    }
    return <>{children}</>;
  }

  return (
    <PostHogProvider
      apiKey={apiKey}
      options={{
        host,
        enableSessionReplay: false,
        captureAppLifecycleEvents: false,
        personProfiles: 'never',
        setDefaultPersonProperties: false,
      }}
      autocapture={false}
    >
      <PostHogBridge />
      {children}
    </PostHogProvider>
  );
}

