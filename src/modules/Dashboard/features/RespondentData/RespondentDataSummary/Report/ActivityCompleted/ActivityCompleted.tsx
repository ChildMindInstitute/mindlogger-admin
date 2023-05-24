import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { Tooltip } from 'shared/components';
import { StyledHeadline, StyledTitleTooltipIcon, theme, variables } from 'shared/styles';
import { ScatterChart } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Charts';

import { ActivityCompletedProps } from './ActivityCompleted.types';
import { FilterFormValues } from '../Report.types';

export const ActivityCompleted = ({ responses, versions }: ActivityCompletedProps) => {
  const { t } = useTranslation();
  const { getValues } = useFormContext<FilterFormValues>();

  const [minDate, maxDate] = getValues().startDateEndDate;

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
      <ScatterChart
        minDate={minDate || new Date()}
        maxDate={maxDate || new Date()}
        responses={responses}
        versions={versions}
      />
    </Box>
  );
};
