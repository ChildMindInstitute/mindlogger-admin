import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledBodyMedium } from 'shared/styles/styledComponents';

import { StyledPresentation } from './TooltipComponents.styles';

export const Slider = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledPresentation data-testid="tooltip-selection-presentation">
        <Svg id="slider-number" width="114" height="72" />
      </StyledPresentation>
      <StyledBodyMedium>{t('sliderHint')}.</StyledBodyMedium>
    </>
  );
};
