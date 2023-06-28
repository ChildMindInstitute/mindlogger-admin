import { Dispatch, SetStateAction } from 'react';

import { SingleAndMultipleSelectionOption } from 'shared/state';

export type SelectionOptionProps = {
  name: string;
  onRemoveOption: (index: number) => void;
  onUpdateOption: (index: number, option: SingleAndMultipleSelectionOption) => void;
  index: number;
  optionsLength: number;
  optionsOpen: boolean[];
  setOptionsOpen: Dispatch<SetStateAction<boolean[]>>;
};

export type SetSelectionOptionValue = {
  name: string;
  onUpdateOption: (index: number, option: SingleAndMultipleSelectionOption) => void;
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
};
