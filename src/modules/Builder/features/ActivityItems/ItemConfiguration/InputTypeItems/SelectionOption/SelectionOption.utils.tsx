import { Svg } from 'shared/components';

import { OptionActions } from './SelectionOption.types';

export const getActions = ({
  actions: { optionHide, paletteClick, optionRemove },
  isHidden,
  hasColorPicker,
  isColorSet,
  optionsLength,
}: OptionActions) => [
  {
    icon: <Svg id={!isHidden ? 'visibility-on' : 'visibility-off'} />,
    action: optionHide,
  },
  {
    icon: <Svg id={isColorSet ? 'paint-filled' : 'paint-outline'} />,
    action: paletteClick,
    isDisplayed: hasColorPicker,
    active: isColorSet,
  },
  {
    icon: <Svg id="trash" />,
    isDisplayed: optionsLength > 1,
    action: optionRemove,
  },
];
