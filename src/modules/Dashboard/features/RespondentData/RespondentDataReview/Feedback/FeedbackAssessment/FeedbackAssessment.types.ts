import { Dispatch, SetStateAction } from 'react';

export type FeedbackAssessmentProps = {
  assessmentStep: number;
  setAssessmentStep: Dispatch<SetStateAction<number>>;
  submitCallback: () => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  userName: string;
  error: string | null;
};

export type CreateAssessment = {
  appletId: string;
  answerId?: string | null;
  submitId?: string | null;
  answer: string;
  updatedItemIds?: string[];
  accountId: string;
  isLastVersion: boolean;
  assessmentVersions: string[];
};
