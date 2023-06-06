import {
  ActivityItemAnswer,
  ItemAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type FormattedAssessmentItem = {
  itemIds: string[];
  answers: ItemAnswer[];
};

export type FeedbackAssessmentFormProps = {
  answers: ActivityItemAnswer[];
  activityId: string;
};

export type AssessmentFormItem = {
  itemId: string;
  answers: number | string | string[] | null;
};

export type AssessmentForm = {
  assessmentItems: AssessmentFormItem[];
};
