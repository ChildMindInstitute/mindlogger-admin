import { format } from 'date-fns';
import uniqueId from 'lodash.uniqueid';
import { useTranslation } from 'react-i18next';

import {
  StyledBodySmall,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelMedium,
  StyledTitleBoldMedium,
  theme,
  variables,
} from 'shared/styles';
import { DateFormats } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks';

import { StyledIndent } from '../../../Chart.styles';
import { StyledBackground, StyledMdPreview, StyledTooltip } from './ChartTooltip.styles';
import { ChartTooltipProps } from './ChartTooltip.types';

export const ChartTooltip = ({ dataPoints, 'data-testid': dataTestid }: ChartTooltipProps) => {
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlags();

  return (
    <>
      <StyledIndent />
      {!!dataPoints?.length && (
        <StyledTooltip data-testid={`${dataTestid}-tooltip`}>
          {dataPoints.map(
            ({ date, backgroundColor, label, value, optionText, severity }, index) => (
              <StyledFlexColumn
                key={uniqueId()}
                sx={{ gap: theme.spacing(0.4) }}
                data-testid={`${dataTestid}-tooltip-item-${index}`}
              >
                <StyledBodySmall sx={{ mb: theme.spacing(1) }} color={variables.palette.outline}>
                  {format(date, DateFormats.MonthDayTime)}
                </StyledBodySmall>
                <StyledFlexTopCenter sx={{ gap: theme.spacing(0.4) }}>
                  <StyledBackground sx={{ backgroundColor }} />
                  <StyledLabelMedium color={variables.palette.on_surface}>
                    {label}: {value}
                  </StyledLabelMedium>
                </StyledFlexTopCenter>
                {featureFlags.enableCahmiSubscaleScoring && severity && (
                  <StyledTitleBoldMedium>
                    {t('subscaleLookupTable.column.severity')}: {severity}
                  </StyledTitleBoldMedium>
                )}
                {optionText && (
                  <StyledMdPreview
                    data-testid={`${dataTestid}-tooltip-item-${index}-md-preview`}
                    sx={{ mt: theme.spacing(1.2) }}
                    modelValue={optionText}
                  />
                )}
              </StyledFlexColumn>
            ),
          )}
        </StyledTooltip>
      )}
    </>
  );
};
