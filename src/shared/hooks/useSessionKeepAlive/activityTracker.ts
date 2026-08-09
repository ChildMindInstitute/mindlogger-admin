import { getLastActivityAt, setLastActivityAt } from './sessionStore';
import { ACTIVITY_EVENTS, ACTIVITY_THROTTLE_MS } from './useSessionKeepAlive.const';

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
