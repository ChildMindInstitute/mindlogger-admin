import { Version } from 'modules/Dashboard/api';
import { FormattedResponses } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type ResponseOptionsProps = {
  responseOptions: Record<string, FormattedResponses[]>;
  versions: Version[];
  flowResponsesIndex?: number;
};

export type GetResponseOptionsProps = {
  color: string;
  minDate: Date;
  maxDate: Date;
  activityItemAnswer: FormattedResponses;
  versions: Version[];
  isStaticActive?: boolean;
};
