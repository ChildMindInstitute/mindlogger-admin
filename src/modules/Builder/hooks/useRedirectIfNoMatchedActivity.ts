import { useEffect } from 'react';
import { useParams, useNavigate, generatePath } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { page } from 'resources';
import { useCheckIfNewApplet } from 'shared/hooks';

import { useCurrentActivity } from './useCurrentActivity';

export const useRedirectIfNoMatchedActivity = () => {
  const { appletId, activityId } = useParams();
  const navigate = useNavigate();
  const { activity } = useCurrentActivity();
  const isNewApplet = useCheckIfNewApplet();
  const { getValues } = useFormContext();

  useEffect(() => {
    const activities = getValues('activities');
    const shouldRedirect = (isNewApplet || activities?.length > 0) && activityId && !activity;

    if (!shouldRedirect) return;

    navigate(generatePath(page.builderAppletActivities, { appletId }));
  }, [activityId]);
};
