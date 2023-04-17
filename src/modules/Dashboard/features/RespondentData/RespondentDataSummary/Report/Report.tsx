import { useRef } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Activity } from 'redux/modules';
import { Svg, Tooltip } from 'shared/components';
import { useHeaderSticky } from 'shared/hooks';
import { StyledHeadlineLarge, theme } from 'shared/styles';

import { ReportFilters } from './ReportFilters';
import { StyledHeader, StyledReport } from './Report.styles';
import { StyledTextBtn } from '../../RespondentData.styles';
import { ReportTable } from './ReportTable';

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
        <ReportTable />
      </Box>
    </StyledReport>
  );
};
