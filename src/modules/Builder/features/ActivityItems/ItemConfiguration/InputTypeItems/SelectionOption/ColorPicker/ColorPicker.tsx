import { Popover } from '@mui/material';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { ChromePicker, ColorChangeHandler } from 'react-color';

import { ColorPickerProps } from './ColorPicker.types';

export const ColorPicker = <T extends FieldValues>({
  name,
  control,
  anchorEl,
  handlePopoverClose,
}: ColorPickerProps<T>) => {
  const { setValue } = useFormContext();

  const colorPickerVisible = Boolean(anchorEl);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const handleChange: ColorChangeHandler = (...args) => {
          onChange(...args);

          setValue('paletteName', '');
        };

        return (
          <Popover
            open={colorPickerVisible}
            onClose={handlePopoverClose}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <ChromePicker disableAlpha={true} color={value} onChangeComplete={handleChange} />
          </Popover>
        );
      }}
    />
  );
};
