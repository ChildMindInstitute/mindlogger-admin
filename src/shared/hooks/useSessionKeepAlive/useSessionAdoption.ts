import { useEffect, useState } from 'react';

import { authStorage } from 'shared/utils/authStorage';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { publishSessionMessage, subscribeSessionSync } from './sessionSync';
import { SESSION_REQUEST_WINDOW_MS } from './sessionSync.const';
import { SessionState } from './sessionSync.types';
import { adoptSession, pickNewestSession } from './useSessionAdoption.utils';

// Asks the other tabs for a live session on boot and adopts the newest answer, so a fresh tab
// lands signed in instead of on the login page. Returns true while the answer is still pending.
export const useSessionAdoption = () => {
  const { featureFlags } = useFeatureFlags();
  // Decided once, at mount: a tab that already asked and heard nothing must not ask again, or a
  // stale login page would silently join a session someone starts later.
  const [isAdopting, setIsAdopting] = useState(
    () => !!featureFlags.enableSessionKeepAlive && !authStorage.getRefreshToken(),
  );

  useEffect(() => {
    if (!isAdopting) return;

    const offered: SessionState[] = [];
    // Subscribing first also opens the channel, without which nothing would be published.
    const unsubscribe = subscribeSessionSync((message) => {
      if (message.type === 'SESSION_STATE') offered.push(message.payload);
    });

    publishSessionMessage({ type: 'SESSION_REQUEST' });

    const timer = setTimeout(() => {
      const newest = pickNewestSession(offered);
      if (newest) adoptSession(newest);
      setIsAdopting(false);
    }, SESSION_REQUEST_WINDOW_MS);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [isAdopting]);

  return isAdopting;
};
