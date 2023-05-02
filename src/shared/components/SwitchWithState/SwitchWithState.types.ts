import * as React from 'react';

export type SwitchWithStateProps = {
  checked: boolean;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  label?: string;
  tooltipText?: string;
};
