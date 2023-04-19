import { ActivityItemAnswer } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackAssessment/FeedbackAssessment.types';

export const getActivityItemIndex = (answers: ActivityItemAnswer[], checkId: string) =>
  answers.findIndex((item) => item.activityItemId === checkId);
