import { ActivityItem } from '../ActivityCartItemList.types';

export type ActivityCardItemProps = {
  activityItem: ActivityItem;
  isBackVisible: boolean;
  isSubmitVisible: boolean;
  isActive: boolean;
  step: number;
  onSubmit: () => void;
  toNextStep?: () => void;
  toPrevStep?: () => void;
};

export type ItemCardButtonsConfig = {
  isBackVisible: boolean;
  isSkippable?: boolean;
};
