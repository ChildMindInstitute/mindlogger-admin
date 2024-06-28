import { OnSelectAnswer } from '../../RespondentDataReview.types';

export type ReviewActivitiesAndFlowsProps = {
  answerId: string | null;
  submitId: string | null;
  appletId?: string;
  respondentId?: string;
  handleSelectAnswer: OnSelectAnswer;
};
