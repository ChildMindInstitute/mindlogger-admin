import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { StyledFlexColumn, StyledFlexTopCenter } from 'shared/styles';
import { RadioGroupController } from 'shared/components/FormComponents';
import {
  SelectionOption,
  getPaletteColor,
  SELECTION_OPTIONS_COLOR_PALETTE,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration';

import {
  StyledColorPalettePickerContainer,
  StyledPaletteColorBox,
} from './ColorPalettePicker.styles';
import { RADIO_GROUP_OPTIONS } from './ColorPalettePicker.const';

export const ColorPalettePicker = () => {
  const { watch, control, getValues, setValue } = useFormContext();

  const palette = watch('palette');

  useEffect(() => {
    if (palette) {
      const options = getValues('options');

      setValue(
        'options',
        options.map((option: SelectionOption, index: number) => ({
          ...option,
          color: {
            hex: getPaletteColor(palette, index),
          },
        })),
      );
    }
  }, [palette]);

  return (
    <StyledColorPalettePickerContainer>
      <RadioGroupController control={control} name="palette" options={RADIO_GROUP_OPTIONS} />
      <StyledFlexTopCenter sx={{ gap: '1.2rem' }}>
        {SELECTION_OPTIONS_COLOR_PALETTE.map(({ name, colors }) => (
          <StyledFlexColumn key={`palette-${name}`} sx={{ flexGrow: 1, gap: '0.1rem' }}>
            {colors.map((hex) => (
              <StyledPaletteColorBox key={`palette-${name}-${hex}`} sx={{ background: hex }} />
            ))}
          </StyledFlexColumn>
        ))}
      </StyledFlexTopCenter>
    </StyledColorPalettePickerContainer>
  );
};
