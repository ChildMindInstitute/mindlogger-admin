import { Dispatch, SetStateAction } from 'react';
import { ActivityItemAnswer, AnswerDTO, EncryptedAnswerSharedProps } from 'shared/types';

export type FeedbackAssessmentProps = {
  setActiveTab: Dispatch<SetStateAction<number>>;
  assessment: ActivityItemAnswer[];
  assessmentStep: number;
  setAssessmentStep: Dispatch<SetStateAction<number>>;
};

export type Assessment = EncryptedAnswerSharedProps & {
  isEdited?: boolean;
};

export type FormattedAssessmentItem = {
  itemIds: string[];
  answers: AnswerDTO[];
};
