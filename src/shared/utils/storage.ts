import secureLocalStorage from 'react-secure-storage';

// Encrypted, and shared by every tab. Reads come from a snapshot taken when the tab loaded.
export const enum LocalStorageKeys {
  Language = 'lang',
  LibraryPreparedData = 'libraryPreparedData',
  IsFromLibrary = 'isFromLibrary',
  LibraryUrl = 'libraryPath',
  RefreshToken = 'refreshToken',
  AccessToken = 'accessToken',
  Workspace = 'workspace',
}

// Left unencrypted on purpose: not secrets, and a tab has to read them live rather than from the
// snapshot above.
export const enum PlainStorageKeys {
  LastActivityAt = 'lastActivityAt',
}

export const enum SessionStorageKeys {
  DebugMode = 'debugMode',
  DatavizHideSkipped = 'datavizHideSkipped',
  ReloadAttempted = 'reloadAttempted',
}

export { secureLocalStorage as storage };
