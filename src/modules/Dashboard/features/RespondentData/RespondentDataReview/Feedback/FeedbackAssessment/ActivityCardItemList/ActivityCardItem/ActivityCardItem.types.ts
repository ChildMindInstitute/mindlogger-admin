import { ActivityCartProps, ActivityItem } from '../ActivityCartItemList.types';

export type ActivityCardItemProps = ActivityCartProps & {
  isActive: boolean;
  activityItem: ActivityItem;
};

export type ItemCardButtonsConfig = {
  isBackVisible: boolean;
  isSkippable?: boolean;
};
