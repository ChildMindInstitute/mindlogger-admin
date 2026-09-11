export type LogoutReason = 'manual' | 'idle' | 'refresh-failed';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

// sessionId lets a tab ignore tokens that do not belong to the account it is showing.
export type SessionState = TokenPair & { sessionId: string };

export type SessionMessage =
  | { type: 'SESSION_REQUEST' }
  | { type: 'SESSION_STATE'; payload: SessionState }
  | { type: 'TOKENS_UPDATED'; payload: SessionState }
  | { type: 'LOGOUT'; payload: { sessionId: string; reason: LogoutReason } };

export type SessionMessageHandler = (message: SessionMessage) => void;
