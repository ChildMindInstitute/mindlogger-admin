import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledBodyMedium, StyledFlexTopStart, StyledHeadline, theme } from 'shared/styles';

import { LineChart } from '../../Charts';
import { AllScoresProps } from './AllScores.types';
import { StyledChartContainer } from './AllScores.styles';

const StringDivider = <StyledBodyMedium sx={{ m: theme.spacing(0, 0.8) }}>∙</StyledBodyMedium>;

export const AllScores = ({ data, latestFinalScore, frequency, versions }: AllScoresProps) => {
  const { t } = useTranslation('app');

  if (!data.subscales.length) return null;

  return (
    <Box sx={{ mb: theme.spacing(2.4) }}>
      <StyledHeadline sx={{ mb: theme.spacing(0.8) }}>{t('subscaleScores')}</StyledHeadline>
      <StyledFlexTopStart>
        {latestFinalScore && (
          <>
            <StyledBodyMedium>
              {t('latestFinalSubscaleScore')}: {latestFinalScore}
            </StyledBodyMedium>
            {StringDivider}
          </>
        )}
        {frequency && (
          <StyledBodyMedium>
            {t('frequency')}: {frequency}
          </StyledBodyMedium>
        )}
      </StyledFlexTopStart>
      <StyledChartContainer>
        <LineChart data={data} versions={versions} />
      </StyledChartContainer>
    </Box>
  );
};
