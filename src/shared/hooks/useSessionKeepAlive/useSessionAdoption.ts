import { useEffect, useReducer } from 'react';

import { authStorage } from 'shared/utils/authStorage';
import { SessionStorageKeys } from 'shared/utils/storage';

import { getLastActivityAt } from './sessionStore';
import { publishSessionMessage, subscribeSessionSync } from './sessionSync';
import { SESSION_REQUEST_WINDOW_MS } from './sessionSync.const';
import { resolveSessionConfig } from './useSessionKeepAlive.utils';

// A tab that loaded signed-out cannot see a sign-in that happens afterwards: its view of the
// encrypted store is a snapshot taken when the page loaded, and there is no way to re-read it.
// So it listens for a session being announced, and asks again whenever it returns to focus, for
// the case where the browser had frozen it when the announcement went out.
export const useSessionAdoption = () => {
  // Adopting writes to storage, which no component is watching. This re-renders so the routes
  // read the token that just arrived.
  const [, onAdopted] = useReducer((count: number) => count + 1, 0);

  const isListening = !authStorage.getRefreshToken();

  useEffect(() => {
    if (!isListening) {
      // This tab has a session, so a later gap is free to reload its way into the next one.
      sessionStorage.removeItem(SessionStorageKeys.ReloadAttempted);

      return;
    }

    let fallbackTimer: ReturnType<typeof setTimeout>;

    // Nobody answered, so no live tab can hand the tokens over — the last one was closed. The
    // marker still says a session exists, and rebuilding the snapshot is the only way to reach it.
    const reloadIntoSession = () => {
      const lastActivityAt = getLastActivityAt();
      if (!lastActivityAt) return;

      // Past its deadline the session is over anyway, and the boot check clears it. Reloading
      // would only land on the same login page.
      if (Date.now() - lastActivityAt >= resolveSessionConfig().idleTimeoutMs) return;

      // Per tab and survives the reload, so a torn state cannot reload in a loop. Cleared above
      // once this tab holds a session.
      if (sessionStorage.getItem(SessionStorageKeys.ReloadAttempted)) return;
      sessionStorage.setItem(SessionStorageKeys.ReloadAttempted, 'true');

      window.location.reload();
    };

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
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(reloadIntoSession, SESSION_REQUEST_WINDOW_MS);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(fallbackTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
    };
  }, [isListening]);
};
