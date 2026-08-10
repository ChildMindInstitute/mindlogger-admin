import { authStorage } from 'shared/utils/authStorage';

import { clearSessionState, getLastActivityAt } from './sessionStore';
import { resolveSessionConfig } from './useSessionKeepAlive.utils';

// A session outlives its tab now, so closing the browser no longer ends one. Without this, a
// session left idle too long comes back on the next visit and only fails once it makes a request.
export const clearStaleSession = () => {
  const lastActivityAt = getLastActivityAt();
  // No clock means the session predates this check. Leave it to the usual 401 path.
  if (!lastActivityAt) return;

  const { idleTimeoutMs } = resolveSessionConfig();
  if (Date.now() - lastActivityAt < idleTimeoutMs) return;

  authStorage.clear();
  clearSessionState();
};
