import { authStorage } from 'shared/utils/authStorage';

import { adoptActivityAt, recordActivity } from './activityTracker';
import { SessionState } from './sessionSync.types';
import { getRotatedAt, getSessionId, stampLoginAt, stampRotatedAt } from './sessionSync.utils';

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

// Only fresher tokens for the session this tab already belongs to. Someone else's newer login is
// not ours to join, so a tab that has a session of its own is never switched to another.
export const pickFresherSibling = (sessions: SessionState[]) => {
  const mine = getSessionId();
  const rotatedAt = getRotatedAt() ?? 0;

  return (
    sessions.find(
      (session) => session.sessionId === mine && (session.rotatedAt ?? 0) > rotatedAt,
    ) ?? null
  );
};

// Rejoining a session this tab already belonged to. Unlike adoptSession it takes the sibling's
// activity clock rather than recording new activity: coming back to a tab is not itself activity,
// so a session that idled out while the tab was gone still ends.
export const catchUpSession = ({
  accessToken,
  refreshToken,
  rotatedAt,
  lastActivityAt,
}: SessionState) => {
  authStorage.setAccessToken(accessToken);
  authStorage.setRefreshToken(refreshToken);
  if (rotatedAt) stampRotatedAt(rotatedAt);
  if (lastActivityAt) adoptActivityAt(lastActivityAt);
};
