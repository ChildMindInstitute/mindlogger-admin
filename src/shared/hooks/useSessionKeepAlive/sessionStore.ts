import { SessionStorageKeys } from 'shared/utils/storage';

// Persisted rather than held in memory so a reload or a duplicated tab inherits the idle clock
// instead of being handed a fresh timeout.
const readTimestamp = (key: SessionStorageKeys): number | null => {
  const stored = Number(sessionStorage.getItem(key));

  return Number.isFinite(stored) && stored > 0 ? stored : null;
};

const writeTimestamp = (key: SessionStorageKeys, at: number) => {
  sessionStorage.setItem(key, String(at));
};

export const getLastActivityAt = () => readTimestamp(SessionStorageKeys.LastActivityAt);

export const setLastActivityAt = (at: number) =>
  writeTimestamp(SessionStorageKeys.LastActivityAt, at);
