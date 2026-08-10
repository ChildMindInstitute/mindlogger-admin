import { PlainStorageKeys } from 'shared/utils/storage';

import { startActivityTracking, stopActivityTracking } from './activityTracker';
import { getLastActivityAt } from './sessionStore';
import { ACTIVITY_EVENTS, ACTIVITY_THROTTLE_MS } from './useSessionKeepAlive.const';

const storedActivity = () => localStorage.getItem(PlainStorageKeys.LastActivityAt);

describe('activityTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T10:00:00Z'));
    localStorage.clear();
  });

  afterEach(() => {
    stopActivityTracking();
    vi.useRealTimers();
  });

  test('seeds the timestamp when nothing is stored', () => {
    startActivityTracking();

    expect(getLastActivityAt()).toBe(Date.now());
  });

  test('adopts an existing timestamp instead of resetting it', () => {
    const earlier = Date.now() - 600000;
    localStorage.setItem(PlainStorageKeys.LastActivityAt, String(earlier));

    startActivityTracking();

    expect(getLastActivityAt()).toBe(earlier);
  });

  test.each(ACTIVITY_EVENTS)('records activity on %s', (event) => {
    startActivityTracking();
    const seeded = getLastActivityAt();

    vi.advanceTimersByTime(ACTIVITY_THROTTLE_MS + 1);
    window.dispatchEvent(new Event(event));

    expect(getLastActivityAt()).toBeGreaterThan(Number(seeded));
    expect(getLastActivityAt()).toBe(Date.now());
  });

  test('throttles repeated events', () => {
    startActivityTracking();
    vi.advanceTimersByTime(ACTIVITY_THROTTLE_MS + 1);
    window.dispatchEvent(new Event('mousemove'));

    const afterFirst = storedActivity();

    vi.advanceTimersByTime(1000);
    window.dispatchEvent(new Event('mousemove'));
    window.dispatchEvent(new Event('mousemove'));

    expect(storedActivity()).toBe(afterFirst);
  });

  test('records again once the throttle window passes', () => {
    startActivityTracking();
    vi.advanceTimersByTime(ACTIVITY_THROTTLE_MS + 1);
    window.dispatchEvent(new Event('mousemove'));
    const afterFirst = storedActivity();

    vi.advanceTimersByTime(ACTIVITY_THROTTLE_MS + 1);
    window.dispatchEvent(new Event('mousemove'));

    expect(storedActivity()).not.toBe(afterFirst);
  });

  test('notifies the caller when activity is recorded', () => {
    const onActivity = vi.fn();
    startActivityTracking(onActivity);

    vi.advanceTimersByTime(ACTIVITY_THROTTLE_MS + 1);
    window.dispatchEvent(new Event('keydown'));

    expect(onActivity).toHaveBeenCalledTimes(1);
  });

  test('stops recording once tracking is stopped', () => {
    startActivityTracking();
    stopActivityTracking();
    const beforeEvent = storedActivity();

    vi.advanceTimersByTime(ACTIVITY_THROTTLE_MS + 1);
    window.dispatchEvent(new Event('mousemove'));

    expect(storedActivity()).toBe(beforeEvent);
  });

  test('starting twice leaves only one set of listeners', () => {
    const onActivity = vi.fn();
    startActivityTracking(onActivity);
    startActivityTracking(onActivity);

    vi.advanceTimersByTime(ACTIVITY_THROTTLE_MS + 1);
    window.dispatchEvent(new Event('keydown'));

    expect(onActivity).toHaveBeenCalledTimes(1);
  });

  test('ignores a corrupt stored value', () => {
    localStorage.setItem(PlainStorageKeys.LastActivityAt, 'not-a-number');

    expect(getLastActivityAt()).toBeNull();
  });
});
