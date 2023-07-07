import { useEffect } from 'react';
import { useParams, useNavigate, generatePath } from 'react-router-dom';

import { page } from 'resources';

import { useCurrentActivity } from './useCurrentActivity';

export const useActivitiesRedirection = () => {
  const { appletId } = useParams();
  const { activity } = useCurrentActivity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activity) navigate(generatePath(page.builderAppletActivities, { appletId }));
  }, [activity]);
};
