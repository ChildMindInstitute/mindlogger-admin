import { MultiSelectActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { DecryptedMultiSelectionAnswer } from 'shared/types';

export type MultipleSelectionProps = {
  activityItem: MultiSelectActivityItem;
  value: DecryptedMultiSelectionAnswer['value'];
  isDisabled?: boolean;
  onChange?: (value: DecryptedMultiSelectionAnswer['value']) => void;
  'data-testid'?: string;
};
