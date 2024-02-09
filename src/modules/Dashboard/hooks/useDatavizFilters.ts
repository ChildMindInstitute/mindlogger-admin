import { useMemo } from 'react';

import { isAfter, isBefore } from 'date-fns';
import { UseFormWatch } from 'react-hook-form';

import { Version } from 'api';
import { SummaryFiltersForm } from 'modules/Dashboard/pages/RespondentData/RespondentData.types';
import { getDateTime } from 'shared/utils';

export const useDatavizFilters = (watch: UseFormWatch<SummaryFiltersForm>, versions: Version[]) => {
  const { startDate, endDate, startTime, endTime } = watch();

  const { minDate, maxDate, filteredVersions } = useMemo(() => {
    const minDate = getDateTime(startDate, startTime);
    const maxDate = getDateTime(endDate, endTime);
    const filteredVersions = versions.filter(
      (version) => isBefore(new Date(version.createdAt), maxDate) && isAfter(new Date(version.createdAt), minDate),
    );

    return { minDate, maxDate, filteredVersions };
  }, [startDate, endDate, startTime, endTime]);

  return { minDate, maxDate, filteredVersions };
};
