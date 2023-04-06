import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Activity } from 'redux/modules';
import { Svg, Tooltip } from 'shared/components';
import { StyledFlexTopStart, StyledHeadlineLarge, theme } from 'shared/styles';

import { ReportFilters } from './ReportFilters';
import { StyledReport } from './Report.styles';
import { StyledTextBtn } from '../../RespondentData.styles';

export const Report = ({ activity }: { activity: Activity }) => {
  const { t } = useTranslation();

  return (
    <StyledReport>
      <StyledFlexTopStart sx={{ justifyContent: 'space-between' }}>
        <StyledHeadlineLarge>{activity.name}</StyledHeadlineLarge>
        <Tooltip tooltipTitle={t('configureServer')}>
          <span>
            <StyledTextBtn variant="text" startIcon={<Svg id="export" width="18" height="18" />}>
              {t('downloadLatestReport')}
            </StyledTextBtn>
          </span>
        </Tooltip>
      </StyledFlexTopStart>
      <Box sx={{ margin: theme.spacing(7.2, 0, 4.8) }}>
        <ReportFilters />
      </Box>
    </StyledReport>
  );
};
