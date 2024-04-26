import { Workspace } from 'shared/state';

import { SessionStorageKeys } from './storage';

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
  getRefreshToken: () => get(SessionStorageKeys.RefreshToken),
  getAccessToken: () => get(SessionStorageKeys.AccessToken),
  getWorkspace: () => get(SessionStorageKeys.Workspace),
  setRefreshToken: (token: string) => set(SessionStorageKeys.RefreshToken, token),
  setAccessToken: (token: string) => set(SessionStorageKeys.AccessToken, token),
  setWorkspace: (workspace: Workspace | null) => set(SessionStorageKeys.Workspace, workspace),
  removeRefreshToken: () => remove(SessionStorageKeys.RefreshToken),
  removeAccessToken: () => remove(SessionStorageKeys.AccessToken),
  removeWorkspace: () => remove(SessionStorageKeys.Workspace),
};
