import { Version } from 'api';
import {
  Answer,
  FormattedActivityItem,
  FormattedResponse,
  RespondentAnswerValue,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type ResponseOptionsProps = {
  responseOptions: Record<string, FormattedResponse[]>;
  versions: Version[];
};

export type GetResponseOptionsProps<T = RespondentAnswerValue> = {
  color: string;
  minDate: Date;
  maxDate: Date;
  activityItem: FormattedActivityItem;
  answers?: Answer<T>[] | Record<string, Answer<T>[]>;
  versions: Version[];
  dataTestid?: string;
};
