import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { getEntityKey } from 'shared/utils';
import { ActivityFormValues, ActivityPath } from 'modules/Builder/types';

export const useCurrentActivity = () => {
  const { activityId } = useParams();

  const methods = useFormContext();

  if (!activityId) return {};

  const activities = methods?.watch?.('activities');
  const currentActivityIndex = activities?.findIndex(
    (activity: ActivityFormValues) => getEntityKey(activity) === activityId,
  );

  if (!~currentActivityIndex) return {};

  return {
    activity: activities[currentActivityIndex],
    fieldName: `activities.${currentActivityIndex}` as ActivityPath,
    activityObjField: `activities[${currentActivityIndex}]`,
  };
};
