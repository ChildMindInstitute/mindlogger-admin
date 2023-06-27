import { Version } from 'api';

import { Identifier } from '../../RespondentDataSummary.types';

export type ReportFiltersProps = {
  identifiers: Identifier[];
  versions: Version[];
};
