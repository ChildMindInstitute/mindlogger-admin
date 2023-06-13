import { Dispatch, SetStateAction } from 'react';

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
