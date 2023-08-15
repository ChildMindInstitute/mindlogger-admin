import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { ActivityFlowFormValues } from 'modules/Builder/types';

export const useActivityFlow = () => {
  const { activityFlowId } = useParams();
  const { watch } = useFormContext();
  const activityFlows = watch('activityFlows');
  const currentActivityFlow = activityFlows?.find(
    ({ id, key }: ActivityFlowFormValues) => id === activityFlowId || key === activityFlowId,
  );

  return currentActivityFlow;
};
