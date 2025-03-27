import secureLocalStorage from 'react-secure-storage';

export const enum LocalStorageKeys {
  Language = 'lang',
  LibraryPreparedData = 'libraryPreparedData',
  IsFromLibrary = 'isFromLibrary',
  LibraryUrl = 'libraryPath',
  EHRBannerAvailableDismissed = 'EHRBannerAvailableDismissed',
  EHRBannerActiveDismissed = 'EHRBannerActiveDismissed',
}

export const enum SessionStorageKeys {
  RefreshToken = 'refreshToken',
  AccessToken = 'accessToken',
  Workspace = 'workspace',
  DebugMode = 'debugMode',
  DatavizHideSkipped = 'datavizHideSkipped',
}

export { secureLocalStorage as storage };
