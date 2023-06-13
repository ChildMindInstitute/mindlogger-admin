import { AssessmentFormItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackAssessment/FeedbackAssessmentForm/FeedbackAssessmentForm.types';

export const getActivityItemIndex = (assessmentItems: AssessmentFormItem[], checkId: string) =>
  assessmentItems?.findIndex((item) => item.itemId === checkId);
