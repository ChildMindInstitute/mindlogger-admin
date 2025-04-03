import { Svg } from 'shared/components/Svg';

import { ActionsType } from './Item.types';

export const getActions = ({
  onRemoveItem,
  onDuplicateItem,
  onChangeVisibility,
  isItemHidden,
  hasHiddenOption,
  hasDuplicateOption,
  'data-testid': dataTestid,
}: ActionsType) => [
  {
    icon: <Svg id="duplicate" />,
    action: () => onDuplicateItem(),
    isDisplayed: hasDuplicateOption,
    'data-testid': `${dataTestid}-duplicate`,
  },
  {
    icon: <Svg id={isItemHidden ? 'visibility-off' : 'visibility-on'} />,
    action: () => onChangeVisibility(),
    isStatic: isItemHidden,
    isDisplayed: !hasHiddenOption,
    'data-testid': `${dataTestid}-hide`,
  },
  {
    icon: <Svg id="trash" />,
    action: onRemoveItem,
    'data-testid': `${dataTestid}-remove`,
  },
];
