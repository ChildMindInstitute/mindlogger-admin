import { NavigateFunction } from 'react-router-dom';

import { LocalStorageKeys, storage } from './storage';

export const navigateToLibrary = (navigate: NavigateFunction) => {
  const fromLibraryUrl = storage.getItem(LocalStorageKeys.LibraryUrl) as string;
  if (fromLibraryUrl) {
    navigate(fromLibraryUrl);
    storage.removeItem(LocalStorageKeys.LibraryUrl);
  }
};
