import { useState } from 'react';

import { auth } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { banners } from 'shared/state/Banners';

// One browser holds one session. While another tab is signed in and this one is not, nothing here
// may start a second: the way forward is the banner's reload, into the session already running.
// Keyed off the fact rather than the banner, which the user can dismiss without consenting to
// anything. Controls start enabled and go quiet on the press that is refused.
export const useSessionElsewhereGuard = () => {
  const dispatch = useAppDispatch();
  const hasSessionElsewhere = auth.useSessionElsewhere();
  const { banners: shownBanners } = banners.useData();
  const [isBlocked, setIsBlocked] = useState(false);

  // True when the action was refused, so the caller bails out.
  const refuse = () => {
    if (!hasSessionElsewhere) return false;

    setIsBlocked(true);

    // A control that goes quiet on its own says nothing about why. The message comes back if it was
    // dismissed, checked first because adding appends and would otherwise show a second copy.
    if (!shownBanners.some(({ key }) => key === 'SessionElsewhereBanner')) {
      dispatch(banners.actions.addBanner({ key: 'SessionElsewhereBanner' }));
    }

    return true;
  };

  return { isBlocked, refuse };
};
