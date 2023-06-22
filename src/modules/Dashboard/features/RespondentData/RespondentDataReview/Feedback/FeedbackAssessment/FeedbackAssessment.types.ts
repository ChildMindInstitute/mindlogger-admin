import { Dispatch, SetStateAction } from 'react';
import { EncryptedAnswerSharedProps } from 'shared/types';

export type FeedbackAssessmentProps = {
  setActiveTab: Dispatch<SetStateAction<number>>;
};

export type ActivityItemAnswer = {
  activityItemId: string;
  answer: {
    value: number | string | string[];
  };
};

export type ActivityItemAnswers = {
  answers: ActivityItemAnswer[];
};

export type Assessment = EncryptedAnswerSharedProps & {
  isEdited?: boolean;
};
