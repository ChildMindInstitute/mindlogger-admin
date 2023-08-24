import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { ActivityFlowFormValues } from 'modules/Builder/types';
import { getEntityKey } from 'shared/utils';

export const useCurrentActivityFlow = () => {
  const { activityFlowId } = useParams();

  const { watch } = useFormContext() ?? {};

  if (!activityFlowId) return {};

  const activityFlows = watch?.('activityFlows');
  const flowIndex = activityFlows?.findIndex(
    (activityFlow: ActivityFlowFormValues) => getEntityKey(activityFlow) === activityFlowId,
  );

  if (!~flowIndex) return {};

  return {
    activityFlow: activityFlows[flowIndex],
  };
};
