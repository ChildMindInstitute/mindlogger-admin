import { useContext } from 'react';

import { ScheduleProviderContext } from './ScheduleProvider';

export function useSchedule() {
  const contextValues = useContext(ScheduleProviderContext);

  return {
    ...contextValues,
    canCreateIndividualSchedule: !!contextValues.userId,
  };
}
