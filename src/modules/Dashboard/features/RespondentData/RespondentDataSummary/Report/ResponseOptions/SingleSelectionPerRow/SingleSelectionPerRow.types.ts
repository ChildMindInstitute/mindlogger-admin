import { Version } from 'api';
import {
  Answer,
  FormattedActivityItem,
  RespondentAnswerValue,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type SingleSelectionPerRowProps<T = RespondentAnswerValue> = {
  color: string;
  minDate: Date;
  maxDate: Date;
  activityItem: FormattedActivityItem;
  answers?: Answer<T>[] | Record<string, Answer<T>[]>;
  versions: Version[];
  dataTestid?: string;
};
