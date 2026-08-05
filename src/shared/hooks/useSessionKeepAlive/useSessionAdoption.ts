import { useEffect, useState } from 'react';

import { authStorage } from 'shared/utils/authStorage';
import { getTokenExpiration } from 'shared/utils/jwt';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { publishSessionMessage, subscribeSessionSync } from './sessionSync';
import { SESSION_REQUEST_WINDOW_MS } from './sessionSync.const';
import { SessionState } from './sessionSync.types';
import {
  adoptSession,
  catchUpSession,
  pickFresherSibling,
  pickNewestSession,
} from './useSessionAdoption.utils';

// 'fresh' joins a session this tab never had; 'catch-up' rejoins one it slept through.
type AdoptionMode = 'fresh' | 'catch-up';

const resolveMode = (isEnabled: boolean): AdoptionMode | null => {
  if (!isEnabled) return null;
  if (!authStorage.getRefreshToken()) return 'fresh';

  // A tab discarded mid-session reloads holding tokens that expired while it was gone. Asking
  // beats letting boot spend a retired refresh token and get the whole session revoked.
  const expiresAt = getTokenExpiration(authStorage.getAccessToken());

  return expiresAt !== null && expiresAt <= Date.now() ? 'catch-up' : null;
};

// Asks the other tabs for a live session on boot and adopts the newest answer, so a fresh tab
// lands signed in instead of on the login page. Returns true while the answer is still pending.
export const useSessionAdoption = () => {
  const { featureFlags } = useFeatureFlags();
  // Decided once, at mount: a tab that already asked and heard nothing must not ask again, or a
  // stale login page would silently join a session someone starts later.
  const [mode] = useState(() => resolveMode(!!featureFlags.enableSessionKeepAlive));
  const [isAdopting, setIsAdopting] = useState(mode !== null);

  useEffect(() => {
    if (!isAdopting) return;

    const offered: SessionState[] = [];
    // Subscribing first also opens the channel, without which nothing would be published.
    const unsubscribe = subscribeSessionSync((message) => {
      if (message.type === 'SESSION_STATE') offered.push(message.payload);
    });

    publishSessionMessage({ type: 'SESSION_REQUEST' });

    const timer = setTimeout(() => {
      if (mode === 'fresh') {
        const newest = pickNewestSession(offered);
        if (newest) adoptSession(newest);
      } else {
        const fresher = pickFresherSibling(offered);
        if (fresher) catchUpSession(fresher);
      }
      setIsAdopting(false);
    }, SESSION_REQUEST_WINDOW_MS);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [isAdopting, mode]);

  return isAdopting;
};
