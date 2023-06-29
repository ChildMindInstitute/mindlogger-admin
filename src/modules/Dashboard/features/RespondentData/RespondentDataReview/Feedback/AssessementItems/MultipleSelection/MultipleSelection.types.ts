import {
  DecryptedMultiSelectionAnswer,
  MultiSelectActivityItem,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export type MultipleSelectionProps = {
  activityItem: MultiSelectActivityItem;
  value: DecryptedMultiSelectionAnswer['value'];
  isDisabled?: boolean;
  onChange?: (value: DecryptedMultiSelectionAnswer['value']) => void;
};
