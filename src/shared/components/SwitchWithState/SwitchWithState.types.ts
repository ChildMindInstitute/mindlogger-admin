import { ChangeEvent } from 'react';

export type SwitchWithStateProps = {
  checked: boolean;
  handleChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  label?: string;
  tooltipText?: string;
  'data-testid'?: string;
};
