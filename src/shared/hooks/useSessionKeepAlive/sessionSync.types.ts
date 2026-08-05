export type LogoutReason = 'manual' | 'idle' | 'refresh-failed';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

// Everything a tab needs to take over a session it was not signed in to itself.
export type SessionState = TokenPair & {
  sessionId: string;
  loginAt: number | null;
  rotatedAt: number | null;
};

// sessionId lets a tab ignore messages belonging to another account.
export type SessionMessage =
  | { type: 'SESSION_REQUEST' }
  | { type: 'SESSION_STATE'; payload: SessionState }
  | { type: 'TOKENS_UPDATED'; payload: TokenPair & { sessionId: string } }
  | { type: 'ACTIVITY'; payload: { sessionId: string; lastActivityAt: number } }
  | { type: 'LOGOUT'; payload: { sessionId: string; reason: LogoutReason } };

export type SessionMessageHandler = (message: SessionMessage) => void;
