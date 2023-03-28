import { UseFieldArrayUpdate } from 'react-hook-form';

import { ItemConfigurationForm, SelectionOption } from '../../ItemConfiguration.types';

export type SelectionOptionProps = {
  onRemoveOption: (index: number) => void;
  onUpdateOption: UseFieldArrayUpdate<ItemConfigurationForm, 'options'>;
  index: number;
  optionsLength: number;
};

export type SetSelectionOptionValue = {
  option: SelectionOption;
  onUpdateOption: UseFieldArrayUpdate<ItemConfigurationForm, 'options'>;
  index: number;
  hasScoresChecked: boolean;
  scoreString?: string;
  hasTooltipsChecked: boolean;
  hasTooltip: boolean;
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
  isVisible?: boolean;
  optionsLength: number;
};
