import { BaseSchema } from 'shared/state/Base';
import { Participant, SubjectDetails, SubjectDetailsWithDataAccess } from 'modules/Dashboard/types';

export type UsersSchema = {
  allRespondents: BaseSchema<{ result: Participant[]; count: number } | null>;
  respondentDetails: BaseSchema<{ result: SubjectDetails } | null>;
  subjectDetails: BaseSchema<{ result: SubjectDetailsWithDataAccess } | null>;
};
