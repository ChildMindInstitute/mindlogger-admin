import { useEffect } from 'react';

import { STORAGE_LIBRARY_KEY } from 'modules/Library/consts';
import { getAppletsFromStorage } from 'modules/Library/utils';
import { auth, library } from 'redux/modules';
import { useAppDispatch } from 'redux/store';

export const useAppletsFromCart = () => {
  const dispatch = useAppDispatch();
  const isAuthorized = auth.useAuthorized();
  const {
    thunk: { postAppletsToCart, getAppletsFromCart },
    actions: { setAppletsFromStorage },
  } = library;
  const appletsFromStorage = getAppletsFromStorage();

  useEffect(() => {
    if (isAuthorized) {
      (async () => {
        if (appletsFromStorage.length) {
          await dispatch(postAppletsToCart(appletsFromStorage));
          sessionStorage.removeItem(STORAGE_LIBRARY_KEY);
        }

        dispatch(getAppletsFromCart());
      })();

      return;
    }

    dispatch(setAppletsFromStorage(appletsFromStorage));
  }, [isAuthorized]);

  return { appletsFromStorage };
};
