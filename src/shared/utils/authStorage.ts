import { Workspace } from 'shared/state';

import { LocalStorageKeys, storage } from './storage';
import { dbg, tokenInfo } from './sessionDebugLog';

// The secure store keeps values in the type they were written as, so nothing is stringified here.
const getString = (key: LocalStorageKeys) => (storage.getItem(key) as string | null) ?? null;

// The store picks the key to delete from the value's type, which it only knows for values this tab
// wrote. Writing one first is what lets it delete a workspace another tab left behind.
const removeWorkspace = () => {
  dbg('store.removeWorkspace');
  storage.setItem(LocalStorageKeys.Workspace, {});
  storage.removeItem(LocalStorageKeys.Workspace);
};

export const authStorage = {
  getRefreshToken: () => getString(LocalStorageKeys.RefreshToken),
  getAccessToken: () => getString(LocalStorageKeys.AccessToken),
  getWorkspace: () => storage.getItem(LocalStorageKeys.Workspace) as Workspace | null,
  setRefreshToken: (token: string) => {
    dbg('store.setRefreshToken', { token: tokenInfo(token) });
    storage.setItem(LocalStorageKeys.RefreshToken, token);
  },
  setAccessToken: (token: string) => {
    dbg('store.setAccessToken', { token: tokenInfo(token) });
    storage.setItem(LocalStorageKeys.AccessToken, token);
  },
  setWorkspace: (workspace: Workspace | null) => {
    dbg('store.setWorkspace', { ownerId: workspace?.ownerId, name: workspace?.workspaceName });
    storage.setItem(LocalStorageKeys.Workspace, workspace as object);
  },
  removeRefreshToken: () => storage.removeItem(LocalStorageKeys.RefreshToken),
  removeAccessToken: () => storage.removeItem(LocalStorageKeys.AccessToken),
  removeWorkspace,
  // Named removals rather than the store's own clear(), which wipes unrelated keys such as the
  // chosen language and the library return path.
  clear: () => {
    dbg('store.clear');
    storage.removeItem(LocalStorageKeys.RefreshToken);
    storage.removeItem(LocalStorageKeys.AccessToken);
    removeWorkspace();
  },
};
