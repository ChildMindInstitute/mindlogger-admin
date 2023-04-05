import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { Update } from 'history';
import { builderSessionStorage } from 'shared/utils';
import { useCallbackPrompt, usePromptSetup } from 'shared/hooks';

import { ActivityFormValues } from './BuilderApplet.types';
import { isAppletRoute } from './BuilderApplet.utils';

export const usePrompt = (isFormChanged: boolean) => {
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
      const nextPathname = nextLocation.location.pathname;

      const shouldSkip = !isFormChanged || isAppletRoute(nextPathname);

      if (!confirmedNavigation && !shouldSkip) {
        setPromptVisible(true);
        setLastLocation(nextLocation);

        return false;
      }

      builderSessionStorage.removeItem();

      setLastLocation(nextLocation);
      setConfirmedNavigation(true);

      return true;
    },
    [confirmedNavigation, location, isFormChanged],
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
      builderSessionStorage.removeItem();
      onConfirm();
    },
    cancelNavigation: onCancel,
  };
};

export const useCurrentActivity = () => {
  const { activityId } = useParams();

  const { watch } = useFormContext();

  const activities = watch('activities');
  const currentActivityIndex = activities?.findIndex(
    ({ id, key }: ActivityFormValues) => activityId === key || activityId === id,
  );

  if (!~currentActivityIndex) return {};

  return {
    activity: activities[currentActivityIndex],
    name: `activities[${currentActivityIndex}]`,
  };
};
