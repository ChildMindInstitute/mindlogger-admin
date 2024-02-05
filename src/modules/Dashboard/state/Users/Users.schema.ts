import { BaseSchema } from 'shared/state/Base';
import { InvitedRespondent, RespondentDetails } from 'modules/Dashboard/types';

export type UsersSchema = {
  allRespondents: BaseSchema<{ result: InvitedRespondent[]; count: number } | null>;
  respondentDetails: BaseSchema<{ result: RespondentDetails } | null>;
};
