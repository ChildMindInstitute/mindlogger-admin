import { format } from 'date-fns';
import uniqueId from 'lodash.uniqueid';

import {
  StyledBodySmall,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelMedium,
  theme,
  variables,
} from 'shared/styles';
import { DateFormats } from 'shared/consts';

import { StyledIndent } from '../../../Chart.styles';
import { StyledBackground, StyledMdPreview, StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps } from './ChartTooltip.types';

export const ChartTooltip = ({ dataPoints, 'data-testid': dataTestid }: ChartTooltipProps) => (
  <>
    <StyledIndent />
    {!!dataPoints?.length && (
      <StyledTooltip data-testid={`${dataTestid}-tooltip`}>
        {dataPoints.map(({ date, backgroundColor, label, value, optionText }, index) => (
          <StyledFlexColumn
            key={uniqueId()}
            sx={{ mt: index > 0 ? theme.spacing(2.4) : '' }}
            data-testid={`${dataTestid}-tooltip-item-${index}`}
          >
            <StyledBodySmall sx={{ mb: theme.spacing(1) }} color={variables.palette.outline}>
              {format(date, DateFormats.MonthDayTime)}
            </StyledBodySmall>
            <StyledFlexTopCenter>
              <StyledBackground sx={{ backgroundColor }} />
              <StyledLabelMedium
                sx={{ ml: theme.spacing(0.8) }}
                color={variables.palette.on_surface}
              >
                {label}: {value}
              </StyledLabelMedium>
            </StyledFlexTopCenter>
            {optionText && (
              <StyledMdPreview
                data-testid={`${dataTestid}-tooltip-item-${index}-md-preview`}
                sx={{ mt: theme.spacing(1) }}
                modelValue={optionText}
              />
            )}
          </StyledFlexColumn>
        ))}
      </StyledTooltip>
    )}
  </>
);
