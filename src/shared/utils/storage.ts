import secureLocalStorage from 'react-secure-storage';

export const enum LocalStorageKeys {
  RefreshToken = 'refreshToken',
  AccessToken = 'accessToken',
  Workspace = 'workspace',
  Language = 'lang',
}

export { secureLocalStorage as storage };
