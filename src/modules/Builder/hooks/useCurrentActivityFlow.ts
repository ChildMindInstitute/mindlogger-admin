import { useParams } from 'react-router-dom';

import { ActivityFlowFormValues } from 'modules/Builder/types';
import { getEntityKey } from 'shared/utils';

import { useCustomFormContext } from './useCustomFormContext';

export const useCurrentActivityFlow = () => {
  const { activityFlowId } = useParams();

  const { watch } = useCustomFormContext() ?? {};

  if (!activityFlowId) return {};

  const activityFlows = watch?.('activityFlows');
  const flowIndex = activityFlows?.findIndex(
    (activityFlow: ActivityFlowFormValues) => getEntityKey(activityFlow) === activityFlowId,
  );

  if (typeof flowIndex !== 'number' || !~flowIndex) return {};

  return {
    activityFlow: activityFlows[flowIndex],
    fieldName: `activityFlows.${flowIndex}`,
  };
};
