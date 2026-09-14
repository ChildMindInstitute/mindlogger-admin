import { deleteRefreshTokenApi } from 'modules/Auth/api';
import { authStorage } from 'shared/utils/authStorage';
import { getTokenExpiration } from 'shared/utils/jwt';

import { clearSessionState, getLastActivityAt } from './sessionStore';
import { resolveSessionConfig } from './useSessionKeepAlive.utils';

// A session outlives its tab now, so closing the browser no longer ends one. Without this, a
// session left idle too long comes back on the next visit and only fails once it makes a request.
export const clearStaleSession = async () => {
  const lastActivityAt = getLastActivityAt();
  // No clock means the session predates this check. Leave it to the usual 401 path.
  if (!lastActivityAt) return;

  // A clock with no token behind it names a session nothing can rejoin, and a tab that trusts it
  // raises a banner offering a reload that only lands back on the login page. The secure store is
  // read from a snapshot taken at load, so this answer is only reliable here, at boot.
  if (!authStorage.getRefreshToken()) return clearSessionState();

  const { idleTimeoutMs } = resolveSessionConfig();
  if (Date.now() - lastActivityAt < idleTimeoutMs) return;

  // Today the refresh token expires as the session goes stale, so this is skipped. It matters if
  // the idle timeout is ever shortened below the token's lifetime, leaving a live one behind.
  const refreshTokenExpiresAt = getTokenExpiration(authStorage.getRefreshToken());
  if (refreshTokenExpiresAt !== null && refreshTokenExpiresAt > Date.now()) {
    // logout2 revokes the whole family, so the access token goes with it.
    await deleteRefreshTokenApi().catch(() => undefined);
  }

  authStorage.clear();
  clearSessionState();
  // Survives a reload, so a stale session would otherwise leave the applet private keys behind.
  // Matches the teardown in Auth.reducer's resetAuthorization.
  sessionStorage.clear();
};
