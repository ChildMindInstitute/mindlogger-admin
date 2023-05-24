import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledHeadlineLarge, theme } from 'shared/styles';
import { useBreadcrumbs } from 'shared/hooks';

import { PerformanceTaskHeader } from '../PerformanceTaskHeader';
import { NameDescription } from '../NameDescription';
import { GeneralSettings } from './GeneralSettings';

export const Flanker = () => {
  const { t } = useTranslation();
  useBreadcrumbs();

  return (
    <>
      <PerformanceTaskHeader />
      <Box sx={{ p: theme.spacing(2.4, 6.4) }}>
        <StyledHeadlineLarge sx={{ mb: theme.spacing(3) }}>{t('flanker')}</StyledHeadlineLarge>
        <NameDescription />
        <GeneralSettings />
      </Box>
    </>
  );
};
