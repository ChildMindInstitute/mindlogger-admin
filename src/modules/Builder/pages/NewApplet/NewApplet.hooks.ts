import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Update } from 'history';

import { useBlocker } from 'shared/hooks';

import { isActivityRoute, isAppletRoute } from './NewApplet.utils';

export const usePrompt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [promptVisible, setPromptVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState<Update | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const cancelNavigation = () => {
    setPromptVisible(false);
    setLastLocation(null);
  };

  // handle blocking when user click on another route prompt will be shown
  const handleBlockedNavigation = useCallback(
    (nextLocation: Update) => {
      const currentPathname = location.pathname;
      const nextPathname = nextLocation.location.pathname;
      const shouldSkip =
        (isAppletRoute(currentPathname) && isAppletRoute(nextPathname)) ||
        (isActivityRoute(currentPathname) && isActivityRoute(nextPathname));

      if (!confirmedNavigation && !shouldSkip) {
        setPromptVisible(true);
        setLastLocation(nextLocation);

        return false;
      }

      setLastLocation(nextLocation);
      setConfirmedNavigation(true);

      return true;
    },
    [confirmedNavigation, location],
  );

  const confirmNavigation = useCallback(() => {
    setPromptVisible(false);
    setConfirmedNavigation(true);
  }, []);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.location?.pathname);
      setConfirmedNavigation(false);
    }
  }, [confirmedNavigation, lastLocation]);

  useBlocker(handleBlockedNavigation, true);

  return { promptVisible, confirmNavigation, cancelNavigation };
};
