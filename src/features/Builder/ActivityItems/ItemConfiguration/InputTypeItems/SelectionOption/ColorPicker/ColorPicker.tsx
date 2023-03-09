import { Popover } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import { ChromePicker } from 'react-color';

import { ColorPickerProps } from './ColorPicker.types';

export const ColorPicker = <T extends FieldValues>({
  name,
  control,
  anchorEl,
  handlePopoverClose,
}: ColorPickerProps<T>) => {
  const colorPickerVisible = Boolean(anchorEl);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
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
          <ChromePicker disableAlpha={true} color={value} onChangeComplete={onChange} />
        </Popover>
      )}
    />
  );
};
