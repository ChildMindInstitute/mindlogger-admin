import { BaseSchema } from 'shared/state/Base';
import { Respondent, SubjectDetails } from 'modules/Dashboard/types';

export type UsersSchema = {
  allRespondents: BaseSchema<{ result: Respondent[]; count: number } | null>;
  respondentDetails: BaseSchema<{ result: SubjectDetails } | null>;
  subjectDetails: BaseSchema<{ result: SubjectDetails } | null>;
};
