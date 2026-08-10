import { PlainStorageKeys } from 'shared/utils/storage';

// Plain localStorage, not the encrypted store: a timestamp is not a secret, and every tab has to
// be able to read the current value rather than the one it loaded with.
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

export const clearSessionState = () => localStorage.removeItem(PlainStorageKeys.LastActivityAt);
