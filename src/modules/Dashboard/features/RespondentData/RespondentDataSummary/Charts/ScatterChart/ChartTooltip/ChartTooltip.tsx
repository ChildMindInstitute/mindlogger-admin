import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { StyledBodySmall, StyledFlexColumn, variables } from 'shared/styles';
import { DateFormats } from 'shared/consts';
import { getDateInUserTimezone } from 'shared/utils';

import { StyledButton, StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps } from './ChartTooltip.types';

export const ChartTooltip = ({ data, position }: ChartTooltipProps) => {
  const { t } = useTranslation();

  return (
    <StyledTooltip sx={position}>
      <StyledBodySmall color={variables.palette.outline}>
        {format(
          getDateInUserTimezone((data.raw as { x: string; y: number }).x),
          DateFormats.MonthDayTime,
        )}
      </StyledBodySmall>
      <StyledFlexColumn sx={{ alignItems: 'flex-start' }}>
        <StyledButton>{t('review')}</StyledButton>
        <StyledButton>{t('showSubscaleResult')}</StyledButton>
      </StyledFlexColumn>
    </StyledTooltip>
  );
};
