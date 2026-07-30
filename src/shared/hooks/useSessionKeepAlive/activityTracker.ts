import { SessionStorageKeys } from 'shared/utils/storage';

import { ACTIVITY_EVENTS, ACTIVITY_THROTTLE_MS } from './useSessionKeepAlive.const';

// Persisted rather than held in memory so a reload or a duplicated tab inherits the idle clock
// instead of being handed a fresh timeout.
export const getLastActivityAt = (): number | null => {
  const stored = Number(sessionStorage.getItem(SessionStorageKeys.LastActivityAt));

  return Number.isFinite(stored) && stored > 0 ? stored : null;
};

const setLastActivityAt = (at: number) => {
  sessionStorage.setItem(SessionStorageKeys.LastActivityAt, String(at));
};

let stopTracking: (() => void) | null = null;

export const startActivityTracking = (onActivity?: () => void) => {
  stopActivityTracking();

  if (!getLastActivityAt()) setLastActivityAt(Date.now());

  let lastWriteAt = 0;
  const handleActivity = () => {
    const now = Date.now();
    if (now - lastWriteAt < ACTIVITY_THROTTLE_MS) return;

    lastWriteAt = now;
    setLastActivityAt(now);
    onActivity?.();
  };

  ACTIVITY_EVENTS.forEach((event) =>
    window.addEventListener(event, handleActivity, { passive: true }),
  );

  stopTracking = () =>
    ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity));
};

export const stopActivityTracking = () => {
  stopTracking?.();
  stopTracking = null;
};
