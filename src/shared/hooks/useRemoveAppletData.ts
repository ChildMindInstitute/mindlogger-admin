import { useAppDispatch } from 'redux/store';
import { applet } from 'redux/modules';
import { storage, LocalStorageKeys } from 'shared/utils/storage';

export const useRemoveAppletData = () => {
  const dispatch = useAppDispatch();

  return () => {
    dispatch(applet.actions.removeApplet());
    storage.removeItem(LocalStorageKeys.IsFromLibrary);
    storage.removeItem(LocalStorageKeys.LibraryPreparedData);
  };
};
