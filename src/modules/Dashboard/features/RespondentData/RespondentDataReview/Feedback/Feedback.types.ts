import { Dispatch, SetStateAction } from 'react';

import { ReviewActivity } from 'api';
import {
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
} from 'shared/types';

import { FeedbackTabs } from '../RespondentDataReview.types';

export type FeedbackProps = {
  activeTab: FeedbackTabs;
  setActiveTab: Dispatch<SetStateAction<FeedbackTabs>>;
  onClose: () => void;
  selectedActivity: ReviewActivity;
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
