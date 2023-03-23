import { useFormContext } from 'react-hook-form';

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
  label,
  isExpanded,
  isMultiple,
  onArrowClick,
  onTrashClick,
}: HeaderProps) => {
  const { watch } = useFormContext();

  const { min, max, minLabel, maxLabel, minImage, maxImage } = watch(name);
  const settings = watch('settings');

  if (isExpanded) {
    return (
      <StyledSliderPanelHeader isExpanded>
        <StyledClearedButton onClick={onArrowClick} sx={commonButtonStyles}>
          <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
        </StyledClearedButton>
        <StyledLabelBoldLarge>{label}</StyledLabelBoldLarge>
        {isMultiple && (
          <StyledClearedButton sx={commonButtonStyles} onClick={onTrashClick}>
            <Svg id="trash" width="20" height="20" />
          </StyledClearedButton>
        )}
      </StyledSliderPanelHeader>
    );
  }

  const hasTickMarks = settings?.includes(ItemConfigurationSettings.HasTickMarks);
  const hasTickMarksLabels = settings?.includes(ItemConfigurationSettings.HasTickMarksLabels);

  const marks = hasTickMarks && getMarks(min, max, hasTickMarksLabels);

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
        <StyledSlider min={min} max={max} marks={marks} disabled />
        <StyledFlexColumn sx={{ alignItems: 'center' }}>
          {<StyledLabelLarge>{maxLabel}</StyledLabelLarge>}
          {maxImage && <StyledImg src={maxImage} />}
        </StyledFlexColumn>
      </StyledSliderPanelPreviewContainer>
    </StyledSliderPanelHeader>
  );
};
