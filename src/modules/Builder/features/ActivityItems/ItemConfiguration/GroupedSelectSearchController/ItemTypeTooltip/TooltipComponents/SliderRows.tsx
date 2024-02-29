import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import theme from 'shared/styles/theme';
import { StyledBodyMedium, StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { StyledPresentation, StyledTooltipText } from './TooltipComponents.styles';
import { tooltipPresentationDataTestid } from '../ItemTypeTooltip.const';

export const SliderRows = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledPresentation data-testid={tooltipPresentationDataTestid}>
        <StyledFlexTopCenter sx={{ mb: theme.spacing(-1.5) }}>
          <StyledTooltipText sx={{ mr: theme.spacing(0.5) }}>{t('slider')} 1</StyledTooltipText>
          <Svg id="slider-rows-first" width="98" height="48" />
        </StyledFlexTopCenter>
        <StyledFlexTopCenter>
          <StyledTooltipText sx={{ mr: theme.spacing(0.5) }}>{t('slider')} 2</StyledTooltipText>
          <Svg id="slider-rows-second" width="98" height="48" />
        </StyledFlexTopCenter>
      </StyledPresentation>
      <StyledBodyMedium>{t('sliderRowsHint')}.</StyledBodyMedium>
    </>
  );
};
