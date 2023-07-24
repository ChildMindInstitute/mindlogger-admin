import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Box } from '@mui/material';

import { DateFormats } from 'shared/consts';
import { StyledBodyMedium, StyledFlexSpaceBetween, StyledHeadline, theme } from 'shared/styles';
import { BarChart } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Charts';
import { StyledTextBtn } from 'modules/Dashboard/features/RespondentData/RespondentData.styles';
import { Svg } from 'shared/components';

import { AdditionalInformation } from '../AdditionalInformation';
import { StyledChartContainer, StyledDescription } from './ActivityCompletionScores.styles';
import { ScoresProps } from './ActivityCompletionScores.types';
import { ReportContext } from '../../context';

const StringDivider = <StyledBodyMedium sx={{ m: theme.spacing(0, 0.8) }}>∙</StyledBodyMedium>;

export const ActivityCompletionScores = ({
  reviewDate,
  finalSubscaleScore,
  frequency,
  optionText,
  subscaleScores,
  showAllSubscaleResultsVisible,
}: ScoresProps) => {
  const { t } = useTranslation('app');
  const { setCurrentActivityCompletionData } = useContext(ReportContext);

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
      <StyledFlexSpaceBetween sx={{ mt: theme.spacing(6) }}>
        <StyledHeadline>{t('subscaleScores')}</StyledHeadline>
        {showAllSubscaleResultsVisible && (
          <StyledTextBtn
            onClick={() => setCurrentActivityCompletionData(null)}
            variant="text"
            startIcon={<Svg id="reset" width="18" height="18" />}
          >
            {t('showAllSubscaleResults')}
          </StyledTextBtn>
        )}
      </StyledFlexSpaceBetween>
      {renderChartDescription()}
      <StyledChartContainer>
        <BarChart chartData={subscaleScores} />
      </StyledChartContainer>
      {optionText && (
        <Box sx={{ m: theme.spacing(6.4, 0) }}>
          <AdditionalInformation optionText={optionText} />
        </Box>
      )}
    </>
  );
};
