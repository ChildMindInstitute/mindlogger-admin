import { useContext } from 'react';
import { createSearchParams, generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { StyledBodySmall, StyledFlexColumn, theme, variables } from 'shared/styles';
import { DateFormats } from 'shared/consts';
import { page } from 'resources';
import { ReportContext } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.context';
import { applet } from 'shared/state/Applet';

import { StyledIndent } from '../../Chart.styles';
import { StyledListItemButton, StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps, ScatterTooltipRowData } from './ChartTooltip.types';
import { getReviewOption } from './ChartTooltip.utils';

export const ChartTooltip = ({ data, 'data-testid': dataTestId }: ChartTooltipProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletId, respondentId } = useParams();
  const { appletMeta } = applet.useAppletData() ?? {};

  const { setCurrentActivityCompletionData } = useContext(ReportContext);

  const { id, areSubscalesVisible, reviewCount, isFlow } =
    (data?.raw as ScatterTooltipRowData) || {};
  const { mine, other } = reviewCount ?? {};

  const navigateToReviewAnswer = (isFeedbackVisible = false) => {
    if (!data) return;

    const selectedDate = format(new Date(data.parsed.x), DateFormats.YearMonthDay);
    const pathname = generatePath(page.appletRespondentDataReview, { appletId, respondentId });
    const search = createSearchParams({
      selectedDate,
      ...(isFlow ? { submitId: id } : { answerId: id }),
      isFeedbackVisible: String(isFeedbackVisible),
    }).toString();

    navigate({ pathname, search });
  };

  const showSubscaleResultHandler = () => {
    if (!id || isFlow) return;
    setCurrentActivityCompletionData({ answerId: id, date: data?.parsed.x });
  };

  return (
    <>
      {data && (
        <>
          <StyledIndent />
          <StyledTooltip data-testid={`${dataTestId}-tooltip`}>
            <StyledBodySmall
              sx={{ padding: theme.spacing(1.6, 2, 0.8) }}
              color={variables.palette.outline}
              data-testid={`${dataTestId}-tooltip-date`}
            >
              {format(data?.parsed.x, DateFormats.MonthDayTime)}
            </StyledBodySmall>

            <StyledFlexColumn>
              <StyledListItemButton
                onClick={() => navigateToReviewAnswer(false)}
                data-testid={`${dataTestId}-tooltip-view-response`}
              >
                {t('viewResponse')}
              </StyledListItemButton>
              {appletMeta?.hasAssessment && (
                <StyledListItemButton
                  onClick={() => navigateToReviewAnswer(true)}
                  data-testid={`${dataTestId}-tooltip-review-count`}
                >
                  {getReviewOption(mine, other)}
                </StyledListItemButton>
              )}
              {areSubscalesVisible && (
                <StyledListItemButton
                  onClick={showSubscaleResultHandler}
                  data-testid={`${dataTestId}-tooltip-show-subscale-result-button`}
                >
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
