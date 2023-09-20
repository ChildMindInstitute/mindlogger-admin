import { useEffect } from 'react';
import { useParams, useNavigate, generatePath } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { page } from 'resources';
import { useCheckIfNewApplet } from 'shared/hooks';
import { getEntityKey } from 'shared/utils';

import { ActivityFlowFormValues } from '../types';

export const useActivityFlowsRedirection = () => {
  const { appletId, activityFlowId } = useParams();
  const navigate = useNavigate();
  const isNewApplet = useCheckIfNewApplet();
  const { watch } = useFormContext();

  useEffect(() => {
    const activities = watch('activities');
    const activityFlows = watch('activityFlows');
    const activityFlow = activityFlows?.find(
      (flow: ActivityFlowFormValues) => activityFlowId === getEntityKey(flow),
    );
    const shouldRedirect =
      (isNewApplet || activities?.length > 0) && activityFlowId && !activityFlow;

    if (!shouldRedirect) return;

    navigate(generatePath(page.builderAppletActivityFlow, { appletId }));
  }, [activityFlowId]);
};
