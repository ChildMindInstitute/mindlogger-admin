import { useEffect } from 'react';

import { useAppDispatch } from 'redux/store';
import { auth, library } from 'redux/modules';
import { getAppletsFromStorage } from 'modules/Library/utils';
import { STORAGE_LIBRARY_KEY } from 'modules/Library/consts';
import { AppletsFromCartType } from '../api';

export const useAppletsFromCart = (params?: AppletsFromCartType) => {
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();
  const {
    thunk: { postAppletsToCart, getAppletsFromCart },
    actions: { setAppletsFromStorage },
  } = library;
  const appletsFromStorage = getAppletsFromStorage();

  useEffect(() => {
    if (isAuthorized) {
      if (appletsFromStorage.length) {
        (async () => {
          await dispatch(postAppletsToCart(appletsFromStorage));
          sessionStorage.removeItem(STORAGE_LIBRARY_KEY);
        })();
      } else {
        dispatch(getAppletsFromCart(params ?? {}));
      }

      return;
    }

    dispatch(setAppletsFromStorage(appletsFromStorage));
  }, [isAuthorized, params?.search, params?.page, params?.limit]);

  return { appletsFromStorage };
};
