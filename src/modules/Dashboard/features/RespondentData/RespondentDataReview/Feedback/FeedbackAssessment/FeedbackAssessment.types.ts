import { Dispatch, SetStateAction } from 'react';

export type FeedbackAssessmentProps = {
  setActiveTab: Dispatch<SetStateAction<number>>;
  assessmentStep: number;
  setAssessmentStep: Dispatch<SetStateAction<number>>;
};
