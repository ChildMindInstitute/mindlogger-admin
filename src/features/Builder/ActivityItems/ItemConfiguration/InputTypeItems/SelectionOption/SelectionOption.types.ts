import { UseFieldArrayUpdate } from 'react-hook-form';

import { ItemConfigurationForm } from '../../ItemConfiguration.types';

export type SelectionOptionProps = {
  onRemoveOption: (index: number) => void;
  onUpdateOption: UseFieldArrayUpdate<ItemConfigurationForm, 'options'>;
  index: number;
};

export type OptionActions = {
  actions: {
    optionHide: () => void;
    paletteClick: () => void;
    optionRemove: () => void;
  };
  isVisible?: boolean;
};
