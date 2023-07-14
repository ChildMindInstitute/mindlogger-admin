import secureLocalStorage from 'react-secure-storage';

export const enum LocalStorageKeys {
  RefreshToken = 'refreshToken',
  AccessToken = 'accessToken',
  Workspace = 'workspace',
  Language = 'lang',
  LibraryPreparedData = 'libraryPreparedData',
  IsFromLibrary = 'isFromLibrary',
  LibraryUrl = 'libraryPath',
}

export { secureLocalStorage as storage };
