import { getLastActivityAt, setLastActivityAt } from './sessionStore';
import { ACTIVITY_EVENTS, ACTIVITY_THROTTLE_MS } from './useSessionKeepAlive.const';

let stopTracking: (() => void) | null = null;

// Held while the warning is open, so reaching for its buttons cannot answer the countdown for you.
let isPaused = false;

export const setActivityTrackingPaused = (paused: boolean) => {
  isPaused = paused;
};

export const startActivityTracking = (onActivity?: () => void) => {
  stopActivityTracking();

  if (!getLastActivityAt()) setLastActivityAt(Date.now());

  let lastWriteAt = 0;
  const handleActivity = () => {
    if (isPaused) return;

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
  // Cleared here too, so a teardown mid-warning cannot leave the next session unable to record.
  isPaused = false;
};
