import { useEffect } from 'react';
import { useParams, useNavigate, generatePath } from 'react-router-dom';
import debounce from 'lodash.debounce';

import { page } from 'resources';
import { applet } from 'shared/state';

import { useCurrentActivity } from './useCurrentActivity';

export const useActivitiesRedirection = () => {
  const { appletId } = useParams();
  const { activity } = useCurrentActivity();
  const navigate = useNavigate();

  const loadingStatus = applet.useResponseStatus() ?? {};

  useEffect(() => {
    if (loadingStatus !== 'loading' && !activity) {
      debounce(() => navigate(generatePath(page.builderAppletActivities, { appletId })));
    }
  }, [activity, loadingStatus]);
};
