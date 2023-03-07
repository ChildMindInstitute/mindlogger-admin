import { FieldValues, Path, Control, UseControllerProps } from 'react-hook-form';

export type NumberSelectionProps<T extends FieldValues> = {
  maxName: Path<T>;
} & UseControllerProps<T>;
