import {
  InMemoryBroadcastChannel,
  resetInMemoryBroadcastChannels,
} from 'shared/tests/InMemoryBroadcastChannel';

import { closeSessionSync, publishSessionMessage, subscribeSessionSync } from './sessionSync';
import { SESSION_CHANNEL_NAME } from './sessionSync.const';
import { SessionMessage } from './sessionSync.types';

const message: SessionMessage = { type: 'SESSION_REQUEST' };

// The module under test acts as this tab; a raw channel stands in for a second one.
const openSiblingTab = () => new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);

describe('sessionSync', () => {
  beforeEach(() => {
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
  });

  test('delivers a published message to another tab', () => {
    subscribeSessionSync(vi.fn());
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;

    publishSessionMessage(message);

    expect(onSiblingMessage).toHaveBeenCalledWith({ data: message });
  });

  test('stays silent while nothing in this tab is listening', () => {
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;

    publishSessionMessage(message);

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  test('does not deliver a published message back to the publisher', () => {
    const handler = vi.fn();
    subscribeSessionSync(handler);

    publishSessionMessage(message);

    expect(handler).not.toHaveBeenCalled();
  });

  test('delivers a message from another tab to every subscriber', () => {
    const first = vi.fn();
    const second = vi.fn();
    subscribeSessionSync(first);
    subscribeSessionSync(second);

    openSiblingTab().postMessage(message);

    expect(first).toHaveBeenCalledWith(message);
    expect(second).toHaveBeenCalledWith(message);
  });

  test('stops delivering once unsubscribed', () => {
    const handler = vi.fn();
    const unsubscribe = subscribeSessionSync(handler);
    const sibling = openSiblingTab();

    unsubscribe();
    sibling.postMessage(message);

    expect(handler).not.toHaveBeenCalled();
  });

  test('ignores a payload that is not a session message', () => {
    const handler = vi.fn();
    subscribeSessionSync(handler);

    openSiblingTab().postMessage({ unrelated: true });

    expect(handler).not.toHaveBeenCalled();
  });

  test('does nothing when BroadcastChannel is unavailable', () => {
    vi.stubGlobal('BroadcastChannel', undefined);
    const handler = vi.fn();

    const unsubscribe = subscribeSessionSync(handler);
    publishSessionMessage(message);
    unsubscribe();

    expect(handler).not.toHaveBeenCalled();
  });
});
