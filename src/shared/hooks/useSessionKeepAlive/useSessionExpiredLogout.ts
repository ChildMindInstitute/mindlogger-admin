import { useEffect, useRef } from 'react';

import { auth } from 'redux/modules';
import { setSessionExpiredHandler } from 'shared/api';
import { useLogout } from 'shared/hooks/useLogout';

// A refresh triggered by a user action can fail for reasons the keep-alive timer never sees: the
// family revoked from another device, a password change. Deliberately outside the feature flag,
// because that is where the gap is widest.
export const useSessionExpiredLogout = () => {
  const isAuthorized = auth.useAuthorized();
  const logout = useLogout();

  // Refreshed every render so the logout never closes over a stale email or workspace.
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  useEffect(() => {
    if (!isAuthorized) return;

    // Parallel requests all 401 and all land here off one shared refresh. Scoped to the effect,
    // so signing in again in this tab re-arms it.
    let hasEnded = false;

    setSessionExpiredHandler(() => {
      if (hasEnded) return;
      hasEnded = true;

      logoutRef.current({ shouldSoftLock: true, reason: 'refresh-failed' });
    });

    return () => setSessionExpiredHandler(null);
  }, [isAuthorized]);
};
