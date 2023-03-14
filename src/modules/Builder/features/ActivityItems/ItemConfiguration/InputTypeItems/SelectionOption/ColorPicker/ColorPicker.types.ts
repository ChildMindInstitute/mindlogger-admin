import { FieldValues, UseControllerProps } from 'react-hook-form';

type ColorPicker = {
  anchorEl: HTMLElement;
  handlePopoverClose: () => void;
};

export type ColorPickerProps<T extends FieldValues> = ColorPicker & UseControllerProps<T>;
