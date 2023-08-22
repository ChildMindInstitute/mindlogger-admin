import { DatavizActivity } from 'api';

export type FeedbackProps = {
  isFeedbackOpen: boolean;
  onClose: () => void;
  selectedActivity: DatavizActivity;
};

export type AssessmentFormItem = {
  itemId: string;
  answers: string | number | (string | number)[];
  edited: number | null;
};

export type FeedbackForm = {
  newNote: string;
  assessmentItems: AssessmentFormItem[];
};
