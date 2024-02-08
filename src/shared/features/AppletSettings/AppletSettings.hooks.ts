import { useCallback } from 'react';

import { Update } from 'history';

import { useCallbackPrompt, usePromptSetup } from 'shared/hooks';

export const usePrompt = (when: boolean) => {
  const {
    location,
    promptVisible,
    setPromptVisible,
    lastLocation,
    setLastLocation,
    confirmedNavigation,
    setConfirmedNavigation,
  } = usePromptSetup();

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

  return {
    promptVisible,
    ...useCallbackPrompt({
      when,
      handleBlockedNavigation,
      lastLocation,
      setLastLocation,
      setPromptVisible,
      confirmedNavigation,
      setConfirmedNavigation,
    }),
  };
};
