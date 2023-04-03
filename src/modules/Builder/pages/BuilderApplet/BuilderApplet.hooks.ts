import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { Update } from 'history';
import { useCallbackPrompt, usePromptSetup } from 'shared/hooks';
import { Activity } from 'shared/types';

import { isActivityRoute, isAppletRoute } from './BuilderApplet.utils';

export const usePrompt = () => {
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

  return {
    promptVisible,
    ...useCallbackPrompt({
      when: true,
      handleBlockedNavigation,
      lastLocation,
      setLastLocation,
      setPromptVisible,
      confirmedNavigation,
      setConfirmedNavigation,
    }),
  };
};

export const useCurrentActivity = () => {
  const { activityId } = useParams();

  const { getValues } = useFormContext();

  const activities = getValues('activities');
  const currentActivityIndex = activities?.findIndex(
    ({ id, key }: Activity) => activityId === key || activityId === id,
  );

  if (!~currentActivityIndex) return {};

  return {
    activity: activities[currentActivityIndex],
    name: `activities[${currentActivityIndex}]`,
  };
};
