import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Box } from '@mui/material';

import { StyledBodyMedium, StyledLabelMedium, theme, variables } from 'shared/styles';
import { DateFormats } from 'shared/consts';

import { StyledIndent, StyledTooltipWrapper } from '../../Chart.styles';
import { StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps } from './ChartTooltip.types';

export const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ data, onMouseEnter, onMouseLeave }, tooltipRef) => {
    const { t } = useTranslation();

    return (
      <StyledTooltipWrapper
        ref={tooltipRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <StyledIndent />
        <StyledTooltip>
          {data && (
            <>
              <StyledBodyMedium
                sx={{ padding: theme.spacing(0.4, 0.8) }}
                color={variables.palette.white}
              >
                {t('response', { count: data.length })}
              </StyledBodyMedium>
              <Box sx={{ pb: theme.spacing(0.8) }}>
                {data.map((response) => (
                  <StyledLabelMedium
                    key={response.parsed.x}
                    sx={{ padding: theme.spacing(0.2, 0.8) }}
                    color={variables.palette.white}
                  >
                    {format(response?.parsed.x, DateFormats.MonthDayTime)}
                  </StyledLabelMedium>
                ))}
              </Box>
            </>
          )}
        </StyledTooltip>
      </StyledTooltipWrapper>
    );
  },
);
