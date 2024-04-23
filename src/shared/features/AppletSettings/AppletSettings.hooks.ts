import { useCallback } from 'react';
import { Update } from 'history';

import { useCallbackPrompt, usePromptSetup } from 'shared/hooks';
import { LocationState, LocationStateKeys } from 'shared/types';

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
      const shouldSkip =
        nextLocation.location.pathname === location.pathname ||
        (nextLocation.location.state as LocationState)?.[
          LocationStateKeys.ShouldNavigateWithoutPrompt
        ];
      if (!confirmedNavigation && !shouldSkip) {
        setPromptVisible(true);
        setLastLocation(nextLocation);

        return false;
      }

      setLastLocation({
        ...nextLocation,
        location: {
          ...nextLocation.location,
          state: {
            ...(nextLocation.location.state ?? {}),
            [LocationStateKeys.ShouldNavigateWithoutPrompt]: undefined,
          },
        },
      });

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
