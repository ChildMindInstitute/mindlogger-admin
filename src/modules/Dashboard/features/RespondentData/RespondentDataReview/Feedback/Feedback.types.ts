import { DatavizActivity } from 'api';
import { AnswerDTO, AnswerValue } from 'shared/types';

export type FeedbackProps = {
  isFeedbackOpen: boolean;
  onClose: () => void;
  selectedActivity: DatavizActivity;
};

export type AssessmentFormItem = {
  itemId: string;
  answers: AnswerValue;
  edited: number | null;
};

export type FeedbackForm = {
  newNote: string;
  assessmentItems: AssessmentFormItem[];
};

export type EditedAnswer = AnswerDTO & { edited: number | null };
