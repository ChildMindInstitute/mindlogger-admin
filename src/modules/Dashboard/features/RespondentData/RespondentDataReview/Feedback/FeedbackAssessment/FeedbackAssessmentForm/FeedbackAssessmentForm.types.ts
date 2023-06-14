import { Dispatch, SetStateAction } from 'react';

import {
  ActivityItemAnswer,
  AnswerDTO,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type FormattedAssessmentItem = {
  itemIds: string[];
  answers: AnswerDTO[];
};

export type FeedbackAssessmentFormProps = {
  answers: ActivityItemAnswer[];
  setActiveTab: Dispatch<SetStateAction<number>>;
};

export type AssessmentFormItem = {
  itemId: string;
  answers: number | string | number[] | null;
};

export type AssessmentForm = {
  assessmentItems: AssessmentFormItem[];
};
