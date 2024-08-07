import { OnSelectAnswer } from '../../RespondentDataReview.types';

export type ReviewActivitiesAndFlowsProps = {
  answerId: string | null;
  submitId: string | null;
  activityId?: string;
  activityFlowId?: string;
  appletId?: string;
  subjectId?: string;
  handleSelectAnswer: OnSelectAnswer;
};
