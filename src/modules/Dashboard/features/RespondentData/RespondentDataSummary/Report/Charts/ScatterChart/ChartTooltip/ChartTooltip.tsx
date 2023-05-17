import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { StyledBodySmall, StyledFlexColumn, theme, variables } from 'shared/styles';
import { DateFormats } from 'shared/consts';
import { getDateInUserTimezone } from 'shared/utils';

import { StyledListItemButton, StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps } from './ChartTooltip.types';

export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ data, onMouseEnter, onMouseLeave }, tooltipRef) => {
    const { t } = useTranslation();

    return (
      <StyledTooltip ref={tooltipRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {data && (
          <StyledBodySmall
            sx={{ padding: theme.spacing(1.6, 2, 0.8) }}
            color={variables.palette.outline}
          >
            {format(
              getDateInUserTimezone((data?.raw as { x: string; y: number }).x),
              DateFormats.MonthDayTime,
            )}
          </StyledBodySmall>
        )}
        <StyledFlexColumn>
          <StyledListItemButton>{t('review')}</StyledListItemButton>
          <StyledListItemButton>{t('showSubscaleResult')}</StyledListItemButton>
        </StyledFlexColumn>
      </StyledTooltip>
    );
  },
);
