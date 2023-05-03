import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StyledBodyLarge, StyledFlexTopCenter, StyledTooltipSvg } from 'shared/styles';
import { Tooltip } from 'shared/components';
import { CheckboxController } from 'shared/components/FormComponents';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';

export const ScoresAndReports = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('app');
  const { fieldName } = useCurrentActivity();
  const { control } = useFormContext();
  const generateReportName = `${fieldName}.generateReport`;
  const showScoreSummaryName = `${fieldName}.showScoreSummary`;

  return (
    <>
      <CheckboxController
        control={control}
        name={generateReportName}
        label={<StyledBodyLarge>{t('generateReport')}</StyledBodyLarge>}
      />
      <CheckboxController
        control={control}
        name={showScoreSummaryName}
        label={
          <StyledFlexTopCenter>
            <StyledBodyLarge>{t('showScoreSummary')}</StyledBodyLarge>
            <Tooltip tooltipTitle={t('showScoreSummaryTooltip')}>
              <StyledFlexTopCenter>
                <StyledTooltipSvg id="more-info-outlined" width="20" height="20" />
              </StyledFlexTopCenter>
            </Tooltip>
          </StyledFlexTopCenter>
        }
      />
      {children}
    </>
  );
};
