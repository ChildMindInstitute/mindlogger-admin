export const MS_IN_SEC = 1000;
export const MS_IN_MIN = 60 * MS_IN_SEC;

// Overridden by REACT_APP_IDLE_TIMEOUT_MIN.
export const DEFAULT_IDLE_TIMEOUT_MIN = 30;

// Headroom before token expiry. Overridden by REACT_APP_REFRESH_LEAD_SEC.
export const DEFAULT_REFRESH_LEAD_SEC = 90;

// How long the warning counts down for. Overridden by REACT_APP_IDLE_WARNING_MIN.
export const DEFAULT_IDLE_WARNING_MIN = 5;

// How often the countdown redraws while the warning is open.
export const COUNTDOWN_TICK_MS = MS_IN_SEC;

// pointermove fires continuously, so writes are throttled well below the timeout's precision.
export const ACTIVITY_THROTTLE_MS = 5 * MS_IN_SEC;

// Pointer events cover mouse, touch and pen in one, so there is no separate mouse or touch entry.
// Reading without pointing is caught by scroll and wheel: on a touchscreen pointermove only fires
// while a finger is down.
export const ACTIVITY_EVENTS = [
  'pointermove',
  'pointerdown',
  'keydown',
  'scroll',
  'wheel',
] as const;
