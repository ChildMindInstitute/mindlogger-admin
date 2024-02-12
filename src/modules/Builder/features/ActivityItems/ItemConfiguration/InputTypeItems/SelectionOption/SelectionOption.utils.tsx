import { Svg } from 'shared/components/Svg';
import { ConditionalLogic, OptionCondition } from 'shared/state';

import { OptionActions } from './SelectionOption.types';

export const getActions = ({
  actions: { optionHide, paletteClick, optionRemove },
  isHidden,
  hasColorPicker,
  isColorSet,
  optionsLength,
  'data-testid': dataTestid,
}: OptionActions) => [
  {
    icon: <Svg id={isHidden ? 'visibility-off' : 'visibility-on'} />,
    action: optionHide,
    'data-testid': `${dataTestid}-hide`,
  },
  {
    icon: <Svg id={isColorSet ? 'paint-filled' : 'paint-outline'} />,
    action: paletteClick,
    isDisplayed: hasColorPicker,
    active: isColorSet,
    'data-testid': `${dataTestid}-palette`,
  },
  {
    icon: <Svg id="trash" />,
    isDisplayed: optionsLength > 1,
    action: optionRemove,
    'data-testid': `${dataTestid}-remove`,
  },
];

export const getDependentConditions = (
  optionValue: string,
  conditionalLogic?: ConditionalLogic[],
) =>
  conditionalLogic?.filter(
    ({ conditions }) =>
      conditions?.some(
        ({ payload }) => (payload as OptionCondition['payload'])?.optionValue === optionValue,
      ),
  );
