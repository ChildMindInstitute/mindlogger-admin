import { useFormContext } from 'react-hook-form';
import { Slider } from '@mui/material';

import { Svg } from 'shared/components';
import {
  theme,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledLabelLarge,
} from 'shared/styles';

import { HeaderProps } from './Header.types';
import { StyledImg, StyledSliderPanelHeader } from './Header.styles';

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
  const { getValues } = useFormContext();

  const { min, max, minLabel, maxLabel, minImage, maxImage } = getValues(name);

  if (isExpanded)
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

  return (
    <StyledSliderPanelHeader>
      <StyledClearedButton onClick={onArrowClick} sx={commonButtonStyles}>
        <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
      </StyledClearedButton>
      <StyledLabelBoldLarge>{label}</StyledLabelBoldLarge>
      <StyledFlexTopCenter sx={{ width: '100%', gap: '2.4rem' }}>
        <StyledFlexColumn sx={{ alignItems: 'center' }}>
          {<StyledLabelLarge>{minLabel}</StyledLabelLarge>}
          {minImage && <StyledImg src={minImage} />}
        </StyledFlexColumn>
        <Slider min={min} max={max} />
        <StyledFlexColumn sx={{ alignItems: 'center' }}>
          {<StyledLabelLarge>{maxLabel}</StyledLabelLarge>}
          {maxImage && <StyledImg src={maxImage} />}
        </StyledFlexColumn>
      </StyledFlexTopCenter>
    </StyledSliderPanelHeader>
  );
};
