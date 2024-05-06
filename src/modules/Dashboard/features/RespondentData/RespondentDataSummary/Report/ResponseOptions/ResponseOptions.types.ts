import { Version } from 'api';
import { FormattedResponses } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type ResponseOptionsProps = {
  responseOptions: Record<string, FormattedResponses[]>;
  versions: Version[];
};

export type GetResponseOptionsProps = {
  color: string;
  minDate: Date;
  maxDate: Date;
  activityItemAnswer: FormattedResponses;
  versions: Version[];
  isStaticActive?: boolean;
};
