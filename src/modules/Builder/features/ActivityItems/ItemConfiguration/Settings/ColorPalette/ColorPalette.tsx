import { useState } from 'react';

import { toggleBooleanState } from 'shared/utils/toggleBooleanState';

import { ColorPaletteHeader } from './ColorPaletteHeader';
import { ColorPalettePicker } from './ColorPalettePicker';
import { StyledColorPaletteContainer } from './ColorPalette.styles';
import { ColorPaletteProps } from './ColorPalette.types';

export const ColorPalette = ({ name, onRemovePalette }: ColorPaletteProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <StyledColorPaletteContainer
      in={isExpanded}
      collapsedSize="8.8rem"
      timeout={0}
      data-testid="builder-activity-items-item-configuration-color-palette"
    >
      <ColorPaletteHeader
        isExpanded={isExpanded}
        onArrowClick={toggleBooleanState(setIsExpanded)}
        onRemovePalette={onRemovePalette}
      />
      {isExpanded && <ColorPalettePicker name={name} />}
    </StyledColorPaletteContainer>
  );
};
