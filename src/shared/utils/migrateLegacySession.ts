import { Workspace } from 'shared/state';
import { setLastActivityAt } from 'shared/hooks/useSessionKeepAlive/sessionStore';

import { authStorage } from './authStorage';
import { dbg, tokenInfo } from './sessionDebugLog';

// Sessions signed in before tokens moved to local storage sit under these keys. Without this, the
// deploy looks like a logout to anyone who was signed in at the time.
// Temporary: delete this file one release after shipping.
const LEGACY_KEYS = {
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  workspace: 'workspace',
  lastActivityAt: 'lastActivityAt',
} as const;

// The old authStorage stringified on write, so values come back wrapped and have to be unwrapped.
const readLegacy = (key: string): unknown => {
  const stored = sessionStorage.getItem(key);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const migrateLegacySession = () => {
  const legacyKeys = Object.values(LEGACY_KEYS).filter((key) => sessionStorage.getItem(key));

  // A session already in the new store is by definition the newer one.
  if (authStorage.getRefreshToken()) {
    if (legacyKeys.length) dbg('migrate.skip', { legacyKeys });

    return;
  }

  const refreshToken = readLegacy(LEGACY_KEYS.refreshToken);
  const accessToken = readLegacy(LEGACY_KEYS.accessToken);
  if (typeof refreshToken !== 'string' || typeof accessToken !== 'string') return;

  dbg('migrate.run', { legacyKeys, refresh: tokenInfo(refreshToken) });

  authStorage.setRefreshToken(refreshToken);
  authStorage.setAccessToken(accessToken);

  const workspace = readLegacy(LEGACY_KEYS.workspace);
  if (workspace) authStorage.setWorkspace(workspace as Workspace);

  // The tracker wrote this one as a bare number, never through JSON, so it is read differently.
  const lastActivityAt = Number(sessionStorage.getItem(LEGACY_KEYS.lastActivityAt));
  if (Number.isFinite(lastActivityAt) && lastActivityAt > 0) setLastActivityAt(lastActivityAt);

  Object.values(LEGACY_KEYS).forEach((key) => sessionStorage.removeItem(key));
};
