import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { Tooltip } from 'shared/components';
import { StyledHeadline, StyledTitleTooltipIcon, theme, variables } from 'shared/styles';
import { ScatterChart } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Charts';

import { ActivityCompletedProps } from './ActivityCompleted.types';
import { FilterFormValues } from '../Report.types';
import { getDateTime } from '../Report.utils';

export const ActivityCompleted = ({ answers = [], versions = [] }: ActivityCompletedProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<FilterFormValues>();

  const {
    startDateEndDate: [startDate, endDate],
    startTime,
    endTime,
  } = watch();

  const { minDate, maxDate } = useMemo(
    () => ({
      minDate: getDateTime(startDate, startTime),
      maxDate: getDateTime(endDate, endTime),
    }),
    [startDate, endDate, startTime, endTime],
  );

  return (
    <Box sx={{ mb: theme.spacing(6.4) }}>
      <StyledHeadline sx={{ mb: theme.spacing(2), color: variables.palette.on_surface }}>
        {t('activityCompleted')}
        <Tooltip tooltipTitle={t('theRespondentCompletedTheActivity')}>
          <span>
            <StyledTitleTooltipIcon id="more-info-outlined" width={16} height={16} />
          </span>
        </Tooltip>
      </StyledHeadline>
      <ScatterChart minDate={minDate} maxDate={maxDate} answers={answers} versions={versions} />
    </Box>
  );
};
