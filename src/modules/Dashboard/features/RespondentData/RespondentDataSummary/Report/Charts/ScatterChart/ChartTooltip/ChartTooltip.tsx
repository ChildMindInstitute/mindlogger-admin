import { forwardRef } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { StyledBodySmall, StyledFlexColumn, theme, variables } from 'shared/styles';
import { DateFormats } from 'shared/consts';
import { getDateInUserTimezone } from 'shared/utils';
import { page } from 'resources';

import { StyledListItemButton, StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps, ScatterTooltipRowData } from './ChartTooltip.types';

export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ data, onMouseEnter, onMouseLeave }, tooltipRef) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { appletId, respondentId } = useParams();

    const navigateToReviewAnswer = () => {
      if (!data) return;

      const { answerId } = data.raw as ScatterTooltipRowData;
      navigate(
        generatePath(page.appletRespondentDataReviewAnswer, { appletId, respondentId, answerId }),
      );
    };

    return (
      <StyledTooltip ref={tooltipRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {data && (
          <StyledBodySmall
            sx={{ padding: theme.spacing(1.6, 2, 0.8) }}
            color={variables.palette.outline}
          >
            {format(
              getDateInUserTimezone((data?.raw as ScatterTooltipRowData).x),
              DateFormats.MonthDayTime,
            )}
          </StyledBodySmall>
        )}
        <StyledFlexColumn>
          <StyledListItemButton onClick={navigateToReviewAnswer}>
            {t('review')}
          </StyledListItemButton>
          <StyledListItemButton>{t('showSubscaleResult')}</StyledListItemButton>
        </StyledFlexColumn>
      </StyledTooltip>
    );
  },
);
