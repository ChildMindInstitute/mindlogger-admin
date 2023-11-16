import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { getEntityKey } from 'shared/utils';
import { ActivityFormValues } from 'modules/Builder/types';

export const useCurrentActivity = () => {
  const { activityId } = useParams();

  const methods = useFormContext();

  if (!activityId) return {};

  const activities = methods?.watch?.('activities');
  const currentActivityIndex = activities?.findIndex(
    (activity: ActivityFormValues) => getEntityKey(activity) === activityId,
  );

  if (typeof currentActivityIndex !== 'number' || !~currentActivityIndex) return {};

  return {
    activity: activities[currentActivityIndex] as ActivityFormValues,
    fieldName: `activities.${currentActivityIndex}`,
    activityObjField: `activities[${currentActivityIndex}]`,
  };
};
