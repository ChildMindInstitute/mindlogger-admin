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
  DatavizHideSkipped = 'datavizHideSkipped',
  LastActivityAt = 'lastActivityAt',
  LoginAt = 'loginAt',
  TokensRotatedAt = 'tokensRotatedAt',
}

export { secureLocalStorage as storage };
