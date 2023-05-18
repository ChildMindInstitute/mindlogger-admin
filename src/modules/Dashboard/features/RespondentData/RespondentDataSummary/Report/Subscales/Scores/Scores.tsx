import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Box } from '@mui/material';

import { DateFormats } from 'shared/consts';
import { StyledBodyMedium, StyledHeadline, theme } from 'shared/styles';
import { BarChart } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Charts';

import { AdditionalInformation } from '../AdditionalInformation';
import { StyledChartContainer, StyledDescription } from './Scores.styles';
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

  const renderChartDescription = () => (
    <StyledDescription>
      {reviewDate && (
        <>
          <StyledBodyMedium>
            {t('reviewDate')}: {format(reviewDate, DateFormats.DayMonthYear)}
          </StyledBodyMedium>
          {StringDivider}
          <StyledBodyMedium>
            {t('time')}: {format(reviewDate, DateFormats.TimeSeconds)}
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
  );

  return (
    <>
      <StyledHeadline sx={{ mt: theme.spacing(6) }}>{t('subscaleScores')}</StyledHeadline>
      {renderChartDescription()}
      <StyledChartContainer>
        <BarChart chartData={subscaleScores} />
      </StyledChartContainer>
      <Box sx={{ m: theme.spacing(6.4, 0) }}>
        <AdditionalInformation {...additionalInformation} />
      </Box>
    </>
  );
};
