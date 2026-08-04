export type LogoutReason = 'manual' | 'idle' | 'refresh-failed';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

// sessionId lets a tab ignore messages belonging to another account.
export type SessionMessage =
  | { type: 'SESSION_REQUEST' }
  | {
      type: 'SESSION_STATE';
      payload: TokenPair & { sessionId: string; loginAt: number | null; rotatedAt: number | null };
    }
  | { type: 'TOKENS_UPDATED'; payload: TokenPair & { sessionId: string } }
  | { type: 'ACTIVITY'; payload: { sessionId: string; lastActivityAt: number } }
  | { type: 'LOGOUT'; payload: { sessionId: string; reason: LogoutReason } };

export type SessionMessageHandler = (message: SessionMessage) => void;
