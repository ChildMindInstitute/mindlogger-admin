import { Dispatch, SetStateAction } from 'react';

import { ActivityItemAnswer, AnswerDTO, AnswerValue } from 'shared/types';

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
  answers: AnswerValue;
};

export type AssessmentForm = {
  assessmentItems: AssessmentFormItem[];
};
