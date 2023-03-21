import { FieldValues, UseControllerProps } from 'react-hook-form';
import { ColorChangeHandler } from 'react-color';

type ColorPicker = {
  anchorEl: HTMLElement;
  handleColorChange?: ColorChangeHandler;
  handlePopoverClose: () => void;
};

export type ColorPickerProps<T extends FieldValues> = ColorPicker & UseControllerProps<T>;
