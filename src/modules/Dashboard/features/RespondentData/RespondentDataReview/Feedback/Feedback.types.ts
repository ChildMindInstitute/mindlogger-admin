import { DatavizActivity } from 'api';
import { ActivityItemAnswer, AnswerValue } from 'shared/types';

export type FeedbackProps = {
  isFeedbackOpen: boolean;
  onClose: () => void;
  selectedActivity: DatavizActivity;
  assessment: ActivityItemAnswer[];
};

export type AssessmentFormItem = {
  itemId: string;
  answers: AnswerValue;
};

export type FeedbackForm = {
  newNote: string;
  assessmentItems: AssessmentFormItem[];
};
