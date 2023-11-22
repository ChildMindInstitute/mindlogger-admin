import { useEffect, useState } from 'react';

import { getNextDayComparison } from 'modules/Dashboard/state/CalendarEvents/CalendarEvents.utils';

import { UseNextDayLabelProps } from './EventForm.types';

export const useNextDayLabel = ({ startTime, endTime }: UseNextDayLabelProps) => {
  const [hasNextDayLabel, setHasNextDayLabel] = useState(getNextDayComparison(startTime, endTime));

  useEffect(() => {
    setHasNextDayLabel(getNextDayComparison(startTime, endTime));
  }, [startTime, endTime]);

  return hasNextDayLabel;
};
