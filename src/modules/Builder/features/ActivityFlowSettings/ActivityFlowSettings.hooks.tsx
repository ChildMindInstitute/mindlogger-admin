import { useParams } from 'react-router-dom';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { ActivityFlowFormValues } from 'modules/Builder/types';

export const useActivityFlow = () => {
  const { activityFlowId } = useParams();
  const { watch } = useCustomFormContext();
  const activityFlows = watch('activityFlows');
  const currentActivityFlow = activityFlows?.find(
    ({ id, key }: ActivityFlowFormValues) => id === activityFlowId || key === activityFlowId,
  );

  return currentActivityFlow;
};
