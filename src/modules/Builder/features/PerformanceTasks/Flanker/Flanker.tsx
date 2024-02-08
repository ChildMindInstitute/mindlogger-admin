import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { RoundTypeEnum } from 'modules/Builder/types';
import { StyledHeadlineLarge, theme } from 'shared/styles';

import { NameDescription } from '../NameDescription';
import { PerformanceTaskHeader } from '../PerformanceTaskHeader';
import { StyledPerformanceTaskBody } from '../PerformanceTasks.styles';
import { GeneralSettings } from './GeneralSettings';
import { RoundSettings } from './RoundSettings';

export const Flanker = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ overflowY: 'auto' }}>
      <StyledPerformanceTaskBody sx={{ p: theme.spacing(2.4, 6.4) }}>
        <StyledHeadlineLarge sx={{ mb: theme.spacing(3) }}>{t('flanker')}</StyledHeadlineLarge>
        <NameDescription />
        <GeneralSettings />
        <RoundSettings uiType={RoundTypeEnum.Practice} />
        <RoundSettings uiType={RoundTypeEnum.Test} />
      </StyledPerformanceTaskBody>
    </Box>
  );
};
