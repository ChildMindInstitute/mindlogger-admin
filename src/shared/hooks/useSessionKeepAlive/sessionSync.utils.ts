import { authStorage } from 'shared/utils/authStorage';
import { parseJwtClaims } from 'shared/utils/jwt';

// Rotation preserves family across refreshes; jti is the fallback until it ships.
export const getSessionId = (): string | null => {
  const { family, jti } = parseJwtClaims(authStorage.getRefreshToken()) ?? {};

  if (typeof family === 'string' && family) return family;
  if (typeof jti === 'string' && jti) return jti;

  return null;
};
