import { useEffect } from 'react';

import { auth } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { banners } from 'shared/state/Banners';
import { authStorage } from 'shared/utils/authStorage';
import { SessionStorageKeys } from 'shared/utils/storage';

import { getLastActivityAt } from './sessionStore';
import { publishSessionMessage, subscribeSessionSync } from './sessionSync';
import { SESSION_REQUEST_WINDOW_MS } from './sessionSync.const';
import { resolveSessionConfig } from './useSessionKeepAlive.utils';

// A tab that loaded signed-out cannot see a sign-in that happens afterwards: its view of the
// encrypted store is a snapshot taken when the page loaded, and there is no way to re-read it.
// So it listens for a session being announced, and asks again whenever it returns to focus, for
// the case where the browser had frozen it when the announcement went out. What it never does is
// let itself in: it says a session is running, and the user decides whether to join it.
export const useSessionAdoption = () => {
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();
  const hasSessionElsewhere = auth.useSessionElsewhere();

  // A tab sent here by leaveEndedSession can still read tokens, but they are not its own, so it
  // listens like any signed-out tab. Once told, there is nothing further to hear: the answer
  // cannot change until this tab reloads.
  const hasSessionEnded = !!sessionStorage.getItem(SessionStorageKeys.SessionEnded);
  const isListening = (hasSessionEnded || !authStorage.getRefreshToken()) && !hasSessionElsewhere;

  // Signed in here now, so the note left for the last boot must not turn the next one away.
  useEffect(() => {
    if (isAuthorized) sessionStorage.removeItem(SessionStorageKeys.SessionEnded);
  }, [isAuthorized]);

  useEffect(() => {
    if (!isListening) return;

    let fallbackTimer: ReturnType<typeof setTimeout>;
    // Two tabs can announce in the same tick, before the flag above has re-rendered anything.
    let hasRaised = false;

    const raiseBanner = () => {
      if (hasRaised) return;
      hasRaised = true;

      dispatch(auth.actions.markSessionElsewhere());
      dispatch(banners.actions.addBanner({ key: 'SessionElsewhereBanner' }));
    };

    // Nobody answered, so no live tab is left to hand the session over — the last one was closed.
    // The activity clock is the only witness left that there is anything to go back to.
    const raiseBannerFromClock = () => {
      const lastActivityAt = getLastActivityAt();
      if (!lastActivityAt) return;

      // Past its deadline the session is over anyway, and the boot check clears it. Reloading
      // would only land on the same login page.
      if (Date.now() - lastActivityAt >= resolveSessionConfig().idleTimeoutMs) return;

      raiseBanner();
    };

    const unsubscribe = subscribeSessionSync((message) => {
      if (message.type !== 'SESSION_STATE') return;
      // A session of this tab's own arrived between the announcement and this handler. Leave it
      // alone — but tokens held by a tab that was displaced are not that.
      if (!hasSessionEnded && authStorage.getRefreshToken()) return;

      // Not gated on visibility: a tab visible in a second window says so straight away.
      clearTimeout(fallbackTimer);
      raiseBanner();
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      publishSessionMessage({ type: 'SESSION_REQUEST' });
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(raiseBannerFromClock, SESSION_REQUEST_WINDOW_MS);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(fallbackTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
    };
  }, [isListening, hasSessionEnded, dispatch]);
};
