import { forwardRef, useContext } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { StyledBodySmall, StyledFlexColumn, theme, variables } from 'shared/styles';
import { DateFormats } from 'shared/consts';
import { page } from 'resources';
import { ReportContext } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/context';

import { StyledListItemButton, StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps, ScatterTooltipRowData } from './ChartTooltip.types';

export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ data, onMouseEnter, onMouseLeave }, tooltipRef) => {
    const { t } = useTranslation('app');
    const navigate = useNavigate();
    const { appletId, respondentId } = useParams();

    const { setCurrentActivityCompletionData } = useContext(ReportContext);

    const { answerId } = (data?.raw as ScatterTooltipRowData) || {};

    const navigateToReviewAnswer = () => {
      if (!data) return;

      navigate(
        generatePath(page.appletRespondentDataReviewAnswer, { appletId, respondentId, answerId }),
      );
    };

    const showSubscaleResultHandler = () => {
      answerId && setCurrentActivityCompletionData({ answerId, date: data?.parsed.x });
    };

    return (
      <StyledTooltip ref={tooltipRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {data && (
          <StyledBodySmall
            sx={{ padding: theme.spacing(1.6, 2, 0.8) }}
            color={variables.palette.outline}
          >
            {format(data?.parsed.x, DateFormats.MonthDayTime)}
          </StyledBodySmall>
        )}
        <StyledFlexColumn>
          <StyledListItemButton onClick={navigateToReviewAnswer}>
            {t('review')}
          </StyledListItemButton>
          <StyledListItemButton onClick={showSubscaleResultHandler}>
            {t('showSubscaleResult')}
          </StyledListItemButton>
        </StyledFlexColumn>
      </StyledTooltip>
    );
  },
);
