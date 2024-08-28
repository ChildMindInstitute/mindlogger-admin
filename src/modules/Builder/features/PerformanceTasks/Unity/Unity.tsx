import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledHeadlineLarge, StyledTitleLarge, theme } from 'shared/styles';

import { NameDescription } from '../NameDescription';
import { StyledPerformanceTaskBody } from '../PerformanceTasks.styles';

export const Unity = () => {
  const { t } = useTranslation();

  const dataTestid = 'builder-activity-unity';

  return (
    <Box sx={{ overflowY: 'auto' }}>
      <StyledPerformanceTaskBody sx={{ p: theme.spacing(2.4, 6.4) }}>
        <StyledHeadlineLarge sx={{ mb: theme.spacing(3) }}>{'Unity file '}</StyledHeadlineLarge>
        <NameDescription />
        <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>{t('instructions')}</StyledTitleLarge>
      </StyledPerformanceTaskBody>
    </Box>
  );
};
