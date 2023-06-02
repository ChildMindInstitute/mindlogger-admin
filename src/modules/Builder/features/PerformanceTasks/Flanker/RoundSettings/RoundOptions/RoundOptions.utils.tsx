import i18n from 'i18next';
import { StyledBodyMedium, StyledCheckboxTooltipSvg } from 'shared/styles';
import { Tooltip } from 'shared/components';

const { t } = i18n;

export const getCheckboxes = (fieldName: string) => [
  {
    name: `${fieldName}.randomizeOrder`,
    label: <StyledBodyMedium>{t('flankerRound.randomize')}</StyledBodyMedium>,
  },
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
  },
  {
    name: `${fieldName}.showSummary`,
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
  },
];
