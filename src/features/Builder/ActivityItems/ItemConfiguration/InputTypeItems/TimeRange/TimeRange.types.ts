import { FieldValues, Path, UseControllerProps } from 'react-hook-form';

export type TimeRangeProps<T extends FieldValues> = {
  endTime: Path<T>;
} & UseControllerProps<T>;
