import { Workspace } from 'shared/state';

import { LocalStorageKeys, storage } from './storage';

// The secure store keeps values in the type they were written as, so nothing is stringified here.
const getString = (key: LocalStorageKeys) => (storage.getItem(key) as string | null) ?? null;

export const authStorage = {
  getRefreshToken: () => getString(LocalStorageKeys.RefreshToken),
  getAccessToken: () => getString(LocalStorageKeys.AccessToken),
  getWorkspace: () => storage.getItem(LocalStorageKeys.Workspace) as Workspace | null,
  setRefreshToken: (token: string) => storage.setItem(LocalStorageKeys.RefreshToken, token),
  setAccessToken: (token: string) => storage.setItem(LocalStorageKeys.AccessToken, token),
  setWorkspace: (workspace: Workspace | null) =>
    storage.setItem(LocalStorageKeys.Workspace, workspace as object),
  removeRefreshToken: () => storage.removeItem(LocalStorageKeys.RefreshToken),
  removeAccessToken: () => storage.removeItem(LocalStorageKeys.AccessToken),
  removeWorkspace: () => storage.removeItem(LocalStorageKeys.Workspace),
  // Named removals rather than the store's own clear(), which wipes unrelated keys such as the
  // chosen language and the library return path.
  clear: () => {
    storage.removeItem(LocalStorageKeys.RefreshToken);
    storage.removeItem(LocalStorageKeys.AccessToken);
    storage.removeItem(LocalStorageKeys.Workspace);
    // The store keys a value by its type and reads that type from a snapshot taken when the tab
    // loaded. The workspace is the only object here, so a tab that loaded before another wrote one
    // removes it as a string and leaves the real entry behind for the next tab to read.
    localStorage.removeItem('@secure.j.workspace');
  },
};
