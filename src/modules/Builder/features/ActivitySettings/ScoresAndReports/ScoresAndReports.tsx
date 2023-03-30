import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StyledBodyLarge, StyledFlexTopCenter } from 'shared/styles';
import { Tooltip } from 'shared/components';
import { CheckboxController } from 'shared/components/FormComponents';

import { StyledScoreSummaryTooltipSvg } from './ScoresAndReports.styles';
import { ScoresAndReportsProps } from './ScoresAndReports.types';

export const ScoresAndReports = () => {
  const { t } = useTranslation('app');

  const { control } = useFormContext();

  return (
    <>
      <CheckboxController
        control={control}
        name="generateReport"
        label={<StyledBodyLarge>{t('generateReport')}</StyledBodyLarge>}
      />
      <CheckboxController
        control={control}
        name="showScoreSummary"
        label={
          <StyledFlexTopCenter>
            <StyledBodyLarge>{t('showScoreSummary')}</StyledBodyLarge>
            <Tooltip tooltipTitle={t('showScoreSummaryTooltip')}>
              <StyledFlexTopCenter>
                <StyledScoreSummaryTooltipSvg id="more-info-outlined" width="20" height="20" />
              </StyledFlexTopCenter>
            </Tooltip>
          </StyledFlexTopCenter>
        }
      />
    </>
  );
};
