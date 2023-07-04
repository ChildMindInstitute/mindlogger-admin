import { Svg } from 'shared/components';
import { ConditionalLogic, OptionCondition } from 'shared/state';

import { OptionActions } from './SelectionOption.types';

export const getActions = ({
  actions: { optionHide, paletteClick, optionRemove },
  isHidden,
  hasColorPicker,
  isColorSet,
  optionsLength,
}: OptionActions) => [
  {
    icon: <Svg id={isHidden ? 'visibility-off' : 'visibility-on'} />,
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

export const getDependentConditions = (
  optionValue: string,
  conditionalLogic?: ConditionalLogic[],
) =>
  conditionalLogic?.filter(({ conditions }) =>
    conditions?.some(
      ({ payload }) => (payload as OptionCondition['payload'])?.optionValue === optionValue,
    ),
  );
