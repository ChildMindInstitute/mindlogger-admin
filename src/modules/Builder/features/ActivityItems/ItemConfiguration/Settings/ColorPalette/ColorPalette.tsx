import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { ColorPaletteHeader } from './ColorPaletteHeader';
import { ColorPalettePicker } from './ColorPalettePicker';
import { StyledColorPaletteContainer } from './ColorPalette.styles';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';

export const ColorPalette = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { watch, setValue } = useFormContext();

  const settings = watch('settings');

  const handleCollapse = () => setIsExpanded((prevExpanded) => !prevExpanded);
  const handleRemovePalette = () => {
    setValue(
      'settings',
      settings?.filter(
        (setting: ItemConfigurationSettings) =>
          setting !== ItemConfigurationSettings.HasColorPalette,
      ),
    );
  };

  return (
    <StyledColorPaletteContainer in={isExpanded} collapsedSize="8.8rem" timeout={0}>
      <ColorPaletteHeader
        isExpanded={isExpanded}
        onArrowClick={handleCollapse}
        onTrashClick={handleRemovePalette}
      />
      <ColorPalettePicker />
    </StyledColorPaletteContainer>
  );
};
