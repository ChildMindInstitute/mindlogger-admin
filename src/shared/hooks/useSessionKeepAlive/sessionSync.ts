import { SESSION_CHANNEL_NAME } from './sessionSync.const';
import { SessionMessage, SessionMessageHandler } from './sessionSync.types';

const handlers = new Set<SessionMessageHandler>();
let channel: BroadcastChannel | null = null;

// The tab that logs out keeps its tokens until the revoke call comes back, so it still looks like
// it holds a live session. Noted here so it stops answering for one that is over.
let revokedSessionId: string | null = null;

export const markSessionRevoked = (sessionId: string) => {
  revokedSessionId = sessionId;
};

export const isSessionRevoked = (sessionId: string) => revokedSessionId === sessionId;

// Opened on first use, so a tab that never syncs never creates one.
const openChannel = () => {
  if (typeof BroadcastChannel === 'undefined') return null;

  if (!channel) {
    channel = new BroadcastChannel(SESSION_CHANNEL_NAME);
    // One onmessage slot fans out, so subscribers cannot overwrite each other.
    channel.onmessage = ({ data }: MessageEvent<SessionMessage>) => {
      if (!data?.type) return;

      handlers.forEach((handler) => handler(data));
    };
  }

  return channel;
};

// A tab only speaks while it is listening, so the flag-gated subscribers gate sending too.
export const publishSessionMessage = (message: SessionMessage) => {
  if (!handlers.size) return;

  openChannel()?.postMessage(message);
};

export const subscribeSessionSync = (handler: SessionMessageHandler) => {
  handlers.add(handler);
  openChannel();

  return () => {
    handlers.delete(handler);
  };
};

export const closeSessionSync = () => {
  channel?.close();
  channel = null;
  handlers.clear();
  revokedSessionId = null;
};
