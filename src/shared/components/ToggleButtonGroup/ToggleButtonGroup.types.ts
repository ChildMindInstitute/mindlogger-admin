export type ToggleButton = {
  value: string | number;
  label: string;
  tooltip?: string;
  icon?: JSX.Element;
};

export type ToggleButtonGroupProps = {
  toggleButtons: ToggleButton[];
  activeButton: string | number;
  setActiveButton?: (value: string | number) => void;
  customChange?: (value: string | number) => void;
  'data-testid'?: string;
};
