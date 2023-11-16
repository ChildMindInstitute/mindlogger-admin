import { BaseSchema } from 'shared/state/Base';
import { Respondent } from 'modules/Dashboard/types';

export type UsersSchema = {
  allRespondents: BaseSchema<{ result: Respondent[]; count: number } | null>;
};
