import { useEffect } from 'react';

import { useFormContext } from 'react-hook-form';

import { RadioGroupController } from 'shared/components/FormComponents';
import { StyledFlexColumn, StyledFlexTopCenter } from 'shared/styles';

import { SELECTION_OPTIONS_COLOR_PALETTE } from '../../../ItemConfiguration.const';
import { SelectionOption } from '../../../ItemConfiguration.types';
import { getPaletteColor } from '../../../ItemConfiguration.utils';
import { RADIO_GROUP_OPTIONS } from './ColorPalettePicker.const';
import { StyledColorPalettePickerContainer, StyledPaletteColorBox } from './ColorPalettePicker.styles';
import { ColorPalettePickerProps } from './ColorPalettePicker.types';

export const ColorPalettePicker = ({ name }: ColorPalettePickerProps) => {
  const { watch, control, getValues, setValue } = useFormContext();

  const palette = watch(`${name}.responseValues.paletteName`);
  const optionsName = `${name}.responseValues.options`;

  useEffect(() => {
    if (palette) {
      const options = getValues(optionsName);

      setValue(
        optionsName,
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
      <RadioGroupController
        key={`palette-controller-${palette}`}
        control={control}
        name={`${name}.responseValues.paletteName`}
        options={RADIO_GROUP_OPTIONS}
        data-testid="builder-activity-items-item-configuration-color-palette-picker"
      />
      <StyledFlexTopCenter sx={{ gap: '1.2rem' }}>
        {SELECTION_OPTIONS_COLOR_PALETTE.map(({ name, colors }) => (
          <StyledFlexColumn key={`palette-${name}`} sx={{ flexGrow: 1, gap: '0.1rem' }}>
            {colors.map(hex => (
              <StyledPaletteColorBox key={`palette-${name}-${hex}`} sx={{ background: hex }} />
            ))}
          </StyledFlexColumn>
        ))}
      </StyledFlexTopCenter>
    </StyledColorPalettePickerContainer>
  );
};
