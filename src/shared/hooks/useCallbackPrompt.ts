import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Update } from 'history';

import { useBlocker } from './useBlocker';

export const useCallbackPrompt = (when: boolean) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [promptVisible, setPromptVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState<Update | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const cancelNavigation = useCallback(() => {
    setPromptVisible(false);
    setLastLocation(null);
  }, []);

  // handle blocking when user click on another route prompt will be shown
  const handleBlockedNavigation = useCallback(
    (nextLocation: Update) => {
      if (!confirmedNavigation && nextLocation.location.pathname !== location.pathname) {
        setPromptVisible(true);
        setLastLocation(nextLocation);

        return false;
      }

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

  useBlocker(handleBlockedNavigation, when);

  return { promptVisible, confirmNavigation, cancelNavigation };
};
