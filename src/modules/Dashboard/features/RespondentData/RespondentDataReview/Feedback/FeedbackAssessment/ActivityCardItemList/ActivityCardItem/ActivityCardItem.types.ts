import { ActivityItemAnswer } from 'shared/types';

import { ActivityCartProps } from '../ActivityCartItemList.types';

export type ActivityCardItemProps = ActivityCartProps & {
  isActive: boolean;
  activityItem: ActivityItemAnswer;
};

export type ItemCardButtonsConfig = {
  isBackVisible: boolean;
  isSkippable?: boolean;
};
