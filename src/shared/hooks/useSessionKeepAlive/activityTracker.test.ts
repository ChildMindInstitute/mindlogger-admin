import { SessionStorageKeys } from 'shared/utils/storage';
import { authStorage } from 'shared/utils/authStorage';
import {
  InMemoryBroadcastChannel,
  resetInMemoryBroadcastChannels,
} from 'shared/tests/InMemoryBroadcastChannel';

import {
  adoptActivityAt,
  getLastActivityAt,
  startActivityTracking,
  stopActivityTracking,
} from './activityTracker';
import { closeSessionSync, subscribeSessionSync } from './sessionSync';
import { SESSION_CHANNEL_NAME } from './sessionSync.const';
import { ACTIVITY_EVENTS, ACTIVITY_THROTTLE_MS } from './useSessionKeepAlive.const';

const storedActivity = () => sessionStorage.getItem(SessionStorageKeys.LastActivityAt);

describe('activityTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T10:00:00Z'));
    sessionStorage.clear();
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
    sessionStorage.setItem(SessionStorageKeys.LastActivityAt, String(earlier));

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
    sessionStorage.setItem(SessionStorageKeys.LastActivityAt, 'not-a-number');

    expect(getLastActivityAt()).toBeNull();
  });

  test('adopts a later timestamp but never an earlier one', () => {
    startActivityTracking();
    const seeded = Number(storedActivity());

    adoptActivityAt(seeded - ACTIVITY_THROTTLE_MS);
    expect(getLastActivityAt()).toBe(seeded);

    adoptActivityAt(seeded + ACTIVITY_THROTTLE_MS);
    expect(getLastActivityAt()).toBe(seeded + ACTIVITY_THROTTLE_MS);
  });
});

describe('activityTracker broadcast', () => {
  let onSiblingMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T10:00:00Z'));
    sessionStorage.clear();
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    // Stands in for this tab's engine, without which nothing is broadcast at all.
    subscribeSessionSync(vi.fn());
    authStorage.setRefreshToken(`header.${btoa(JSON.stringify({ family: 'family-1' }))}.signature`);

    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
    onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;
  });

  afterEach(() => {
    stopActivityTracking();
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test('announces activity to sibling tabs', () => {
    startActivityTracking();

    vi.advanceTimersByTime(ACTIVITY_THROTTLE_MS + 1);
    window.dispatchEvent(new Event('keydown'));

    expect(onSiblingMessage).toHaveBeenCalledWith({
      data: {
        type: 'ACTIVITY',
        payload: { sessionId: 'family-1', lastActivityAt: Date.now() },
      },
    });
  });

  test('announces once per throttle window, not once per event', () => {
    startActivityTracking();

    vi.advanceTimersByTime(ACTIVITY_THROTTLE_MS + 1);
    window.dispatchEvent(new Event('mousemove'));
    window.dispatchEvent(new Event('mousemove'));
    window.dispatchEvent(new Event('mousemove'));

    expect(onSiblingMessage).toHaveBeenCalledTimes(1);
  });

  test('announces nothing when the token carries no session id', () => {
    authStorage.setRefreshToken('opaque-token');
    startActivityTracking();

    vi.advanceTimersByTime(ACTIVITY_THROTTLE_MS + 1);
    window.dispatchEvent(new Event('keydown'));

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });
});
