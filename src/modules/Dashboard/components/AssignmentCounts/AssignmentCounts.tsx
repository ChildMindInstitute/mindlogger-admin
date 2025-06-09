import { Trans, useTranslation } from 'react-i18next';

import { Svg, Tooltip } from 'shared/components';
import {
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelLarge,
  variables,
} from 'shared/styles';

import { AssignmentCountsProps } from './AssignmentCounts.types';

export const AssignmentCounts = ({ selfReports, multiInformant }: AssignmentCountsProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });

  return selfReports || multiInformant ? (
    <StyledFlexTopCenter sx={{ gap: 0.8, position: 'relative', zIndex: 1 }}>
      <StyledLabelLarge color={variables.palette.on_surface_variant} sx={{ mr: 0.8 }}>
        {t('selfReports', { count: selfReports })}
      </StyledLabelLarge>
      <StyledLabelLarge color={variables.palette.on_surface_variant}>
        {t('multiInformant', { count: multiInformant })}
      </StyledLabelLarge>

      <Tooltip
        tooltipTitle={
          <StyledFlexColumn sx={{ gap: variables.font.lineHeight.label3 }}>
            <Trans i18nKey="activityAssign.assignmentCountsTooltip">
              <div>Self-Report</div>
              <div>Multi-Informant</div>
            </Trans>
          </StyledFlexColumn>
        }
      >
        <StyledFlexAllCenter component="span">
          <Svg
            id="help-outlined"
            width={18}
            height={18}
            fill={variables.palette.on_surface_variant}
          />
        </StyledFlexAllCenter>
      </Tooltip>
    </StyledFlexTopCenter>
  ) : null;
};
