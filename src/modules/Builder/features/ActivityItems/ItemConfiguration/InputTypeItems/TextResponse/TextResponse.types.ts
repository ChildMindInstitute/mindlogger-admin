import { FieldValues, Path, UseControllerProps } from 'react-hook-form';

export type TextResponseProps<T extends FieldValues> = {
  maxCharacters: Path<T>;
} & UseControllerProps<T>;
