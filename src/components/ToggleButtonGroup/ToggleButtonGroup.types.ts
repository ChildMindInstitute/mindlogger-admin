export type ToggleButton = {
  value: string;
  label: string;
  tooltip?: string;
};

export type ToggleButtonGroupProps = {
  toggleButtons: ToggleButton[];
  activeButton: string;
  setActiveButton: (value: string) => void;
};
