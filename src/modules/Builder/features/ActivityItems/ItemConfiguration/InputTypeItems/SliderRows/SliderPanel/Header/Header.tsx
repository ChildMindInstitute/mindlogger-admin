import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { Svg } from 'shared/components';
import {
  theme,
  StyledClearedButton,
  StyledFlexColumn,
  StyledLabelBoldLarge,
  StyledLabelLarge,
} from 'shared/styles';

import { HeaderProps } from './Header.types';
import {
  StyledImg,
  StyledSliderPanelHeader,
  StyledSliderPanelPreviewContainer,
} from './Header.styles';
import { StyledSlider } from '../SliderPanel.styles';
import { getMarks } from '../SliderPanel.utils';
import { ItemConfigurationSettings } from '../../../../ItemConfiguration.types';

const commonButtonStyles = {
  p: theme.spacing(1),
  mr: theme.spacing(0.2),
};

export const Header = ({
  name,
  index,
  label,
  isExpanded,
  isMultiple,
  onArrowClick,
  onTrashClick,
}: HeaderProps) => {
  const { watch } = useFormContext();

  const settings = watch(`${name}.config`);
  const { minValue, maxValue, minLabel, maxLabel, minImage, maxImage } =
    watch(`${name}.responseValues${isMultiple ? `.rows.${index}` : ''}`) || {};

  if (isExpanded) {
    return (
      <StyledSliderPanelHeader isExpanded>
        <StyledClearedButton onClick={onArrowClick} sx={commonButtonStyles}>
          <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
        </StyledClearedButton>
        <StyledLabelBoldLarge>{label}</StyledLabelBoldLarge>
        {isMultiple && index !== 0 && (
          <StyledClearedButton sx={commonButtonStyles} onClick={onTrashClick}>
            <Svg id="trash" width="20" height="20" />
          </StyledClearedButton>
        )}
      </StyledSliderPanelHeader>
    );
  }

  const hasTickMarks = get(settings, ItemConfigurationSettings.HasTickMarks);
  const hasTickMarksLabels = get(settings, ItemConfigurationSettings.HasTickMarksLabels);

  const marks = hasTickMarks && getMarks(minValue, maxValue, hasTickMarksLabels);

  return (
    <StyledSliderPanelHeader>
      <StyledClearedButton onClick={onArrowClick} sx={commonButtonStyles}>
        <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
      </StyledClearedButton>
      <StyledLabelBoldLarge>{label}</StyledLabelBoldLarge>
      <StyledSliderPanelPreviewContainer>
        <StyledFlexColumn sx={{ alignItems: 'center' }}>
          {<StyledLabelLarge>{minLabel}</StyledLabelLarge>}
          {minImage && <StyledImg src={minImage} />}
        </StyledFlexColumn>
        <StyledSlider min={minValue} max={maxValue} marks={marks} disabled />
        <StyledFlexColumn sx={{ alignItems: 'center' }}>
          {<StyledLabelLarge>{maxLabel}</StyledLabelLarge>}
          {maxImage && <StyledImg src={maxImage} />}
        </StyledFlexColumn>
      </StyledSliderPanelPreviewContainer>
    </StyledSliderPanelHeader>
  );
};
