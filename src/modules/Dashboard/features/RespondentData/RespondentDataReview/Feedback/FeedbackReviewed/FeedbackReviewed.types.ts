import { AssessmentActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview';
import { EncryptedAnswerSharedProps } from 'shared/types';

export type Reviewer = {
  firstName: string;
  lastName: string;
};

export type Review = EncryptedAnswerSharedProps & ReviewData;

export type ReviewData = {
  reviewer: Reviewer;
  review: AssessmentActivityItem[];
};
