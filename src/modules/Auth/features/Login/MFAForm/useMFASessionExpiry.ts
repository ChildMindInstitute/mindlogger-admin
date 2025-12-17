import { useEffect, useRef } from 'react';

import { MFASession } from 'modules/Auth/state';

type UseMFASessionExpiryArgs = {
  mfaSession?: MFASession;
  onExpire: () => void;
};

/**
 * Schedules a callback to run when the current MFA session expires.
 * Triggers immediately if the session is already expired.
 */
export const useMFASessionExpiry = ({ mfaSession, onExpire }: UseMFASessionExpiryArgs) => {
  const hasExpiredRef = useRef(false);

  // Reset the guard when we receive a brand-new session
  useEffect(() => {
    hasExpiredRef.current = false;
  }, [mfaSession?.sessionId]);

  useEffect(() => {
    if (!mfaSession?.expiresAt) return;

    const triggerExpiry = () => {
      if (hasExpiredRef.current) return;
      hasExpiredRef.current = true;
      onExpire();
    };

    const now = Date.now();
    const timeUntilExpiry = mfaSession.expiresAt - now;

    // Expired sessions should be handled right away
    if (timeUntilExpiry <= 0) {
      triggerExpiry();
      return;
    }

    const expiryTimeout = window.setTimeout(triggerExpiry, timeUntilExpiry);

    return () => {
      clearTimeout(expiryTimeout);
    };
  }, [mfaSession?.expiresAt, mfaSession?.sessionId, onExpire]);
};
