import { authStorage } from 'shared/utils/authStorage';

import { recordActivity } from './activityTracker';
import { SessionState } from './sessionSync.types';
import { stampLoginAt, stampRotatedAt } from './sessionSync.utils';

// Sessions that began before the flag was switched on have no stamp, so they sort oldest.
export const pickNewestSession = (sessions: SessionState[]) =>
  sessions.reduce<SessionState | null>(
    (newest, session) =>
      !newest || (session.loginAt ?? 0) > (newest.loginAt ?? 0) ? session : newest,
    null,
  );

// loginAt is inherited, not re-stamped: the tab joins an existing session, it does not start one.
// The tokens must land before recordActivity, which reads the session id from them.
export const adoptSession = ({ accessToken, refreshToken, loginAt, rotatedAt }: SessionState) => {
  authStorage.setAccessToken(accessToken);
  authStorage.setRefreshToken(refreshToken);
  if (loginAt) stampLoginAt(loginAt);
  if (rotatedAt) stampRotatedAt(rotatedAt);
  recordActivity();
};
