import { ChangeEvent } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { FieldPathValue } from 'react-hook-form/dist/types';

import { FormInputProps } from '../InputController.types';

export type InputProps<T extends FieldValues> = FormInputProps & {
  onChange: (value: string | number) => void;
  value: FieldPathValue<T, Path<T>>;
  onCustomChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: () => void,
  ) => void;
};

export type GetTextAdornment = {
  value: number;
  textAdornment?: string;
  disabled?: boolean;
};
