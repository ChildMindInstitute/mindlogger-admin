import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { Tooltip } from 'shared/components/Tooltip';
import { StyledHeadline, StyledTitleTooltipIcon, theme, variables } from 'shared/styles';
import { ScatterChart } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Charts';
import { useDatavizFilters } from 'modules/Dashboard/hooks';
import { SummaryFiltersForm } from 'modules/Dashboard/pages/RespondentData/RespondentData.types';

import { ActivityCompletedProps } from './ActivityCompleted.types';

export const ActivityCompleted = ({ answers = [], versions = [] }: ActivityCompletedProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<SummaryFiltersForm>();

  const { minDate, maxDate, filteredVersions } = useDatavizFilters(watch, versions);

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
      <ScatterChart minDate={minDate} maxDate={maxDate} answers={answers} versions={filteredVersions} />
    </Box>
  );
};
