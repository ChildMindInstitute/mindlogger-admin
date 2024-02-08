import { useContext } from 'react';
import { createSearchParams, generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { StyledBodySmall, StyledFlexColumn, theme, variables } from 'shared/styles';
import { DateFormats } from 'shared/consts';
import { page } from 'resources';
import { ReportContext } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.context';

import { StyledIndent } from '../../Chart.styles';
import { StyledListItemButton, StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps, ScatterTooltipRowData } from './ChartTooltip.types';

export const ChartTooltip = ({ data, 'data-testid': dataTestid }: ChartTooltipProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletId, respondentId } = useParams();

  const { setCurrentActivityCompletionData } = useContext(ReportContext);

  const { answerId, areSubscalesVisible } = (data?.raw as ScatterTooltipRowData) || {};

  const navigateToReviewAnswer = () => {
    if (!data) return;

    const selectedDate = format(new Date(data?.parsed.x), DateFormats.YearMonthDay);
    const pathname = generatePath(page.appletRespondentDataReview, { appletId, respondentId });
    navigate({
      pathname,
      search: createSearchParams({
        selectedDate,
        answerId,
      }).toString(),
    });
  };

  const showSubscaleResultHandler = () => {
    answerId && setCurrentActivityCompletionData({ answerId, date: data?.parsed.x });
  };

  return (
    <>
      {data && (
        <>
          <StyledIndent />
          <StyledTooltip data-testid={`${dataTestid}-tooltip`}>
            <StyledBodySmall
              sx={{ padding: theme.spacing(1.6, 2, 0.8) }}
              color={variables.palette.outline}
              data-testid={`${dataTestid}-tooltip-date`}>
              {format(data?.parsed.x, DateFormats.MonthDayTime)}
            </StyledBodySmall>

            <StyledFlexColumn>
              <StyledListItemButton
                onClick={navigateToReviewAnswer}
                data-testid={`${dataTestid}-tooltip-review-button`}>
                {t('review')}
              </StyledListItemButton>
              {areSubscalesVisible && (
                <StyledListItemButton
                  onClick={showSubscaleResultHandler}
                  data-testid={`${dataTestid}-tooltip-show-subscale-result-button`}>
                  {t('showSubscaleResult')}
                </StyledListItemButton>
              )}
            </StyledFlexColumn>
          </StyledTooltip>
        </>
      )}
    </>
  );
};
