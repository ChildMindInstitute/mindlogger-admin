export const MS_IN_SEC = 1000;
export const MS_IN_MIN = 60 * MS_IN_SEC;

// TEST BRANCH ONLY - shortened from 30 so the idle timeout is observable. Do not merge.
// Overridden by REACT_APP_IDLE_TIMEOUT_MIN.
export const DEFAULT_IDLE_TIMEOUT_MIN = 3;

// Headroom before token expiry. Overridden by REACT_APP_REFRESH_LEAD_SEC.
export const DEFAULT_REFRESH_LEAD_SEC = 90;

// TEST BRANCH ONLY - shortened from 5, leaving two minutes of use before it. Do not merge.
// How long the warning counts down for. Overridden by REACT_APP_IDLE_WARNING_MIN.
export const DEFAULT_IDLE_WARNING_MIN = 1;

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
