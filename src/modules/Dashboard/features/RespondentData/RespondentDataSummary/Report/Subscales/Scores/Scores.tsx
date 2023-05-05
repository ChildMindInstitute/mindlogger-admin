import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Box } from '@mui/material';

import { StyledBodyMedium, StyledHeadline, theme } from 'shared/styles';
import { BarChart } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Charts/BarChart';

import { AdditionalInformation } from '../AdditionalInformation';
import { StyledBarChart, StyledDescription } from './Scores.styles';
import { ScoresProps } from './Scores.types';

const StringDivider = <StyledBodyMedium sx={{ m: theme.spacing(0, 0.8) }}>∙</StyledBodyMedium>;

export const Scores = ({
  reviewDate,
  finalSubscaleScore,
  frequency,
  additionalInformation,
  subscaleScores,
}: ScoresProps) => {
  const { t } = useTranslation();

  return (
    <>
      <StyledHeadline sx={{ mt: theme.spacing(6) }}>{t('subscaleScores')}</StyledHeadline>
      <StyledDescription>
        {reviewDate && (
          <>
            <StyledBodyMedium>
              {t('reviewDate')}: {format(reviewDate, 'd MMM yyyy')}
            </StyledBodyMedium>
            {StringDivider}
            <StyledBodyMedium>
              {t('time')}: {format(reviewDate, 'HH:mm:ss')}
            </StyledBodyMedium>
            {StringDivider}
          </>
        )}
        {finalSubscaleScore && (
          <>
            <StyledBodyMedium>
              {t('finalSubscaleScore')}: {finalSubscaleScore}
            </StyledBodyMedium>
            {StringDivider}
          </>
        )}
        {frequency && (
          <StyledBodyMedium>
            {t('frequency')}: {frequency}
          </StyledBodyMedium>
        )}
      </StyledDescription>
      <StyledBarChart>
        <BarChart chartData={subscaleScores} />
      </StyledBarChart>
      <Box sx={{ m: theme.spacing(6.4, 0) }}>
        <AdditionalInformation {...additionalInformation} />
      </Box>
    </>
  );
};
