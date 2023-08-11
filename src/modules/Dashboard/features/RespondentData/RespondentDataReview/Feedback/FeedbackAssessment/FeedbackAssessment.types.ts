import { Dispatch, SetStateAction } from 'react';
import { AnswerDTO, EncryptedAnswerSharedProps } from 'shared/types';

export type FeedbackAssessmentProps = {
  setActiveTab: Dispatch<SetStateAction<number>>;
  assessmentStep: number;
  setAssessmentStep: Dispatch<SetStateAction<number>>;
};

export type Assessment = EncryptedAnswerSharedProps;

export type FormattedAssessmentItem = {
  answers: AnswerDTO[];
};
