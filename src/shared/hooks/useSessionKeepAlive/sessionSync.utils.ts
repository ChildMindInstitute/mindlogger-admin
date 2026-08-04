import { authStorage } from 'shared/utils/authStorage';
import { parseJwtClaims } from 'shared/utils/jwt';
import { SessionStorageKeys } from 'shared/utils/storage';

// Rotation preserves family across refreshes; jti is the fallback until it ships.
export const getSessionId = (): string | null => {
  const { family, jti } = parseJwtClaims(authStorage.getRefreshToken()) ?? {};

  if (typeof family === 'string' && family) return family;
  if (typeof jti === 'string' && jti) return jti;

  return null;
};

const readTimestamp = (key: SessionStorageKeys) => {
  const stored = Number(sessionStorage.getItem(key));

  return Number.isFinite(stored) && stored > 0 ? stored : null;
};

// Stamped once per sign-in, so sessions stay orderable after rotation replaces their tokens.
export const getLoginAt = () => readTimestamp(SessionStorageKeys.LoginAt);
export const stampLoginAt = (at: number = Date.now()) =>
  sessionStorage.setItem(SessionStorageKeys.LoginAt, String(at));

// Bumped on every rotation, so a tab can tell whether a sibling is holding fresher tokens.
export const getRotatedAt = () => readTimestamp(SessionStorageKeys.TokensRotatedAt);
export const stampRotatedAt = (at: number = Date.now()) =>
  sessionStorage.setItem(SessionStorageKeys.TokensRotatedAt, String(at));
