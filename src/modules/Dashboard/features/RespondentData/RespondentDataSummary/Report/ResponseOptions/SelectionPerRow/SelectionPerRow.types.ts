import { Version } from 'api';
import {
  FormattedActivityItem,
  SingleMultiSelectionPerRowAnswer,
  SingleMultiSelectionPerRowItemResponseValues,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type SelectionPerRowProps = {
  color: string;
  minDate: Date;
  maxDate: Date;
  activityItem: FormattedActivityItem<SingleMultiSelectionPerRowItemResponseValues>;
  answers?: SingleMultiSelectionPerRowAnswer;
  versions: Version[];
  dataTestid?: string;
};
