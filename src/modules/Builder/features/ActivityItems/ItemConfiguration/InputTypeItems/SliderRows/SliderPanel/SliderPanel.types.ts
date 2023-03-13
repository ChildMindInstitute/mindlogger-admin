import { FieldValues, UseControllerProps } from 'react-hook-form';

export type SliderPanelProps<T extends FieldValues> = {
  label: string;
  isMultiple: boolean | undefined;
  onRemove: () => void;
} & UseControllerProps<T>;
