import { SingleAndMultiSelectOption } from 'shared/state';

export type SelectionOptionProps = {
  name: string;
  onRemoveOption: (index: number) => void;
  onUpdateOption: (index: number, option: SingleAndMultiSelectOption) => void;
  index: number;
  optionsLength: number;
};

export type SetSelectionOptionValue = {
  name: string;
  onUpdateOption: (index: number, option: SingleAndMultiSelectOption) => void;
  index: number;
  hasColorPicker: boolean;
  hasColor: boolean;
};

export type OptionActions = {
  actions: {
    optionHide: () => void;
    paletteClick: () => void;
    optionRemove: () => void;
  };
  hasColorPicker: boolean;
  isColorSet: boolean;
  isHidden?: boolean;
  optionsLength: number;
  'data-testid'?: string;
};
