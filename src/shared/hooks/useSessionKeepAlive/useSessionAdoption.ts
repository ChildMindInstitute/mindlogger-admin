import { useEffect, useReducer } from 'react';

import { authStorage } from 'shared/utils/authStorage';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { publishSessionMessage, subscribeSessionSync } from './sessionSync';

// A tab that loaded signed-out cannot see a sign-in that happens afterwards: its view of the
// encrypted store is a snapshot taken when the page loaded, and there is no way to re-read it.
// So it listens for a session being announced, and asks again whenever it returns to focus, for
// the case where the browser had frozen it when the announcement went out.
export const useSessionAdoption = () => {
  const { featureFlags } = useFeatureFlags();
  // Adopting writes to storage, which no component is watching. This re-renders so the routes
  // read the token that just arrived.
  const [, onAdopted] = useReducer((count: number) => count + 1, 0);

  const isListening = !!featureFlags.enableSessionKeepAlive && !authStorage.getRefreshToken();

  useEffect(() => {
    if (!isListening) return;

    const unsubscribe = subscribeSessionSync((message) => {
      if (message.type !== 'SESSION_STATE') return;
      // A session arrived between the announcement and this handler. Leave it alone.
      if (authStorage.getRefreshToken()) return;

      // No sessionId check: a tab with no session of its own has nothing to compare against, and
      // one browser holds one session, so the announcement is by definition the one to join.
      authStorage.setAccessToken(message.payload.accessToken);
      authStorage.setRefreshToken(message.payload.refreshToken);
      onAdopted();
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      publishSessionMessage({ type: 'SESSION_REQUEST' });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
    };
  }, [isListening]);
};
