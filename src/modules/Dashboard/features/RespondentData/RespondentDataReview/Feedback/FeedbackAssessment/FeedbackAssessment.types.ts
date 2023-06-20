import { Dispatch, SetStateAction } from 'react';
import { SharedDecryptedAnswer } from 'shared/types';

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

export type Assessment = SharedDecryptedAnswer & {
  isEdited?: boolean;
};
