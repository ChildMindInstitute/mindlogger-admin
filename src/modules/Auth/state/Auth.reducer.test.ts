import { authStorage } from 'shared/utils/authStorage';
import {
  getLastActivityAt,
  setLastActivityAt,
} from 'shared/hooks/useSessionKeepAlive/sessionStore';
import { LocalStorageKeys, storage } from 'shared/utils/storage';

import { reducers } from './Auth.reducer';
import { state as initialState } from './Auth.state';
import { AuthSchema } from './Auth.schema';

const appletKey = 'pwd/owner-id/applet-id';

describe('resetAuthorization', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test('clears the session from every store it is spread across', () => {
    authStorage.setAccessToken('access-token');
    authStorage.setRefreshToken('refresh-token');
    setLastActivityAt(Date.now());
    sessionStorage.setItem(appletKey, 'private-key');

    reducers.resetAuthorization({ ...initialState, isAuthorized: true } as AuthSchema);

    expect(authStorage.getAccessToken()).toBeNull();
    expect(authStorage.getRefreshToken()).toBeNull();
    expect(getLastActivityAt()).toBeNull();
    expect(sessionStorage.getItem(appletKey)).toBeNull();
  });

  test('leaves storage that is not part of the session alone', () => {
    storage.setItem(LocalStorageKeys.Language, 'fr');

    reducers.resetAuthorization({ ...initialState } as AuthSchema);

    expect(storage.getItem(LocalStorageKeys.Language)).toBe('fr');
  });
});
