import { Box } from '@mui/material';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { DateFormats } from 'shared/consts';
import { StyledBodyMedium, StyledLabelMedium, theme, variables } from 'shared/styles';

import { StyledIndent } from '../../Chart.styles';
import { StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps } from './ChartTooltip.types';

export const ChartTooltip = ({ data, 'data-testid': dataTestid }: ChartTooltipProps) => {
  const { t } = useTranslation();

  return (
    <>
      {data && (
        <>
          <StyledIndent />
          <StyledTooltip data-testid={`${dataTestid}-tooltip`}>
            <StyledBodyMedium sx={{ padding: theme.spacing(0.4, 0.8) }} color={variables.palette.white}>
              {t('response', { count: data.length })}
            </StyledBodyMedium>
            <Box sx={{ pb: theme.spacing(0.8) }} data-testid={`${dataTestid}-tooltip-dates`}>
              {data.map((response, index) => (
                <StyledLabelMedium
                  key={response.parsed.x}
                  sx={{ padding: theme.spacing(0.2, 0.8) }}
                  color={variables.palette.white}
                  data-testid={`${dataTestid}-tooltip-date-${index}`}
                >
                  {format(response?.parsed.x, DateFormats.MonthDayTime)}
                </StyledLabelMedium>
              ))}
            </Box>
          </StyledTooltip>
        </>
      )}
    </>
  );
};
