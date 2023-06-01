import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { ActivityFormValues } from 'modules/Builder/types';

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
    fieldName: `activities.${currentActivityIndex}`,
  };
};
