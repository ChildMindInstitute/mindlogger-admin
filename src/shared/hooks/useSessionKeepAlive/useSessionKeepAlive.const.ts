export const MS_IN_SEC = 1000;
export const MS_IN_MIN = 60 * MS_IN_SEC;

// Overridden by REACT_APP_IDLE_TIMEOUT_MIN.
export const DEFAULT_IDLE_TIMEOUT_MIN = 30;

// Headroom before token expiry. Overridden by REACT_APP_REFRESH_LEAD_SEC.
export const DEFAULT_REFRESH_LEAD_SEC = 90;

// mousemove fires continuously, so writes are throttled well below the timeout's precision.
export const ACTIVITY_THROTTLE_MS = 5 * MS_IN_SEC;

export const ACTIVITY_EVENTS = [
  'mousemove',
  'pointerdown',
  'keydown',
  'scroll',
  'wheel',
  'touchstart',
] as const;
