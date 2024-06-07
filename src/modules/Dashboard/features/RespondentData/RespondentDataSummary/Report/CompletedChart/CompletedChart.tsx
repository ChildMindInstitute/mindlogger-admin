import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Tooltip } from 'shared/components/Tooltip';
import { StyledHeadline, StyledTitleTooltipIcon, theme, variables } from 'shared/styles';
import { ScatterChart } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Charts';

import { useDatavizFilters } from '../../hooks/useDatavizFilters';
import { CompletedChartProps } from './CompletedChart.types';

export const CompletedChart = ({
  completions = [],
  versions = [],
  isFlow,
  'data-testid': dataTestId,
}: CompletedChartProps) => {
  const { t } = useTranslation();
  const { minDate, maxDate, filteredVersions } = useDatavizFilters(versions);

  return (
    <Box sx={{ mb: theme.spacing(6.4) }}>
      <StyledHeadline
        sx={{ mb: theme.spacing(2), color: variables.palette.on_surface }}
        data-testid={`${dataTestId}-headline`}
      >
        {t(isFlow ? 'activityFlowCompleted' : 'activityCompleted')}
        <Tooltip
          tooltipTitle={t(isFlow ? 'respondentCompletedFlow' : 'respondentCompletedActivity')}
        >
          <span data-testid={`${dataTestId}-tooltip`}>
            <StyledTitleTooltipIcon id="more-info-outlined" width={16} height={16} />
          </span>
        </Tooltip>
      </StyledHeadline>
      <ScatterChart
        minDate={minDate}
        maxDate={maxDate}
        completions={completions}
        versions={filteredVersions}
        data-testid={`${dataTestId}-scatter-chart`}
      />
    </Box>
  );
};
