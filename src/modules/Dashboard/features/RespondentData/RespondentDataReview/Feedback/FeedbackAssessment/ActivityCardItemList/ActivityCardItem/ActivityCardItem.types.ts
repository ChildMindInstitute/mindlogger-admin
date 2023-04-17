import { Item } from 'shared/state';

import { ActivityCartProps } from '../ActivityCartItemList.types';

export type ActivityCardItemProps = ActivityCartProps & {
  isActive: boolean;
  activityItem: Item;
};

export type ItemCardButtonsConfig = {
  isBackVisible: boolean;
  isSkippable?: boolean;
};
