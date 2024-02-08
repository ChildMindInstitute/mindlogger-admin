import { Respondent, RespondentDetails } from 'modules/Dashboard/types';
import { BaseSchema } from 'shared/state/Base';

export type UsersSchema = {
  allRespondents: BaseSchema<{ result: Respondent[]; count: number } | null>;
  respondentDetails: BaseSchema<{ result: RespondentDetails } | null>;
};
