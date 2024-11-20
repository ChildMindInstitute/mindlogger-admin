import { useEffect, useRef } from 'react';

import { banners } from 'shared/state/Banners';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { authStorage } from 'shared/utils';

export const useSessionBanners = () => {
  const dispatch = useAppDispatch();
  const hasToken = !!authStorage.getAccessToken();
  const status = auth.useStatus();
  const isSessionValid = hasToken && status !== 'error';

  const prevIsSessionValid = useRef(isSessionValid);
  useEffect(() => {
    // Only update banners when session status changes
    if (prevIsSessionValid.current !== isSessionValid) {
      if (!isSessionValid) {
        dispatch(banners.actions.removeAllBanners());
      }
    }
    prevIsSessionValid.current = isSessionValid;
  }, [dispatch, isSessionValid]);
};
