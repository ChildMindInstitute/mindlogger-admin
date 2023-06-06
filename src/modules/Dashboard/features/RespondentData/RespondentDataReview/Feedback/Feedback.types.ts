import { Item } from 'shared/state';

import { Activity, ItemAnswer } from '../RespondentDataReview.types';

export type ActivityItemAnswer = {
  activityItem: Item & {
    edited: boolean;
  };
  answer: ItemAnswer | string;
};

export type FeedbackProps = {
  onClose: () => void;
  selectedActivity: Activity;
};
