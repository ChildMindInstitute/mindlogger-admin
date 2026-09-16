export type LogoutReason = 'manual' | 'idle' | 'refresh-failed';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

// sessionId lets a tab ignore tokens that do not belong to the account it is showing.
export type SessionState = TokenPair & { sessionId: string };

// The clock travels with the announcement: a tab woken from a freeze can read storage before its
// process sees a sibling's write, and a live sibling's reading is the newer of the two.
export type SessionAnnouncement = SessionState & { lastActivityAt: number };

export type SessionMessage =
  | { type: 'SESSION_REQUEST' }
  | { type: 'SESSION_STATE'; payload: SessionAnnouncement }
  | { type: 'TOKENS_UPDATED'; payload: SessionState }
  | { type: 'LOGOUT'; payload: { sessionId: string; reason: LogoutReason } };

export type SessionMessageHandler = (message: SessionMessage) => void;
