import secureLocalStorage from 'react-secure-storage';

export const enum LocalStorageKeys {
  Language = 'lang',
  LibraryPreparedData = 'libraryPreparedData',
  IsFromLibrary = 'isFromLibrary',
  LibraryUrl = 'libraryPath',
}

export const enum SessionStorageKeys {
  RefreshToken = 'refreshToken',
  AccessToken = 'accessToken',
  Workspace = 'workspace',
  DebugMode = 'debugMode',
}

export { secureLocalStorage as storage };
