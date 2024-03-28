import { Version } from 'api';
import {
  Answer,
  FormattedActivityItem,
  FormattedResponse,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type ResponseOptionsProps = {
  responseOptions: Record<string, FormattedResponse[]>;
  versions: Version[];
};

export type GetResponseOptionsProps = {
  color: string;
  minDate: Date;
  maxDate: Date;
  activityItem: FormattedActivityItem;
  answers?: Answer[];
  versions: Version[];
  dataTestid?: string;
};
