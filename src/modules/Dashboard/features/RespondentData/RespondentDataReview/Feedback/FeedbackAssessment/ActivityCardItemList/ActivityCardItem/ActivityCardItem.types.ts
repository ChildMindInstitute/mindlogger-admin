import { AssessmentActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview';

import { ActivityCartProps } from '../ActivityCartItemList.types';

export type ActivityCardItemProps = ActivityCartProps & {
  isActive: boolean;
  activityItem: AssessmentActivityItem;
};

export type ItemCardButtonsConfig = {
  isBackVisible: boolean;
  isSkippable?: boolean;
};
