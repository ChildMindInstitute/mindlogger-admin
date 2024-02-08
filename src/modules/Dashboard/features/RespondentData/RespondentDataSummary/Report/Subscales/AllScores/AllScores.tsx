import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledBodyMedium, StyledFlexTopStart, StyledHeadline, theme, variables } from 'shared/styles';

import { SubscaleLineChart } from '../../Charts/LineChart';
import { AllScoresProps } from './AllScores.types';

const StringDivider = <StyledBodyMedium sx={{ m: theme.spacing(0, 0.8) }}>∙</StyledBodyMedium>;

export const AllScores = ({ data, latestFinalScore, frequency, versions }: AllScoresProps) => {
  const { t } = useTranslation('app');

  if (!data.subscales.length) return null;

  return (
    <Box sx={{ mb: theme.spacing(2.4) }} data-testid="all-scores">
      <StyledHeadline sx={{ mb: theme.spacing(0.8), color: variables.palette.on_surface }}>
        {t('subscaleScores')}
      </StyledHeadline>
      <StyledFlexTopStart>
        {latestFinalScore && (
          <>
            <StyledBodyMedium data-testid="latest-final-subscale-score">
              {t('latestFinalSubscaleScore')}: {latestFinalScore}
            </StyledBodyMedium>
            {StringDivider}
          </>
        )}
        {frequency && (
          <StyledBodyMedium data-testid="frequency">
            {t('frequency')}: {frequency}
          </StyledBodyMedium>
        )}
      </StyledFlexTopStart>
      <SubscaleLineChart data={data} versions={versions} />
    </Box>
  );
};
