import { authStorage } from 'shared/utils/authStorage';
import { parseJwtClaims } from 'shared/utils/jwt';

import { getActiveSessionId } from './sessionStore';

// Rotation preserves family across refreshes; jti is the fallback until it ships.
export const getSessionId = (): string | null => {
  const { family, jti } = parseJwtClaims(authStorage.getRefreshToken()) ?? {};

  if (typeof family === 'string' && family) return family;
  if (typeof jti === 'string' && jti) return jti;

  return null;
};

// Whether this tab's session is the one the browser belongs to. A tab that slept through a logout
// and someone else signing in still holds the old one, and must not clear a store that is now
// theirs. Nothing recorded means a session that predates this check, which is left alone.
export const ownsActiveSession = () => {
  const activeSessionId = getActiveSessionId();

  return !activeSessionId || activeSessionId === getSessionId();
};
