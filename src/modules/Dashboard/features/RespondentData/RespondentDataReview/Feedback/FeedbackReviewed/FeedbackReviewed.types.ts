import { ItemAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { Item } from 'shared/state';

export type ActivityItemAnswer = {
  activityItem: Item & {
    edited: boolean;
  };
  answer: ItemAnswer | string;
};

export type Reviewer = {
  id: string;
  fullName: string;
  activityItemAnswers: ActivityItemAnswer[];
};
