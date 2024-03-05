import { Box, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledFlexTopStart, StyledTitleMedium, StyledTitleSmall, theme } from 'shared/styles';
import { ScoreConditionalLogic } from 'redux/modules';

import { StaticScoreConditionals } from '../ScoreCondition/StaticScoreConditionals/StaticScoreConditionals';

export const StaticScoreContent = ({
  scoreConditionals,
}: {
  scoreConditionals: ScoreConditionalLogic[];
}) => {
  const { t } = useTranslation('app');

  return (
    <>
      <StyledFlexTopStart sx={{ mt: theme.spacing(1.6) }}>
        <Box sx={{ mr: theme.spacing(2.4), width: '50%' }}>
          <Skeleton variant="rounded" height={60} sx={{ mb: theme.spacing(4.8) }} />
          <Skeleton variant="rounded" height={60} sx={{ mb: theme.spacing(4.8) }} />
        </Box>
        <Box sx={{ ml: theme.spacing(2.4), width: '50%' }}>
          <StyledTitleSmall sx={{ mb: theme.spacing(0.2) }}>{t('scoreId')}</StyledTitleSmall>
          <Skeleton variant="text" height={60} sx={{ mb: theme.spacing(2.4) }} />
          <StyledTitleSmall sx={{ mb: theme.spacing(0.2) }}>{t('rangeOfScores')}</StyledTitleSmall>
          <Skeleton variant="text" height={60} sx={{ mb: theme.spacing(2.4) }} />
        </Box>
      </StyledFlexTopStart>
      <StyledTitleMedium sx={{ mb: theme.spacing(1.2) }}>{t('scoreItems')}</StyledTitleMedium>
      <Skeleton variant="rounded" height={60} sx={{ mb: theme.spacing(1.2), width: '40%' }} />
      <Skeleton variant="rounded" height={300} />
      <Skeleton variant="text" height={60} width={180} sx={{ mt: theme.spacing(2.4) }} />
      <Skeleton variant="rounded" height={300} />
      <Skeleton variant="text" height={60} width={180} sx={{ mt: theme.spacing(2.4) }} />
      <StaticScoreConditionals scoreConditionals={scoreConditionals} />
    </>
  );
};
