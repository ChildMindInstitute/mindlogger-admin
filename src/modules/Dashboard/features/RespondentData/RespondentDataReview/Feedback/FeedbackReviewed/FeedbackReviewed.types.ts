import { ActivityItemAnswer } from '../Feedback.types';

export type Reviewer = {
  id: string;
  fullName: string;
  activityItemAnswers: ActivityItemAnswer[];
};
