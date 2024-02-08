import { useState } from 'react';

import { ColorPaletteHeader } from './ColorPaletteHeader';
import { ColorPalettePicker } from './ColorPalettePicker';
import { StyledColorPaletteContainer } from './ColorPalette.styles';
import { ColorPaletteProps } from './ColorPalette.types';

export const ColorPalette = ({ name, onRemovePalette }: ColorPaletteProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCollapse = () => setIsExpanded(prevExpanded => !prevExpanded);

  return (
    <StyledColorPaletteContainer
      in={isExpanded}
      collapsedSize="8.8rem"
      timeout={0}
      data-testid="builder-activity-items-item-configuration-color-palette">
      <ColorPaletteHeader isExpanded={isExpanded} onArrowClick={handleCollapse} onRemovePalette={onRemovePalette} />
      {isExpanded && <ColorPalettePicker name={name} />}
    </StyledColorPaletteContainer>
  );
};
