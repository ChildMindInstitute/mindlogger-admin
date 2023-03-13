import { FieldValues, UseControllerProps } from 'react-hook-form';

export type TextInputOptionProps<T extends FieldValues> = {
  onRemove: () => void;
} & UseControllerProps<T>;
