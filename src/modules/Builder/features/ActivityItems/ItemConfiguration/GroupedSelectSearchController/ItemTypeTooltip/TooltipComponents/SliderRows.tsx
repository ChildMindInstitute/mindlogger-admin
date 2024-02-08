import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledBodyMedium, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import { StyledPresentation, StyledTooltipText } from './TooltipComponents.styles';

export const SliderRows = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledPresentation>
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
