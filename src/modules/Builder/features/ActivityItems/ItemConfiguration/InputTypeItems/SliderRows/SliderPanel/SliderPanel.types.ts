import { FieldValues, UseControllerProps } from 'react-hook-form';

export type SliderPanelProps<T extends FieldValues> = {
  label: string;
  isMultiple?: boolean;
  onRemove: () => void;
} & UseControllerProps<T>;
