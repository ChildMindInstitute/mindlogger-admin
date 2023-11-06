import { auth } from 'modules/Auth';
import { useEffect } from 'react';

// import { auth } from 'redux/modules';
import { storage, LocalStorageKeys } from 'shared/utils';

export const useReturnToLibraryPath = (path: string) => {
  const isAuthorized = auth.useAuthorized();

  useEffect(() => {
    if (isAuthorized) {
      storage.removeItem(LocalStorageKeys.LibraryUrl);

      return;
    }
    storage.setItem(LocalStorageKeys.LibraryUrl, path);
  }, [isAuthorized]);
};
