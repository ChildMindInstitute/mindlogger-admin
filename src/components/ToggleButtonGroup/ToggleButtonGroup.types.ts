export type ToggleButton = {
  value: string;
  label: string;
  tooltip?: string;
  icon?: JSX.Element;
};

export type ToggleButtonGroupProps = {
  toggleButtons: ToggleButton[];
  activeButton: string;
  setActiveButton: (value: string) => void;
  customChange?: (value: string) => void;
};
