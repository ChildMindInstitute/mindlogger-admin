import { useEffect } from 'react';
import { useParams, useNavigate, generatePath } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { page } from 'resources';
import { useCheckIfNewApplet } from 'shared/hooks';
import { getEntityKey } from 'shared/utils';

import { ActivityFlowFormValues } from '../types';

export const useRedirectIfNoMatchedActivityFlow = () => {
  const { appletId, activityFlowId } = useParams();
  const navigate = useNavigate();
  const isNewApplet = useCheckIfNewApplet();
  const { getValues } = useFormContext();

  useEffect(() => {
    const activities = getValues('activities');
    const activityFlows = getValues('activityFlows');
    const activityFlow = activityFlows?.find(
      (flow: ActivityFlowFormValues) => activityFlowId === getEntityKey(flow),
    );
    const shouldRedirect =
      (isNewApplet || activities?.length > 0) && activityFlowId && !activityFlow;

    if (!shouldRedirect) return;

    navigate(generatePath(page.builderAppletActivityFlow, { appletId }));
  }, [activityFlowId]);
};