export enum ToggleButtonVariants {
  Default = 'Default',
  Large = 'Large',
}

export type ToggleButton = {
  value: string | number;
  label: string;
  description?: string;
  tooltip?: string;
  icon?: JSX.Element;
};

export type ToggleButtonGroupProps = {
  variant?: ToggleButtonVariants;
  toggleButtons: ToggleButton[];
  activeButton: string | number;
  setActiveButton?: (value: string | number) => void;
  customChange?: (value: string | number) => void;
  'data-testid'?: string;
};
