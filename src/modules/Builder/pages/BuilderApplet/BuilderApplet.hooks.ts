import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { Update } from 'history';
import { Activity } from 'shared/types';
import { BuilderLayers, useCallbackPrompt, usePromptSetup } from 'shared/hooks';
import { builderSessionStorage } from 'shared/utils';

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
      const isFormChanged = builderSessionStorage.getItem(BuilderLayers.AppletHasDiffs);
      const shouldSkip =
        !isFormChanged ||
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

  const { cancelNavigation: onCancel, confirmNavigation: onConfirm } = useCallbackPrompt({
    when: true,
    handleBlockedNavigation,
    lastLocation,
    setLastLocation,
    setPromptVisible,
    confirmedNavigation,
    setConfirmedNavigation,
  });

  return {
    promptVisible,
    confirmNavigation: () => {
      builderSessionStorage.setItem(BuilderLayers.AppletHasDiffs, false);
      onConfirm();
    },
    cancelNavigation: onCancel,
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
