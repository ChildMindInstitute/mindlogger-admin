import i18n from 'i18n';
import { StyledBodyMedium, StyledCheckboxTooltipSvg } from 'shared/styles';
import { Tooltip } from 'shared/components/Tooltip';

import { GetCheckboxes } from './RoundOptions.types';

const { t } = i18n;

export const getCheckboxes = ({ fieldName, 'data-testid': dataTestid }: GetCheckboxes) => [
  {
    name: `${fieldName}.showFeedback`,
    label: (
      <StyledBodyMedium sx={{ position: 'relative' }}>
        {t('flankerRound.showFeedback')}
        <Tooltip tooltipTitle={t('flankerRound.feedbackTooltip')}>
          <span>
            <StyledCheckboxTooltipSvg id="more-info-outlined" />
          </span>
        </Tooltip>
      </StyledBodyMedium>
    ),
    'data-testid': `${dataTestid}-show-feedback`,
  },
  {
    name: `${fieldName}.showResults`,
    label: (
      <StyledBodyMedium sx={{ position: 'relative' }}>
        {t('flankerRound.showSummary')}
        <Tooltip tooltipTitle={t('flankerRound.summaryTooltip')}>
          <span>
            <StyledCheckboxTooltipSvg id="more-info-outlined" />
          </span>
        </Tooltip>
      </StyledBodyMedium>
    ),
    'data-testid': `${dataTestid}-show-summary`,
  },
];
