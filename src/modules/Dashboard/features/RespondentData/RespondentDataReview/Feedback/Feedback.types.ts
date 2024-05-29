import { Dispatch, SetStateAction } from 'react';

import {
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
} from 'shared/types';

import { FeedbackTabs } from '../RespondentDataReview.types';

export type SelectedEntity = {
  id: string;
  isFlow: boolean;
};

export type FeedbackProps = {
  activeTab: FeedbackTabs;
  setActiveTab: Dispatch<SetStateAction<FeedbackTabs>>;
  onClose: () => void;
  selectedEntity: SelectedEntity;
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
