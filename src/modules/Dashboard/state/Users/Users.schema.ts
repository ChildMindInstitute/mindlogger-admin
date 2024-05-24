import { BaseSchema } from 'shared/state/Base';
import { Respondent, RespondentDetails } from 'modules/Dashboard/types';

export type UsersSchema = {
  allRespondents: BaseSchema<{ result: Respondent[]; count: number } | null>;
  respondentDetails: BaseSchema<{ result: RespondentDetails } | null>;
  subjectDetails: BaseSchema<{ result: RespondentDetails } | null>;
};
