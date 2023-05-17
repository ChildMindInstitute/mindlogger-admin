import { useRef } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Activity } from 'redux/modules';
import { Svg, Tooltip } from 'shared/components';
import { useHeaderSticky } from 'shared/hooks';
import { StyledHeadlineLarge, StyledHeadline, StyledTitleTooltipIcon, theme } from 'shared/styles';

import { StyledTextBtn } from '../../RespondentData.styles';
import { ScatterChart } from '../Charts/ScatterChart';
import { MultiScatterChart } from '../Charts/MultiScatterChart';
import { ReportFilters } from './ReportFilters';
import { StyledChartContainer, StyledHeader, StyledReport } from './Report.styles';
import { Subscales } from './Subscales';

export const Report = ({ activity }: { activity: Activity }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);

  return (
    <StyledReport ref={containerRef}>
      <StyledHeader isSticky={isHeaderSticky}>
        <StyledHeadlineLarge>{activity.name}</StyledHeadlineLarge>
        <Tooltip tooltipTitle={t('configureServer')}>
          <span>
            <StyledTextBtn variant="text" startIcon={<Svg id="export" width="18" height="18" />}>
              {t('downloadLatestReport')}
            </StyledTextBtn>
          </span>
        </Tooltip>
      </StyledHeader>
      <Box sx={{ margin: theme.spacing(4.8, 6.4, 4.8) }}>
        <ReportFilters />
        <StyledHeadline sx={{ mb: theme.spacing(2) }}>
          {t('activityCompleted')}
          <Tooltip tooltipTitle={t('theRespondentCompletedTheActivity')}>
            <span>
              <StyledTitleTooltipIcon id="more-info-outlined" width={16} height={16} />
            </span>
          </Tooltip>
        </StyledHeadline>
        <ScatterChart />
        <StyledChartContainer>
          <MultiScatterChart />
        </StyledChartContainer>
        <Subscales />
      </Box>
    </StyledReport>
  );
};
