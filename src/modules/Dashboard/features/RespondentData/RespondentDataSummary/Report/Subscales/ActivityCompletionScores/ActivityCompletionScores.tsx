import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Box } from '@mui/material';

import { DateFormats } from 'shared/consts';
import {
  StyledBodyMedium,
  StyledFlexSpaceBetween,
  StyledHeadline,
  theme,
  variables,
} from 'shared/styles';
import { BarChart } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Charts';
import { StyledTextBtn } from 'modules/Dashboard/features/RespondentData/RespondentData.styles';
import { Svg } from 'shared/components/Svg';

import { AdditionalInformation } from '../AdditionalInformation';
import { StyledDescription } from './ActivityCompletionScores.styles';
import { ScoresProps } from './ActivityCompletionScores.types';
import { ReportContext } from '../../Report.context';
import { dataTestid } from './ActivityCompletionScores.const';

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
    <StyledDescription data-testid={`${dataTestid}-header`}>
      {reviewDate && (
        <>
          <StyledBodyMedium data-testid={`${dataTestid}-review-date`}>
            {t('reviewDate')}: {format(reviewDate, DateFormats.DayMonthYear)}
          </StyledBodyMedium>
          {StringDivider}
          <StyledBodyMedium data-testid={`${dataTestid}-review-time`}>
            {t('time')}: {format(reviewDate, DateFormats.TimeSeconds)}
          </StyledBodyMedium>
          {StringDivider}
        </>
      )}
      {finalSubscaleScore && (
        <>
          <StyledBodyMedium data-testid={`${dataTestid}-final-subscale-score`}>
            {t('finalSubscaleScore')}: {finalSubscaleScore}
          </StyledBodyMedium>
          {StringDivider}
        </>
      )}
      {frequency && (
        <StyledBodyMedium data-testid={`${dataTestid}-subscale-frequency`}>
          {t('frequency')}: {frequency}
        </StyledBodyMedium>
      )}
    </StyledDescription>
  );

  return (
    <Box data-testid={dataTestid}>
      <StyledFlexSpaceBetween sx={{ mt: theme.spacing(6) }}>
        <StyledHeadline color={variables.palette.on_surface}>{t('subscaleScores')}</StyledHeadline>
        {showAllSubscaleResultsVisible && (
          <StyledTextBtn
            onClick={() => setCurrentActivityCompletionData(null)}
            variant="text"
            startIcon={<Svg id="reset" width="18" height="18" />}
            data-testid="show-all-subscale-results"
          >
            {t('showAllSubscaleResults')}
          </StyledTextBtn>
        )}
      </StyledFlexSpaceBetween>
      {renderChartDescription()}
      <BarChart chartData={subscaleScores} />
      {optionText && (
        <Box sx={{ m: theme.spacing(6.4, 0) }}>
          <AdditionalInformation optionText={optionText} />
        </Box>
      )}
    </Box>
  );
};
