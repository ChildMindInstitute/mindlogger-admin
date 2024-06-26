import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { isAfter, isBefore } from 'date-fns';

import { Version } from 'api';
import { getDateTime } from 'shared/utils/getDateTime';

export const useDatavizFilters = (versions: Version[]) => {
  const [startDate, endDate, startTime, endTime]: [Date, Date, string, string] = useWatch({
    name: ['startDate', 'endDate', 'startTime', 'endTime'],
  });

  const { minDate, maxDate, filteredVersions } = useMemo(() => {
    const minDate = getDateTime(startDate, startTime);
    const maxDate = getDateTime(endDate, endTime);
    const filteredVersions = versions.filter(
      (version) =>
        isBefore(new Date(version.createdAt), maxDate) &&
        isAfter(new Date(version.createdAt), minDate),
    );

    return { minDate, maxDate, filteredVersions };
  }, [startDate, endDate, startTime, endTime, versions]);

  return { minDate, maxDate, filteredVersions };
};
