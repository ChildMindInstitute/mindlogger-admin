import { DatavizActivity } from 'api';
import { DecryptedMultiSelectionAnswer, DecryptedSingleSelectionAnswer, DecryptedSliderAnswer } from 'shared/types';

export type FeedbackProps = {
  onClose: () => void;
  selectedActivity: DatavizActivity;
};

export type AssessmentFormItem = {
  itemId: string;
  answers:
    | DecryptedMultiSelectionAnswer['value']
    | DecryptedSingleSelectionAnswer['value']
    | DecryptedSliderAnswer['value']
    | null;
  edited: number | null;
};

export type FeedbackForm = {
  newNote: string;
  assessmentItems: AssessmentFormItem[];
};
