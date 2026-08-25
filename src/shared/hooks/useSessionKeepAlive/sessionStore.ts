import { PlainStorageKeys } from 'shared/utils/storage';

// Plain localStorage, not the encrypted store: neither value is a secret, and every tab has to be
// able to read the current one rather than the one it loaded with.
const readTimestamp = (key: PlainStorageKeys): number | null => {
  const stored = Number(localStorage.getItem(key));

  return Number.isFinite(stored) && stored > 0 ? stored : null;
};

const writeTimestamp = (key: PlainStorageKeys, at: number) => {
  localStorage.setItem(key, String(at));
};

export const getLastActivityAt = () => readTimestamp(PlainStorageKeys.LastActivityAt);

export const setLastActivityAt = (at: number) =>
  writeTimestamp(PlainStorageKeys.LastActivityAt, at);

// Which session the browser currently belongs to. A tab that slept through a sign-in holds a
// snapshot naming the session before it, and this is the only way it can tell.
export const getActiveSessionId = () =>
  localStorage.getItem(PlainStorageKeys.ActiveSessionId) || null;

export const setActiveSessionId = (sessionId: string) => {
  localStorage.setItem(PlainStorageKeys.ActiveSessionId, sessionId);
};

// Both go together: a session's clock and its identity end at the same moment.
export const clearSessionState = () => {
  localStorage.removeItem(PlainStorageKeys.LastActivityAt);
  localStorage.removeItem(PlainStorageKeys.ActiveSessionId);
};
