import { Svg } from 'shared/components';

import { GetSliderPanelActions } from './Header.types';

export const getActions = ({ onRemove }: GetSliderPanelActions) => [
  {
    icon: <Svg id="trash" />,
    action: onRemove,
  },
];
