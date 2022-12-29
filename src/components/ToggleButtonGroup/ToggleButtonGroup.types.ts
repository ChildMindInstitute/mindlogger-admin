export type ToggleButton = {
  value: string;
  label: string;
};

export type ToggleButtonGroupProps = {
  toggleButtons: ToggleButton[];
  activeButton: string;
  setActiveButton: (value: string) => void;
  customChange?: (value: string) => void;
};
