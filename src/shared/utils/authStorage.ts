import { Workspace } from 'shared/state';

import { LocalStorageKeys } from './storage';

const set = (key: string, data: unknown) => sessionStorage.setItem(key, JSON.stringify(data));
const get = (key: string) => {
  const data = sessionStorage.getItem(key);

  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return data;
  }
};
const remove = (key: string) => sessionStorage.removeItem(key);

export const authStorage = {
  getRefreshToken: () => get(LocalStorageKeys.RefreshToken),
  getAccessToken: () => get(LocalStorageKeys.AccessToken),
  getWorkspace: () => get(LocalStorageKeys.Workspace),
  setRefreshToken: (token: string) => set(LocalStorageKeys.RefreshToken, token),
  setAccessToken: (token: string) => set(LocalStorageKeys.AccessToken, token),
  setWorkspace: (workspace: Workspace) => set(LocalStorageKeys.Workspace, workspace),
  removeRefreshToken: () => remove(LocalStorageKeys.RefreshToken),
  removeAccessToken: () => remove(LocalStorageKeys.AccessToken),
  removeWorkspace: () => remove(LocalStorageKeys.Workspace),
};
