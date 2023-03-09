import { Svg } from 'components';

import { OptionActions } from './SelectionOption.types';

export const OPTION_TEXT_MAX_LENGTH = 75;
export const getActions = ({
  actions: { optionHide, paletteClick, optionRemove },
  isVisible,
}: OptionActions) => [
  {
    icon: <Svg id={isVisible ? 'visibility-on' : 'visibility-off'} />,
    action: optionHide,
  },
  {
    icon: <Svg id="paint-outline" />,
    action: paletteClick,
  },
  {
    icon: <Svg id="trash" />,
    action: optionRemove,
  },
];
