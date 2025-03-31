import { BaseSchema } from 'shared/state/Base';
import { SubjectDetails, SubjectDetailsWithDataAccess } from 'modules/Dashboard/types';

export type UsersSchema = {
  respondentDetails: BaseSchema<{ result: SubjectDetails } | null>;
  subjectDetails: BaseSchema<{ result: SubjectDetailsWithDataAccess } | null>;
};
