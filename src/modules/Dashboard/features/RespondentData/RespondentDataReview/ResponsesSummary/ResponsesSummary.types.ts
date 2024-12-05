import { RespondentDetails } from 'modules/Dashboard/types';

import { ResponsesSummary } from '../RespondentDataReview.types';

export type ResponsesSummaryProps = ResponsesSummary & {
  'data-testid': string;
  sourceSubject?: RespondentDetails;
};
