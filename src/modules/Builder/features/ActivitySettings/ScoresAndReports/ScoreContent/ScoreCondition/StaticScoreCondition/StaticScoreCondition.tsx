import { Box, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledFlexTopStart, StyledTitleSmall, theme } from 'shared/styles';

export const StaticScoreCondition = () => {
  const { t } = useTranslation('app');

  return (
    <>
      <StyledFlexTopStart sx={{ mt: theme.spacing(1.6) }}>
        <Box sx={{ mr: theme.spacing(2.4), width: '70%' }}>
          <Skeleton variant="rounded" height={60} sx={{ mb: theme.spacing(4.8) }} />
        </Box>
        <Box sx={{ ml: theme.spacing(2.4), width: '30%' }}>
          <StyledTitleSmall sx={{ mb: theme.spacing(0.2) }}>
            {t('scoreConditionId')}
          </StyledTitleSmall>
          <Skeleton variant="text" height={60} sx={{ mb: theme.spacing(2.4) }} />
        </Box>
      </StyledFlexTopStart>
      <Skeleton variant="rounded" height={40} sx={{ width: '70%' }} />
      <Skeleton variant="text" height={40} width={120} sx={{ mt: theme.spacing(0.6) }} />
      <Skeleton variant="rounded" height={40} width={240} sx={{ my: theme.spacing(2.2) }} />
      <Skeleton variant="text" height={40} width={120} />
      <Skeleton variant="rounded" height={30} width={180} />
      <Skeleton variant="rounded" height={300} sx={{ mt: theme.spacing(1.2) }} />
      <Skeleton variant="text" height={60} width={180} sx={{ mt: theme.spacing(2.4) }} />
    </>
  );
};
