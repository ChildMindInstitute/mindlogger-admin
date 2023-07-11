import { useEffect } from 'react';
import { useParams, useNavigate, generatePath } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import debounce from 'lodash.debounce';

import { page } from 'resources';
import { applet } from 'shared/state';

import { getActivityFlowIndex } from '../features/ActivityFlowBuilder/ActivityFlowBuilder.utils';

export const useActivityFlowsRedirection = () => {
  const { appletId, activityFlowId } = useParams();
  const navigate = useNavigate();
  const { watch } = useFormContext();

  const loadingStatus = applet.useResponseStatus() ?? {};
  const activityFlows = watch('activityFlows');
  const activityFlowIndex = getActivityFlowIndex(activityFlows, activityFlowId || '');

  useEffect(() => {
    if (loadingStatus !== 'loading' && activityFlowIndex === -1) {
      debounce(() => navigate(generatePath(page.builderAppletActivityFlow, { appletId })));
    }
  }, [activityFlowIndex, loadingStatus]);
};
