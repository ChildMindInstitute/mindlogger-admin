import { AssessmentFormItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/Feedback.types';

export const getActivityItemIndex = (assessmentItems: AssessmentFormItem[], checkId: string) =>
  assessmentItems?.findIndex((item) => item.itemId === checkId);
